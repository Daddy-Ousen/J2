"use client";

import React, { useState } from "react";
import { CustomKitConfig, ConfiguratorView, JerseyProduct } from "@/types";
import { InteractiveJerseyCanvas } from "./InteractiveJerseyCanvas";
import {
  RotateCcw,
  Sparkles,
  Shirt,
  Eye,
  Move3d,
  Palette,
  Sliders,
  Layers,
  Check,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const COLORWAY_PRESETS: {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  hex: string;
  description: string;
}[] = [
  {
    id: "obsidian",
    name: "Obsidian & Gold",
    primary: "#0d0f14",
    secondary: "#181a24",
    accent: "#f59e0b",
    text: "#f59e0b",
    hex: "#0d0f14",
    description: "Deep carbon black infused with 24K championship gold highlights.",
  },
  {
    id: "cyber",
    name: "Cyber Volt",
    primary: "#080d14",
    secondary: "#101b2a",
    accent: "#84cc16",
    text: "#84cc16",
    hex: "#84cc16",
    description: "High-octane neon volt accents cut through pitch-black stealth fabric.",
  },
  {
    id: "bloodline",
    name: "Bloodline Crimson",
    primary: "#1c0608",
    secondary: "#2c0b0e",
    accent: "#ef4444",
    text: "#ffffff",
    hex: "#ef4444",
    description: "Primal arena red balanced by smoked onyx panels and bone highlights.",
  },
  {
    id: "alpine",
    name: "Alpine Frost",
    primary: "#0a1924",
    secondary: "#122a3c",
    accent: "#38bdf8",
    text: "#38bdf8",
    hex: "#38bdf8",
    description: "Glacial cyan luminescence inspired by sub-zero high-altitude ascents.",
  },
  {
    id: "verdant",
    name: "Verdant Emerald",
    primary: "#051812",
    secondary: "#0a281e",
    accent: "#10b981",
    text: "#facc15",
    hex: "#10b981",
    description: "Deep forest emerald interwoven with aureate matchday crest detailing.",
  },
  {
    id: "solar",
    name: "Solar Flare",
    primary: "#261304",
    secondary: "#3d1f06",
    accent: "#f97316",
    text: "#fef08a",
    hex: "#f97316",
    description: "Intense molten amber gradient capturing the blinding heat of the arena.",
  },
];

const WEAVE_OPTIONS: {
  id: string;
  name: string;
  gsm: number;
  pattern: "pique" | "jacquard" | "carbon" | "honeycomb";
  desc: string;
}[] = [
  {
    id: "w-pique",
    name: "Tactical Micro-Piqué",
    gsm: 240,
    pattern: "pique",
    desc: "Japanese high-density dimple knit engineered for rapid moisture evaporation.",
  },
  {
    id: "w-jacquard",
    name: "Topographic Jacquard",
    gsm: 260,
    pattern: "jacquard",
    desc: "Zoned 3D elevation contours mapping high-heat athletic meridians.",
  },
  {
    id: "w-carbon",
    name: "Carbon Diamond",
    gsm: 230,
    pattern: "carbon",
    desc: "High-tensile aerodynamic diamond grid with frictionless exterior glide.",
  },
  {
    id: "w-honeycomb",
    name: "Dual-Layer Honeycomb",
    gsm: 250,
    pattern: "honeycomb",
    desc: "Hexagonal cell ventilation matrix providing sub-zero microclimate control.",
  },
];

const MANTRA_SUGGESTIONS = [
  "BELIEF OVER EVERYTHING",
  "THE CRUCIBLE",
  "VANGUARD",
  "SANCTUARY",
  "NO CEILING",
  "ARCHETYPE",
];

const DEFAULT_CONFIG: CustomKitConfig = {
  colorwayId: "obsidian",
  colorwayName: "Obsidian & Gold",
  primaryColor: "#0d0f14",
  secondaryColor: "#181a24",
  accentColor: "#f59e0b",
  textColor: "#f59e0b",
  hexCode: "#0d0f14",
  finish: "satin",
  playerName: "BELIEF OVER EVERYTHING",
  jerseyNumber: "94",
  fontFamily: "modern",
  crestFinish: "gold",
  weaveId: "w-pique",
  weaveName: "Tactical Micro-Piqué",
  weaveGsm: 240,
  weavePattern: "pique",
};

interface StudioConfiguratorProps {
  onAddBespokeToBag?: (customKit: JerseyProduct, config: CustomKitConfig) => void;
}

export function StudioConfigurator({ onAddBespokeToBag }: StudioConfiguratorProps) {
  const [config, setConfig] = useState<CustomKitConfig>(DEFAULT_CONFIG);
  const [activeView, setActiveView] = useState<ConfiguratorView>("front");
  const [activeTab, setActiveTab] = useState<"colorways" | "identity" | "weave">("colorways");
  const [isSaved, setIsSaved] = useState(false);

  const handleSelectColorway = (preset: typeof COLORWAY_PRESETS[0]) => {
    setConfig((prev) => ({
      ...prev,
      colorwayId: preset.id,
      colorwayName: preset.name,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
      textColor: preset.text,
      hexCode: preset.hex,
    }));
  };

  const handleSelectWeave = (weave: typeof WEAVE_OPTIONS[0]) => {
    setConfig((prev) => ({
      ...prev,
      weaveId: weave.id,
      weaveName: weave.name,
      weaveGsm: weave.gsm,
      weavePattern: weave.pattern,
    }));
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setActiveView("front");
  };

  const handleSaveSpec = () => {
    setIsSaved(true);

    const bespokeProduct: JerseyProduct = {
      id: `bespoke-${Date.now()}`,
      code: `ARC-BESPOKE/${config.jerseyNumber}`,
      name: `ARCHETYPE BESPOKE: ${config.playerName}`,
      subtitle: `${config.colorwayName} // ${config.weaveName}`,
      price: 215,
      edition: `Custom Tailored — Serial #${config.jerseyNumber}`,
      colorway: config.colorwayName,
      dominantColor: config.primaryColor,
      accentColor: config.accentColor,
      image: "/images/hero_jersey.jpg",
      fallbackGradient: "from-zinc-950 via-zinc-900 to-amber-950/40",
      weightGsm: config.weaveGsm,
      fabric: config.weaveName,
      badgeType: `3D ${config.crestFinish.toUpperCase()} silicone crest`,
      story: `Custom commissioned atelier chassis carrying the personal oath "${config.playerName}" (#${config.jerseyNumber}).`,
      specs: [
        { label: "Fabric Architecture", value: `${config.weaveGsm} GSM ${config.weaveName}` },
        { label: "Finish Profile", value: `${config.finish.toUpperCase()} Finish` },
        { label: "Crest Spec", value: `3D ${config.crestFinish.toUpperCase()} Relief` },
        { label: "Identity Imprint", value: `${config.playerName} (#${config.jerseyNumber})` },
      ],
      availableSizes: ["S", "M", "L", "XL", "XXL"],
    };

    if (onAddBespokeToBag) {
      onAddBespokeToBag(bespokeProduct, config);
    }

    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="relative w-full py-8 text-white">
      {/* Subtitle intro banner */}
      <div className="text-center max-w-2xl mx-auto mb-8 px-4 space-y-2">
        <p className="font-mono text-xs text-amber-400/90 tracking-widest uppercase">
          ATELIER SPEC 01 // BESPOKE LAB
        </p>
        <p className="text-sm font-light text-zinc-300 leading-relaxed">
          A jersey is not fabric. It is the armor of 90 minutes of faith. Customize your kit below
          with real-time 3D rendering.
        </p>
      </div>

      {/* Main 2-Column Grid matching reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Left Column: Interactive 3D Canvas */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <InteractiveJerseyCanvas
            config={config}
            activeView={activeView}
            onViewChange={setActiveView}
            className="w-full h-full min-h-[460px] lg:min-h-[520px]"
          />
        </div>

        {/* Right Column: Studio Configurator Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* View Mode Camera Bar */}
          <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-white/10 bg-zinc-950/80 p-1.5 backdrop-blur-md">
            <button
              onClick={() => setActiveView("front")}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-2 font-mono text-[11px] font-bold transition-all ${
                activeView === "front"
                  ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Shirt className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Front Chest</span>
              <span className="sm:hidden">Front</span>
            </button>

            <button
              onClick={() => setActiveView("back")}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-2 font-mono text-[11px] font-bold transition-all ${
                activeView === "back"
                  ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back Name</span>
              <span className="sm:hidden">Back</span>
            </button>

            <button
              onClick={() => setActiveView("macro")}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-2 font-mono text-[11px] font-bold transition-all ${
                activeView === "macro"
                  ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Crest Macro</span>
              <span className="sm:hidden">Macro</span>
            </button>

            <button
              onClick={() => setActiveView("orbit")}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-2 font-mono text-[11px] font-bold transition-all ${
                activeView === "orbit"
                  ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Move3d className="h-3.5 w-3.5" />
              <span>3D Orbit</span>
            </button>
          </div>

          {/* Configurator Card */}
          <div className="flex-1 rounded-2xl border border-white/10 bg-zinc-950/90 p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-5">
            {/* Header with Reset */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-200">
                  STUDIO CONFIGURATOR // LIVE
                </span>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 hover:text-amber-400 transition-colors"
                title="Reset customizations to default"
              >
                <RotateCcw className="h-3 w-3" />
                <span>RESET</span>
              </button>
            </div>

            {/* Config Sub-Tabs */}
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-zinc-900/90 p-1 border border-white/5">
              <button
                onClick={() => setActiveTab("colorways")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-mono font-bold transition-all ${
                  activeTab === "colorways"
                    ? "bg-zinc-800 text-amber-400 shadow-md border border-white/10"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Palette className="h-3.5 w-3.5" />
                <span>Colorways</span>
              </button>

              <button
                onClick={() => setActiveTab("identity")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-mono font-bold transition-all ${
                  activeTab === "identity"
                    ? "bg-zinc-800 text-amber-400 shadow-md border border-white/10"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Identity</span>
              </button>

              <button
                onClick={() => setActiveTab("weave")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-mono font-bold transition-all ${
                  activeTab === "weave"
                    ? "bg-zinc-800 text-amber-400 shadow-md border border-white/10"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Weave</span>
              </button>
            </div>

            {/* Tab 1: Colorways Palette */}
            {activeTab === "colorways" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    COLORWAY PALETTE
                  </span>
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-400">
                    SIGNATURE
                  </span>
                </div>

                {/* Swatches Row */}
                <div className="grid grid-cols-6 gap-2">
                  {COLORWAY_PRESETS.map((preset) => {
                    const isSelected = config.colorwayId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectColorway(preset)}
                        className={`group relative flex flex-col items-center gap-1 rounded-xl p-2 transition-all ${
                          isSelected
                            ? "bg-zinc-900 border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                            : "bg-zinc-900/50 border border-white/5 hover:border-white/20"
                        }`}
                      >
                        {/* Swatch circle with dual tone */}
                        <div
                          className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/20 shadow-md overflow-hidden"
                          style={{ background: preset.primary }}
                        >
                          <div
                            className="absolute bottom-0 right-0 h-4 w-4 rounded-tl-full"
                            style={{ background: preset.accent }}
                          />
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-white stroke-[3] drop-shadow-md" />
                          )}
                        </div>
                        <span className="text-[9px] font-mono text-zinc-400 truncate max-w-full">
                          {preset.id}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Colorway Details Card */}
                <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-white">{config.colorwayName}</span>
                    <span className="text-zinc-500">{config.hexCode}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                    {COLORWAY_PRESETS.find((p) => p.id === config.colorwayId)?.description}
                  </p>
                </div>

                {/* Material Sheen Selector */}
                <div className="space-y-1.5 pt-1">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                    SURFACE FINISH
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(["satin", "matte", "metallic"] as const).map((finishMode) => (
                      <button
                        key={finishMode}
                        onClick={() => setConfig((p) => ({ ...p, finish: finishMode }))}
                        className={`rounded-lg py-1.5 px-2 font-mono text-[10px] font-bold uppercase transition-all ${
                          config.finish === finishMode
                            ? "bg-amber-400 text-black shadow-md"
                            : "bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {finishMode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Identity & Custom Mantra */}
            {activeTab === "identity" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Custom Name / Mantra Field */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                    <span>PLAYER NAME / MANTRA</span>
                    <span className="text-zinc-500">{config.playerName.length}/24 CHARS</span>
                  </label>
                  <input
                    type="text"
                    maxLength={24}
                    value={config.playerName}
                    onChange={(e) =>
                      setConfig((p) => ({ ...p, playerName: e.target.value.toUpperCase() }))
                    }
                    placeholder="ENTER OATH OR NAME"
                    className="w-full rounded-xl border border-white/15 bg-zinc-900/90 px-3.5 py-2.5 text-xs font-mono font-bold tracking-wider text-amber-400 placeholder-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />

                  {/* Suggestion Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {MANTRA_SUGGESTIONS.map((m) => (
                      <button
                        key={m}
                        onClick={() => setConfig((p) => ({ ...p, playerName: m }))}
                        className="rounded-full border border-white/10 bg-zinc-900/70 px-2 py-0.5 font-mono text-[9px] text-zinc-400 hover:border-amber-400 hover:text-white transition-colors"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Jersey Number Customization */}
                <div className="space-y-1.5 pt-1">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                    <span>JERSEY NUMBER (00–99)</span>
                    <span className="text-amber-400">CHAMPION DIGIT</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={2}
                      value={config.jerseyNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setConfig((p) => ({ ...p, jerseyNumber: val }));
                      }}
                      className="w-20 rounded-xl border border-white/15 bg-zinc-900/90 px-3 py-2 text-center text-base font-mono font-bold text-amber-400 focus:border-amber-400 focus:outline-none"
                    />
                    <div className="flex flex-1 gap-1.5">
                      {["01", "07", "10", "23", "94", "99"].map((num) => (
                        <button
                          key={num}
                          onClick={() => setConfig((p) => ({ ...p, jerseyNumber: num }))}
                          className={`flex-1 rounded-lg py-1.5 font-mono text-xs font-bold transition-all ${
                            config.jerseyNumber === num
                              ? "bg-amber-400 text-black shadow-md"
                              : "bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Crest Finish Selector */}
                <div className="space-y-1.5 pt-1">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                    CREST BADGE RELIEF
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(["gold", "stealth", "prismatic"] as const).map((crest) => (
                      <button
                        key={crest}
                        onClick={() => setConfig((p) => ({ ...p, crestFinish: crest }))}
                        className={`rounded-lg py-1.5 px-2 font-mono text-[10px] font-bold uppercase transition-all ${
                          config.crestFinish === crest
                            ? "bg-amber-400 text-black shadow-md"
                            : "bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {crest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Weave & Material Architecture */}
            {activeTab === "weave" && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                  ENGINEERED TEXTILE MATRIX
                </div>

                <div className="space-y-2">
                  {WEAVE_OPTIONS.map((weave) => {
                    const isSelected = config.weaveId === weave.id;
                    return (
                      <div
                        key={weave.id}
                        onClick={() => handleSelectWeave(weave)}
                        className={`group cursor-pointer rounded-xl border p-3 transition-all ${
                          isSelected
                            ? "border-amber-400 bg-zinc-900 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                            : "border-white/5 bg-zinc-900/40 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${
                                isSelected ? "bg-amber-400 shadow-[0_0_8px_#f59e0b]" : "bg-zinc-600"
                              }`}
                            />
                            <span className="font-sans text-xs font-bold text-white">
                              {weave.name}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] font-bold text-amber-400">
                            {weave.gsm} GSM
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] text-zinc-400 font-light pl-4.5">
                          {weave.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Save Custom Kit Spec Action Button */}
            <div className="pt-2">
              <button
                onClick={handleSaveSpec}
                className="w-full group flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 py-3.5 px-6 font-mono text-xs font-black tracking-widest text-black shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all hover:brightness-110 active:scale-98"
              >
                {isSaved ? (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>BESPOKE SPEC SAVED TO BAG</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>SAVE CUSTOM KIT SPEC (GENERATE SPEC)</span>
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
