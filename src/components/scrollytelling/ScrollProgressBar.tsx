"use client";

import React, { useEffect, useState } from "react";
import { ACTS_DATA } from "@/data/jerseys";

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  const [currentAct, setCurrentAct] = useState<string>("01 ORIGIN");

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const currentScroll = window.scrollY;
      const pct = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
      setProgress(pct);

      // Determine active act based on viewport positions
      for (let i = ACTS_DATA.length - 1; i >= 0; i--) {
        const el = document.getElementById(ACTS_DATA[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setCurrentAct(`${ACTS_DATA[i].actNumber} ${ACTS_DATA[i].title}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top 2px Thin Scroll Progress Line */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] w-full bg-zinc-900/60 backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-200 transition-all duration-75 ease-out shadow-[0_0_10px_rgba(245,158,11,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating Bottom/Corner Narrative Act Pill */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-3 rounded-full border border-white/10 bg-zinc-950/80 px-3.5 py-1.5 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
          </span>
          <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
            NARRATIVE ARC:
          </span>
          <span className="font-mono text-[11px] font-bold tracking-wider text-amber-400">
            {currentAct}
          </span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <span className="font-mono text-[10px] text-zinc-400">
          {Math.round(progress)}%
        </span>
      </div>
    </>
  );
}
