"use client";

import React, { useState } from "react";
import { X, Ruler, Sparkles, CheckCircle2, Calculator } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
}

export function SizeGuideModal({ isOpen, onClose, onSelectSize }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<"table" | "calculator">("calculator");
  const [unit, setUnit] = useState<"inches" | "cm">("inches");

  // Calculator inputs
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [fitPreference, setFitPreference] = useState<"tight" | "athletic" | "relaxed">("athletic");

  if (!isOpen) return null;

  const SIZES_DATA = [
    { size: "S", chestIn: "36 - 38", lengthIn: "27", chestCm: "91 - 96", lengthCm: "69", weight: "50 - 62 kg", height: "5'4\" - 5'7\"" },
    { size: "M", chestIn: "38 - 40", lengthIn: "28", chestCm: "96 - 101", lengthCm: "71", weight: "63 - 73 kg", height: "5'7\" - 5'10\"" },
    { size: "L", chestIn: "40 - 42", lengthIn: "29", chestCm: "101 - 106", lengthCm: "74", weight: "74 - 84 kg", height: "5'10\" - 6'1\"" },
    { size: "XL", chestIn: "42 - 44", lengthIn: "30", chestCm: "106 - 112", lengthCm: "76", weight: "85 - 95 kg", height: "6'0\" - 6'3\"" },
    { size: "XXL", chestIn: "44 - 46", lengthIn: "31", chestCm: "112 - 118", lengthCm: "79", weight: "95 - 108 kg", height: "6'2\"+" },
  ];

  // Calculate recommended size
  const calculateSize = (): { size: string; notes: string } => {
    let score = weightKg;
    if (heightCm > 180) score += 3;
    if (heightCm < 165) score -= 3;

    if (fitPreference === "tight") score -= 5;
    if (fitPreference === "relaxed") score += 5;

    if (score < 62) return { size: "S", notes: "Snug, body-hugging athletic cut." };
    if (score < 74) return { size: "M", notes: "Standard matchday athletic fit. Optimal mobility." };
    if (score < 85) return { size: "L", notes: "Comfortable athletic drape with full chest room." };
    if (score < 96) return { size: "XL", notes: "Roomy torso fit for broader frame." };
    return { size: "XXL", notes: "Max width chassis for heavyweight comfort." };
  };

  const recommendation = calculateSize();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Ruler className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-sans text-base font-bold text-white">
                SIZE & FIT ARCHITECTURE
              </h3>
              <p className="font-mono text-[10px] text-zinc-400">
                Official Matchday Player Dimensions (Bangladesh / Global Spec)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-4 pb-2">
          <button
            onClick={() => setActiveTab("calculator")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
              activeTab === "calculator"
                ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                : "bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>FIND MY FIT (CALCULATOR)</span>
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
              activeTab === "table"
                ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                : "bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            <Ruler className="h-3.5 w-3.5" />
            <span>MEASUREMENT CHART</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: INTERACTIVE SIZE CALCULATOR */}
        {/* ========================================================= */}
        {activeTab === "calculator" && (
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 space-y-2">
                <div className="flex justify-between font-mono text-xs text-zinc-300">
                  <span>YOUR HEIGHT</span>
                  <span className="text-amber-400 font-bold">{heightCm} CM ({Math.floor(heightCm / 30.48)}&apos;{Math.round((heightCm % 30.48) / 2.54)}&quot;)</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="205"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 space-y-2">
                <div className="flex justify-between font-mono text-xs text-zinc-300">
                  <span>YOUR WEIGHT</span>
                  <span className="text-amber-400 font-bold">{weightKg} KG</span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="120"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Fit Preference */}
            <div>
              <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-2">
                FIT PREFERENCE
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "tight", label: "Skin-Tight (Aero)" },
                  { key: "athletic", label: "Athletic (Standard)" },
                  { key: "relaxed", label: "Relaxed (Streetwear)" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFitPreference(item.key as any)}
                    className={`rounded-xl py-2.5 px-3 font-mono text-xs text-center border transition-all ${
                      fitPreference === item.key
                        ? "border-amber-400 bg-amber-500/15 text-amber-300 font-bold"
                        : "border-white/10 bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendation Result Card */}
            <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-zinc-900 to-black p-5 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>RECOMMENDED CHASSIS</span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-black text-white font-mono">
                    SIZE {recommendation.size}
                  </span>
                  <span className="font-mono text-xs text-zinc-300">
                    {recommendation.notes}
                  </span>
                </div>
              </div>

              {onSelectSize && (
                <button
                  onClick={() => {
                    onSelectSize(recommendation.size);
                    onClose();
                  }}
                  className="rounded-xl bg-amber-400 px-4 py-2 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-colors flex-shrink-0"
                >
                  APPLY SIZE
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MEASUREMENT TABLE */}
        {/* ========================================================= */}
        {activeTab === "table" && (
          <div className="space-y-4 pt-2">
            {/* Unit Switcher */}
            <div className="flex items-center justify-between py-2">
              <span className="font-mono text-xs text-zinc-400">
                Standard Asian/European Matchday Taper
              </span>
              <div className="flex items-center rounded-lg border border-white/10 bg-zinc-900 p-0.5 text-xs font-mono">
                <button
                  onClick={() => setUnit("inches")}
                  className={`rounded-md px-3 py-1 font-bold transition-all ${
                    unit === "inches" ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  INCHES (in)
                </button>
                <button
                  onClick={() => setUnit("cm")}
                  className={`rounded-md px-3 py-1 font-bold transition-all ${
                    unit === "cm" ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  METRIC (cm)
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-900/40">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-zinc-900/80 text-[10px] text-amber-400">
                    <th className="py-3 px-4">SIZE</th>
                    <th className="py-3 px-4">CHEST</th>
                    <th className="py-3 px-4">LENGTH</th>
                    <th className="py-3 px-4">EST. WEIGHT</th>
                    <th className="py-3 px-4">EST. HEIGHT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {SIZES_DATA.map((row) => (
                    <tr key={row.size} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-4 font-bold text-amber-300">{row.size}</td>
                      <td className="py-2.5 px-4">{unit === "inches" ? `${row.chestIn}"` : `${row.chestCm} cm`}</td>
                      <td className="py-2.5 px-4">{unit === "inches" ? `${row.lengthIn}"` : `${row.lengthCm} cm`}</td>
                      <td className="py-2.5 px-4">{row.weight}</td>
                      <td className="py-2.5 px-4">{row.height}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-zinc-400 font-mono text-[11px]">
          <CheckCircle2 className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Match-Day Guarantee:</strong> If you prefer a loose casual streetwear fit over an athletic tapered cut, we recommend choosing one size up.
          </span>
        </div>
      </div>
    </div>
  );
}
