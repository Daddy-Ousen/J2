import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required to manage fantasy squad" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      name,
      picks, // Array of 15 picks: { playerId, positionOrder, isCaptain, isViceCaptain }
      formation = "4-3-3",
      activeChip = null,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Team name is required" },
        { status: 400 }
      );
    }

    if (!picks || !Array.isArray(picks) || picks.length !== 15) {
      return NextResponse.json(
        { success: false, message: "A complete 15-player squad is required" },
        { status: 400 }
      );
    }

    // 1. Fetch player records to validate positions, budget, and club quotas
    const playerIds = picks.map((p: any) => p.playerId);
    const dbPlayers = await prisma.fantasyPlayer.findMany({
      where: { id: { in: playerIds } },
    });

    if (dbPlayers.length !== 15) {
      return NextResponse.json(
        { success: false, message: "Invalid or duplicate players detected in squad" },
        { status: 400 }
      );
    }

    // 2. Validate position distribution: 2 GK, 5 DEF, 5 MID, 3 FWD
    const posCounts = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    const clubCounts: Record<string, number> = {};
    let totalCost = 0;

    for (const player of dbPlayers) {
      posCounts[player.position as keyof typeof posCounts] =
        (posCounts[player.position as keyof typeof posCounts] || 0) + 1;
      clubCounts[player.club] = (clubCounts[player.club] || 0) + 1;
      totalCost += player.price;
    }

    if (
      posCounts.GK !== 2 ||
      posCounts.DEF !== 5 ||
      posCounts.MID !== 5 ||
      posCounts.FWD !== 3
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Squad must contain exactly 2 GK, 5 DEF, 5 MID, and 3 FWD",
        },
        { status: 400 }
      );
    }

    // 3. Validate budget (Max 100.0M)
    const budgetLimit = 100.0;
    if (totalCost > budgetLimit) {
      return NextResponse.json(
        {
          success: false,
          message: `Squad exceeds ৳100.0M budget limit (Total: ৳${totalCost.toFixed(1)}M)`,
        },
        { status: 400 }
      );
    }

    // 4. Validate club quotas (Max 3 players per club)
    for (const [club, count] of Object.entries(clubCounts)) {
      if (count > 3) {
        return NextResponse.json(
          {
            success: false,
            message: `Cannot select more than 3 players from ${club} (Selected: ${count})`,
          },
          { status: 400 }
        );
      }
    }

    // 5. Validate Captain and Vice-Captain
    const captainPick = picks.find((p: any) => p.isCaptain);
    const vicePick = picks.find((p: any) => p.isViceCaptain);

    if (!captainPick || !vicePick) {
      return NextResponse.json(
        { success: false, message: "Captain and Vice-Captain must be selected" },
        { status: 400 }
      );
    }

    const bankRemaining = parseFloat((budgetLimit - totalCost).toFixed(1));

    // 6. Check existing team or create new
    let existingTeam = await prisma.fantasyTeam.findFirst({
      where: { userId: user.id },
    });

    let team;

    if (existingTeam) {
      // Update team details
      team = await prisma.fantasyTeam.update({
        where: { id: existingTeam.id },
        data: {
          name: name.trim(),
          bank: bankRemaining,
          formation,
          activeChip,
        },
      });

      // Clear old picks and re-create
      await prisma.fantasyPick.deleteMany({
        where: { teamId: team.id },
      });
    } else {
      team = await prisma.fantasyTeam.create({
        data: {
          userId: user.id,
          name: name.trim(),
          bank: bankRemaining,
          formation,
          activeChip,
        },
      });

      // Add to Global League
      const globalLeague = await prisma.fantasyLeague.findFirst({
        where: { type: "GLOBAL" },
      });

      if (globalLeague) {
        await prisma.fantasyLeagueMember.create({
          data: {
            leagueId: globalLeague.id,
            teamId: team.id,
            teamName: team.name,
            managerName: user.name,
            totalPoints: 0,
            rank: 1,
          },
        });
      }
    }

    // 7. Insert picks
    const picksToInsert = picks.map((p: any) => ({
      teamId: team.id,
      playerId: p.playerId,
      positionOrder: p.positionOrder,
      isCaptain: !!p.isCaptain,
      isViceCaptain: !!p.isViceCaptain,
      multiplier: p.isCaptain ? (activeChip === "triple_captain" ? 3 : 2) : 1,
    }));

    await prisma.fantasyPick.createMany({
      data: picksToInsert,
    });

    const fullTeam = await prisma.fantasyTeam.findUnique({
      where: { id: team.id },
      include: {
        picks: {
          include: { player: true },
          orderBy: { positionOrder: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Fantasy squad saved successfully!",
      team: fullTeam,
    });
  } catch (error) {
    console.error("Fantasy Team API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save fantasy team" },
      { status: 500 }
    );
  }
}
