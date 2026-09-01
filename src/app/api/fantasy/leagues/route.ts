import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const team = await prisma.fantasyTeam.findFirst({
      where: { userId: user.id },
    });

    if (!team) {
      return NextResponse.json(
        { success: false, message: "You must create a fantasy squad before joining or creating leagues" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { action, name, code } = body; // action: "create" | "join"

    if (action === "create") {
      if (!name || !name.trim()) {
        return NextResponse.json(
          { success: false, message: "League name is required" },
          { status: 400 }
        );
      }

      // Generate random 6-character alphanumeric code e.g. "JV-9284"
      const randomCode = `JV-${Math.floor(1000 + Math.random() * 9000)}`;

      const league = await prisma.fantasyLeague.create({
        data: {
          name: name.trim(),
          code: randomCode,
          type: "PRIVATE",
          adminId: user.id,
          members: {
            create: {
              teamId: team.id,
              teamName: team.name,
              managerName: user.name,
              totalPoints: team.totalPoints,
              rank: 1,
            },
          },
        },
        include: {
          members: {
            orderBy: { totalPoints: "desc" },
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: `League "${league.name}" created! Code: ${league.code}`,
        league,
      });
    } else if (action === "join") {
      if (!code || !code.trim()) {
        return NextResponse.json(
          { success: false, message: "League code is required" },
          { status: 400 }
        );
      }

      const cleanCode = code.trim().toUpperCase();
      const league = await prisma.fantasyLeague.findUnique({
        where: { code: cleanCode },
        include: { members: true },
      });

      if (!league) {
        return NextResponse.json(
          { success: false, message: "Invalid league code. No league found." },
          { status: 404 }
        );
      }

      const alreadyMember = league.members.some((m) => m.teamId === team.id);
      if (alreadyMember) {
        return NextResponse.json(
          { success: false, message: "You are already a member of this league." },
          { status: 400 }
        );
      }

      await prisma.fantasyLeagueMember.create({
        data: {
          leagueId: league.id,
          teamId: team.id,
          teamName: team.name,
          managerName: user.name,
          totalPoints: team.totalPoints,
          rank: league.members.length + 1,
        },
      });

      const updatedLeague = await prisma.fantasyLeague.findUnique({
        where: { id: league.id },
        include: {
          members: {
            orderBy: { totalPoints: "desc" },
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: `Successfully joined "${league.name}"!`,
        league: updatedLeague,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Fantasy League API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to manage fantasy league" },
      { status: 500 }
    );
  }
}
