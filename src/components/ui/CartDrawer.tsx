"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JerseyProduct, CustomKitConfig } from "@/types";
import { X, Trash2, ShieldCheck, ArrowRight, Sparkles, Plus, Minus } from "lucide-react";

export interface CartItem {
  jersey: JerseyProduct;
  size: string;
  quantity: number;
  customConfig?: CustomKitConfig;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity?: (index: number, delta: number) => void;
  onClearCart?: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
}: CartDrawerProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (acc, item) => acc + item.jersey.price * item.quantity,
    0
  );

  const customizationFee = items.reduce(
    (acc, item) => (item.customConfig ? acc + 200 * item.quantity : acc),
    0
  );

  const total = subtotal + customizationFee;

  const handleProceedToCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col justify-between border-l border-white/10 bg-zinc-950 p-6 sm:p-8 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
              ARMOR BAG
            </span>
            <span className="font-mono text-xs text-zinc-500">
              ({items.reduce((acc, i) => acc + i.quantity, 0)} ITEMS)
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="text-sm font-mono text-zinc-400">
                YOUR ARMOR BAG IS EMPTY
              </div>
              <p className="text-xs text-zinc-500 max-w-xs">
                Explore our in-stock matchday kits or commission a custom tailored jersey.
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="mt-4 rounded-xl bg-amber-400 px-4 py-2 font-mono text-xs font-bold text-black"
              >
                BROWSE MATCHDAY KITS
              </Link>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.jersey.id}-${item.size}-${idx}`}
                className="flex flex-col gap-3 rounded-xl border border-white/5 bg-zinc-900/50 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-14 rounded-lg overflow-hidden border border-white/10 bg-black flex-shrink-0">
                    <Image
                      src={item.jersey.image}
                      alt={item.jersey.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans text-xs font-bold text-white truncate">
                        {item.jersey.name}
                      </h4>
                      {item.customConfig && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 font-mono text-[8px] font-bold text-amber-400">
                          <Sparkles className="h-2.5 w-2.5" /> CUSTOM
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-0.5">
                      <span>SIZE: {item.size}</span>
                      <span>•</span>
                      <span className="text-amber-400 font-bold">
                        ৳{item.jersey.price.toLocaleString()} BDT
                      </span>
                    </div>

                    {/* Quantity Modifier */}
                    <div className="flex items-center gap-2 mt-2 font-mono text-xs">
                      <button
                        onClick={() => onUpdateQuantity && onUpdateQuantity(idx, -1)}
                        className="flex h-5 w-5 items-center justify-center rounded border border-white/10 bg-zinc-800 text-zinc-300 hover:text-white"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-bold text-white px-1">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity && onUpdateQuantity(idx, 1)}
                        className="flex h-5 w-5 items-center justify-center rounded border border-white/10 bg-zinc-800 text-zinc-300 hover:text-white"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(idx)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Customization Spec Tags */}
                {item.customConfig && (
                  <div className="rounded-lg border border-white/5 bg-black/40 p-2.5 space-y-1 font-mono text-[9px]">
                    <div className="flex justify-between text-zinc-400">
                      <span>CUSTOM PRINT:</span>
                      <span className="text-amber-300 font-bold">
                        {item.customConfig.playerName} #{item.customConfig.jerseyNumber} (+৳200)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer with Checkout */}
        {items.length > 0 && (
          <div className="border-t border-white/10 pt-4 space-y-4">
            <div className="space-y-1 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span>SUBTOTAL</span>
                <span className="text-white">৳{subtotal.toLocaleString()} BDT</span>
              </div>
              {customizationFee > 0 && (
                <div className="flex items-center justify-between text-amber-300 text-[11px]">
                  <span>CUSTOM PRINTING</span>
                  <span>+৳{customizationFee.toLocaleString()} BDT</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                <span>TOTAL ESTIMATE</span>
                <span className="text-amber-400 font-mono text-base">
                  ৳{total.toLocaleString()} BDT
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              <span>UPFRONT BKASH & NAGAD VERIFICATION AT CHECKOUT</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 py-3.5 px-6 font-mono text-xs font-bold tracking-widest text-black shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all hover:brightness-110 active:scale-98"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
