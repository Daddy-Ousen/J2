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
      include: {
        picks: {
          include: { player: true },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { success: false, message: "No fantasy squad found to transfer" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { transfers, chip = null } = body; // transfers: [{ playerInId, playerOutId }]

    if (!transfers || !Array.isArray(transfers) || transfers.length === 0) {
      return NextResponse.json(
        { success: false, message: "No transfers specified" },
        { status: 400 }
      );
    }

    // 1. Calculate transfer point cost
    // If Wildcard or Free Hit is active, cost is 0
    let cost = 0;
    const isFreeChip = chip === "wildcard" || chip === "free_hit";

    if (!isFreeChip) {
      const freeAvailable = team.freeTransfers;
      const extraTransfers = Math.max(0, transfers.length - freeAvailable);
      cost = extraTransfers * 4;
    }

    // 2. Perform each transfer
    for (const tr of transfers) {
      const { playerInId, playerOutId } = tr;

      // Find current pick
      const existingPick = team.picks.find((p) => p.playerId === playerOutId);
      if (!existingPick) continue;

      // Update pick with playerInId
      await prisma.fantasyPick.update({
        where: { id: existingPick.id },
        data: { playerId: playerInId },
      });

      // Record transfer log
      await prisma.fantasyTransfer.create({
        data: {
          teamId: team.id,
          playerInId,
          playerOutId,
          cost,
        },
      });
    }

    // 3. Recalculate remaining bank
    const updatedPicks = await prisma.fantasyPick.findMany({
      where: { teamId: team.id },
      include: { player: true },
    });

    const totalSquadCost = updatedPicks.reduce((acc, p) => acc + p.player.price, 0);
    const newBank = Math.max(0, parseFloat((100.0 - totalSquadCost).toFixed(1)));

    // 4. Update team total points penalty if extra transfers made
    const updatedTeam = await prisma.fantasyTeam.update({
      where: { id: team.id },
      data: {
        bank: newBank,
        totalPoints: Math.max(0, team.totalPoints - cost),
        freeTransfers: 1, // Reset free transfers after use
        activeChip: chip || team.activeChip,
      },
      include: {
        picks: {
          include: { player: true },
          orderBy: { positionOrder: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Transfers confirmed! ${cost > 0 ? `(-${cost} pts penalty applied)` : ""}`,
      team: updatedTeam,
      cost,
    });
  } catch (error) {
    console.error("Fantasy Transfers API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process fantasy transfers" },
      { status: 500 }
    );
  }
}
