"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { ScrollProgressBar } from "@/components/scrollytelling/ScrollProgressBar";
import { Act1Origin } from "@/components/scrollytelling/Act1Origin";
import { Act2Struggle } from "@/components/scrollytelling/Act2Struggle";
import { Act3JerseyMoment } from "@/components/scrollytelling/Act3JerseyMoment";
import { Act4ProductCTA } from "@/components/scrollytelling/Act4ProductCTA";
import { QuickViewModal } from "@/components/ui/QuickViewModal";
import { CartDrawer, CartItem } from "@/components/ui/CartDrawer";
import { JERSEYS_DATA } from "@/data/jerseys";
import { JerseyProduct, CustomKitConfig } from "@/types";
import { Check, ShoppingBag, Sparkles } from "lucide-react";

export default function Home() {
  const [liveProducts, setLiveProducts] = useState<JerseyProduct[]>(JERSEYS_DATA);
  const [activeModalJersey, setActiveModalJersey] = useState<JerseyProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; isBespoke?: boolean } | null>(null);

  // Sync live products from PostgreSQL database (with updated photos/descriptions from Admin Desk)
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setLiveProducts(data.products);
        }
      })
      .catch((err) => {
        console.log("Using static initial fallback:", err);
      });
  }, []);

  const showToast = (title: string, isBespoke = false) => {
    setToastMessage({ title, isBespoke });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenQuickView = (jersey: JerseyProduct) => {
    setActiveModalJersey(jersey);
    setIsModalOpen(true);
  };

  const handleInspectHeroKit = (jersey?: JerseyProduct) => {
    const target = jersey || liveProducts[0] || JERSEYS_DATA[0];
    handleOpenQuickView(target);
  };

  const handleAddToCart = (jersey: JerseyProduct, size: string, customConfig?: CustomKitConfig) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.jersey.id === jersey.id && i.size === size && !i.customConfig && !customConfig
      );
      if (existingIdx > -1 && !customConfig) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, { jersey, size, quantity: 1, customConfig }];
    });
    showToast(
      customConfig
        ? `Custom ${jersey.name} (${customConfig.playerName} #${customConfig.jerseyNumber}) added to bag!`
        : `Added ${jersey.name} (Size ${size}) to your bag.`
    );
  };

  const handleAddBespokeToBag = (customKit: JerseyProduct, config: CustomKitConfig) => {
    setCartItems((prev) => [
      ...prev,
      { jersey: customKit, size: "M", quantity: 1, customConfig: config },
    ]);
    showToast(`Bespoke Kit "${config.playerName}" (#${config.jerseyNumber}) commissioned!`, true);
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalQuantity = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="relative min-h-screen w-full bg-[#070709] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Scrollytelling Progress Bar */}
      <ScrollProgressBar />

      {/* Global Minimalist Header */}
      <Navbar
        cartCount={totalQuantity}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Scrollytelling Narrative Flow */}
      <main className="relative w-full">
        {/* ACT I: ORIGIN */}
        <Act1Origin />

        {/* ACT II: THE CRUCIBLE / STRUGGLE */}
        <Act2Struggle />

        {/* ACT III: THE MANTLE / JERSEY MOMENT */}
        <Act3JerseyMoment
          products={liveProducts}
          onInspectHeroKit={handleInspectHeroKit}
        />

        {/* ACT IV: THE ARMOR / 2026 CAPSULE & STUDIO CONFIGURATOR */}
        <Act4ProductCTA
          products={liveProducts}
          onOpenQuickView={handleOpenQuickView}
          onAddToCart={handleAddToCart}
          onAddBespokeToBag={handleAddBespokeToBag}
        />
      </main>

      {/* Quick View Technical Modal */}
      <QuickViewModal
        jersey={activeModalJersey}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-amber-500/40 bg-zinc-950/95 px-5 py-2.5 text-xs font-mono text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-black">
            {toastMessage.isBespoke ? (
              <Sparkles className="h-3 w-3" />
            ) : (
              <Check className="h-3 w-3 stroke-[3]" />
            )}
          </span>
          <span>{toastMessage.title}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 flex items-center gap-1 text-amber-400 underline underline-offset-2 hover:text-amber-300"
          >
            <ShoppingBag className="h-3 w-3" /> View Bag
          </button>
        </div>
      )}
    </div>
  );
}
