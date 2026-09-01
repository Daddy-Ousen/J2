import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Admin authorization required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, gameweekNumber, playerUpdates } = body;
    // playerUpdates: [{ playerId, goals, assists, cleanSheet, yellowCard, redCard, saves, bonusPoints }]

    if (action === "update_player_stats" && Array.isArray(playerUpdates)) {
      for (const update of playerUpdates) {
        const player = await prisma.fantasyPlayer.findUnique({
          where: { id: update.playerId },
        });
        if (!player) continue;

        // Calculate event points based on fantasy rules:
        // Goal: FWD (+4), MID (+5), DEF/GK (+6)
        // Assist: +3
        // Clean Sheet: DEF/GK (+4), MID (+1)
        // Penalty/Saves: +1 per 3 saves
        // Yellow Card: -1, Red Card: -3
        let eventPts = 0;

        if (player.position === "FWD") {
          eventPts += (update.goals || 0) * 4;
        } else if (player.position === "MID") {
          eventPts += (update.goals || 0) * 5;
          if (update.cleanSheet) eventPts += 1;
        } else if (player.position === "DEF" || player.position === "GK") {
          eventPts += (update.goals || 0) * 6;
          if (update.cleanSheet) eventPts += 4;
          if (update.saves) eventPts += Math.floor(update.saves / 3);
        }

        eventPts += (update.assists || 0) * 3;
        eventPts += update.bonusPoints || 0;
        if (update.yellowCard) eventPts -= 1;
        if (update.redCard) eventPts -= 3;

        // Base appearance points if player played
        if (update.played) eventPts += 2;

        await prisma.fantasyPlayer.update({
          where: { id: player.id },
          data: {
            eventPoints: eventPts,
            totalPoints: player.totalPoints + eventPts,
            goals: player.goals + (update.goals || 0),
            assists: player.assists + (update.assists || 0),
            cleanSheets: player.cleanSheets + (update.cleanSheet ? 1 : 0),
            saves: player.saves + (update.saves || 0),
            yellowCards: player.yellowCards + (update.yellowCard ? 1 : 0),
            redCards: player.redCards + (update.redCard ? 1 : 0),
          },
        });
      }
    }

    // Recalculate all user team points
    const allTeams = await prisma.fantasyTeam.findMany({
      include: {
        picks: {
          include: { player: true },
        },
      },
    });

    for (const team of allTeams) {
      let teamEventPts = 0;
      const isBenchBoost = team.activeChip === "bench_boost";

      for (const pick of team.picks) {
        // Starting XI (positionOrder 1 to 11) OR Bench Boost (includes 12 to 15)
        if (pick.positionOrder <= 11 || isBenchBoost) {
          const mult = pick.multiplier || 1;
          teamEventPts += pick.player.eventPoints * mult;
        }
      }

      await prisma.fantasyTeam.update({
        where: { id: team.id },
        data: {
          eventPoints: teamEventPts,
          totalPoints: team.totalPoints + teamEventPts,
          activeChip: null, // Reset chip after gameweek
        },
      });

      // Update league member record
      await prisma.fantasyLeagueMember.updateMany({
        where: { teamId: team.id },
        data: {
          totalPoints: team.totalPoints + teamEventPts,
        },
      });
    }

    // Re-rank all leagues
    const allLeagues = await prisma.fantasyLeague.findMany({
      include: {
        members: {
          orderBy: { totalPoints: "desc" },
        },
      },
    });

    for (const league of allLeagues) {
      for (let i = 0; i < league.members.length; i++) {
        await prisma.fantasyLeagueMember.update({
          where: { id: league.members[i].id },
          data: { rank: i + 1 },
        });
      }
    }

    // Auto-award discount coupon to Top #1 Manager of Gameweek
    const topTeam = await prisma.fantasyTeam.findFirst({
      orderBy: { totalPoints: "desc" },
    });

    if (topTeam) {
      const voucherCode = `FANTASY-GW${gameweekNumber || 1}-${Math.floor(1000 + Math.random() * 9000)}`;
      await prisma.fantasyReward.create({
        data: {
          userId: topTeam.userId,
          title: `Matchday ${gameweekNumber || 1} Champion (৳500 Matchday Voucher)`,
          code: voucherCode,
          discountAmount: 500,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Gameweek scores calculated, leaderboards updated, and rewards issued!",
    });
  } catch (error) {
    console.error("Admin Fantasy Scoring API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process matchday scores" },
      { status: 500 }
    );
  }
}
