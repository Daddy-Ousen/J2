"use client";

import React from "react";
import { Shield, Sparkles, Star, Award, Zap, ArrowLeftRight, UserCheck } from "lucide-react";

export interface FantasyPlayerType {
  id: string;
  name: string;
  shortName: string;
  club: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  price: number;
  form: number;
  totalPoints: number;
  eventPoints: number;
  selectedByPercent: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  jerseyColor: string;
  status: string;
}

export interface PickType {
  playerId: string;
  player: FantasyPlayerType;
  positionOrder: number; // 1-11 for starting XI, 12-15 for bench
  isCaptain: boolean;
  isViceCaptain: boolean;
  multiplier: number;
}

interface PitchVisualizerProps {
  picks: PickType[];
  formation: string; // e.g. "4-3-3"
  activeChip: string | null;
  onSelectPlayerForAction?: (pick: PickType) => void;
  selectedPickId?: string | null;
}

export function PitchVisualizer({
  picks,
  formation,
  activeChip,
  onSelectPlayerForAction,
  selectedPickId,
}: PitchVisualizerProps) {
  // Separate into Starting XI (1-11) and Bench (12-15)
  const startingPicks = picks.filter((p) => p.positionOrder <= 11);
  const benchPicks = picks.filter((p) => p.positionOrder > 11);

  // Group Starting XI by position
  const gks = startingPicks.filter((p) => p.player?.position === "GK");
  const defs = startingPicks.filter((p) => p.player?.position === "DEF");
  const mids = startingPicks.filter((p) => p.player?.position === "MID");
  const fwds = startingPicks.filter((p) => p.player?.position === "FWD");

  const renderPlayerCard = (pick: PickType, isBench = false) => {
    const isSelected = selectedPickId === pick.playerId;
    const player = pick.player;
    if (!player) return null;

    return (
      <div
        key={pick.playerId || pick.positionOrder}
        onClick={() => onSelectPlayerForAction?.(pick)}
        className={`group relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
          isSelected ? "scale-110 z-20" : "hover:scale-105"
        }`}
      >
        {/* Captain / Vice Captain Badge */}
        {pick.isCaptain && (
          <div className="absolute -top-2 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 font-mono text-[10px] font-black text-black shadow-lg border border-amber-300">
            C
          </div>
        )}
        {pick.isViceCaptain && (
          <div className="absolute -top-2 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 font-mono text-[10px] font-black text-black shadow-lg border border-white">
            V
          </div>
        )}

        {/* Jersey Graphic / Icon */}
        <div
          className={`relative flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-2xl shadow-md transition-all border ${
            isSelected
              ? "border-amber-400 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.6)]"
              : "border-white/15 bg-zinc-900/90 group-hover:border-amber-400/50"
          }`}
          style={{
            boxShadow: `0 4px 14px ${player.jerseyColor}25`,
          }}
        >
          {/* Mini Jersey Simulation */}
          <div
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg font-mono text-[10px] font-extrabold text-white shadow-inner"
            style={{ backgroundColor: player.jerseyColor || "#f59e0b" }}
          >
            <Shield className="h-4 w-4 drop-shadow text-white fill-white/20" />
          </div>

          {/* Points Bubble */}
          <div className="absolute -bottom-1.5 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-950 px-1 font-mono text-[9px] font-bold text-amber-400 border border-white/20">
            {player.eventPoints > 0 ? `+${player.eventPoints}` : player.totalPoints}
          </div>
        </div>

        {/* Player Name Tag */}
        <div className="mt-1 flex flex-col items-center">
          <div
            className={`max-w-[75px] sm:max-w-[90px] truncate rounded-md px-1.5 py-0.5 text-center font-sans text-[10px] sm:text-[11px] font-bold shadow-md ${
              isSelected
                ? "bg-amber-400 text-black font-extrabold"
                : "bg-zinc-950/90 text-zinc-100 border border-white/10"
            }`}
          >
            {player.shortName || player.name.split(" ").pop()}
          </div>
          <span className="font-mono text-[9px] text-zinc-400 drop-shadow">
            {player.club.split(" ")[0]} • ৳{player.price}M
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full space-y-6">
      {/* 3D Pitch Container */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#0e2918] via-[#091f12] to-[#06150c] p-4 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Tactical Pitch Lines & Markings */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          {/* Outer Border */}
          <div className="absolute inset-4 rounded-2xl border-2 border-white/60" />
          {/* Halfway Line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/60 -translate-y-1/2" />
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60" />
          {/* Penalty Boxes */}
          <div className="absolute top-4 left-1/2 h-20 w-44 -translate-x-1/2 border-2 border-t-0 border-white/60 rounded-b-xl" />
          <div className="absolute bottom-4 left-1/2 h-20 w-44 -translate-x-1/2 border-2 border-b-0 border-white/60 rounded-t-xl" />
          {/* Subtle Grass Stripes */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(255,255,255,0.02)_40px,rgba(255,255,255,0.02)_80px)]" />
        </div>

        {/* Pitch Status Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3 mb-6 font-mono text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Sparkles className="h-4 w-4" />
            <span>STARTING XI ({formation})</span>
          </div>

          {activeChip && (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/50 px-3 py-0.5 text-[10px] font-bold text-amber-300 animate-pulse">
              <Zap className="h-3 w-3" />
              <span>CHIP ACTIVE: {activeChip.replace("_", " ").toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Tactical Zones on Pitch */}
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:gap-8 min-h-[460px] sm:min-h-[520px]">
          {/* Forwards Zone */}
          <div className="flex justify-around items-center px-4">
            {fwds.map((p) => renderPlayerCard(p))}
          </div>

          {/* Midfielders Zone */}
          <div className="flex justify-around items-center px-2">
            {mids.map((p) => renderPlayerCard(p))}
          </div>

          {/* Defenders Zone */}
          <div className="flex justify-around items-center px-2">
            {defs.map((p) => renderPlayerCard(p))}
          </div>

          {/* Goalkeeper Zone */}
          <div className="flex justify-center items-center">
            {gks.map((p) => renderPlayerCard(p))}
          </div>
        </div>
      </div>

      {/* Substitutes Bench / Dugout */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/90 p-4 sm:p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-4">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-400">
            <ArrowLeftRight className="h-3.5 w-3.5 text-amber-400" />
            <span>SUBSTITUTES BENCH (4 PLAYERS)</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-500">
            Auto-substitutes if Starting XI player is benched
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {benchPicks.map((pick, idx) => (
            <div key={pick.playerId || idx} className="flex flex-col items-center">
              <span className="font-mono text-[9px] text-zinc-500 mb-1">
                {idx === 0 ? "SUB GK" : `SUB ${idx}`}
              </span>
              {renderPlayerCard(pick, true)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
