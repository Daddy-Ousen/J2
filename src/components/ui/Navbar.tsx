"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export function Navbar({ cartCount = 0, onOpenCart }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [currency, setCurrency] = useState("BDT");
  const pathname = usePathname();

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
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
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-zinc-950/80 px-4 py-1.5 backdrop-blur-md md:flex">
          <Link
            href="/"
            className={`rounded-full px-3 py-1 text-[11px] font-mono tracking-wider transition-colors ${
              pathname === "/" ? "text-amber-400 font-bold bg-white/5" : "text-zinc-400 hover:text-white"
            }`}
          >
            ORIGIN & STORY
          </Link>

          <Link
            href="/shop"
            className={`rounded-full px-3 py-1 text-[11px] font-mono tracking-wider transition-colors ${
              pathname === "/shop" ? "text-amber-400 font-bold bg-white/5" : "text-zinc-400 hover:text-white"
            }`}
          >
            IN-STOCK SHOP
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
              pathname === "/track" ? "text-amber-400 font-bold bg-white/5" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Truck className="h-3 w-3 text-amber-400" />
            <span>TRACK ORDER</span>
          </Link>

          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 hover:bg-amber-500/25 transition-colors"
            >
              <Lock className="h-2.5 w-2.5" />
              <span>ADMIN</span>
            </Link>
          )}
        </div>

        {/* Right Utility Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <AudioToggle />

          {/* Currency Toggle (BDT / USD) */}
          <button
            onClick={() => {
              const current = localStorage.getItem("jv_currency_v1") || "BDT";
              const next = current === "BDT" ? "USD" : "BDT";
              localStorage.setItem("jv_currency_v1", next);
              window.dispatchEvent(new CustomEvent("jv_currency_changed", { detail: next }));
              setCurrency(next);
            }}
            className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-mono font-bold text-amber-300 backdrop-blur-md hover:border-amber-400 transition-all"
            title="Switch Currency (BDT ৳ / USD $)"
          >
            <span>{currency === "USD" ? "🌐 USD ($)" : "🇧🇩 BDT (৳)"}</span>
          </button>

          {/* User Account / Login Shortcut */}
          <Link
            href={user ? "/account" : "/auth/login"}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-mono text-zinc-300 backdrop-blur-md hover:border-amber-400 hover:text-white transition-all"
            title={user ? `Signed in as ${user.name}` : "Sign In / Register"}
          >
            <User className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">
              {user ? user.name.split(" ")[0] : "LOGIN"}
            </span>
          </Link>

          {/* Bag Trigger */}
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
        <div className="border-b border-white/10 bg-zinc-950/98 px-6 py-6 backdrop-blur-xl md:hidden">
          <div className="flex flex-col space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
              Navigation
            </div>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-white/5 py-2 text-sm font-medium text-zinc-200 hover:text-amber-400"
            >
              <span>ORIGIN & STORY</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-white/5 py-2 text-sm font-medium text-zinc-200 hover:text-amber-400"
            >
              <span>IN-STOCK MATCHDAY KITS</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
            </Link>
            <Link
              href="/#atelier-studio-configurator"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-white/5 py-2 text-sm font-medium text-zinc-200 hover:text-amber-400"
            >
              <span>3D STUDIO CONFIGURATOR</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-white/5 py-2 text-sm font-medium text-zinc-200 hover:text-amber-400"
            >
              <span>TRACK ORDER STATUS</span>
              <Truck className="h-3.5 w-3.5 text-amber-400" />
            </Link>
            <Link
              href={user ? "/account" : "/auth/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-white/5 py-2 text-sm font-medium text-zinc-200 hover:text-amber-400"
            >
              <span>{user ? `ACCOUNT (${user.name})` : "LOGIN / REGISTER"}</span>
              <User className="h-3.5 w-3.5 text-zinc-400" />
            </Link>
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-sm font-bold text-amber-400"
              >
                <span>ADMIN CONTROL PANEL</span>
                <Lock className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
