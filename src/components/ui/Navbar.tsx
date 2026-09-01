"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AudioToggle } from "./AudioToggle";
import {
  ShoppingBag,
  Menu,
  X,
  Shield,
  ArrowUpRight,
  Sparkles,
  User,
  Search,
  Truck,
  Sliders,
  Lock,
  MessageCircle,
  Flame,
  Trophy,
  ChevronRight,
} from "lucide-react";

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export function Navbar({ cartCount = 0, onOpenCart }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [currency, setCurrency] = useState("BDT");
  const [mobileSearch, setMobileSearch] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jv_currency_v1");
      if (saved) setCurrency(saved);
    } catch {}

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleCurrency = () => {
    const next = currency === "BDT" ? "USD" : "BDT";
    try {
      localStorage.setItem("jv_currency_v1", next);
    } catch {}
    window.dispatchEvent(new CustomEvent("jv_currency_changed", { detail: next }));
    setCurrency(next);
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileSearch.trim()) return;
    setMobileMenuOpen(false);
    router.push(`/shop?search=${encodeURIComponent(mobileSearch.trim())}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-zinc-950/95 border-b border-white/10 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2 text-white"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/40 bg-zinc-900 shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all duration-300 group-hover:border-amber-400">
              <Shield className="h-4 w-4 text-amber-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-xs sm:text-sm font-black tracking-[0.18em] text-white">
                JERSEY VERSE
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-amber-400/80">
                OFFICIAL MATCHDAY // 2026
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links (Centered) */}
        <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900/80 px-4 py-1.5 md:flex">
          <Link
            href="/"
            className={`rounded-full px-3 py-1 text-[11px] font-mono tracking-wider transition-colors ${
              pathname === "/" ? "text-amber-400 font-bold bg-white/10" : "text-zinc-400 hover:text-white"
            }`}
          >
            ORIGIN & STORY
          </Link>

          <Link
            href="/shop"
            className={`rounded-full px-3 py-1 text-[11px] font-mono tracking-wider transition-colors ${
              pathname === "/shop" ? "text-amber-400 font-bold bg-white/10" : "text-zinc-400 hover:text-white"
            }`}
          >
            IN-STOCK SHOP
          </Link>

          <Link
            href="/fantasy"
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-mono tracking-wider transition-colors ${
              pathname === "/fantasy" ? "text-amber-400 font-bold bg-white/10" : "text-amber-400/90 hover:text-white"
            }`}
          >
            <Trophy className="h-3 w-3 text-amber-400" />
            <span>FANTASY</span>
          </Link>

          <Link
            href="/#atelier-studio-configurator"
            className="rounded-full px-3 py-1 text-[11px] font-mono tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            3D STUDIO
          </Link>

          <Link
            href="/track"
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-mono tracking-wider transition-colors ${
              pathname === "/track" ? "text-amber-400 font-bold bg-white/10" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Truck className="h-3 w-3 text-amber-400" />
            <span>TRACK ORDER</span>
          </Link>

          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 hover:bg-amber-500/30 transition-colors"
            >
              <Lock className="h-2.5 w-2.5" />
              <span>ADMIN</span>
            </Link>
          )}
        </div>

        {/* Right Action Utilities (Both Mobile & Desktop) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio Soundtrack Toggle */}
          <AudioToggle />

          {/* Currency Toggle (BDT ৳ / USD $) */}
          <button
            onClick={toggleCurrency}
            className="flex items-center gap-1 rounded-full border border-white/15 bg-zinc-900 px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-mono font-bold text-amber-300 hover:border-amber-400 transition-all"
            title="Switch Currency (BDT ৳ / USD $)"
          >
            <span>{currency === "USD" ? "$ USD" : "৳ BDT"}</span>
          </button>

          {/* User Account / Login (Hidden on small mobile, visible in drawer & sm+) */}
          <Link
            href={user ? "/account" : "/auth/login"}
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/15 bg-zinc-900 px-2.5 py-1 text-[11px] font-mono text-zinc-300 hover:border-amber-400 hover:text-white transition-all"
            title={user ? `Signed in as ${user.name}` : "Sign In / Register"}
          >
            <User className="h-3.5 w-3.5 text-zinc-400" />
            <span>{user ? user.name.split(" ")[0] : "LOGIN"}</span>
          </Link>

          {/* Bag / Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="group relative flex items-center gap-1 sm:gap-1.5 rounded-full border border-amber-500/40 bg-zinc-900 px-2.5 py-1 text-[10px] sm:text-[11px] font-mono font-bold text-zinc-200 transition-all hover:border-amber-400 hover:text-white active:scale-95 shadow-sm"
            aria-label="View Bag"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-amber-400 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">MANTLE</span>
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-black text-black">
              {cartCount}
            </span>
          </button>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-zinc-900 text-zinc-200 transition-colors hover:border-amber-400 hover:text-white md:hidden active:scale-95"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4 text-amber-400" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* ============================================================ */}
      {/* MOBILE FULL-FEATURED DRAWER NAVIGATION (< md screens) */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div className="border-b border-white/15 bg-zinc-950 px-5 py-5 md:hidden animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
          {/* Quick Search Input */}
          <form onSubmit={handleMobileSearchSubmit} className="mb-4">
            <div className="relative flex items-center">
              <input
                type="text"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                placeholder="Search club, team, or player..."
                className="w-full rounded-xl border border-white/15 bg-zinc-900/90 py-2.5 pl-9 pr-4 font-mono text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
              />
              <Search className="absolute left-3 h-4 w-4 text-zinc-400" />
            </div>
          </form>

          {/* Navigation Links Grid */}
          <div className="flex flex-col space-y-2 font-mono text-xs">
            <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 pb-1">
              Storefront Navigation
            </div>

            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl bg-amber-500/15 border border-amber-500/30 p-3 text-amber-300 font-bold hover:bg-amber-500/25"
            >
              <div className="flex items-center gap-2.5">
                <Flame className="h-4 w-4 text-amber-400" />
                <span>IN-STOCK MATCHDAY KITS</span>
              </div>
              <ChevronRight className="h-4 w-4 text-amber-400" />
            </Link>

            <Link
              href="/fantasy"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-amber-300 hover:text-amber-200 hover:border-amber-400"
            >
              <div className="flex items-center gap-2.5 font-bold">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>FANTASY FOOTBALL ARENA</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-amber-400" />
            </Link>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-zinc-200 hover:text-amber-400 hover:border-white/20"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="h-4 w-4 text-zinc-400" />
                <span>ORIGIN & STORY</span>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
            </Link>

            <Link
              href="/#atelier-studio-configurator"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-zinc-200 hover:text-amber-400 hover:border-white/20"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="h-4 w-4 text-zinc-400" />
                <span>3D STUDIO CONFIGURATOR</span>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
            </Link>

            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-zinc-200 hover:text-amber-400 hover:border-white/20"
            >
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-amber-400" />
                <span>TRACK ORDER STATUS</span>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-500" />
            </Link>

            <Link
              href={user ? "/account" : "/auth/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-zinc-200 hover:text-amber-400 hover:border-white/20"
            >
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-zinc-400" />
                <span>{user ? `MY ACCOUNT (${user.name})` : "LOGIN / CREATE ACCOUNT"}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-500" />
            </Link>

            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl border border-amber-500/40 bg-amber-500/20 p-3 font-bold text-amber-300"
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="h-4 w-4 text-amber-400" />
                  <span>ADMIN DESK // CONTROL CENTER</span>
                </div>
                <ChevronRight className="h-4 w-4 text-amber-400" />
              </Link>
            )}

            {/* Support & Quick Action Links */}
            <div className="pt-2 border-t border-white/10">
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/25 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WHATSAPP CONCIERGE SUPPORT</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
