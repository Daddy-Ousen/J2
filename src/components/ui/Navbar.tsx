"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AudioToggle } from "./AudioToggle";
import {
  ShoppingBag,
  ShoppingCart,
  Home,
  Bookmark,
  Layers,
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
    <>
      {/* ============================================================ */}
      {/* DESKTOP HEADER (Visible on md+ screens) */}
      {/* ============================================================ */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-zinc-950/95 border-b border-white/10 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 lg:px-8">
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
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900/80 px-4 py-1.5">
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

          {/* Desktop Right Utilities */}
          <div className="flex items-center gap-2">
            <AudioToggle />

            <button
              onClick={toggleCurrency}
              className="flex items-center gap-1 rounded-full border border-white/15 bg-zinc-900 px-2.5 py-1 text-[11px] font-mono font-bold text-amber-300 hover:border-amber-400 transition-all"
              title="Switch Currency (BDT ৳ / USD $)"
            >
              <span>{currency === "USD" ? "$ USD" : "৳ BDT"}</span>
            </button>

            <Link
              href={user ? "/account" : "/auth/login"}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-zinc-900 px-2.5 py-1 text-[11px] font-mono text-zinc-300 hover:border-amber-400 hover:text-white transition-all"
              title={user ? `Signed in as ${user.name}` : "Sign In / Register"}
            >
              <User className="h-3.5 w-3.5 text-zinc-400" />
              <span>{user ? user.name.split(" ")[0] : "LOGIN"}</span>
            </Link>

            <button
              onClick={onOpenCart}
              className="group relative flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-zinc-900 px-2.5 py-1 text-[11px] font-mono font-bold text-zinc-200 transition-all hover:border-amber-400 hover:text-white active:scale-95 shadow-sm"
              aria-label="View Bag"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-amber-400 transition-transform group-hover:scale-110" />
              <span>MANTLE</span>
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-black text-black">
                {cartCount}
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* ============================================================ */}
      {/* MOBILE TOP BAR: ONLY THE FLOATING MUSIC PILL */}
      {/* ============================================================ */}
      <div className="fixed top-3 left-0 right-0 z-50 flex justify-center pointer-events-none md:hidden px-3">
        <div className="pointer-events-auto">
          <AudioToggle />
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE BOTTOM FLOATING CAPSULE BAR (Matching user design) */}
      {/* ============================================================ */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden pointer-events-none">
        <nav
          aria-label="Mobile Navigation Bar"
          className="pointer-events-auto flex items-center gap-5 sm:gap-7 rounded-full border border-white/15 bg-gradient-to-r from-zinc-950/95 via-[#180f12]/95 to-zinc-950/95 px-5 py-2 shadow-[0_15px_45px_rgba(0,0,0,0.85),0_0_20px_rgba(245,158,11,0.15)] backdrop-blur-2xl"
        >
          {/* 1. Home */}
          <Link
            href="/"
            aria-label="Home"
            className={`relative p-2 transition-colors active:scale-90 ${
              pathname === "/" ? "text-amber-400" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Home className="h-5 w-5" />
            {pathname === "/" && (
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            )}
          </Link>

          {/* 2. Shop / Catalog */}
          <Link
            href="/shop"
            aria-label="In-Stock Catalog"
            className={`relative p-2 transition-colors active:scale-90 ${
              pathname === "/shop" ? "text-amber-400" : "text-zinc-400 hover:text-white"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            {pathname === "/shop" && (
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            )}
          </Link>

          {/* 3. Cart with Badge */}
          <button
            onClick={onOpenCart}
            aria-label="Open Shopping Bag"
            className="relative p-2 text-zinc-400 hover:text-white transition-colors active:scale-90"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 font-mono text-[9px] font-black text-black shadow-[0_0_10px_rgba(245,158,11,0.6)]">
                {cartCount}
              </span>
            )}
          </button>

          {/* 4. Bookmark / Saved Items */}
          <Link
            href="/shop?filter=wishlist"
            aria-label="Saved Bookmarks"
            className="relative p-2 text-zinc-400 hover:text-white transition-colors active:scale-90"
          >
            <Bookmark className="h-5 w-5" />
          </Link>

          {/* 5. Menu / Layers Circular Brass Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Extended Menu"
            className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border transition-all active:scale-90 ${
              mobileMenuOpen
                ? "border-amber-400 bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                : "border-[#6b5844]/70 bg-gradient-to-br from-[#473a2e] to-[#241c15] text-[#e8c89b] hover:border-amber-400 hover:text-amber-300 shadow-md"
            }`}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
          </button>
        </nav>
      </div>

      {/* ============================================================ */}
      {/* MOBILE BOTTOM ACTION SHEET DRAWER (< md screens) */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
          />

          {/* Bottom Sheet Panel */}
          <div className="relative z-10 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-white/15 bg-zinc-950 p-6 pb-28 shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle Indicator */}
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-zinc-700" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/40 bg-zinc-900 shadow-sm">
                  <Shield className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <div className="font-sans text-xs font-black tracking-widest text-white">
                    JERSEY VERSE
                  </div>
                  <div className="font-mono text-[8px] text-amber-400/80">
                    OFFICIAL MATCHDAY // 2026
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Form */}
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

            {/* Extended Navigation Links */}
            <div className="flex flex-col space-y-2 font-mono text-xs">
              <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 pb-1">
                Explore The Arena
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
            </div>

            {/* Quick Actions / Currency / User Strip */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={toggleCurrency}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-zinc-900 px-3.5 py-2 font-mono text-xs font-bold text-amber-300 active:scale-95"
              >
                <span>CURRENCY:</span>
                <span className="text-white">{currency === "USD" ? "$ USD" : "৳ BDT"}</span>
              </button>

              <Link
                href={user ? "/account" : "/auth/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-zinc-900 px-3.5 py-2 font-mono text-xs text-zinc-300 hover:text-white active:scale-95"
              >
                <User className="h-3.5 w-3.5 text-amber-400" />
                <span>{user ? user.name.split(" ")[0] : "LOGIN / ACCOUNT"}</span>
              </Link>
            </div>

            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/20 p-2.5 font-mono text-xs font-bold text-amber-300"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>MASTER ADMIN COMMAND DESK</span>
              </Link>
            )}

            {/* WhatsApp Concierge Support */}
            <div className="pt-3 mt-3 border-t border-white/10">
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-2.5 font-mono text-xs font-bold text-emerald-400 hover:bg-emerald-500/25 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WHATSAPP CONCIERGE SUPPORT</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
