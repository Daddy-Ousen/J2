"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Plus, ArrowRightLeft, Check, AlertCircle, Shield, Sparkles } from "lucide-react";
import { FantasyPlayerType, PickType } from "./PitchVisualizer";

interface TransferMarketProps {
  allPlayers: FantasyPlayerType[];
  currentPicks: PickType[];
  bank: number;
  onSelectPlayerToBuy: (player: FantasyPlayerType) => void;
  playerToReplace?: PickType | null;
  onCancelReplace?: () => void;
}

export function TransferMarket({
  allPlayers,
  currentPicks,
  bank,
  onSelectPlayerToBuy,
  playerToReplace,
  onCancelReplace,
}: TransferMarketProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<string>(
    playerToReplace ? playerToReplace.player?.position || "ALL" : "ALL"
  );
  const [selectedClub, setSelectedClub] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"points" | "price" | "form" | "selected">("points");

  // Extract unique clubs
  const clubs = useMemo(() => {
    const set = new Set(allPlayers.map((p) => p.club));
    return ["ALL", ...Array.from(set).sort()];
  }, [allPlayers]);

  // Track counts per club in squad
  const clubCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of currentPicks) {
      if (p.player) {
        counts[p.player.club] = (counts[p.player.club] || 0) + 1;
      }
    }
    return counts;
  }, [currentPicks]);

  // Selected player IDs in squad
  const ownedPlayerIds = useMemo(() => {
    return new Set(currentPicks.map((p) => p.playerId));
  }, [currentPicks]);

  // Filtered & Sorted Players
  const filteredPlayers = useMemo(() => {
    return allPlayers
      .filter((player) => {
        // Filter by position
        if (selectedPosition !== "ALL" && player.position !== selectedPosition) {
          return false;
        }
        // Filter by club
        if (selectedClub !== "ALL" && player.club !== selectedClub) {
          return false;
        }
        // Filter by search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            player.name.toLowerCase().includes(q) ||
            player.shortName.toLowerCase().includes(q) ||
            player.club.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "points") return b.totalPoints - a.totalPoints;
        if (sortBy === "price") return b.price - a.price;
        if (sortBy === "form") return b.form - a.form;
        if (sortBy === "selected") return b.selectedByPercent - a.selectedByPercent;
        return 0;
      });
  }, [allPlayers, selectedPosition, selectedClub, searchQuery, sortBy]);

  // Total cost of current squad
  const squadTotalCost = currentPicks.reduce(
    (acc, p) => acc + (p.player ? p.player.price : 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Replacement Mode Banner if user clicked to swap a specific player */}
      {playerToReplace && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-400/50 bg-amber-500/10 p-4 backdrop-blur-md animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <div>
              <div className="font-mono text-xs font-bold text-amber-300 uppercase">
                REPLACING: {playerToReplace.player?.name} ({playerToReplace.player?.position} • ৳{playerToReplace.player?.price}M)
              </div>
              <div className="text-[11px] text-zinc-400">
                Select a replacement {playerToReplace.player?.position} below within budget.
              </div>
            </div>
          </div>
          <button
            onClick={onCancelReplace}
            className="rounded-xl border border-white/20 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Budget & Squad Quota Indicator Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 backdrop-blur-md">
          <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
            BANK REMAINING
          </div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-0.5">
            ৳{bank.toFixed(1)}M
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">
            Total Squad Value: ৳{squadTotalCost.toFixed(1)}M / ৳100.0M
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 backdrop-blur-md">
          <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
            SQUAD QUOTA (15 PLAYERS)
          </div>
          <div className="flex items-center gap-3 text-xs font-mono font-bold text-white mt-2">
            <span>GK: {currentPicks.filter((p) => p.player?.position === "GK").length}/2</span>
            <span>DEF: {currentPicks.filter((p) => p.player?.position === "DEF").length}/5</span>
            <span>MID: {currentPicks.filter((p) => p.player?.position === "MID").length}/5</span>
            <span>FWD: {currentPicks.filter((p) => p.player?.position === "FWD").length}/3</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 backdrop-blur-md flex flex-col justify-center">
          <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
            CLUB LIMIT RULE
          </div>
          <div className="text-xs text-zinc-300 mt-1">
            Maximum 3 players from any single club (e.g. Real Madrid, Arsenal).
          </div>
        </div>
      </div>

      {/* Search & Filters Controls */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/90 p-4 space-y-3 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search superstar (e.g. Haaland, Mbappé, Salah)..."
              className="w-full rounded-xl border border-white/10 bg-zinc-900/90 pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Club Dropdown Filter */}
          <div className="w-full sm:w-56">
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
            >
              {clubs.map((c) => (
                <option key={c} value={c}>
                  {c === "ALL" ? "All Clubs" : c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full sm:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
            >
              <option value="points">Sort by: Total Points</option>
              <option value="price">Sort by: Price (High to Low)</option>
              <option value="form">Sort by: Form</option>
              <option value="selected">Sort by: Selected %</option>
            </select>
          </div>
        </div>

        {/* Position Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {["ALL", "GK", "DEF", "MID", "FWD"].map((pos) => (
            <button
              key={pos}
              onClick={() => setSelectedPosition(pos)}
              className={`rounded-xl px-4 py-1.5 font-mono text-xs font-bold transition-all ${
                selectedPosition === pos
                  ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {pos === "ALL" ? "ALL POSITIONS" : pos}
            </button>
          ))}
        </div>
      </div>

      {/* Players Catalog Table / Grid */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/90 overflow-hidden backdrop-blur-md">
        <div className="border-b border-white/10 px-4 py-3 font-mono text-xs font-bold text-zinc-400 flex items-center justify-between">
          <span>AVAILABLE SUPERSTARS ({filteredPlayers.length})</span>
          <span className="text-[10px] text-zinc-500">Prices in Millions ৳/£</span>
        </div>

        <div className="divide-y divide-white/5 max-h-[550px] overflow-y-auto">
          {filteredPlayers.map((player) => {
            const isOwned = ownedPlayerIds.has(player.id);
            const currentClubCount = clubCounts[player.club] || 0;
            const isClubMaxed = currentClubCount >= 3 && !isOwned;
            const canAfford =
              player.price <=
              bank + (playerToReplace?.player ? playerToReplace.player.price : 0);

            let actionDisabled = false;
            let disableReason = "";

            if (isOwned) {
              actionDisabled = true;
              disableReason = "In Squad";
            } else if (isClubMaxed) {
              actionDisabled = true;
              disableReason = "Max 3 from Club";
            } else if (!canAfford) {
              actionDisabled = true;
              disableReason = "Insufficient Budget";
            } else if (playerToReplace && playerToReplace.player?.position !== player.position) {
              actionDisabled = true;
              disableReason = `Must be ${playerToReplace.player?.position}`;
            }

            return (
              <div
                key={player.id}
                className="flex items-center justify-between p-3.5 sm:px-6 hover:bg-white/[0.02] transition-colors"
              >
                {/* Player Info Left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold text-white shadow-inner"
                    style={{ backgroundColor: player.jerseyColor || "#f59e0b" }}
                  >
                    <Shield className="h-4 w-4 drop-shadow text-white fill-white/20" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-xs sm:text-sm font-bold text-white truncate">
                        {player.name}
                      </span>
                      <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-400">
                        {player.position}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-zinc-400 truncate">
                      {player.club} • Goals: {player.goals} • Assists: {player.assists}
                    </div>
                  </div>
                </div>

                {/* Player Stats & Price & Action Right */}
                <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                  <div className="hidden sm:flex flex-col text-right font-mono text-xs">
                    <span className="font-bold text-white">{player.totalPoints} PTS</span>
                    <span className="text-[10px] text-zinc-400">Form: {player.form}</span>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xs sm:text-sm font-black text-amber-400">
                      ৳{player.price.toFixed(1)}M
                    </div>
                  </div>

                  {/* Add / Swap Button */}
                  <button
                    disabled={actionDisabled}
                    onClick={() => onSelectPlayerToBuy(player)}
                    className={`flex items-center gap-1 rounded-xl px-3.5 py-2 font-mono text-xs font-bold transition-all ${
                      actionDisabled
                        ? "bg-zinc-900 text-zinc-500 cursor-not-allowed border border-white/5"
                        : "bg-amber-400 text-black hover:bg-amber-300 active:scale-95 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                    }`}
                  >
                    {isOwned ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">OWNED</span>
                      </>
                    ) : actionDisabled ? (
                      <span className="text-[10px]">{disableReason}</span>
                    ) : playerToReplace ? (
                      <>
                        <ArrowRightLeft className="h-3.5 w-3.5" />
                        <span>SWAP</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span>SELECT</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
