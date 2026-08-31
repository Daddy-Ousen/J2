import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { ids, updates } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Product IDs array is required" }, { status: 400 });
    }

    const updateData: Record<string, any> = {};
    if (updates.isFeatured !== undefined) updateData.isFeatured = Boolean(updates.isFeatured);
    if (updates.inStock !== undefined) updateData.inStock = Boolean(updates.inStock);
    if (updates.sleeve !== undefined) updateData.sleeve = updates.sleeve;
    if (updates.kitType !== undefined) updateData.kitType = updates.kitType;
    if (updates.league !== undefined) updateData.league = updates.league;

    const result = await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error("Batch update products error:", error);
    return NextResponse.json(
      { error: "Failed to batch update products" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Product IDs array is required" }, { status: 400 });
    }

    const result = await prisma.product.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error("Batch delete products error:", error);
    return NextResponse.json(
      { error: "Failed to batch delete products" },
      { status: 500 }
    );
  }
}
