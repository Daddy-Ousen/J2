import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();

    // 1. Fetch all available players
    const players = await prisma.fantasyPlayer.findMany({
      orderBy: [{ totalPoints: "desc" }, { price: "desc" }],
    });

    // 2. Fetch Gameweeks
    const gameweeks = await prisma.gameweek.findMany({
      orderBy: { number: "asc" },
    });

    const currentGameweek = gameweeks.find((gw) => gw.isCurrent) || gameweeks[0] || null;

    // 3. Fetch Global League
    const globalLeague = await prisma.fantasyLeague.findFirst({
      where: { type: "GLOBAL" },
      include: {
        members: {
          orderBy: { totalPoints: "desc" },
          take: 50,
        },
      },
    });

    // 4. If user is authenticated, fetch their team & private leagues & rewards
    let userTeam = null;
    let userLeagues: any[] = [];
    let userRewards: any[] = [];

    if (user) {
      userTeam = await prisma.fantasyTeam.findFirst({
        where: { userId: user.id },
        include: {
          picks: {
            include: {
              player: true,
            },
            orderBy: { positionOrder: "asc" },
          },
        },
      });

      // Fetch private leagues user is a member of
      if (userTeam) {
        userLeagues = await prisma.fantasyLeague.findMany({
          where: {
            members: {
              some: { teamId: userTeam.id },
            },
          },
          include: {
            members: {
              orderBy: { totalPoints: "desc" },
            },
          },
        });
      }

      userRewards = await prisma.fantasyReward.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({
      success: true,
      user,
      players,
      gameweeks,
      currentGameweek,
      globalLeague,
      userTeam,
      userLeagues,
      userRewards,
    });
  } catch (error) {
    console.error("Fantasy Bootstrap API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load fantasy bootstrap data" },
      { status: 500 }
    );
  }
}
