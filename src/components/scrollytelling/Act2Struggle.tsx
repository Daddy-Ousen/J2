"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Flame, ShieldAlert, Zap } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BEATS = [
  {
    step: "BEAT 01",
    tag: "THE ISOLATION",
    icon: ShieldAlert,
    main: "The 5 AM cold. The quiet ache in the lungs when nobody is watching.",
    sub: "Every championship begins in empty stadiums before the sun breaks the horizon.",
    tone: "COLD / DESATURATED",
  },
  {
    step: "BEAT 02",
    tag: "THE RESISTANCE",
    icon: Zap,
    main: "Doubt whispers that it's just fabric. It's just a game.",
    sub: "The voice in the darkness asking why you sacrifice what others take for granted.",
    tone: "MID-TRANSITION",
  },
  {
    step: "BEAT 03",
    tag: "THE AWAKENING",
    icon: Flame,
    main: "Until you realize: the weight you carry is the proof you're still standing.",
    sub: "Suffering is not a punishment. It is the crucible where conviction turns to gold.",
    tone: "WARM / SATURATED",
  },
];

export function Act2Struggle() {
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const coldBgRef = useRef<HTMLDivElement>(null);
  const warmBgRef = useRef<HTMLDivElement>(null);
  const beat1Ref = useRef<HTMLDivElement>(null);
  const beat2Ref = useRef<HTMLDivElement>(null);
  const beat3Ref = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (isReduced) {
        // Fallback: all beats visible in stacked view
        if (beat1Ref.current) gsap.set(beat1Ref.current, { opacity: 1, y: 0, position: "relative" });
        if (beat2Ref.current) gsap.set(beat2Ref.current, { opacity: 1, y: 0, position: "relative" });
        if (beat3Ref.current) gsap.set(beat3Ref.current, { opacity: 1, y: 0, position: "relative" });
        if (warmBgRef.current) gsap.set(warmBgRef.current, { opacity: 0.6 });
        return;
      }

      const beats = [beat1Ref.current, beat2Ref.current, beat3Ref.current];

      // Initial state: Beat 1 visible, others hidden and shifted down
      gsap.set(beat1Ref.current, { opacity: 1, y: 0 });
      gsap.set(beat2Ref.current, { opacity: 0, y: 30 });
      gsap.set(beat3Ref.current, { opacity: 0, y: 30 });
      gsap.set(warmBgRef.current, { opacity: 0 });

      const isMobile = window.innerWidth < 768;

      // Main pinned timeline with shortened scroll distance for fast responsive pacing
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSectionRef.current,
          start: "top top",
          end: isMobile ? "+=45%" : "+=65%",
          pin: true,
          pinSpacing: true,
          scrub: isMobile ? 0.3 : 0.5,
          anticipatePin: 1,
        },
      });

      // Background Color Grade Shift: Cold (0%) -> Warm (100%)
      tl.to(
        warmBgRef.current,
        {
          opacity: 1,
          ease: "none",
          duration: 3,
        },
        0
      );

      // Beat 1 -> Beat 2 transition
      // Beat 1 fades out and moves up
      tl.to(
        beat1Ref.current,
        {
          opacity: 0,
          y: -30,
          duration: 0.8,
          ease: "power2.inOut",
        },
        0.5
      );

      // Beat 2 fades in and arrives at center
      tl.to(
        beat2Ref.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.inOut",
        },
        0.7
      );

      // Beat 2 -> Beat 3 transition
      // Beat 2 fades out and moves up
      tl.to(
        beat2Ref.current,
        {
          opacity: 0,
          y: -30,
          duration: 0.8,
          ease: "power2.inOut",
        },
        1.7
      );

      // Beat 3 fades in and arrives at center
      tl.to(
        beat3Ref.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.inOut",
        },
        1.9
      );

      // Progress bar indicator scrub inside the section
      if (indicatorRef.current) {
        tl.to(
          indicatorRef.current,
          {
            scaleX: 1,
            ease: "none",
            duration: 3,
          },
          0
        );
      }
    },
    { scope: pinSectionRef }
  );

  return (
    <section
      id="act-struggle"
      ref={pinSectionRef}
      className="relative w-full bg-black text-white overflow-hidden"
    >
      {/* Viewport container */}
      <div
        ref={containerRef}
        className="relative min-h-[100dvh] w-full flex flex-col justify-between pt-20 pb-6 px-6 sm:pt-24 sm:pb-10 sm:px-12 lg:pt-24 lg:pb-12 lg:px-20 overflow-hidden"
      >
        {/* Layer 1: Cold Desaturated Background (Grayscale/Icy Slate) */}
        <div
          ref={coldBgRef}
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        >
          <Image
            src="/images/act2_struggle.jpg"
            alt="Athlete running in rain"
            fill
            sizes="100vw"
            className="object-cover object-center filter grayscale contrast-[1.3] brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/70 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(15,23,42,0.6),_transparent_70%)]" />
        </div>

        {/* Layer 2: Warm Saturated Background (Sepia / Amber / Ember Grade) */}
        <div
          ref={warmBgRef}
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-300"
        >
          <Image
            src="/images/act2_struggle.jpg"
            alt="Athlete in gold light"
            fill
            sizes="100vw"
            className="object-cover object-center filter saturate-[1.8] contrast-[1.2] brightness-[0.4] hue-rotate-[-25deg]"
          />
          {/* Golden ember gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/80 via-zinc-950/60 to-orange-950/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.25),_transparent_70%)]" />
        </div>

        {/* Top Section Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-widest text-zinc-400">
            <span className="text-amber-400 font-bold">ACT II</span>
            <span className="text-zinc-600">//</span>
            <span className="text-white uppercase font-bold">THE CRUCIBLE</span>
          </div>
        </div>

        {/* Center Beat Stage (Relative wrapper for crossfading absolute beats) */}
        <div className="relative z-10 my-auto flex w-full max-w-4xl mx-auto items-center justify-center min-h-[320px]">
          {/* BEAT 01 */}
          <div
            ref={beat1Ref}
            className="absolute inset-0 flex flex-col justify-center text-center px-4"
          >
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-1.5 font-mono text-[11px] tracking-[0.2em] text-slate-300 backdrop-blur-md shadow-lg">
              <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
              <span>{BEATS[0].step} — {BEATS[0].tag}</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
              {BEATS[0].main}
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base text-slate-400 sm:text-lg">
              {BEATS[0].sub}
            </p>
          </div>

          {/* BEAT 02 */}
          <div
            ref={beat2Ref}
            className="absolute inset-0 flex flex-col justify-center text-center px-4"
          >
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-1.5 font-mono text-[11px] tracking-[0.2em] text-zinc-300 backdrop-blur-md shadow-lg">
              <Zap className="h-3.5 w-3.5 text-zinc-400" />
              <span>{BEATS[1].step} — {BEATS[1].tag}</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
              {BEATS[1].main}
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base text-zinc-400 sm:text-lg">
              {BEATS[1].sub}
            </p>
          </div>

          {/* BEAT 03 */}
          <div
            ref={beat3Ref}
            className="absolute inset-0 flex flex-col justify-center text-center px-4"
          >
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-950/80 px-4 py-1.5 font-mono text-[11px] tracking-[0.2em] text-amber-300 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>{BEATS[2].step} — {BEATS[2].tag}</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
              {BEATS[2].main}
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base text-amber-200/90 sm:text-lg">
              {BEATS[2].sub}
            </p>
          </div>
        </div>

        {/* Bottom Section Progress Bar */}
        <div className="relative z-10 flex flex-col gap-2 border-t border-white/10 pt-4">
          <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
            <div
              ref={indicatorRef}
              className="h-full w-full origin-left bg-gradient-to-r from-slate-400 via-amber-500 to-amber-300"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
