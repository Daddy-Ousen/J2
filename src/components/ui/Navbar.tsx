"use client";

import React, { useState } from "react";
import { AudioToggle } from "./AudioToggle";
import { ShoppingBag, Menu, X, Shield, ArrowUpRight, Sparkles } from "lucide-react";
import { ACTS_DATA } from "@/data/jerseys";

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export function Navbar({ cartCount = 0, onOpenCart }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <a
            href="#act-origin"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("act-origin");
            }}
            className="group flex items-center gap-2.5 text-white"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-sm border border-amber-500/40 bg-zinc-950/80 shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all duration-300 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Shield className="h-4 w-4 text-amber-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-sm font-black tracking-[0.2em] text-white">
                JERSEY VERSE
              </span>
              <span className="font-mono text-[9px] tracking-widest text-zinc-400">
                OFFICIAL STOCK // 2026
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Act Nav Links */}
        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-zinc-950/70 px-3 py-1.5 backdrop-blur-md md:flex">
          {ACTS_DATA.map((act) => (
            <button
              key={act.id}
              onClick={() => scrollToSection(act.id)}
              className="group relative rounded-full px-3 py-1 text-[11px] font-mono tracking-wider text-zinc-400 transition-colors duration-200 hover:text-white"
            >
              <span className="text-amber-500/70 mr-1.5">{act.actNumber}</span>
              <span>{act.title}</span>
            </button>
          ))}
        </div>

        {/* Right Utility Buttons */}
        <div className="flex items-center gap-2.5">
          <AudioToggle />

          <button
            onClick={onOpenCart}
            className="group relative flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-mono tracking-wider text-zinc-300 backdrop-blur-md transition-all duration-300 hover:border-amber-500/50 hover:bg-black/60 hover:text-white"
            aria-label="View Bag"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-zinc-300 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">MANTLE</span>
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500/20 px-1 text-[10px] font-bold text-amber-400">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/40 text-zinc-300 backdrop-blur-md transition-colors hover:text-white md:hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-zinc-950/95 px-6 py-6 backdrop-blur-xl md:hidden">
          <div className="flex flex-col space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              Narrative Acts
            </div>
            {ACTS_DATA.map((act) => (
              <button
                key={act.id}
                onClick={() => scrollToSection(act.id)}
                className="flex items-center justify-between border-b border-white/5 py-2.5 text-left text-sm font-medium text-zinc-200 hover:text-amber-400"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-amber-500">{act.actNumber}</span>
                  <span className="tracking-wide">{act.title}</span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
