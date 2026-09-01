"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { CartDrawer, CartItem } from "@/components/ui/CartDrawer";
import { PitchVisualizer, FantasyPlayerType, PickType } from "@/components/fantasy/PitchVisualizer";
import { TransferMarket } from "@/components/fantasy/TransferMarket";
import { LeaderboardView } from "@/components/fantasy/LeaderboardView";
import { RewardsVouchers } from "@/components/fantasy/RewardsVouchers";
import {
  Trophy,
  Shield,
  Zap,
  ArrowRightLeft,
  Crown,
  Sparkles,
  Save,
  Check,
  AlertCircle,
  Clock,
  Layers,
  Gift,
  HelpCircle,
  LogIn,
  RotateCcw,
} from "lucide-react";

export default function FantasyPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [allPlayers, setAllPlayers] = useState<FantasyPlayerType[]>([]);
  const [gameweeks, setGameweeks] = useState<any[]>([]);
  const [currentGameweek, setCurrentGameweek] = useState<any>(null);
  const [globalLeague, setGlobalLeague] = useState<any>(null);
  const [userLeagues, setUserLeagues] = useState<any[]>([]);
  const [userRewards, setUserRewards] = useState<any[]>([]);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"pitch" | "transfers" | "leagues" | "rewards" | "rules">("pitch");

  // Squad State
  const [teamName, setTeamName] = useState("My Galácticos FC");
  const [formation, setFormation] = useState("4-3-3");
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [picks, setPicks] = useState<PickType[]>([]);
  const [bank, setBank] = useState(100.0);
  const [playerToReplace, setPlayerToReplace] = useState<PickType | null>(null);
  const [selectedPickId, setSelectedPickId] = useState<string | null>(null);
  const [actionModalPick, setActionModalPick] = useState<PickType | null>(null);

  // Status & Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Bootstrap Data Fetch
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/fantasy/bootstrap");
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        setAllPlayers(data.players || []);
        setGameweeks(data.gameweeks || []);
        setCurrentGameweek(data.currentGameweek);
        setGlobalLeague(data.globalLeague);
        setUserLeagues(data.userLeagues || []);
        setUserRewards(data.userRewards || []);

        if (data.userTeam) {
          setTeamName(data.userTeam.name);
          setFormation(data.userTeam.formation || "4-3-3");
          setActiveChip(data.userTeam.activeChip || null);
          setBank(data.userTeam.bank);

          if (data.userTeam.picks && data.userTeam.picks.length === 15) {
            setPicks(
              data.userTeam.picks.map((p: any) => ({
                playerId: p.playerId,
                player: p.player,
                positionOrder: p.positionOrder,
                isCaptain: p.isCaptain,
                isViceCaptain: p.isViceCaptain,
                multiplier: p.multiplier,
              }))
            );
          } else {
            // Default 15-player initial squad builder placeholder
            generateDefaultSquad(data.players);
          }
        } else {
          // New team: populate default starter squad
          generateDefaultSquad(data.players);
        }
      }
    } catch (err) {
      console.error("Failed to load fantasy bootstrap:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper: Populate a balanced default 15-player squad from player database
  const generateDefaultSquad = (playersList: FantasyPlayerType[]) => {
    if (!playersList || playersList.length < 15) return;

    const gks = playersList.filter((p) => p.position === "GK");
    const defs = playersList.filter((p) => p.position === "DEF");
    const mids = playersList.filter((p) => p.position === "MID");
    const fwds = playersList.filter((p) => p.position === "FWD");

    const selected: PickType[] = [];

    // Starting XI (1-11): 1 GK, 4 DEF, 3 MID, 3 FWD (4-3-3 default)
    if (gks[0]) selected.push({ playerId: gks[0].id, player: gks[0], positionOrder: 1, isCaptain: false, isViceCaptain: false, multiplier: 1 });
    defs.slice(0, 4).forEach((d, idx) => selected.push({ playerId: d.id, player: d, positionOrder: 2 + idx, isCaptain: false, isViceCaptain: false, multiplier: 1 }));
    mids.slice(0, 3).forEach((m, idx) => selected.push({ playerId: m.id, player: m, positionOrder: 6 + idx, isCaptain: false, isViceCaptain: false, multiplier: 1 }));
    fwds.slice(0, 3).forEach((f, idx) => selected.push({ playerId: f.id, player: f, positionOrder: 9 + idx, isCaptain: idx === 0, isViceCaptain: idx === 1, multiplier: idx === 0 ? 2 : 1 }));

    // Substitutes Bench (12-15): 1 GK, 1 DEF, 2 MID
    if (gks[1]) selected.push({ playerId: gks[1].id, player: gks[1], positionOrder: 12, isCaptain: false, isViceCaptain: false, multiplier: 1 });
    if (defs[4]) selected.push({ playerId: defs[4].id, player: defs[4], positionOrder: 13, isCaptain: false, isViceCaptain: false, multiplier: 1 });
    if (mids[3]) selected.push({ playerId: mids[3].id, player: mids[3], positionOrder: 14, isCaptain: false, isViceCaptain: false, multiplier: 1 });
    if (mids[4]) selected.push({ playerId: mids[4].id, player: mids[4], positionOrder: 15, isCaptain: false, isViceCaptain: false, multiplier: 1 });

    const totalCost = selected.reduce((acc, p) => acc + (p.player ? p.player.price : 0), 0);
    setPicks(selected);
    setBank(Math.max(0, parseFloat((100.0 - totalCost).toFixed(1))));
  };

  // Player action from pitch
  const handlePitchPlayerClick = (pick: PickType) => {
    setActionModalPick(pick);
    setSelectedPickId(pick.playerId);
  };

  // Set Captain
  const handleSetCaptain = (playerId: string) => {
    setPicks((prev) =>
      prev.map((p) => ({
        ...p,
        isCaptain: p.playerId === playerId,
        isViceCaptain: p.playerId === playerId ? false : p.isViceCaptain,
        multiplier: p.playerId === playerId ? (activeChip === "triple_captain" ? 3 : 2) : 1,
      }))
    );
    setActionModalPick(null);
    showToast("Captain selected! (2x Gameweek Points)");
  };

  // Set Vice Captain
  const handleSetViceCaptain = (playerId: string) => {
    setPicks((prev) =>
      prev.map((p) => ({
        ...p,
        isViceCaptain: p.playerId === playerId,
        isCaptain: p.playerId === playerId ? false : p.isCaptain,
      }))
    );
    setActionModalPick(null);
    showToast("Vice-Captain selected!");
  };

  // Substitute with a bench player
  const handleSubstitute = (pick1: PickType, pick2: PickType) => {
    setPicks((prev) => {
      const p1Order = pick1.positionOrder;
      const p2Order = pick2.positionOrder;
      return prev.map((p) => {
        if (p.playerId === pick1.playerId) return { ...p, positionOrder: p2Order };
        if (p.playerId === pick2.playerId) return { ...p, positionOrder: p1Order };
        return p;
      });
    });
    setActionModalPick(null);
    setSelectedPickId(null);
    showToast("Substitution completed!");
  };

  // Replace a player in transfer market
  const handleStartReplace = (pick: PickType) => {
    setPlayerToReplace(pick);
    setActionModalPick(null);
    setActiveTab("transfers");
  };

  // Buy new player from transfer market
  const handleSelectPlayerToBuy = (newPlayer: FantasyPlayerType) => {
    if (playerToReplace) {
      // Swapping specific player
      setPicks((prev) =>
        prev.map((p) => {
          if (p.playerId === playerToReplace.playerId) {
            return {
              ...p,
              playerId: newPlayer.id,
              player: newPlayer,
            };
          }
          return p;
        })
      );
      setPlayerToReplace(null);
      showToast(`Transferred in ${newPlayer.name}!`);
    } else {
      // Add into open slot matching position
      const emptyOrReplaceIdx = picks.findIndex(
        (p) => p.player?.position === newPlayer.position
      );
      if (emptyOrReplaceIdx > -1) {
        const updated = [...picks];
        updated[emptyOrReplaceIdx] = {
          ...updated[emptyOrReplaceIdx],
          playerId: newPlayer.id,
          player: newPlayer,
        };
        setPicks(updated);
        showToast(`Selected ${newPlayer.name}!`);
      }
    }

    // Recalculate bank
    const newTotal = picks.reduce(
      (acc, p) =>
        acc +
        (p.playerId === playerToReplace?.playerId
          ? newPlayer.price
          : p.player?.price || 0),
      0
    );
    setBank(Math.max(0, parseFloat((100.0 - newTotal).toFixed(1))));
  };

  // Activate Chip
  const handleToggleChip = (chipKey: string) => {
    if (activeChip === chipKey) {
      setActiveChip(null);
      showToast("Chip deactivated.");
    } else {
      setActiveChip(chipKey);
      if (chipKey === "triple_captain") {
        setPicks((prev) =>
          prev.map((p) => ({
            ...p,
            multiplier: p.isCaptain ? 3 : 1,
          }))
        );
      }
      showToast(`⚡ Chip Activated: ${chipKey.replace("_", " ").toUpperCase()}`);
    }
  };

  // Save Squad Lineup to Database
  const handleSaveSquad = async () => {
    if (!user) {
      showToast("Please log in or register to save your Fantasy Squad.");
      return;
    }

    if (picks.length !== 15) {
      showToast("You must select exactly 15 players before saving.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/fantasy/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName,
          picks: picks.map((p) => ({
            playerId: p.playerId,
            positionOrder: p.positionOrder,
            isCaptain: p.isCaptain,
            isViceCaptain: p.isViceCaptain,
          })),
          formation,
          activeChip,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("🔥 Fantasy squad and lineup saved successfully!");
        loadData();
      } else {
        showToast(`Error: ${data.message}`);
      }
    } catch (err: any) {
      showToast("Failed to save squad. Please check connection.");
    } finally {
      setIsSaving(false);
    }
  };

  // League Creation Callback
  const handleCreateLeague = async (name: string) => {
    const res = await fetch("/api/fantasy/leagues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", name }),
    });
    const data = await res.json();
    if (data.success) {
      loadData();
    } else {
      throw new Error(data.message);
    }
  };

  // League Join Callback
  const handleJoinLeague = async (code: string) => {
    const res = await fetch("/api/fantasy/leagues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join", code }),
    });
    const data = await res.json();
    if (data.success) {
      loadData();
    } else {
      throw new Error(data.message);
    }
  };

  const totalPoints = picks.reduce(
    (acc, p) => acc + (p.player?.totalPoints || 0),
    0
  );

  return (
    <div className="relative min-h-screen w-full bg-[#070709] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Global Minimalist Header */}
      <Navbar cartCount={cartItems.length} onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Content Area */}
      <main className="relative mx-auto max-w-7xl px-4 sm:px-8 py-24 space-y-8">
        {/* Fantasy Hero Banner */}
        <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Subtle Background Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400">
                <Crown className="h-3.5 w-3.5" />
                <span>OFFICIAL FANTASY FOOTBALL LEAGUE</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Jersey Verse Fantasy Arena
              </h1>

              <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl">
                Build your 15-superstar dream squad, master tactical formations, climb the live global leaderboard, and win official matchday jerseys every gameweek.
              </p>
            </div>

            {/* Quick Matchday Deadline Pill */}
            {currentGameweek && (
              <div className="rounded-2xl border border-amber-500/30 bg-zinc-950/90 p-4 font-mono text-xs text-right space-y-1 shadow-lg">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold justify-end">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{currentGameweek.name}</span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  Deadline: {new Date(currentGameweek.deadline).toLocaleDateString()} at{" "}
                  {new Date(currentGameweek.deadline).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">
                  ● TRANSFERS & LINEUP ACTIVE
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Authentication Warning / Log in Prompt if Guest */}
        {!user && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 sm:px-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <div className="text-xs font-mono text-amber-300">
                <strong className="text-white">Playing in Demo Mode:</strong> Create an account or sign in to save your squad, join private leagues, and claim jersey vouchers!
              </div>
            </div>
            <Link
              href="/auth/login?redirect=/fantasy"
              className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-all flex-shrink-0"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>SIGN IN TO SAVE SQUAD</span>
            </Link>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-4">
          {[
            { id: "pitch", label: "MY SQUAD & PITCH", icon: Shield },
            { id: "transfers", label: "TRANSFER MARKET", icon: ArrowRightLeft },
            { id: "leagues", label: "LEADERBOARDS & LEAGUES", icon: Trophy },
            { id: "rewards", label: "PRIZES & REWARDS", icon: Gift },
            { id: "rules", label: "RULES & SCORING", icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-mono text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                    : "bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: MY SQUAD & PITCH */}
        {activeTab === "pitch" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Squad Controls Header */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-zinc-950/90 p-5 sm:px-8 backdrop-blur-xl">
              {/* Team Name Input & Points Summary */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    SQUAD IDENTITY
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="bg-transparent border-b border-white/20 font-sans text-lg sm:text-xl font-black text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="h-8 w-px bg-white/10 hidden sm:block" />

                <div className="flex items-center gap-4 font-mono text-xs">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">TOTAL VALUE</span>
                    <span className="text-amber-400 font-bold">
                      ৳{(100.0 - bank).toFixed(1)}M
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">BANK</span>
                    <span className="text-white font-bold">৳{bank.toFixed(1)}M</span>
                  </div>
                </div>
              </div>

              {/* Formation Selector & Chips */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Formation Dropdown */}
                <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-white/10 font-mono text-xs">
                  <span className="text-zinc-400 text-[10px]">FORMATION:</span>
                  <select
                    value={formation}
                    onChange={(e) => setFormation(e.target.value)}
                    className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="4-3-3">4-3-3</option>
                    <option value="4-4-2">4-4-2</option>
                    <option value="3-5-2">3-5-2</option>
                    <option value="3-4-3">3-4-3</option>
                    <option value="5-3-2">5-3-2</option>
                  </select>
                </div>

                {/* Save Squad Button */}
                <button
                  onClick={handleSaveSquad}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? "SAVING SQUAD..." : "SAVE LINEUP"}</span>
                </button>
              </div>
            </div>

            {/* Tactical Chips Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "triple_captain", name: "TRIPLE CAPTAIN", desc: "Captain earns 3x points" },
                { id: "bench_boost", name: "BENCH BOOST", desc: "All 15 players earn points" },
                { id: "free_hit", name: "FREE HIT", desc: "Unlimited 1-GW transfers" },
                { id: "wildcard", name: "WILDCARD", desc: "Unlimited permanent transfers" },
              ].map((chip) => {
                const isActive = activeChip === chip.id;
                return (
                  <button
                    key={chip.id}
                    onClick={() => handleToggleChip(chip.id)}
                    className={`rounded-2xl p-3.5 text-left border transition-all ${
                      isActive
                        ? "border-amber-400 bg-amber-400/20 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                        : "border-white/10 bg-zinc-950/80 text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs font-bold">
                      <span>{chip.name}</span>
                      {isActive && <Check className="h-3.5 w-3.5 text-amber-400" />}
                    </div>
                    <div className="font-mono text-[10px] text-zinc-500 mt-1">{chip.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Interactive 3D Pitch View */}
            <PitchVisualizer
              picks={picks}
              formation={formation}
              activeChip={activeChip}
              onSelectPlayerForAction={handlePitchPlayerClick}
              selectedPickId={selectedPickId}
            />
          </div>
        )}

        {/* TAB 2: TRANSFER MARKET */}
        {activeTab === "transfers" && (
          <div className="animate-in fade-in duration-200">
            <TransferMarket
              allPlayers={allPlayers}
              currentPicks={picks}
              bank={bank}
              onSelectPlayerToBuy={handleSelectPlayerToBuy}
              playerToReplace={playerToReplace}
              onCancelReplace={() => setPlayerToReplace(null)}
            />
          </div>
        )}

        {/* TAB 3: LEADERBOARDS & LEAGUES */}
        {activeTab === "leagues" && (
          <div className="animate-in fade-in duration-200">
            <LeaderboardView
              globalLeague={globalLeague}
              userLeagues={userLeagues}
              currentUserId={user?.id}
              onCreateLeague={handleCreateLeague}
              onJoinLeague={handleJoinLeague}
            />
          </div>
        )}

        {/* TAB 4: PRIZES & REWARDS */}
        {activeTab === "rewards" && (
          <div className="animate-in fade-in duration-200">
            <RewardsVouchers userRewards={userRewards} />
          </div>
        )}

        {/* TAB 5: GAME RULES & SCORING */}
        {activeTab === "rules" && (
          <div className="rounded-3xl border border-white/15 bg-zinc-950/90 p-6 sm:p-10 space-y-8 backdrop-blur-xl animate-in fade-in duration-200 font-mono text-xs leading-relaxed">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-widest text-sm">
              <HelpCircle className="h-5 w-5" />
              <span>JERSEY VERSE FANTASY SCORING PROTOCOL</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-zinc-300">
              <div className="space-y-4 bg-zinc-900/50 p-5 rounded-2xl border border-white/5">
                <h4 className="text-white font-bold text-sm border-b border-white/10 pb-2">
                  1. Attacking & Scoring Points
                </h4>
                <ul className="space-y-2 text-[11px]">
                  <li>⚽ <strong>Forward Goal:</strong> +4 Points</li>
                  <li>⚽ <strong>Midfielder Goal:</strong> +5 Points</li>
                  <li>⚽ <strong>Defender / Goalkeeper Goal:</strong> +6 Points</li>
                  <li>🎯 <strong>Goal Assist:</strong> +3 Points</li>
                  <li>🌟 <strong>Captain Multiplier:</strong> 2x Points (3x with Triple Captain)</li>
                </ul>
              </div>

              <div className="space-y-4 bg-zinc-900/50 p-5 rounded-2xl border border-white/5">
                <h4 className="text-white font-bold text-sm border-b border-white/10 pb-2">
                  2. Defending & Discipline
                </h4>
                <ul className="space-y-2 text-[11px]">
                  <li>🛡️ <strong>Defender / Goalkeeper Clean Sheet:</strong> +4 Points</li>
                  <li>🛡️ <strong>Midfielder Clean Sheet:</strong> +1 Point</li>
                  <li>🧤 <strong>Penalty Save:</strong> +5 Points</li>
                  <li>🧤 <strong>Every 3 Saves by Goalkeeper:</strong> +1 Point</li>
                  <li>🟨 <strong>Yellow Card:</strong> -1 Point</li>
                  <li>🟥 <strong>Red Card:</strong> -3 Points</li>
                </ul>
              </div>

              <div className="space-y-4 bg-zinc-900/50 p-5 rounded-2xl border border-white/5">
                <h4 className="text-white font-bold text-sm border-b border-white/10 pb-2">
                  3. Squad Management & Budget
                </h4>
                <ul className="space-y-2 text-[11px]">
                  <li>💰 <strong>Budget:</strong> ৳100.0M maximum for 15 players</li>
                  <li>👥 <strong>Club Quota:</strong> Maximum 3 players from any single club</li>
                  <li>🔄 <strong>Free Transfers:</strong> 1 free transfer per Gameweek (extra transfers cost -4 pts)</li>
                  <li>📋 <strong>Substitutes:</strong> Automatically subbed in order if Starting XI player does not play</li>
                </ul>
              </div>

              <div className="space-y-4 bg-zinc-900/50 p-5 rounded-2xl border border-white/5">
                <h4 className="text-white font-bold text-sm border-b border-white/10 pb-2">
                  4. Jersey Verse Rewards
                </h4>
                <ul className="space-y-2 text-[11px]">
                  <li>🥇 <strong>#1 Gameweek Winner:</strong> ৳1,000 Jersey Verse Store Voucher</li>
                  <li>🥈 <strong>#2 Runner-Up:</strong> ৳500 Jersey Verse Store Voucher</li>
                  <li>🥉 <strong>#3 Podium:</strong> ৳300 Jersey Verse Store Voucher</li>
                  <li>🎟️ Vouchers are automatically issued to your account and redeemable at Checkout.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Action Modal for Selected Pitch Player */}
      {actionModalPick && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-zinc-950 p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg font-mono text-[10px] font-bold text-white shadow-inner"
                  style={{ backgroundColor: actionModalPick.player?.jerseyColor || "#f59e0b" }}
                >
                  <Shield className="h-3.5 w-3.5 drop-shadow text-white fill-white/20" />
                </div>
                <div>
                  <div className="font-bold text-sm">{actionModalPick.player?.name}</div>
                  <div className="font-mono text-[10px] text-zinc-400">
                    {actionModalPick.player?.club} • {actionModalPick.player?.position} • ৳{actionModalPick.player?.price}M
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActionModalPick(null)}
                className="text-zinc-400 hover:text-white font-mono text-xs"
              >
                ✕
              </button>
            </div>

            {/* Quick Action Options */}
            <div className="space-y-2 pt-1 font-mono text-xs">
              {/* Make Captain */}
              <button
                onClick={() => handleSetCaptain(actionModalPick.playerId)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/5 transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <Crown className="h-4 w-4" />
                  <span>SET AS CAPTAIN (2X POINTS)</span>
                </div>
                {actionModalPick.isCaptain && <Check className="h-4 w-4 text-amber-400" />}
              </button>

              {/* Make Vice Captain */}
              <button
                onClick={() => handleSetViceCaptain(actionModalPick.playerId)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/5 transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-zinc-300">
                  <Shield className="h-4 w-4" />
                  <span>SET AS VICE-CAPTAIN</span>
                </div>
                {actionModalPick.isViceCaptain && <Check className="h-4 w-4 text-white" />}
              </button>

              {/* Substitute with a bench player */}
              {actionModalPick.positionOrder <= 11 ? (
                <div className="space-y-1.5 pt-2">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    SUBSTITUTE WITH BENCH:
                  </div>
                  {picks
                    .filter((p) => p.positionOrder > 11)
                    .map((benchPick) => (
                      <button
                        key={benchPick.playerId}
                        onClick={() => handleSubstitute(actionModalPick, benchPick)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <ArrowRightLeft className="h-3.5 w-3.5 text-amber-400" />
                          <span>{benchPick.player?.name}</span>
                        </div>
                        <span className="text-zinc-500">{benchPick.player?.position}</span>
                      </button>
                    ))}
                </div>
              ) : null}

              {/* Transfer in Market */}
              <button
                onClick={() => handleStartReplace(actionModalPick)}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition-all mt-2"
              >
                <ArrowRightLeft className="h-4 w-4" />
                <span>TRANSFER IN MARKET</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={(idx) => setCartItems((prev) => prev.filter((_, i) => i !== idx))}
        onClearCart={() => setCartItems([])}
      />

      {/* Global Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-amber-500/40 bg-zinc-950/95 px-5 py-2.5 text-xs font-mono text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-black">
            <Sparkles className="h-3 w-3" />
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
