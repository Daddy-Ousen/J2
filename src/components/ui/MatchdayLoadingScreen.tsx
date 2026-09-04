"use client";

import React, { useState, useEffect, useRef } from "react";
import { Shield, Sparkles, Volume2, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { useAudio } from "@/context/AudioContext";

const CRITICAL_ASSETS = [
  "/images/act1_origin.jpg",
  "/images/act2_struggle.jpg",
  "/jerseys_3d/west_ham_home.jpg",
  "/jerseys_3d/real_madrid_third.jpg",
  "/jerseys_3d/bayern_home.jpg",
  "/jerseys_3d/arsenal_away.jpg",
  "/jerseys_3d/atletico_volt.jpg",
  "/jerseys_3d/barca_home.jpg",
];

export function MatchdayLoadingScreen() {
  const { unlockAndPlay } = useAudio();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("CALIBRATING AERO-FIT CHASSIS...");
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const autoEnterTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check session storage so internal page switches don't re-trigger
  useEffect(() => {
    try {
      const alreadyLoaded = sessionStorage.getItem("jv_loader_seen");
      if (alreadyLoaded) {
        setIsRemoved(true);
        return;
      }
    } catch {
      // Ignore storage restrictions in incognito
    }

    // Lock scroll during initialization
    document.body.style.overflow = "hidden";

    let loadedCount = 0;
    const totalAssets = CRITICAL_ASSETS.length;

    // 1. Preload key images in parallel
    CRITICAL_ASSETS.forEach((src) => {
      const img = new Image();
      img.src = src;
      const onDone = () => {
        loadedCount += 1;
      };
      img.onload = onDone;
      img.onerror = onDone;
    });

    // 2. Preload fonts if available
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        // Fonts preloaded
      }).catch(() => {});
    }

    // 3. Smooth progress increment loop
    let currentProgress = 5;
    const interval = setInterval(() => {
      // Calculate weighted target based on real asset completion + time
      const assetRatio = Math.min(1, loadedCount / Math.max(1, totalAssets));
      const targetProgress = Math.min(100, Math.floor(assetRatio * 75 + currentProgress * 0.25));

      if (currentProgress < 95) {
        currentProgress += Math.max(1, Math.floor((targetProgress - currentProgress) * 0.3) || 2);
      } else if (loadedCount >= totalAssets) {
        currentProgress = 100;
      }

      const clamped = Math.min(100, currentProgress);
      setProgress(clamped);

      // Dynamic matchday telemetry status text
      if (clamped < 25) {
        setStatusText("CALIBRATING AERO-FIT MICRO-KNIT CHASSIS...");
      } else if (clamped < 50) {
        setStatusText("PREFETCHING 3D LIQUID SILICONE CRESTS...");
      } else if (clamped < 75) {
        setStatusText("SYNCHRONIZING MATCHDAY AUDIO PROTOCOL...");
      } else if (clamped < 95) {
        setStatusText("WARMING GRAPHICS SHADERS & ATELIER STUDIO...");
      } else {
        setStatusText("ALL SYSTEMS NOMINAL // KICKOFF READY");
      }

      if (clamped >= 100) {
        clearInterval(interval);
        setIsReady(true);

        // Auto-enter after 3.2 seconds if user doesn't tap
        autoEnterTimerRef.current = setTimeout(() => {
          handleEnterExperience(false);
        }, 3200);
      }
    }, 45);

    return () => {
      clearInterval(interval);
      if (autoEnterTimerRef.current) clearTimeout(autoEnterTimerRef.current);
      document.body.style.overflow = "";
    };
  }, []);

  const handleEnterExperience = (withAudioTrigger = true) => {
    if (autoEnterTimerRef.current) clearTimeout(autoEnterTimerRef.current);

    if (withAudioTrigger) {
      try {
        unlockAndPlay();
      } catch (err) {
        console.warn("Audio unlock trigger:", err);
      }
    }

    setIsExiting(true);
    document.body.style.overflow = "";

    try {
      sessionStorage.setItem("jv_loader_seen", "true");
    } catch {}

    setTimeout(() => {
      setIsRemoved(true);
    }, 750);
  };

  if (isRemoved) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Matchday Loading Screen"
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-[#070709] text-white select-none transition-all duration-700 ease-out ${
        isExiting
          ? "opacity-0 scale-105 pointer-events-none filter blur-sm"
          : "opacity-100 scale-100"
      }`}
    >
      {/* Background Ambient Stadium Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Amber Stadium Light Radial Bloom */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.15),_transparent_70%)] blur-3xl animate-pulse" />
        
        {/* Subtle Carbon Mesh Grid */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-repeat bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/90" />
      </div>

      {/* Top Bar: Telemetry & Skip Button */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/40 bg-zinc-900 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Shield className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs font-black tracking-[0.2em] text-white">
              JERSEY VERSE
            </span>
            <span className="font-mono text-[8px] tracking-widest text-amber-400/80">
              MATCHDAY PROTOCOL // 2026
            </span>
          </div>
        </div>

        <button
          onClick={() => handleEnterExperience(false)}
          className="flex items-center gap-1.5 rounded-full border border-white/15 bg-zinc-900/80 px-3 py-1 font-mono text-[10px] tracking-wider text-zinc-400 hover:text-white hover:border-amber-400/80 transition-all active:scale-95 backdrop-blur-sm"
        >
          <span>SKIP</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </header>

      {/* Centerpiece: Glowing 3D Shield Crest & Status */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 -mt-6">
        {/* Animated Layered Shield Crest */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Tactical Rotating Halo Ring */}
          <div className="absolute -inset-6 rounded-full border border-dashed border-amber-500/30 animate-[spin_12s_linear_infinite]" />
          <div className="absolute -inset-10 rounded-full border border-dotted border-amber-400/15 animate-[spin_20s_linear_infinite_reverse]" />

          {/* Golden Ambient Aura */}
          <div className="absolute inset-0 rounded-2xl bg-amber-500/25 blur-2xl animate-pulse" />

          {/* Central Crest Badge */}
          <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl border-2 border-amber-400/60 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black shadow-[0_0_40px_rgba(245,158,11,0.35)] backdrop-blur-md">
            <Shield className="h-12 w-12 sm:h-14 sm:w-14 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
            
            {/* Shimmer Badge Glint */}
            <div className="absolute top-2 right-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Brand Typography */}
        <h1 className="font-sans text-2xl sm:text-3xl font-black uppercase tracking-[0.22em] text-white">
          JERSEY VERSE
        </h1>
        <p className="mt-1 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-amber-400/90">
          The Mantle of Conviction // Official Matchday
        </p>

        {/* Audio Equalizer Waveform Bars (Indicating soundtrack sync) */}
        <div className="mt-5 flex items-center gap-1.5 h-6">
          {[40, 75, 100, 50, 90, 60, 30, 85, 45, 95].map((height, i) => (
            <span
              key={i}
              style={{
                height: `${progress > 20 ? height : 20}%`,
                animationDelay: `${i * 120}ms`,
              }}
              className="w-1 rounded-full bg-gradient-to-t from-amber-500 to-amber-300 animate-pulse transition-all duration-300"
            />
          ))}
        </div>

        {/* Dynamic Telemetry Status */}
        <div className="mt-6 flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-widest text-zinc-400">
          <Zap className="h-3.5 w-3.5 text-amber-400 animate-spin" style={{ animationDuration: "3s" }} />
          <span>{statusText}</span>
        </div>

        {/* Progress Numeric Display */}
        <div className="mt-2 font-mono text-xs font-bold tracking-widest text-amber-300">
          [ {String(progress).padStart(3, "0")}% ]
        </div>

        {/* Glowing Progress Rail */}
        <div className="mt-4 h-1.5 w-64 sm:w-80 rounded-full bg-zinc-900 border border-white/10 overflow-hidden relative shadow-inner">
          <div
            style={{ width: `${progress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 transition-all duration-150 ease-out shadow-[0_0_15px_rgba(245,158,11,0.8)]"
          />
        </div>

        {/* Interactive "ENTER THE ARENA" CTA Button on 100% */}
        <div
          className={`mt-7 flex flex-col items-center gap-2 transition-all duration-500 ${
            isReady
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <button
            onClick={() => handleEnterExperience(true)}
            className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-8 py-3.5 font-mono text-xs font-black tracking-widest text-black shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:shadow-[0_0_55px_rgba(245,158,11,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <Volume2 className="h-4 w-4 fill-black text-black" />
            <span>ENTER THE ARENA</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-amber-400/80">
            TAP TO IGNITE IMMERSIVE MATCHDAY SOUNDTRACK & STORE
          </span>
        </div>
      </main>

      {/* Footer Credentials & Specs */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 px-6 py-5 sm:px-10 border-t border-white/5 font-mono text-[9px] text-zinc-500">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          <span>AUTHENTIC PLAYER-GRADE MEMBRANE // 3D SILICONE CRESTS</span>
        </div>
        <div className="tracking-widest">
          DIRECT GLOBAL IMPORT • NATIONWIDE BANGLADESH
        </div>
      </footer>
    </div>
  );
}