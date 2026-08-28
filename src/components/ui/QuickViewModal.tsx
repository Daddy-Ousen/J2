"use client";

import React, { useState } from "react";
import Image from "next/image";
import { JerseyProduct } from "@/types";
import { JerseySilhouette } from "./JerseySilhouette";
import { X, Check, ShieldCheck, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";

interface QuickViewModalProps {
  jersey: JerseyProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (jersey: JerseyProduct, size: string) => void;
}

export function QuickViewModal({
  jersey,
  isOpen,
  onClose,
  onAddToCart,
}: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [added, setAdded] = useState(false);
  const [viewMode, setViewMode] = useState<"photo" | "schematic">("photo");

  if (!isOpen || !jersey) return null;

  const handleAdd = () => {
    onAddToCart(jersey, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-zinc-900/80 text-zinc-400 hover:border-white/20 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
          {/* Left: Product Visual Stage */}
          <div className="relative flex flex-col items-center justify-center rounded-xl border border-white/5 bg-zinc-900/50 p-6">
            {/* View Switcher */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur-md">
              <button
                onClick={() => setViewMode("photo")}
                className={`rounded-full px-2.5 py-1 text-[10px] font-mono transition-colors ${
                  viewMode === "photo" ? "bg-amber-500 text-black font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                STUDIO SHOT
              </button>
              <button
                onClick={() => setViewMode("schematic")}
                className={`rounded-full px-2.5 py-1 text-[10px] font-mono transition-colors ${
                  viewMode === "schematic" ? "bg-amber-500 text-black font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                SCHEMATIC (SVG)
              </button>
            </div>

            <div className="relative w-full h-[320px] sm:h-[380px] flex items-center justify-center pt-8">
              {viewMode === "photo" ? (
                <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                  <Image
                    src={jersey.image}
                    alt={jersey.name}
                    fill
                    sizes="(max-width: 768px) 300px, 450px"
                    className="object-cover object-center filter contrast-[1.08]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/20" />
                </div>
              ) : (
                <JerseySilhouette
                  primaryColor={jersey.dominantColor}
                  accentColor={jersey.accentColor}
                  number="10"
                  className="w-full h-full max-h-[300px]"
                />
              )}
            </div>

            <div className="mt-4 flex w-full items-center justify-between text-[11px] font-mono text-zinc-400 border-t border-white/5 pt-3">
              <span>{jersey.code}</span>
              <span className="text-amber-400">{jersey.edition}</span>
            </div>
          </div>

          {/* Right: Spec Sheet & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-300">
                <Sparkles className="h-3 w-3" />
                <span>JERSEY VERSE SPEC SHEET</span>
              </div>

              <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
                {jersey.name}
              </h2>
              <p className="font-mono text-xs text-amber-400/90 tracking-wider mt-0.5">
                {jersey.subtitle} — ৳{jersey.price.toLocaleString()} BDT
              </p>

              <p className="mt-4 text-sm leading-relaxed text-zinc-300 font-light">
                {jersey.story}
              </p>
            </div>

            {/* Technical Specifications Grid */}
            <div className="space-y-2 rounded-xl border border-white/5 bg-zinc-900/30 p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                <span>Material Architecture</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {jersey.specs.map((spec) => (
                  <div key={spec.label} className="border-l-2 border-amber-500/30 pl-2.5">
                    <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                      {spec.label}
                    </div>
                    <div className="text-xs font-medium text-zinc-200 mt-0.5">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="mb-2 flex items-center justify-between font-mono text-xs text-zinc-300">
                <span>SELECT CHASSIS SIZE</span>
                <span className="text-amber-400 text-[11px]">TRUE TO ATHLETIC FORM</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {jersey.availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex h-10 items-center justify-center rounded-lg border font-mono text-xs font-bold transition-all ${
                      selectedSize === size
                        ? "border-amber-400 bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                        : "border-white/10 bg-zinc-900/60 text-zinc-300 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleAdd}
                className="group relative flex-1 flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 py-3 px-6 text-xs font-mono font-bold tracking-widest text-black shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all hover:brightness-110 active:scale-98"
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>MANTLE SECURED TO BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>CLAIM MANTLE — ৳{jersey.price.toLocaleString()}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
