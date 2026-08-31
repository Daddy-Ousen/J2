"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Sparkles, Eye, Zap, ShieldCheck, Shuffle } from "lucide-react";
import { JERSEYS_DATA } from "@/data/jerseys";
import { JerseyProduct } from "@/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Act3JerseyMomentProps {
  products?: JerseyProduct[];
  onInspectHeroKit?: (jersey: JerseyProduct) => void;
}

export function Act3JerseyMoment({ products, onInspectHeroKit }: Act3JerseyMomentProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const jerseyStageRef = useRef<HTMLDivElement>(null);
  const jerseyAssetRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const textStageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [hasFlashed, setHasFlashed] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const availableKits = products && products.length > 0 ? products : JERSEYS_DATA;

  // Pick a random available kit on mount
  useEffect(() => {
    if (availableKits.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableKits.length);
      setCurrentIdx(randomIndex);
    }
  }, [availableKits.length]);

  const heroJersey = availableKits[currentIdx % availableKits.length] || availableKits[0] || JERSEYS_DATA[0];

  const handleReroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    let nextIdx = Math.floor(Math.random() * availableKits.length);
    if (nextIdx === currentIdx && availableKits.length > 1) {
      nextIdx = (currentIdx + 1) % availableKits.length;
    }
    setCurrentIdx(nextIdx);

    // Micro pulse effect
    if (jerseyAssetRef.current) {
      gsap.fromTo(
        jerseyAssetRef.current,
        { scale: 0.95, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  };

  useGSAP(
    () => {
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (isReduced) {
        if (jerseyAssetRef.current) {
          gsap.set(jerseyAssetRef.current, { scale: 1, opacity: 1 });
        }
        if (textStageRef.current) {
          gsap.set(textStageRef.current, { opacity: 1, y: 0 });
        }
        return;
      }

      const isMobile = window.innerWidth < 768;

      // Initial state: small, distant, low opacity
      gsap.set(jerseyAssetRef.current, {
        scale: isMobile ? 0.55 : 0.42,
        opacity: 0.8,
        y: isMobile ? 10 : 20,
        filter: isMobile ? "none" : "drop-shadow(0 0 20px rgba(0,0,0,0.9))",
      });
      gsap.set(textStageRef.current, { opacity: 0, y: isMobile ? 25 : 40 });
      gsap.set(glowRef.current, { scale: 0.5, opacity: 0.2 });

      let flashTriggered = false;

      // Pinned push-in timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: isMobile ? "+=110%" : "+=150%",
          pin: true,
          pinSpacing: true,
          scrub: isMobile ? 0.3 : 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Trigger peak flash and screen shake once when crossing 82% progress
            if (self.progress > 0.82 && !flashTriggered) {
              flashTriggered = true;
              setHasFlashed(true);

              // Flash of light
              if (flashRef.current) {
                gsap.fromTo(
                  flashRef.current,
                  { opacity: 0.95 },
                  { opacity: 0, duration: 0.6, ease: "power2.out" }
                );
              }

              // Subtle screen shake
              if (viewportRef.current) {
                gsap.timeline()
                  .to(viewportRef.current, { x: -4, y: 3, duration: 0.05 })
                  .to(viewportRef.current, { x: 5, y: -4, duration: 0.05 })
                  .to(viewportRef.current, { x: -3, y: 2, duration: 0.05 })
                  .to(viewportRef.current, { x: 0, y: 0, duration: 0.08 });
              }
            } else if (self.progress < 0.75) {
              flashTriggered = false;
            }
          },
        },
      });

      // Camera push-in: scale up to 1.12, crisp focus
      tl.to(
        jerseyAssetRef.current,
        {
          scale: 1.12,
          opacity: 1,
          y: 0,
          filter: "blur(0px) drop-shadow(0 30px 80px rgba(245,158,11,0.35))",
          ease: "power2.inOut",
          duration: 3,
        },
        0
      );

      // Volumetric glow expands
      tl.to(
        glowRef.current,
        {
          scale: 1.6,
          opacity: 0.9,
          ease: "power2.inOut",
          duration: 3,
        },
        0
      );

      // Climax text reveal
      tl.to(
        textStageRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        1.8
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="act-mantle"
      ref={sectionRef}
      className="relative w-full bg-zinc-950 text-white overflow-hidden"
    >
      {/* Viewport container with screen shake capability */}
      <div
        ref={viewportRef}
        className="relative min-h-[100dvh] w-full flex flex-col justify-between pt-20 pb-6 px-6 sm:pt-24 sm:pb-10 sm:px-12 lg:pt-24 lg:pb-12 lg:px-20 overflow-hidden"
      >
        {/* Background Grid & Ambient Radial Dust */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(24,24,27,0.8)_0%,_#09090b_100%)]" />
          <div
            ref={glowRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-amber-600/30 via-amber-500/20 to-transparent blur-[120px] pointer-events-none"
          />
          {/* Subtle grid mesh */}
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        {/* Peak Flash of Light Overlay */}
        <div
          ref={flashRef}
          className="absolute inset-0 z-40 pointer-events-none bg-white opacity-0 transition-opacity"
        />

        {/* Top Meta Bar */}
        <div className="relative z-20 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-widest text-zinc-400">
            <span className="text-amber-400 font-bold">ACT III</span>
            <span className="text-zinc-600">//</span>
            <span className="text-white uppercase font-bold">THE JERSEY MOMENT</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReroll}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900/80 px-3 py-1 font-mono text-[10px] text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 transition-all active:scale-95"
              title="Shuffle to another random in-stock 3D armor"
            >
              <Shuffle className="h-3 w-3" />
              <span>REROLL KIT</span>
            </button>

            <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] text-amber-300">
              <Sparkles className="h-3 w-3 animate-spin" />
              <span>EMOTIONAL APEX</span>
            </div>
          </div>
        </div>

        {/* Center Arena: Push-in Jersey Showcase */}
        <div
          ref={jerseyStageRef}
          className="relative z-10 my-auto flex flex-col items-center justify-center py-2"
        >
          {/* Scalable Jersey Asset Container */}
          <div
            ref={jerseyAssetRef}
            className="relative w-[230px] h-[330px] sm:w-[280px] sm:h-[400px] md:w-[320px] md:h-[460px] flex items-center justify-center transform-gpu cursor-pointer group"
            onClick={() => onInspectHeroKit?.(heroJersey)}
            title="Click to inspect kit details"
          >
            {/* Real High-Res 3D In-Stock Jersey Image */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] border border-white/10 bg-zinc-950/80 backdrop-blur-sm group-hover:border-amber-500/50 transition-colors">
              <Image
                src={heroJersey.image}
                alt={heroJersey.name}
                fill
                priority
                sizes="(max-width: 768px) 280px, 320px"
                className="object-cover object-center filter contrast-[1.05] brightness-[1.0] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-black/20" />

              {/* Floating Quick Action Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg border border-white/10 bg-black/80 px-3 py-2 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-mono text-[10px] text-zinc-200 truncate pr-2 font-bold">
                  {heroJersey.name}
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-amber-400 flex-shrink-0">
                  <Eye className="h-3 w-3" /> INSPECT
                </span>
              </div>
            </div>

            {/* Corner Decorative Tech Notations */}
            <div className="absolute -top-3 -left-3 font-mono text-[9px] text-zinc-500 uppercase tracking-widest hidden sm:block">
              // SPEC: {heroJersey.weightGsm}GSM
            </div>
            <div className="absolute -bottom-3 -right-3 font-mono text-[9px] text-amber-500/80 uppercase tracking-widest hidden sm:block">
              // {heroJersey.code}
            </div>
          </div>

          {/* Emotional Headline & Copy Reveal */}
          <div
            ref={textStageRef}
            className="mt-4 sm:mt-6 text-center max-w-xl px-4 space-y-3"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 font-mono text-[9px] uppercase tracking-[0.25em] text-amber-300">
              <ShieldCheck className="h-3 w-3" />
              <span>THE MANTLE // {heroJersey.name}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight">
              You don&apos;t just wear it.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-100">
                You become what it represents.
              </span>
            </h2>

            <p className="mx-auto max-w-md text-xs sm:text-sm font-light text-zinc-300 leading-relaxed">
              When the collar settles across your shoulders, the doubts evaporate. You inherit every
              triumph and sacrifice of everyone who ever wore the crest.
            </p>

            <div className="pt-1">
              <button
                onClick={() => onInspectHeroKit?.(heroJersey)}
                className="inline-flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-500/20 px-4 py-1.5 text-xs font-mono font-bold tracking-widest text-amber-300 hover:bg-amber-500 hover:text-black transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              >
                <Zap className="h-3.5 w-3.5" />
                EXPLORE IN-STOCK SPEC SHEET
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Subtle Divider */}
        <div className="relative z-20 border-t border-white/10 pt-2" />
      </div>
    </section>
  );
}
