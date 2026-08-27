"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronDown, Compass, Sparkles } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Act1Origin() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (isReduced) {
        // Simple entrance for reduced motion
        gsap.to(contentRef.current, { opacity: 1, duration: 0.8 });
        return;
      }

      // Continuous slow background parallax drift on scroll
      gsap.to(bgRef.current, {
        yPercent: 18,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Cinematic entrance sequence on initial mount
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 40, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, delay: 0.2 }
      )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1.1 },
          "-=0.8"
        )
        .fromTo(
          metaRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.6"
        );
    },
    { scope: containerRef }
  );

  const handleScrollToNext = () => {
    const act2 = document.getElementById("act-struggle");
    if (act2) {
      act2.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="act-origin"
      ref={containerRef}
      className="relative min-h-[100dvh] w-full overflow-hidden bg-zinc-950 text-white flex flex-col justify-between pt-24 pb-12 px-6 sm:px-12 lg:px-20"
    >
      {/* Background with Parallax Container */}
      <div
        ref={bgRef}
        className="absolute inset-0 -top-[10%] -bottom-[10%] w-full h-[120%] pointer-events-none z-0 overflow-hidden"
      >
        <Image
          src="/images/act1_origin.jpg"
          alt="Athlete walking through atmospheric stadium tunnel at dawn"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.45] contrast-[1.15]"
        />
        {/* Cinematic Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-zinc-950/60 to-zinc-950" />
        {/* Subtle Film Grain Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-repeat bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Top Metadata Strip */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-zinc-400">
          <Compass className="h-3.5 w-3.5 text-amber-500" />
          <span>52°31&apos;12&quot;N 13°24&apos;18&quot;E</span>
          <span className="hidden sm:inline text-zinc-600">//</span>
          <span className="hidden sm:inline text-zinc-400">DAWN TRANSCENDENCE</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] tracking-widest">
          <span className="inline-flex items-center gap-1.5 text-amber-400/90">
            <Sparkles className="h-3 w-3" />
            ACT I // ORIGIN
          </span>
          <span className="text-zinc-400">|</span>
          <span className="text-zinc-400">GENESIS 2026</span>
        </div>
      </div>

      {/* Main Narrative Hero Content */}
      <div
        ref={contentRef}
        className="relative z-10 my-auto max-w-4xl space-y-8 pt-8 pb-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400 backdrop-blur-sm">
          Where Belief Starts
        </div>

        <h1
          ref={headlineRef}
          className="text-4xl font-extrabold tracking-tighter text-zinc-100 sm:text-6xl md:text-7xl lg:text-8xl leading-[0.98]"
        >
          Before the lights,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-amber-300">
            there is only the quiet.
          </span>
        </h1>

        <p
          ref={subtextRef}
          className="max-w-2xl text-base font-light leading-relaxed text-zinc-300 sm:text-lg md:text-xl"
        >
          A jersey is never just synthetic thread. It is a silent contract made in the mirror
          before anyone is watching. An oath to carry every ounce of doubt until it is forged into
          unshakable resolve.
        </p>

        {/* Action / Interaction Trigger */}
        <div ref={metaRef} className="flex flex-wrap items-center gap-4 pt-4">
          <button
            onClick={handleScrollToNext}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-7 py-3.5 text-xs font-mono font-bold tracking-widest text-zinc-950 transition-all duration-300 hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-95"
          >
            <span>ENTER THE CRUCIBLE</span>
            <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>

          <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>SCROLL TO PROGRESS NARRATIVE</span>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 font-bold">01</span>
          <span className="tracking-widest uppercase">The Genesis Point</span>
        </div>

        <button
          onClick={handleScrollToNext}
          className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
          aria-label="Scroll down"
        >
          <span className="tracking-widest uppercase text-[10px]">SCROLL</span>
          <ChevronDown className="h-3.5 w-3.5 animate-bounce text-amber-400" />
        </button>
      </div>
    </section>
  );
}
