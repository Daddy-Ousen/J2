import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, hashPassword } from "@/lib/auth";

// GET /api/admin/users - List all users & roles (Admin only)
export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Fetch users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create a new admin or customer account (Admin only)
export async function POST(req: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, role = "ADMIN" } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: `User with email "${cleanEmail}" already exists` },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: role === "ADMIN" ? "ADMIN" : "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Account created successfully for ${newUser.email} as ${newUser.role}`,
      user: newUser,
    });
  } catch (error: any) {
    console.error("Create admin user error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users - Update password or promote/demote role (Admin only)
export async function PATCH(req: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { action } = body;

    // 1. Action: Change Password
    if (action === "change_password") {
      const { newPassword, targetUserId } = body;

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters long" },
          { status: 400 }
        );
      }

      const userIdToUpdate = targetUserId || sessionUser.id;
      const passwordHash = await hashPassword(newPassword);

      await prisma.user.update({
        where: { id: userIdToUpdate },
        data: { passwordHash },
      });

      return NextResponse.json({
        success: true,
        message: "Password updated successfully",
      });
    }

    // 2. Action: Promote to Admin or Demote to Customer
    if (action === "update_role") {
      const { targetUserId, newRole } = body;

      if (!targetUserId || !newRole || !["ADMIN", "CUSTOMER"].includes(newRole)) {
        return NextResponse.json(
          { error: "Invalid userId or role specified" },
          { status: 400 }
        );
      }

      if (targetUserId === sessionUser.id && newRole === "CUSTOMER") {
        const totalAdmins = await prisma.user.count({
          where: { role: "ADMIN" },
        });
        if (totalAdmins <= 1) {
          return NextResponse.json(
            { error: "Cannot demote the only remaining admin account" },
            { status: 400 }
          );
        }
      }

      const updated = await prisma.user.update({
        where: { id: targetUserId },
        data: { role: newRole },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Updated ${updated.email} role to ${updated.role}`,
        user: updated,
      });
    }

    return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin user action error:", error);
    return NextResponse.json(
      { error: error.message || "Operation failed" },
      { status: 500 }
    );
  }
}