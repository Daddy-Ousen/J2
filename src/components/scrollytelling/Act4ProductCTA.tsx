"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { JERSEYS_DATA } from "@/data/jerseys";
import { JerseyProduct, CustomKitConfig } from "@/types";
import { StudioConfigurator } from "../configurator/StudioConfigurator";
import {
  Sparkles,
  ShoppingBag,
  Eye,
  ShieldCheck,
  Check,
  Send,
  Globe,
  ArrowUp,
  ArrowRight,
  Layers,
  Sliders,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Act4ProductCTAProps {
  onOpenQuickView: (jersey: JerseyProduct) => void;
  onAddToCart: (jersey: JerseyProduct, size: string) => void;
  onAddBespokeToBag?: (customKit: JerseyProduct, config: CustomKitConfig) => void;
}

export function Act4ProductCTA({
  onOpenQuickView,
  onAddToCart,
  onAddBespokeToBag,
}: Act4ProductCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const configuratorRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    "kit-atm-volt": "M",
    "kit-rma-third": "L",
    "kit-ars-away": "M",
    "kit-fcb-blau": "M",
    "kit-nas-heritage": "L",
    "kit-mun-red": "M",
    "kit-acm-away": "M",
    "kit-juv-home": "L",
  });
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useGSAP(
    () => {
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (isReduced) {
        const cards = gsap.utils.toArray<HTMLElement>(".jersey-card");
        gsap.set(cards, { opacity: 1, y: 0 });
        if (manifestoRef.current) gsap.set(manifestoRef.current, { opacity: 1, y: 0 });
        return;
      }

      // Staggered fade and slide-up entrance for jersey product cards
      const cards = gsap.utils.toArray<HTMLElement>(".jersey-card");

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Manifesto reveal
      gsap.fromTo(
        manifestoRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: manifestoRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  const handleSizeChange = (jerseyId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [jerseyId]: size }));
  };

  const handleAddFromCard = (jersey: JerseyProduct) => {
    const size = selectedSizes[jersey.id] || "M";
    onAddToCart(jersey, size);
    setAddedIds((prev) => ({ ...prev, [jersey.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [jersey.id]: false }));
    }, 2000);
  };

  const scrollToStudio = () => {
    const el = document.getElementById("atelier-studio-configurator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmailInput("");
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      id="act-collection"
      ref={containerRef}
      className="relative w-full bg-zinc-950 text-white pt-24 pb-16 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background Ambient Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[140px]" />
      </div>

      {/* Act Header */}
      <div className="relative z-10 mx-auto max-w-7xl border-b border-white/10 pb-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300">
              <Sparkles className="h-3 w-3" />
              <span>ACT IV // IN-STOCK REPOSITORY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Available Matchday Kits.
            </h2>
          </div>
          <p className="max-w-md font-mono text-xs leading-relaxed text-zinc-400">
            Real matchday armor currently in stock at <span className="text-amber-400 font-bold">Jersey verse</span>.
            Serialized, authentic, and ready for immediate courier dispatch.
          </p>
        </div>
      </div>

      {/* Product Grid (Real In-Stock Jerseys) */}
      <div
        ref={gridRef}
        className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {JERSEYS_DATA.map((jersey, idx) => {
          const isAdded = addedIds[jersey.id];
          const currentSize = selectedSizes[jersey.id] || "M";

          return (
            <div
              key={jersey.id}
              className="jersey-card group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-md transition-all duration-300 hover:border-amber-500/50 hover:bg-zinc-900/70 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              {/* Top Card Badge & Edition */}
              <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 pb-3 border-b border-white/5">
                <span className="text-amber-400 font-bold">{jersey.code}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  IN STOCK
                </span>
              </div>

              {/* Real Product Image with Hover Zoom */}
              <div className="relative my-4 flex h-[280px] w-full items-center justify-center rounded-xl overflow-hidden bg-black/60 border border-white/5 group-hover:border-white/10 transition-all p-1">
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <Image
                    src={jersey.image}
                    alt={jersey.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover object-center filter contrast-[1.06] transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/20" />
                </div>

                {/* Quick View Button Hover Overlay */}
                <button
                  onClick={() => onOpenQuickView(jersey)}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/80 px-3 py-1 text-[10px] font-mono text-zinc-200 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:border-amber-400 hover:text-white"
                >
                  <Eye className="h-3 w-3 text-amber-400" />
                  <span>INSPECT</span>
                </button>
              </div>

              {/* Product Details */}
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-sans text-sm font-bold text-white tracking-tight leading-snug line-clamp-2">
                    {jersey.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="font-mono text-[10px] text-zinc-400 truncate max-w-[160px]">
                      {jersey.colorway}
                    </p>
                    <span className="font-mono text-sm font-bold text-amber-400">
                      ৳{jersey.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Specs Pill List */}
                <div className="space-y-1.5 rounded-lg border border-white/5 bg-black/30 p-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span>WEIGHT</span>
                    <span className="text-zinc-200 font-bold">{jersey.weightGsm} GSM</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span>SEAMS</span>
                    <span className="text-zinc-200 truncate ml-2">Ultrasonic Bonded</span>
                  </div>
                </div>

                {/* Size Selector */}
                <div className="flex items-center gap-1.5 pt-1">
                  {jersey.availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(jersey.id, size)}
                      className={`flex-1 h-7 rounded font-mono text-[10px] font-bold transition-colors ${
                        currentSize === size
                          ? "bg-amber-400 text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                          : "bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Action Buttons: Add to Bag + Studio Customizer trigger */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => handleAddFromCard(jersey)}
                    className="w-full flex items-center justify-center gap-2 rounded-full border border-white/10 bg-zinc-950 py-2.5 px-4 font-mono text-[11px] font-bold tracking-wider text-white transition-all duration-200 hover:border-amber-400 hover:bg-amber-500 hover:text-black active:scale-95"
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                        <span>SECURED TO BAG</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>ACQUIRE MANTLE</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={scrollToStudio}
                    className="w-full flex items-center justify-center gap-1.5 rounded-full border border-white/5 bg-zinc-900/60 py-1.5 text-[10px] font-mono text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                  >
                    <Sliders className="h-3 w-3" />
                    <span>CUSTOMIZE IN STUDIO</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explore All In Shop Link */}
      <div className="relative z-10 mx-auto max-w-7xl mt-10 flex justify-center">
        <a
          href="/shop"
          className="inline-flex items-center gap-3 rounded-full border border-amber-500/40 bg-zinc-900/90 px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:border-amber-400 hover:bg-amber-400 hover:text-black transition-all group"
        >
          <span>EXPLORE ALL 34 IN-STOCK MATCHDAY KITS</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* ========================================================================= */}
      {/* FLAGSHIP INTERACTIVE STUDIO CONFIGURATOR */}
      {/* ========================================================================= */}
      <div id="atelier-studio-configurator" ref={configuratorRef} className="mt-28">
        <StudioConfigurator onAddBespokeToBag={onAddBespokeToBag} />
      </div>

      {/* Brand Manifesto & Drop Syndicate Section */}
      <div
        ref={manifestoRef}
        className="relative z-10 mx-auto max-w-5xl mt-24 rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/60 to-black/90 p-8 sm:p-14 backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.9)]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: The Manifesto */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>THE JERSEY VERSE MANIFESTO</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              We do not manufacture sportswear for spectators.
            </h3>

            <p className="text-sm sm:text-base leading-relaxed text-zinc-300 font-light">
              Every seam, every millimeter of engineered weave, and every liquid-silicone crest is
              curated for the solitary competitor who steps across the white line when everything is
              at stake. When you pull on a <strong className="text-white">Jersey verse</strong> chassis, you do not simply play. You declare who you are.
            </p>

            <div className="flex items-center gap-6 font-mono text-xs text-zinc-400 pt-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-amber-500" />
                <span>GLOBAL COURIER DISPATCH</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber-500" />
                <span>SERIALIZED AUTHENTICITY</span>
              </div>
            </div>
          </div>

          {/* Right Column: Waitlist Drop Notification */}
          <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8 space-y-4">
            <div className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
              JOIN THE SYNDICATE
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Receive private access keys to unreleased capsule drops and exclusive numbered editions.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="athlete@domain.com"
                  className="w-full rounded-xl border border-white/15 bg-zinc-900/90 px-4 py-3 text-xs font-mono text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3 px-4 font-mono text-xs font-bold tracking-wider text-black transition-all hover:brightness-110 active:scale-98"
              >
                {subscribed ? (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>INVITATION KEY RESERVED</span>
                  </>
                ) : (
                  <>
                    <span>REQUEST ACCESS KEY</span>
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="text-[10px] font-mono text-zinc-500 text-center">
              STRICTLY LIMITED ALLOCATION // NO SPAM
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Footer */}
      <footer className="relative z-10 mx-auto max-w-7xl mt-24 border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="font-sans font-black tracking-widest text-white">JERSEY VERSE</span>
          <span>© 2026 ALL RIGHTS RESERVED</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
          <span className="hover:text-zinc-300 cursor-pointer">CRAFT & REPAIR GUARANTEE</span>
          <span className="hover:text-zinc-300 cursor-pointer">PRIVACY PROTOCOL</span>
          <span className="hover:text-zinc-300 cursor-pointer">TERMS OF DISPATCH</span>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/60 px-4 py-1.5 text-zinc-400 hover:border-amber-400 hover:text-white transition-all"
        >
          <span>RETURN TO APEX</span>
          <ArrowUp className="h-3.5 w-3.5 text-amber-400" />
        </button>
      </footer>
    </div>
  );
}
