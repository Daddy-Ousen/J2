"use client";

import React, { useState } from "react";
import { X, Ruler, ShieldAlert, CheckCircle2 } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"inches" | "cm">("inches");

  if (!isOpen) return null;

  const SIZES_DATA = [
    { size: "S", chestIn: "36 - 38", lengthIn: "27", chestCm: "91 - 96", lengthCm: "69", weight: "50 - 62 kg", height: "5'4\" - 5'7\"" },
    { size: "M", chestIn: "38 - 40", lengthIn: "28", chestCm: "96 - 101", lengthCm: "71", weight: "63 - 73 kg", height: "5'7\" - 5'10\"" },
    { size: "L", chestIn: "40 - 42", lengthIn: "29", chestCm: "101 - 106", lengthCm: "74", weight: "74 - 84 kg", height: "5'10\" - 6'1\"" },
    { size: "XL", chestIn: "42 - 44", lengthIn: "30", chestCm: "106 - 112", lengthCm: "76", weight: "85 - 95 kg", height: "6'0\" - 6'3\"" },
    { size: "XXL", chestIn: "44 - 46", lengthIn: "31", chestCm: "112 - 118", lengthCm: "79", weight: "95 - 108 kg", height: "6'2\"+" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-950 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-sans text-base font-bold text-white">
                OFFICIAL SIZE & MEASUREMENT GUIDE
              </h3>
              <p className="font-mono text-[10px] text-zinc-400">
                Matchday Aero-Fit Athletic Dimensions
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

        {/* Unit Switcher */}
        <div className="flex items-center justify-between py-4">
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
                  <td className="py-2.5 px-4 text-zinc-400">{row.weight}</td>
                  <td className="py-2.5 px-4 text-zinc-400">{row.height}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sizing Tip Alert */}
        <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 flex items-start gap-3">
          <ShieldAlert className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 font-mono text-[11px] leading-relaxed text-zinc-300">
            <span className="font-bold text-amber-300">ATHLETIC FIT NOTE:</span>
            <p className="text-zinc-400">
              If you prefer a relaxed or streetwear drape, we recommend ordering <strong>one size up</strong> from your usual t-shirt size. For customized player name/number printing, verify your measurements carefully as personalized kits are tailored specifically for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
