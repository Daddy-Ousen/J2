"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X, ExternalLink, ShieldCheck } from "lucide-react";

export function WhatsAppSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("8801700000000");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.whatsapp_number) {
          setWhatsappNumber(data.settings.whatsapp_number.replace(/[^0-9]/g, ""));
        }
      })
      .catch(() => {});
  }, []);

  const cleanNumber = whatsappNumber.startsWith("88") ? whatsappNumber : `88${whatsappNumber}`;
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent("Hello Jersey Verse, I need assistance with matchday jersey orders / custom printing.")}`;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 font-mono">
      {/* Expanded Quick Chat Box */}
      {isOpen && (
        <div className="mb-3 w-80 rounded-2xl border border-amber-500/30 bg-zinc-950 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-white">JERSEY VERSE SUPPORT</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-[11px] text-zinc-300 leading-relaxed">
            Need help with your <strong className="text-amber-400">bKash / Nagad payment</strong>, custom player name & number printing, or order tracking? Chat with our dispatch desk on WhatsApp.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black py-2.5 px-4 text-xs font-bold transition-all active:scale-98"
          >
            <MessageCircle className="h-4 w-4" />
            <span>OPEN WHATSAPP CHAT</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[9px] text-zinc-500">
            <ShieldCheck className="h-3 w-3 text-amber-500" />
            <span>DIRECT DHAKA DISPATCH DESK</span>
          </div>
        </div>
      )}

      {/* Floating Pill Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contact WhatsApp Support"
        className="flex items-center gap-2.5 rounded-full border border-emerald-500/40 bg-zinc-950/90 px-4 py-3 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:border-emerald-400 hover:bg-emerald-500 hover:text-black transition-all active:scale-95 group"
      >
        <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
        <span className="text-xs font-bold hidden sm:inline">WHATSAPP HELP</span>
      </button>
    </div>
  );
}
