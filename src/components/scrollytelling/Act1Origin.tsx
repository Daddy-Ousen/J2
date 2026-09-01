"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronDown, Compass, Sparkles, ShoppingBag, Eye, ArrowRight, ShieldCheck, Flame } from "lucide-react";
import { JerseyProduct } from "@/types";
import { JERSEYS_DATA } from "@/data/jerseys";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Act1OriginProps {
  products?: JerseyProduct[];
  onOpenQuickView?: (jersey: JerseyProduct) => void;
}

export function Act1Origin({ products, onOpenQuickView }: Act1OriginProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const availableJerseys = products && products.length > 0 ? products : JERSEYS_DATA;
  // Pick 4 top featured / high-profile kits for immediate hero showcase
  const heroShowcaseKits = availableJerseys.slice(0, 4);

  useGSAP(
    () => {
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (isReduced) {
        gsap.to(contentRef.current, { opacity: 1, duration: 0.8 });
        return;
      }

      const isMobile = window.innerWidth < 768;

      // Continuous background parallax drift on scroll
      gsap.to(bgRef.current, {
        yPercent: isMobile ? 6 : 12,
        scale: isMobile ? 1.03 : 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: isMobile ? 0.3 : 1.0,
        },
      });

      // Cinematic entrance sequence on initial mount
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.1, delay: 0.1 }
      )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.6"
        )
        .fromTo(
          metaRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
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

  const handleScrollToShop = () => {
    const collection = document.getElementById("act-collection");
    if (collection) {
      collection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="act-origin"
      ref={containerRef}
      className="relative min-h-[100dvh] w-full overflow-hidden bg-zinc-950 text-white flex flex-col justify-between pt-24 pb-10 px-4 sm:px-8 lg:px-16"
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
          className="object-cover object-center filter brightness-[0.38] contrast-[1.15]"
        />
        {/* Cinematic Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-zinc-950/60 to-zinc-950" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-repeat bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Top Metadata Strip */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-widest text-zinc-400">
          <Compass className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
          <span>DIRECT GLOBAL IMPORT</span>
          <span className="hidden sm:inline text-zinc-600">//</span>
          <span className="hidden sm:inline text-zinc-400">DHAKA CUSTOM PRINTING</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-widest">
          <span className="inline-flex items-center gap-1.5 text-amber-400/90 font-bold">
            <Sparkles className="h-3 w-3" />
            26 IN-STOCK KITS
          </span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-400">2026 MATCHDAY</span>
        </div>
      </div>

      {/* Main Narrative & Instant Store Hero Content */}
      <div
        ref={contentRef}
        className="relative z-10 my-auto max-w-5xl space-y-6 pt-4 pb-6"
      >
        {/* Immediate Storefront & Craftsmanship Identifier */}
        <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-amber-400 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.15)]">
          <Flame className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-bold">Imported From Reputed Global Manufacturers • Custom Heat-Press</span>
        </div>

        <h1
          ref={headlineRef}
          className="text-3xl font-extrabold tracking-tighter text-zinc-100 sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02]"
        >
          Before the lights,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-amber-300">
            there is only the quiet.
          </span>
        </h1>

        <p
          ref={subtextRef}
          className="max-w-2xl text-sm sm:text-base font-light leading-relaxed text-zinc-300"
        >
          Directly imported from reputed international manufacturers and licensed suppliers. Authentic player-grade micro-knit chassis, 3D liquid silicone crests, and commercial heat-pressed name & number customization.
        </p>

        {/* Action Buttons: Direct Shop Entry vs Cinematic Scroll */}
        <div ref={metaRef} className="flex flex-wrap items-center gap-3 pt-2">
          {/* High-Converting Primary Shop Button */}
          <button
            onClick={handleScrollToShop}
            className="group relative inline-flex items-center gap-2.5 rounded-full bg-amber-400 px-6 py-3 text-xs font-mono font-bold tracking-wider text-black transition-all duration-300 hover:bg-amber-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] active:scale-95 shadow-md"
          >
            <ShoppingBag className="h-4 w-4 fill-black stroke-black" />
            <span>EXPLORE MATCHDAY KITS (৳1,150 — ৳1,450)</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Secondary Story Scroll Button */}
          <button
            onClick={handleScrollToNext}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-zinc-900/60 px-5 py-3 text-xs font-mono text-zinc-300 hover:text-white hover:border-amber-400 hover:bg-zinc-900 transition-all duration-300 active:scale-95 backdrop-blur-sm"
          >
            <span>EXPERIENCE ORIGIN STORY</span>
            <ChevronDown className="h-3.5 w-3.5 text-amber-400" />
          </button>
        </div>

        {/* Hero Featured In-Stock Kits Ribbon (Instant Visibility) */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>In-Stock Matchday Picks (Tap to Inspect)</span>
            </div>
            <Link
              href="/shop"
              className="font-mono text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>View All 26 Kits</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Quick-Peek Grid / Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {heroShowcaseKits.map((kit) => (
              <div
                key={kit.id}
                onClick={() => onOpenQuickView?.(kit)}
                className="group relative flex items-center gap-2.5 p-2 rounded-xl border border-white/10 bg-zinc-950/80 hover:border-amber-500/50 hover:bg-zinc-900/90 transition-all cursor-pointer backdrop-blur-md shadow-sm"
              >
                {/* Kit Thumbnail */}
                <div className="relative h-12 w-10 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 bg-zinc-900">
                  <Image
                    src={kit.image}
                    alt={kit.name}
                    fill
                    sizes="40px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Kit Info */}
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-[11px] font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                    {kit.club}
                  </div>
                  <div className="font-mono text-[10px] text-amber-400 font-bold">
                    ৳{kit.price.toLocaleString()}
                  </div>
                </div>

                {/* Inspect Icon */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-3.5 w-3.5 text-zinc-400 group-hover:text-amber-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Nationwide Courier Dispatch (Inside Dhaka 24-48h • Outside 48-72h)</span>
        </div>

        <button
          onClick={handleScrollToNext}
          className="flex items-center gap-1.5 text-zinc-400 transition-colors hover:text-white"
          aria-label="Scroll down"
        >
          <span className="tracking-widest uppercase text-[10px]">SCROLL</span>
          <ChevronDown className="h-3.5 w-3.5 animate-bounce text-amber-400" />
        </button>
      </div>
    </section>
  );
}
