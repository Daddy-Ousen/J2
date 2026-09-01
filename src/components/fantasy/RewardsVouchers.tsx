"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Gift, Award, Copy, Check, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";

interface FantasyRewardType {
  id: string;
  title: string;
  code: string;
  discountAmount: number;
  isClaimed: boolean;
  createdAt: string;
}

interface RewardsVouchersProps {
  userRewards: FantasyRewardType[];
}

export function RewardsVouchers({ userRewards }: RewardsVouchersProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <div className="space-y-8">
      {/* Top Prize Pool Showcase */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-zinc-950 to-zinc-950 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-widest mb-2">
          <Sparkles className="h-4 w-4" />
          <span>MATCHDAY PRIZE POOL</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Compete. Win. Claim Matchday Jerseys.
        </h2>

        <p className="text-sm text-zinc-300 max-w-2xl mt-2 leading-relaxed">
          Every Gameweek and Month, the top fantasy managers on the Jersey Verse Leaderboard automatically receive exclusive store vouchers redeemable for authentic player-grade kits at checkout.
        </p>

        {/* 3 Tier Prize Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {/* 1st Place */}
          <div className="rounded-2xl border border-amber-400/50 bg-amber-400/10 p-5 backdrop-blur-md relative overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-black text-black mb-3">
              1st
            </div>
            <div className="font-mono text-xs font-bold text-amber-300">GAMEWEEK CHAMPION</div>
            <div className="text-xl font-black text-white mt-1">৳1,000 VOUCHER</div>
            <div className="text-xs text-zinc-300 mt-2">
              Valid for any 2026/27 Player-Issue Jersey + Custom Back Print.
            </div>
          </div>

          {/* 2nd Place */}
          <div className="rounded-2xl border border-zinc-400/30 bg-zinc-900/60 p-5 backdrop-blur-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-300 font-mono text-xs font-black text-black mb-3">
              2nd
            </div>
            <div className="font-mono text-xs font-bold text-zinc-300">RUNNER-UP</div>
            <div className="text-xl font-black text-white mt-1">৳500 VOUCHER</div>
            <div className="text-xs text-zinc-400 mt-2">
              Instant ৳500 discount across all in-stock club & international kits.
            </div>
          </div>

          {/* 3rd Place */}
          <div className="rounded-2xl border border-amber-700/40 bg-zinc-900/60 p-5 backdrop-blur-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-700 font-mono text-xs font-black text-white mb-3">
              3rd
            </div>
            <div className="font-mono text-xs font-bold text-amber-500">PODIUM FINISHER</div>
            <div className="text-xl font-black text-white mt-1">৳300 VOUCHER</div>
            <div className="text-xs text-zinc-400 mt-2">
              Store discount code delivered straight to your rewards desk.
            </div>
          </div>
        </div>
      </div>

      {/* User's Claimable Rewards Section */}
      <div className="rounded-3xl border border-white/10 bg-zinc-950/90 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Gift className="h-4 w-4" />
            <span>YOUR EARNED VOUCHERS ({userRewards.length})</span>
          </div>

          <Link
            href="/shop"
            className="flex items-center gap-1 font-mono text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>Browse Jersey Shop</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {userRewards.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-8 text-center space-y-3">
            <Award className="h-10 w-10 text-zinc-600 mx-auto" />
            <div className="font-mono text-sm font-bold text-white">No Rewards Earned Yet</div>
            <p className="font-mono text-xs text-zinc-400 max-w-md mx-auto">
              Finish in the top 3 on the global leaderboard at the end of the current Gameweek to unlock your first Jersey Verse discount voucher!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userRewards.map((reward) => (
              <div
                key={reward.id}
                className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                      ৳{reward.discountAmount} DISCOUNT
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {new Date(reward.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-sans text-sm font-bold text-white mt-2">
                    {reward.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <div className="font-mono text-xs font-black text-amber-400 tracking-wider">
                    {reward.code}
                  </div>

                  <button
                    onClick={() => handleCopy(reward.code)}
                    className="flex items-center gap-1 rounded-xl bg-amber-400 px-3 py-1.5 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-colors shadow-sm"
                  >
                    {copiedCode === reward.code ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>COPY CODE</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
