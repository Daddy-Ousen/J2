"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JerseyProduct, CustomKitConfig } from "@/types";
import { saveStoredCart, getStoredCart } from "@/lib/cartStore";
import {
  X,
  Check,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ExternalLink,
  Truck,
  RotateCcw,
  Flame,
} from "lucide-react";

interface QuickViewModalProps {
  jersey: JerseyProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (jersey: JerseyProduct, size: string, customConfig?: CustomKitConfig) => void;
}

export function QuickViewModal({
  jersey,
  isOpen,
  onClose,
  onAddToCart,
}: QuickViewModalProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [enableCustomPrint, setEnableCustomPrint] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [viewMode, setViewMode] = useState<"front" | "back">("front");
  const [added, setAdded] = useState(false);

  // Set default name/number based on club
  useEffect(() => {
    if (!jersey) return;
    if (jersey.club?.includes("Real Madrid") || jersey.name?.includes("Real Madrid")) {
      setCustomName("BELLINGHAM");
      setCustomNumber("5");
    } else if (jersey.club?.includes("Barcelona") || jersey.name?.includes("Barcelona")) {
      setCustomName("LAMINE YAMAL");
      setCustomNumber("19");
    } else if (jersey.club?.includes("Arsenal") || jersey.name?.includes("Arsenal")) {
      setCustomName("SAKA");
      setCustomNumber("7");
    } else if (jersey.club?.includes("Man United") || jersey.name?.includes("Man United")) {
      setCustomName("MAINOO");
      setCustomNumber("37");
    } else if (jersey.club?.includes("Man City") || jersey.name?.includes("Man City")) {
      setCustomName("HAALAND");
      setCustomNumber("9");
    } else if (jersey.club?.includes("West Ham") || jersey.name?.includes("West Ham")) {
      setCustomName("BOWEN");
      setCustomNumber("20");
    } else if (jersey.club?.includes("Milan") || jersey.name?.includes("Milan")) {
      setCustomName("LEÃO");
      setCustomNumber("10");
    } else if (jersey.club?.includes("Chelsea") || jersey.name?.includes("Chelsea")) {
      setCustomName("PALMER");
      setCustomNumber("20");
    } else {
      setCustomName("CAPTAIN");
      setCustomNumber("10");
    }
  }, [jersey]);

  if (!isOpen || !jersey) return null;

  const currentPrice = jersey.price + (enableCustomPrint ? 200 : 0);
  const originalPrice = jersey.originalPrice || Math.round(jersey.price * 1.25);

  const getStockForSize = (size: string) => {
    switch (size) {
      case "S":
        return jersey.stockS ?? 6;
      case "M":
        return jersey.stockM ?? 10;
      case "L":
        return jersey.stockL ?? 14;
      case "XL":
        return jersey.stockXL ?? 6;
      case "XXL":
        return jersey.stockXXL ?? 3;
      default:
        return 5;
    }
  };

  const customConfig: CustomKitConfig | undefined = enableCustomPrint
    ? {
        colorwayId: "custom",
        colorwayName: "Matchday Official Print",
        primaryColor: jersey.dominantColor || "#111",
        secondaryColor: jersey.accentColor || "#f59e0b",
        accentColor: jersey.accentColor || "#f59e0b",
        textColor: "#ffffff",
        hexCode: jersey.dominantColor || "#111",
        finish: "metallic",
        playerName: customName.toUpperCase() || "PLAYER",
        jerseyNumber: customNumber || "10",
        fontFamily: "modern",
        crestFinish: "gold",
        weaveId: "player-knit",
        weaveName: "Aero-Fit Matchday Weave",
        weaveGsm: jersey.weightGsm || 240,
        weavePattern: "jacquard",
      }
    : undefined;

  const handleAdd = () => {
    onAddToCart(jersey, selectedSize, customConfig);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleDirectCheckout = () => {
    const existing = getStoredCart();
    const updated = [
      ...existing,
      {
        jersey,
        size: selectedSize,
        quantity: 1,
        customConfig,
      },
    ];
    saveStoredCart(updated);
    onClose();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/15 bg-zinc-950 p-5 sm:p-8 shadow-[0_25px_100px_rgba(0,0,0,0.95)] animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900/90 text-zinc-400 hover:border-white/30 hover:text-white transition-colors"
          aria-label="Close inspect modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* ============================================================ */}
          {/* LEFT: 3D PHOTO & LIVE BACK PRINT SIMULATOR (5 Cols) */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("front")}
                className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider transition-all ${
                  viewMode === "front"
                    ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                    : "border border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white"
                }`}
              >
                FRONT CHEST
              </button>
              <button
                onClick={() => setViewMode("back")}
                className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                  viewMode === "back"
                    ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                    : "border border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white"
                }`}
              >
                <Sparkles className="h-3 w-3" />
                <span>BACK PRINT (LIVE)</span>
              </button>
            </div>

            {/* Stage Container */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/60 shadow-2xl flex items-center justify-center p-2 group">
              {viewMode === "front" ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src={jersey.image}
                    alt={jersey.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover object-center filter contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Serial pill bottom left */}
                  <div className="absolute bottom-3 left-3 rounded bg-black/80 px-2 py-1 font-mono text-[9px] text-zinc-400 border border-white/10 backdrop-blur-md">
                    SERIAL: {jersey.code}
                  </div>
                  {/* Weight tag bottom right */}
                  <div className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-1 font-mono text-[9px] text-amber-400 font-bold border border-white/10 backdrop-blur-md">
                    {jersey.weightGsm || 240} GSM CHASSIS
                  </div>
                </div>
              ) : (
                /* LIVE BACK PRINT SIMULATOR */
                <div
                  className="relative w-full h-full rounded-xl flex flex-col items-center justify-center p-6 border border-white/10 shadow-inner overflow-hidden"
                  style={{
                    backgroundColor: jersey.dominantColor || "#0c0a09",
                    backgroundImage: `radial-gradient(circle at center, ${jersey.accentColor}25 0%, transparent 70%)`,
                  }}
                >
                  <div className="absolute top-4 text-[9px] font-mono uppercase tracking-widest text-zinc-400/80 border-b border-white/10 pb-1">
                    JERSEY VERSE // MATCHDAY REAR
                  </div>

                  {/* Player Name */}
                  <div className="font-sans font-black tracking-widest text-white text-xl sm:text-2xl uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] text-center max-w-full truncate px-2">
                    {customName || "PLAYER"}
                  </div>

                  {/* Jersey Number */}
                  <div className="font-sans font-black text-6xl sm:text-7xl tracking-tighter text-white drop-shadow-[0_6px_12px_rgba(0,0,0,0.9)] mt-1">
                    {customNumber || "10"}
                  </div>

                  {/* Authentic Label */}
                  <div className="absolute bottom-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-[9px] text-amber-300 backdrop-blur-md">
                    <Sparkles className="h-3 w-3" />
                    <span>HEAT-PRESSED OFFICIAL ATHLETIC FOIL</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick link to standalone page */}
            <Link
              href={`/product/${jersey.slug || jersey.id}`}
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-amber-300 transition-colors py-1"
            >
              <span>View full high-res 3D gallery & reviews</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: SPECS, SIZE, CUSTOMIZATION & ACTIONS (7 Cols) */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            {/* Header Identity */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300 uppercase">
                  {jersey.league || "Official Matchday"}
                </span>
                <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                  {jersey.kitType ? `${jersey.kitType} Kit` : "Matchday Kit"}
                </span>
                <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                  {jersey.sleeve || "Half sleeve"}
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  IN STOCK ({getStockForSize(selectedSize)} UNITS IN SIZE {selectedSize})
                </span>
              </div>

              <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight">
                {jersey.name}
              </h2>
              <p className="font-mono text-xs text-zinc-400 mt-1">
                {jersey.subtitle || "26/27 Official Matchday Player Version"}
              </p>

              {/* Price Row */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-mono text-2xl sm:text-3xl font-black text-amber-400">
                  ৳{currentPrice.toLocaleString()} BDT
                </span>
                {originalPrice > currentPrice && (
                  <span className="font-mono text-sm text-zinc-500 line-through">
                    ৳{originalPrice.toLocaleString()}
                  </span>
                )}
                {enableCustomPrint && (
                  <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 font-mono text-[10px] text-amber-300 font-bold">
                    +৳200 CUSTOM PRINT
                  </span>
                )}
              </div>
            </div>

            {/* Size Selector with Live Stock Counters */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs text-zinc-300">
                <span className="font-bold uppercase tracking-wider text-[11px]">
                  SELECT CHASSIS SIZE
                </span>
                <span className="text-amber-400 text-[10px]">TRUE TO ATHLETIC FORM</span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => {
                  const count = getStockForSize(size);
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`flex flex-col items-center justify-center py-2 rounded-xl border font-mono transition-all ${
                        isSelected
                          ? "border-amber-400 bg-amber-400 text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.02]"
                          : "border-white/10 bg-zinc-900 text-zinc-300 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      <span className="text-sm font-bold">{size}</span>
                      <span
                        className={`text-[9px] mt-0.5 ${
                          isSelected ? "text-zinc-900 font-bold" : "text-zinc-500"
                        }`}
                      >
                        {count > 0 ? `${count} left` : "sold out"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Player Name & Number Printing Accordion */}
            <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={enableCustomPrint}
                    onChange={(e) => {
                      setEnableCustomPrint(e.target.checked);
                      if (e.target.checked) setViewMode("back");
                    }}
                    className="h-4 w-4 rounded accent-amber-400 cursor-pointer"
                  />
                  <span className="font-mono text-xs font-bold text-white uppercase">
                    CUSTOM PLAYER PRINTING (+৳200)
                  </span>
                </div>
                <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-300">
                  HEAT-PRESSED
                </span>
              </label>

              {enableCustomPrint && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 animate-in fade-in duration-200">
                  <div>
                    <label className="block font-mono text-[9px] uppercase text-zinc-400 mb-1">
                      Name on Back
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                      placeholder="e.g. BELLINGHAM"
                      className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 font-mono text-xs font-bold text-white uppercase focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase text-zinc-400 mb-1">
                      Jersey Number
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={customNumber}
                      onChange={(e) =>
                        setCustomNumber(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      placeholder="e.g. 10"
                      className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 font-mono text-xs font-bold text-white text-center focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleAdd}
                className="group relative w-full flex items-center justify-center gap-2.5 rounded-2xl bg-amber-400 py-3.5 px-6 font-mono text-xs font-bold tracking-widest text-black shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-300 active:scale-[0.99]"
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>ADDED TO MANTLE BAG!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>ADD TO MANTLE — ৳{currentPrice.toLocaleString()}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <button
                onClick={handleDirectCheckout}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-zinc-900 hover:bg-white/10 py-3 px-6 font-mono text-xs font-bold text-zinc-200 hover:text-white transition-colors"
              >
                <span>PROCEED TO BKASH / NAGAD CHECKOUT</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
              </button>
            </div>

            {/* Technical Specifications Grid */}
            <div className="rounded-2xl border border-white/5 bg-zinc-900/30 p-4 space-y-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span>MATERIAL ARCHITECTURE SPEC SHEET</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="border-l border-amber-500/40 pl-2.5">
                  <span className="block font-mono text-[9px] uppercase text-zinc-500">
                    WEAVE DENSITY
                  </span>
                  <span className="font-medium text-zinc-200 text-[11px]">
                    {jersey.weightGsm || 240} GSM Micro-Knit
                  </span>
                </div>

                <div className="border-l border-amber-500/40 pl-2.5">
                  <span className="block font-mono text-[9px] uppercase text-zinc-500">
                    BADGE RELIEF
                  </span>
                  <span className="font-medium text-zinc-200 text-[11px]">
                    {jersey.badgeType || "3D Liquid Silicone Crest"}
                  </span>
                </div>

                <div className="border-l border-amber-500/40 pl-2.5">
                  <span className="block font-mono text-[9px] uppercase text-zinc-500">
                    ORIGIN CODE
                  </span>
                  <span className="font-mono font-bold text-amber-400 text-[11px]">
                    {jersey.code}
                  </span>
                </div>

                <div className="border-l border-amber-500/40 pl-2.5">
                  <span className="block font-mono text-[9px] uppercase text-zinc-500">
                    CARE PROTOCOL
                  </span>
                  <span className="font-medium text-zinc-200 text-[11px]">
                    Cold Wash, Hang Dry
                  </span>
                </div>
              </div>

              {jersey.story && (
                <p className="text-[11px] font-sans text-zinc-400 leading-relaxed pt-1 border-t border-white/5">
                  {jersey.story}
                </p>
              )}

              {/* Badges footer */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 font-mono text-[9px] text-zinc-400 text-center">
                <div className="rounded-lg bg-zinc-900/80 p-1.5 border border-white/5">
                  <ShieldCheck className="h-3.5 w-3.5 mx-auto text-amber-400 mb-0.5" />
                  <span>100% AUTHENTIC</span>
                </div>
                <div className="rounded-lg bg-zinc-900/80 p-1.5 border border-white/5">
                  <Truck className="h-3.5 w-3.5 mx-auto text-amber-400 mb-0.5" />
                  <span>FAST DISPATCH</span>
                </div>
                <div className="rounded-lg bg-zinc-900/80 p-1.5 border border-white/5">
                  <Flame className="h-3.5 w-3.5 mx-auto text-amber-400 mb-0.5" />
                  <span>CUSTOM PRINTS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
