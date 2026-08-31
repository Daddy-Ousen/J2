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
  products?: JerseyProduct[];
  onOpenQuickView: (jersey: JerseyProduct) => void;
  onAddToCart: (jersey: JerseyProduct, size: string) => void;
  onAddBespokeToBag?: (customKit: JerseyProduct, config: CustomKitConfig) => void;
}

export function Act4ProductCTA({
  products,
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
  const [activeCategory, setActiveCategory] = useState<string>("Featured");
  const [policyModal, setPolicyModal] = useState<"guarantee" | "privacy" | "terms" | null>(null);

  const availableJerseys = products && products.length > 0 ? products : JERSEYS_DATA;

  const filteredJerseys = availableJerseys.filter((j) => {
    if (activeCategory === "Featured") {
      const featuredItems = availableJerseys.filter((item) => item.isFeatured);
      return featuredItems.length > 0 ? Boolean(j.isFeatured) : true;
    }
    if (activeCategory === "All") return true;
    if (activeCategory === "Retro") return j.league === "Retro" || j.id.includes("retro") || j.name.toLowerCase().includes("retro");
    if (activeCategory === "International") return j.league === "International" || j.name.includes("Portugal") || j.name.includes("Argentina") || j.name.includes("Brazil");
    if (activeCategory === "Clubs") return j.league !== "Retro" && j.league !== "International";
    return true;
  });

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
    }, 2200);
  };

  const scrollToStudio = () => {
    if (configuratorRef.current) {
      configuratorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) return;
    setSubscribed(true);
    setEmailInput("");
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
      <div className="relative z-10 mx-auto max-w-7xl border-b border-white/10 pb-6 mb-8">
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
            Serialized, authentic, rendered in 3D, and ready for immediate courier dispatch.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-white/5 font-mono text-xs">
          {[
            { id: "Featured", label: "★ FEATURED ON STOREFRONT" },
            { id: "All", label: "ALL MATCHDAY KITS" },
            { id: "Clubs", label: "26/27 CLUBS" },
            { id: "Retro", label: "LEGENDARY RETRO VAULT" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-1.5 text-[11px] font-bold tracking-wider transition-all ${
                activeCategory === cat.id
                  ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  : "border border-white/10 bg-zinc-900/60 text-zinc-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid (Real In-Stock Jerseys with 3D Renders) */}
      <div
        ref={gridRef}
        className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {filteredJerseys.map((jersey, idx) => {
          const isAdded = addedIds[jersey.id];
          const currentSize = selectedSizes[jersey.id] || "M";
          const sizes = jersey.availableSizes && jersey.availableSizes.length > 0 ? jersey.availableSizes : ["S", "M", "L", "XL", "XXL"];

          return (
            <div
              key={jersey.id}
              className="jersey-card group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-md transition-all duration-300 hover:border-amber-500/50 hover:bg-zinc-900/70 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              {/* Top Card Badge & Edition */}
              <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 pb-3 border-b border-white/5">
                <span className="text-amber-400 font-bold">{jersey.code}</span>
                <div className="flex items-center gap-1.5">
                  <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-300 font-bold uppercase">
                    {jersey.kitType || "Home"}
                  </span>
                  <span className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-[9px] text-zinc-300">
                    {jersey.sleeve || "Half sleeve"}
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1 text-[9px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    IN STOCK
                  </span>
                </div>
              </div>

              {/* Real Product Image with Hover Zoom & Click to Inspect */}
              <div
                onClick={() => onOpenQuickView(jersey)}
                className="relative my-4 flex h-[280px] w-full items-center justify-center rounded-xl overflow-hidden bg-black/60 border border-white/5 group-hover:border-amber-500/40 transition-all p-1 cursor-pointer"
                title="Click to inspect kit details and specs"
              >
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
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQuickView(jersey);
                  }}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/85 px-3 py-1 text-[10px] font-mono text-zinc-200 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:border-amber-400 hover:text-white"
                >
                  <Eye className="h-3 w-3 text-amber-400" />
                  <span>INSPECT</span>
                </button>
              </div>

              {/* Product Details */}
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => onOpenQuickView(jersey)}
                    className="font-sans text-sm font-bold text-white tracking-tight leading-snug line-clamp-2 cursor-pointer hover:text-amber-300 transition-colors"
                  >
                    {jersey.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="font-mono text-[10px] text-zinc-400 truncate max-w-[160px]">
                      {jersey.colorway || jersey.subtitle}
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
                    <span className="text-zinc-200 font-bold">{jersey.weightGsm || 240} GSM</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span>SEAMS</span>
                    <span className="text-zinc-200 truncate ml-2">Ultrasonic Bonded</span>
                  </div>
                </div>

                {/* Size Selector */}
                <div className="flex items-center gap-1.5 pt-1">
                  {sizes.map((size) => (
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

                {/* Action Buttons: Add to Bag + Inspect / Studio Customizer */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => onOpenQuickView(jersey)}
                    className="w-full flex items-center justify-center gap-2 rounded-full border border-white/10 bg-zinc-950 py-2.5 px-4 font-mono text-[11px] font-bold tracking-wider text-white transition-all duration-200 hover:border-amber-400 hover:bg-amber-500 hover:text-black active:scale-95 shadow-md"
                  >
                    <Eye className="h-3.5 w-3.5 text-amber-400 group-hover:text-black" />
                    <span>ACQUIRE MANTLE / INSPECT</span>
                  </button>

                  <button
                    onClick={() => onOpenQuickView(jersey)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-full border border-white/5 bg-zinc-900/60 py-1.5 text-[10px] font-mono text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                  >
                    <Sliders className="h-3 w-3" />
                    <span>CUSTOMIZE BACK PRINT</span>
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
          <span>SHOW ALL IN-STOCK MATCHDAY KITS</span>
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
          <button
            onClick={() => setPolicyModal("guarantee")}
            className="hover:text-amber-400 cursor-pointer transition-colors"
          >
            CRAFT & REPAIR GUARANTEE
          </button>
          <button
            onClick={() => setPolicyModal("privacy")}
            className="hover:text-amber-400 cursor-pointer transition-colors"
          >
            PRIVACY PROTOCOL
          </button>
          <button
            onClick={() => setPolicyModal("terms")}
            className="hover:text-amber-400 cursor-pointer transition-colors"
          >
            TERMS OF DISPATCH
          </button>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/60 px-4 py-1.5 text-zinc-400 hover:border-amber-400 hover:text-white transition-all"
        >
          <span>RETURN TO APEX</span>
          <ArrowUp className="h-3.5 w-3.5 text-amber-400" />
        </button>
      </footer>

      {/* Official Company Policy & Guarantee Modal */}
      {policyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-zinc-950 p-6 sm:p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4" />
                <span>
                  {policyModal === "guarantee" && "CRAFT & REPAIR GUARANTEE"}
                  {policyModal === "privacy" && "OFFICIAL PRIVACY PROTOCOL"}
                  {policyModal === "terms" && "TERMS OF DISPATCH & COURIER"}
                </span>
              </div>
              <button
                onClick={() => setPolicyModal(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs text-zinc-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              {policyModal === "guarantee" && (
                <>
                  <p>
                    <strong className="text-white">100% Authentic Player-Grade Craftsmanship:</strong> Every Jersey Verse matchday chassis features high-density micro-knit polyester, laser-cut ventilation channels, and 3D heat-pressed liquid silicone crests.
                  </p>
                  <p>
                    <strong className="text-amber-400">7-Day Hassle-Free Replacement:</strong> In the unlikely event of stitching defects, misprinted numbers, or courier transit damage, we offer instant replacement within 7 days of delivery.
                  </p>
                  <p>
                    <strong className="text-white">Care Protocol:</strong> To preserve silicone crests and heat-pressed player printing, machine wash cold (under 30°C) inside-out and hang dry. Do not iron directly over prints.
                  </p>
                </>
              )}

              {policyModal === "privacy" && (
                <>
                  <p>
                    <strong className="text-white">Data Privacy Commitment:</strong> Jersey Verse collects only the delivery details (name, recipient phone, delivery address, city) and payment transaction IDs required to verify and dispatch your order.
                  </p>
                  <p>
                    <strong className="text-amber-400">Zero Third-Party Sharing:</strong> We do not sell, rent, or distribute customer details to third-party advertisers. All customer records are stored securely with enterprise encrypted databases.
                  </p>
                  <p>
                    <strong className="text-white">Account Security:</strong> Passwords are cryptographic-hashed (bcrypt), and payment verifications are validated directly with authorized mobile financial services.
                  </p>
                </>
              )}

              {policyModal === "terms" && (
                <>
                  <p>
                    <strong className="text-white">Nationwide Express Dispatch:</strong> Orders confirmed before 4:00 PM are packaged with serialized authenticity tags and handed to Steadfast Courier for dispatch.
                  </p>
                  <p>
                    <strong className="text-amber-400">Delivery Timelines:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                    <li>Inside Dhaka Metropolitan: 24 to 48 hours (৳80)</li>
                    <li>Outside Dhaka & Suburbs: 48 to 72 hours (৳130)</li>
                    <li>Complimentary Free Delivery on all orders over ৳3,000</li>
                  </ul>
                  <p>
                    <strong className="text-white">Live Tracking:</strong> You will receive real-time consignment tracking updates via SMS and can track your order status anytime at <span className="text-amber-400">/track</span>.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setPolicyModal(null)}
                className="rounded-xl bg-amber-400 px-5 py-2 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-colors"
              >
                ACKNOWLEDGED
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
