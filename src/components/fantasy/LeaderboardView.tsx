"use client";

import React, { useState } from "react";
import { Trophy, Users, Plus, Key, Award, Shield, Sparkles, ChevronRight, Check } from "lucide-react";

interface LeagueMember {
  id: string;
  teamName: string;
  managerName: string;
  rank: number;
  totalPoints: number;
}

interface LeagueType {
  id: string;
  name: string;
  code: string;
  type: string;
  members: LeagueMember[];
}

interface LeaderboardViewProps {
  globalLeague: LeagueType | null;
  userLeagues: LeagueType[];
  currentUserId?: string;
  onCreateLeague: (name: string) => Promise<void>;
  onJoinLeague: (code: string) => Promise<void>;
}

export function LeaderboardView({
  globalLeague,
  userLeagues,
  currentUserId,
  onCreateLeague,
  onJoinLeague,
}: LeaderboardViewProps) {
  const [activeTab, setActiveTab] = useState<"global" | "private">("global");
  const [selectedPrivateLeagueId, setSelectedPrivateLeagueId] = useState<string | null>(
    userLeagues.length > 0 ? userLeagues[0].id : null
  );

  // Create League Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newLeagueName, setNewLeagueName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Join League Modal State
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

  // Toast / Feedback
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeagueName.trim()) return;
    setCreateLoading(true);
    try {
      await onCreateLeague(newLeagueName.trim());
      setIsCreateOpen(false);
      setNewLeagueName("");
      setFeedback("Private league created successfully!");
    } catch (err: any) {
      setFeedback(err.message || "Failed to create league");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoinLoading(true);
    try {
      await onJoinLeague(joinCode.trim());
      setIsJoinOpen(false);
      setJoinCode("");
      setFeedback("Joined league successfully!");
    } catch (err: any) {
      setFeedback(err.message || "Failed to join league");
    } finally {
      setJoinLoading(false);
    }
  };

  const currentDisplayLeague =
    activeTab === "global"
      ? globalLeague
      : userLeagues.find((l) => l.id === selectedPrivateLeagueId) || userLeagues[0] || null;

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div className="flex items-center justify-between rounded-xl border border-amber-400/40 bg-amber-500/10 p-3 font-mono text-xs text-amber-300">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Top Tabs & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* League Switcher Tabs */}
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950 p-1.5 backdrop-blur-md">
          <button
            onClick={() => setActiveTab("global")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
              activeTab === "global"
                ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>GLOBAL CHAMPIONSHIP</span>
          </button>

          <button
            onClick={() => setActiveTab("private")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
              activeTab === "private"
                ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>PRIVATE MINI-LEAGUES ({userLeagues.length})</span>
          </button>
        </div>

        {/* Create / Join Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 font-mono text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>CREATE LEAGUE</span>
          </button>

          <button
            onClick={() => setIsJoinOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-zinc-900 px-3.5 py-2 font-mono text-xs font-bold text-zinc-200 hover:border-amber-400 hover:text-white transition-all active:scale-95"
          >
            <Key className="h-3.5 w-3.5" />
            <span>JOIN LEAGUE</span>
          </button>
        </div>
      </div>

      {/* Private Leagues Selector if on private tab */}
      {activeTab === "private" && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {userLeagues.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4 text-xs font-mono text-zinc-400 w-full text-center">
              You haven't joined any private mini-leagues yet. Create one with your friends or enter a room code!
            </div>
          ) : (
            userLeagues.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelectedPrivateLeagueId(l.id)}
                className={`rounded-xl px-4 py-2 font-mono text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedPrivateLeagueId === l.id || (!selectedPrivateLeagueId && userLeagues[0]?.id === l.id)
                    ? "border-amber-400 bg-amber-400/15 text-amber-300"
                    : "border-white/10 bg-zinc-950 text-zinc-400 hover:text-white"
                }`}
              >
                {l.name} ({l.code})
              </button>
            ))
          )}
        </div>
      )}

      {/* Standings Table Card */}
      {currentDisplayLeague && (
        <div className="rounded-3xl border border-white/15 bg-zinc-950/90 overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* League Info Header */}
          <div className="border-b border-white/10 p-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>{currentDisplayLeague.type === "GLOBAL" ? "OFFICIAL LEAGUE" : "PRIVATE MINI-LEAGUE"}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                {currentDisplayLeague.name}
              </h3>
            </div>

            {currentDisplayLeague.code && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 font-mono text-xs font-bold text-amber-300">
                <span>INVITE CODE:</span>
                <span className="text-white font-black tracking-widest">{currentDisplayLeague.code}</span>
              </div>
            )}
          </div>

          {/* Members Standings Table */}
          <div className="divide-y divide-white/5">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-5 py-3 font-mono text-[10px] sm:text-xs font-bold text-zinc-400 bg-zinc-900/50">
              <div className="col-span-2 sm:col-span-1">RANK</div>
              <div className="col-span-6 sm:col-span-7">TEAM & MANAGER</div>
              <div className="col-span-4 sm:col-span-4 text-right">TOTAL POINTS</div>
            </div>

            {/* Rows */}
            {currentDisplayLeague.members && currentDisplayLeague.members.length > 0 ? (
              currentDisplayLeague.members.map((member, index) => {
                const isTop1 = index === 0;
                const isTop2 = index === 1;
                const isTop3 = index === 2;

                return (
                  <div
                    key={member.id || index}
                    className={`grid grid-cols-12 items-center px-5 py-4 transition-colors ${
                      isTop1 ? "bg-amber-400/[0.04]" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="col-span-2 sm:col-span-1 flex items-center">
                      {isTop1 ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-black text-black shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                          1
                        </div>
                      ) : isTop2 ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-300 font-mono text-xs font-black text-black">
                          2
                        </div>
                      ) : isTop3 ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-700 font-mono text-xs font-black text-white">
                          3
                        </div>
                      ) : (
                        <span className="font-mono text-xs font-bold text-zinc-400 pl-2">
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* Team & Manager Name */}
                    <div className="col-span-6 sm:col-span-7">
                      <div className="font-sans text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span>{member.teamName}</span>
                        {isTop1 && (
                          <span className="rounded-md bg-amber-400/20 border border-amber-400/40 px-1.5 py-0.2 font-mono text-[9px] font-bold text-amber-300">
                            LEADER
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[10px] text-zinc-400 mt-0.5">
                        Manager: {member.managerName}
                      </div>
                    </div>

                    {/* Points Total */}
                    <div className="col-span-4 sm:col-span-4 text-right font-mono">
                      <span className="text-sm sm:text-base font-black text-amber-400">
                        {member.totalPoints} PTS
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center font-mono text-xs text-zinc-500">
                No managers in this league yet. Be the first to join!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create Private League */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-zinc-950 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>CREATE PRIVATE MINI-LEAGUE</span>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-zinc-400 hover:text-white text-xs font-mono p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  League Name
                </label>
                <input
                  type="text"
                  required
                  value={newLeagueName}
                  onChange={(e) => setNewLeagueName(e.target.value)}
                  placeholder="e.g. Dhaka Sunday League, Office Rivals"
                  className="w-full rounded-xl border border-white/15 bg-zinc-900 px-4 py-3 text-xs font-mono text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <p className="text-[11px] font-mono text-zinc-400">
                You will receive a unique 6-character room code to share with your friends and colleagues!
              </p>

              <button
                type="submit"
                disabled={createLoading}
                className="w-full rounded-xl bg-amber-400 py-3 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50"
              >
                {createLoading ? "CREATING LEAGUE..." : "CONFIRM & GENERATE CODE"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Join Private League */}
      {isJoinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-zinc-950 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span>JOIN PRIVATE MINI-LEAGUE</span>
              </div>
              <button
                onClick={() => setIsJoinOpen(false)}
                className="text-zinc-400 hover:text-white text-xs font-mono p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  League Invite Code
                </label>
                <input
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="e.g. JV-7482"
                  className="w-full rounded-xl border border-white/15 bg-zinc-900 px-4 py-3 text-xs font-mono text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none uppercase tracking-widest"
                />
              </div>

              <button
                type="submit"
                disabled={joinLoading}
                className="w-full rounded-xl bg-amber-400 py-3 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50"
              >
                {joinLoading ? "JOINING LEAGUE..." : "JOIN MINI-LEAGUE"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
