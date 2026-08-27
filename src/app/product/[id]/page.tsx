"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { CartDrawer, CartItem } from "@/components/ui/CartDrawer";
import { SizeGuideModal } from "@/components/ui/SizeGuideModal";
import { JerseyProduct } from "@/types";
import { getStoredCart, saveStoredCart } from "@/lib/cartStore";
import {
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Ruler,
  Truck,
  RotateCcw,
  Check,
  Flame,
  ArrowRight,
  ChevronRight,
  Shield,
  Palette,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [enableCustomPrint, setEnableCustomPrint] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [viewMode, setViewMode] = useState<"front" | "back">("front");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setCartItems(getStoredCart());
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          // Set default custom name to club or popular player if applicable
          if (data.product.club.includes("Real Madrid")) {
            setCustomName("BELLINGHAM");
            setCustomNumber("5");
          } else if (data.product.club.includes("Barcelona")) {
            setCustomName("LAMINE YAMAL");
            setCustomNumber("19");
          } else if (data.product.club.includes("Arsenal")) {
            setCustomName("SAKA");
            setCustomNumber("7");
          } else if (data.product.club.includes("Al Nassr")) {
            setCustomName("RONALDO");
            setCustomNumber("7");
          } else if (data.product.club.includes("Manchester United")) {
            setCustomName("MAINOO");
            setCustomNumber("37");
          } else if (data.product.club.includes("Argentina")) {
            setCustomName("MESSI");
            setCustomNumber("10");
          } else {
            setCustomName("JERSEY VERSE");
            setCustomNumber("10");
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <span className="font-mono text-xs text-zinc-400">Loading matchday armor specs...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <ShieldCheck className="h-12 w-12 text-zinc-600 mb-3" />
        <h2 className="text-2xl font-bold">Jersey Not Found</h2>
        <p className="text-sm font-mono text-zinc-400 mt-1 mb-6">
          The requested kit code or slug does not exist in our active repository.
        </p>
        <Link
          href="/shop"
          className="rounded-xl bg-amber-400 px-6 py-2.5 font-mono text-xs font-bold text-black"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const getStockForSize = (s: string) => {
    if (s === "S") return product.stockS;
    if (s === "M") return product.stockM;
    if (s === "L") return product.stockL;
    if (s === "XL") return product.stockXL;
    if (s === "XXL") return product.stockXXL;
    return 0;
  };

  const currentSizeStock = getStockForSize(selectedSize);

  const calculateFinalPrice = () => {
    let base = product.price;
    if (enableCustomPrint) base += 200;
    return base;
  };

  const handleAddToCart = () => {
    const jerseyProd: JerseyProduct = {
      id: product.id,
      code: product.code,
      name: product.name,
      subtitle: product.subtitle,
      price: calculateFinalPrice(),
      edition: product.league,
      colorway: product.club,
      dominantColor: product.dominantColor,
      accentColor: product.accentColor,
      image: product.image,
      fallbackGradient: "from-zinc-950 via-zinc-900 to-amber-950/40",
      weightGsm: product.weightGsm,
      fabric: product.fabric,
      badgeType: product.badgeType,
      story: product.story,
      specs: [
        { label: "Weight", value: `${product.weightGsm} GSM` },
        { label: "Fabric", value: product.fabric },
        { label: "Badge", value: product.badgeType },
      ],
      availableSizes: ["S", "M", "L", "XL", "XXL"],
    };

    const customConfig = enableCustomPrint
      ? {
          colorwayId: product.club,
          colorwayName: product.name,
          primaryColor: product.dominantColor,
          secondaryColor: product.dominantColor,
          accentColor: product.accentColor,
          textColor: product.accentColor,
          hexCode: product.dominantColor,
          finish: "satin" as const,
          playerName: customName.toUpperCase() || "NAME",
          jerseyNumber: customNumber || "00",
          fontFamily: "modern" as const,
          crestFinish: "gold" as const,
          weaveId: "w-pique",
          weaveName: "Aero-Fit Knit",
          weaveGsm: product.weightGsm,
          weavePattern: "pique" as const,
        }
      : undefined;

    setCartItems((prev) => {
      let updated: CartItem[];
      const existing = prev.findIndex(
        (i) =>
          i.jersey.id === product.id &&
          i.size === selectedSize &&
          i.customConfig?.playerName === customConfig?.playerName &&
          i.customConfig?.jerseyNumber === customConfig?.jerseyNumber
      );
      if (existing > -1) {
        const copy = [...prev];
        copy[existing].quantity += 1;
        updated = copy;
      } else {
        updated = [...prev, { jersey: jerseyProd, size: selectedSize, quantity: 1, customConfig }];
      }
      saveStoredCart(updated);
      return updated;
    });

    setAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-400 selection:text-black">
      <Navbar cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-4">
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            HOME
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-600" />
          <Link href="/shop" className="hover:text-amber-400 transition-colors">
            SHOP
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-600" />
          <span className="text-zinc-400">{product.league}</span>
          <ChevronRight className="h-3 w-3 text-zinc-600" />
          <span className="text-amber-400 font-bold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main PDP Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Stage: Visual Showcase & Back Print Live Simulator */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Main Stage Frame */}
            <div className="relative aspect-square w-full rounded-3xl border border-white/10 bg-zinc-950 p-4 sm:p-6 overflow-hidden shadow-2xl flex items-center justify-center">
              {/* Perspective background grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

              {/* View mode toggle */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1 rounded-full border border-white/10 bg-black/80 p-1 backdrop-blur-md">
                <button
                  onClick={() => setViewMode("front")}
                  className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold transition-colors ${
                    viewMode === "front" ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  FRONT CHEST
                </button>
                <button
                  onClick={() => setViewMode("back")}
                  className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold transition-colors ${
                    viewMode === "back" ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  BACK PRINT (LIVE)
                </button>
              </div>

              {/* Front Authentic Shot */}
              {viewMode === "front" ? (
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover object-center filter contrast-[1.08]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                </div>
              ) : (
                /* Back Name/Number Live Simulator */
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-900/50 rounded-2xl p-6 border border-white/5">
                  <div className="relative w-full max-w-sm aspect-[3/4] flex flex-col items-center justify-center border-2 border-white/10 rounded-2xl bg-zinc-950 p-6 shadow-inner">
                    {/* Inner Collar Brand */}
                    <span className="font-mono text-[8px] tracking-[0.3em] text-zinc-500 mb-6 uppercase">
                      // {product.club} ATELIER //
                    </span>

                    {/* Custom Player Name */}
                    <div className="text-center font-black tracking-[0.2em] uppercase text-2xl sm:text-3xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                      {enableCustomPrint && customName ? customName : "YOUR NAME"}
                    </div>

                    {/* Custom Player Number */}
                    <div className="font-sans font-black text-7xl sm:text-9xl tracking-tighter text-amber-400 drop-shadow-[0_10px_25px_rgba(245,158,11,0.4)] my-2">
                      {enableCustomPrint && customNumber ? customNumber : "10"}
                    </div>

                    {/* Official League Font Stamp */}
                    <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest mt-4">
                      OFFICIAL 2024/25 MATCH SPEC
                    </span>
                  </div>
                </div>
              )}

              {/* Serial & GSM tag bottom */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-zinc-400 border-t border-white/5 pt-2">
                <span>SERIAL: {product.code}</span>
                <span className="text-amber-400 font-bold">{product.weightGsm} GSM CHASSIS</span>
              </div>
            </div>

            {/* Guarantees Strip */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-3 flex flex-col items-center text-center">
                <Shield className="h-4 w-4 text-amber-400 mb-1" />
                <span className="font-mono text-[10px] font-bold text-white">100% AUTHENTIC</span>
                <span className="text-[9px] text-zinc-500 font-mono">Serialized Badging</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-3 flex flex-col items-center text-center">
                <Truck className="h-4 w-4 text-amber-400 mb-1" />
                <span className="font-mono text-[10px] font-bold text-white">FAST DISPATCH</span>
                <span className="text-[9px] text-zinc-500 font-mono">24-48h Across BD</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-3 flex flex-col items-center text-center">
                <Sparkles className="h-4 w-4 text-amber-400 mb-1" />
                <span className="font-mono text-[10px] font-bold text-white">CUSTOM PRINTS</span>
                <span className="text-[9px] text-zinc-500 font-mono">Official Heat Press</span>
              </div>
            </div>
          </div>

          {/* Right Stage: Options, Custom Printing, & Checkout Actions */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Header Lockup */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                  {product.league}
                </span>
                <span className="font-mono text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  IN STOCK ({currentSizeStock} UNITS IN SIZE {selectedSize})
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase">
                {product.name}
              </h1>

              <p className="mt-1 font-mono text-xs text-amber-400/90 tracking-wide">
                {product.subtitle}
              </p>

              {/* Price Row */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-mono text-3xl font-black text-amber-400">
                  ৳{calculateFinalPrice().toLocaleString()} BDT
                </span>
                {product.originalPrice && (
                  <span className="font-mono text-sm text-zinc-500 line-through">
                    ৳{(product.originalPrice + (enableCustomPrint ? 200 : 0)).toLocaleString()}
                  </span>
                )}
                {enableCustomPrint && (
                  <span className="rounded bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                    +৳200 Custom Print Included
                  </span>
                )}
              </div>
            </div>

            {/* Size Selector Strip */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-zinc-300">
                  SELECT CHASSIS SIZE
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 font-mono text-[11px] text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-4"
                >
                  <Ruler className="h-3 w-3" />
                  <span>Size & Fit Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => {
                  const stock = getStockForSize(size);
                  const isSelected = selectedSize === size;
                  const isLow = stock > 0 && stock <= 3;
                  const isOut = stock <= 0;

                  return (
                    <button
                      key={size}
                      disabled={isOut}
                      onClick={() => setSelectedSize(size)}
                      className={`relative flex flex-col items-center justify-center h-14 rounded-xl border font-mono transition-all ${
                        isOut
                          ? "border-zinc-800 bg-zinc-900/30 text-zinc-600 opacity-40 cursor-not-allowed"
                          : isSelected
                          ? "border-amber-400 bg-amber-400 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                          : "border-white/10 bg-zinc-900/60 text-zinc-300 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <span className="text-sm font-bold">{size}</span>
                      <span
                        className={`text-[8px] mt-0.5 ${
                          isSelected ? "text-black/80 font-bold" : isLow ? "text-amber-400" : "text-zinc-500"
                        }`}
                      >
                        {isOut ? "OUT" : `${stock} left`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Name & Number Printing Section */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableCustomPrint}
                    onChange={(e) => {
                      setEnableCustomPrint(e.target.checked);
                      if (e.target.checked) setViewMode("back");
                    }}
                    className="h-4 w-4 rounded border-white/20 bg-zinc-900 text-amber-500 focus:ring-amber-400 accent-amber-400"
                  />
                  <span className="font-mono text-xs font-bold text-white">
                    CUSTOM PLAYER PRINTING (+৳200)
                  </span>
                </label>
                <span className="font-mono text-[10px] text-amber-400 font-bold">
                  HEAT-PRESSED
                </span>
              </div>

              {enableCustomPrint && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-in fade-in duration-200">
                  <div>
                    <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                      Player Name on Back (Max 14 chars)
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                      placeholder="e.g. MESSI, RONALDO, YOUR NAME"
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                      Jersey Number (00 - 99)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={customNumber}
                      onChange={(e) => setCustomNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="10"
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <p className="font-mono text-[9px] text-zinc-500">
                    * Preview updates in real-time on the "BACK PRINT" tab on the left.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons: Add to Bag & Direct Checkout */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 py-3.5 px-6 font-mono text-xs font-bold tracking-widest text-black shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all hover:brightness-110 active:scale-98"
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>MANTLE SECURED TO BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>ADD TO MANTLE — ৳{calculateFinalPrice().toLocaleString()}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  handleAddToCart();
                  router.push("/checkout");
                }}
                className="w-full rounded-full border border-white/15 bg-zinc-900/80 py-3 px-6 font-mono text-xs font-bold text-white hover:border-amber-400 hover:text-amber-300 transition-colors"
              >
                PROCEED TO BKASH / NAGAD CHECKOUT
              </button>
            </div>

            {/* Technical Specifications Sheet */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300">
                <ShieldCheck className="h-4 w-4" />
                <span>MATERIAL ARCHITECTURE SPEC SHEET</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="border-l-2 border-amber-500/30 pl-2.5">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                    Weave Density
                  </div>
                  <div className="font-mono text-xs text-zinc-200 mt-0.5">
                    {product.weightGsm} GSM Micro-Knit
                  </div>
                </div>

                <div className="border-l-2 border-amber-500/30 pl-2.5">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                    Badge Relief
                  </div>
                  <div className="font-mono text-xs text-zinc-200 mt-0.5">
                    3D Liquid Silicone Crest
                  </div>
                </div>

                <div className="border-l-2 border-amber-500/30 pl-2.5">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                    Origin Code
                  </div>
                  <div className="font-mono text-xs text-zinc-200 mt-0.5">
                    {product.code}
                  </div>
                </div>

                <div className="border-l-2 border-amber-500/30 pl-2.5">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                    Care Protocol
                  </div>
                  <div className="font-mono text-xs text-zinc-200 mt-0.5">
                    Cold Wash, Hang Dry
                  </div>
                </div>
              </div>

              <p className="font-sans text-xs text-zinc-400 font-light leading-relaxed pt-2 border-t border-white/5">
                {product.story}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sizing Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={(idx, delta) => {
          setCartItems((prev) => {
            const updated = [...prev];
            const newQty = updated[idx].quantity + delta;
            if (newQty <= 0) return updated.filter((_, i) => i !== idx);
            updated[idx].quantity = newQty;
            return updated;
          });
        }}
        onRemoveItem={(idx) => {
          setCartItems((prev) => prev.filter((_, i) => i !== idx));
        }}
      />
    </div>
  );
}
