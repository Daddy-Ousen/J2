"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { CartDrawer, CartItem } from "@/components/ui/CartDrawer";
import { QuickViewModal } from "@/components/ui/QuickViewModal";
import { JerseyProduct, CustomKitConfig } from "@/types";
import { getStoredCart, saveStoredCart } from "@/lib/cartStore";
import { JERSEYS_DATA } from "@/data/jerseys";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  ShoppingBag,
  Eye,
  Check,
  Flame,
  ArrowRight,
  ShieldCheck,
  Heart,
} from "lucide-react";

const LEAGUES = [
  "All",
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Saudi Pro League",
  "International",
  "Retro",
];

const SIZES = ["All", "S", "M", "L", "XL", "XXL"];

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>(JERSEYS_DATA);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [inspectProduct, setInspectProduct] = useState<JerseyProduct | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    setCartItems(getStoredCart());
    try {
      const savedWish = localStorage.getItem("jv_wishlist_ids");
      if (savedWish) setWishlistIds(JSON.parse(savedWish));
    } catch {}
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedLeague, selectedSize, sortBy]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("jv_wishlist_ids", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedLeague !== "All") params.set("league", selectedLeague);
      if (selectedSize !== "All") params.set("size", selectedSize);
      if (sortBy === "price_asc") params.set("sort", "price_asc");
      if (sortBy === "price_desc") params.set("sort", "price_desc");
      if (search) params.set("search", search);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error("Shop product sync error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleQuickAdd = (p: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const chosenSize = selectedSize !== "All" ? selectedSize : "M";

    const jerseyProd: JerseyProduct = {
      id: p.id,
      code: p.code,
      name: p.name,
      subtitle: p.subtitle,
      price: p.price,
      edition: p.league,
      colorway: p.club,
      dominantColor: p.dominantColor,
      accentColor: p.accentColor,
      image: p.image,
      fallbackGradient: "from-zinc-950 via-zinc-900 to-amber-950/40",
      weightGsm: p.weightGsm,
      fabric: p.fabric,
      badgeType: p.badgeType,
      story: p.story,
      specs: [
        { label: "Weight", value: `${p.weightGsm} GSM` },
        { label: "Fabric", value: p.fabric },
        { label: "Badge", value: p.badgeType },
      ],
      availableSizes: ["S", "M", "L", "XL", "XXL"],
    };

    setCartItems((prev) => {
      let updated: CartItem[];
      const existing = prev.findIndex(
        (i) => i.jersey.id === p.id && i.size === chosenSize && !i.customConfig
      );
      if (existing > -1) {
        const copy = [...prev];
        copy[existing].quantity += 1;
        updated = copy;
      } else {
        updated = [...prev, { jersey: jerseyProd, size: chosenSize, quantity: 1 }];
      }
      saveStoredCart(updated);
      return updated;
    });

    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-400 selection:text-black">
      <Navbar cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* Header Banner */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-gradient-to-b from-zinc-950 via-zinc-900/30 to-black overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-4">
            <Sparkles className="h-3 w-3" />
            <span>AUTHENTIC MATCHDAY INVENTORY // 2026</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase">
                The Armor <span className="text-amber-400">Repository</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                Explore authentic club and national team matchday jerseys in stock. Every piece carries high-tensile micro-knit engineering, serialized authenticity tags, and optional custom player name/number printing.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-6 border-l-2 border-amber-500/30 pl-4 font-mono text-xs text-zinc-400">
              <div>
                <div className="text-xl font-bold text-white">{products.length}</div>
                <div className="text-[10px] text-amber-400/80">IN-STOCK KITS</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">৳80 / ৳130</div>
                <div className="text-[10px] text-amber-400/80">DHAKA / BD COURIER</div>
              </div>
            </div>
          </div>

          {/* Search and Filters Strip */}
          <div className="mt-10 space-y-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-3 sm:p-4 backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Search Input */}
              <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-96">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search team, player, or kit code..."
                  className="w-full rounded-xl border border-white/10 bg-black/60 py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </form>

              {/* League Tabs */}
              <div className="flex w-full lg:w-auto items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                {LEAGUES.map((l) => (
                  <button
                    key={l}
                    onClick={() => setSelectedLeague(l)}
                    className={`flex-shrink-0 rounded-lg px-3 py-1.5 font-mono text-xs transition-all ${
                      selectedLeague === l
                        ? "bg-amber-400 font-bold text-black shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                        : "border border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 hidden sm:inline">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/60 py-1.5 px-3 font-mono text-xs text-zinc-300 focus:border-amber-400 focus:outline-none"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Size Filter Bar */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/5 overflow-x-auto">
              <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 flex items-center gap-1 flex-shrink-0">
                <SlidersHorizontal className="h-3 w-3" />
                <span>FILTER SIZE:</span>
              </span>
              <div className="flex items-center gap-1.5">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-bold transition-all ${
                      selectedSize === sz
                        ? "bg-white text-black"
                        : "bg-black/50 text-zinc-400 border border-white/10 hover:text-white"
                    }`}
                  >
                    {sz === "All" ? "ALL SIZES" : `SIZE ${sz}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="h-96 rounded-2xl border border-white/5 bg-zinc-900/20 animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-16 text-center">
            <ShieldCheck className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white">No Matchday Armor Found</h2>
            <p className="mt-2 text-sm text-zinc-400 font-mono">
              Try adjusting your search criteria or resetting league and size filters.
            </p>
            <button
              onClick={() => {
                setSelectedLeague("All");
                setSelectedSize("All");
                setSearch("");
              }}
              className="mt-6 rounded-xl bg-amber-400 px-6 py-2.5 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-colors"
            >
              RESET ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => {
              const isWishlisted = wishlistIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
                >
                  {/* Top Badge Strip & Heart Action */}
                  <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                    <span className="rounded-md border border-white/10 bg-black/70 px-2 py-0.5 font-mono text-[9px] font-bold text-zinc-300 backdrop-blur-md">
                      {p.code}
                    </span>

                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      {p.isFeatured && (
                        <span className="flex items-center gap-1 rounded-md bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-300 backdrop-blur-md">
                          <Flame className="h-2.5 w-2.5" />
                          FLAGSHIP
                        </span>
                      )}
                      <button
                        onClick={(e) => toggleWishlist(p.id, e)}
                        className={`p-1.5 rounded-full backdrop-blur-md border transition-all ${
                          isWishlisted
                            ? "bg-rose-500 border-rose-400 text-white"
                            : "bg-black/60 border-white/15 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Heart className="h-3.5 w-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Product Image Stage */}
                  <Link
                    href={`/product/${p.slug || p.id}`}
                    className="relative block h-72 w-full overflow-hidden bg-zinc-900/60 cursor-pointer"
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 350px"
                      className="object-cover object-center filter contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                    {/* Hover Quick Action Buttons */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="font-mono text-[10px] text-amber-300 font-bold bg-black/80 px-2.5 py-1 rounded-full border border-amber-500/30">
                        CLICK FOR 3D SPECS
                      </span>
                    </div>
                  </Link>

                  {/* Card Info */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span>{p.league}</span>
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          IN STOCK
                        </span>
                      </div>

                      <Link href={`/product/${p.slug || p.id}`} className="group-hover:text-amber-400 transition-colors">
                        <h3 className="mt-2 text-base font-bold tracking-tight text-white line-clamp-1">
                          {p.name}
                        </h3>
                      </Link>

                      <p className="mt-1 font-mono text-[11px] text-zinc-400 line-clamp-1">
                        {p.subtitle}
                      </p>

                      {/* Technical Specs pills */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded bg-zinc-900 border border-white/5 px-2 py-0.5 font-mono text-[9px] text-zinc-300">
                          {p.weightGsm} GSM
                        </span>
                        <span className="rounded bg-zinc-900 border border-white/5 px-2 py-0.5 font-mono text-[9px] text-zinc-300">
                          {p.badgeType || "Official Badge"}
                        </span>
                      </div>
                    </div>

                    {/* Price and Action Strip */}
                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-mono text-base font-bold text-amber-400">
                          ৳{p.price.toLocaleString()}{" "}
                          <span className="text-[10px] text-zinc-500">BDT</span>
                        </div>
                        {p.originalPrice && (
                          <div className="font-mono text-[10px] text-zinc-500 line-through">
                            ৳{p.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setInspectProduct(p)}
                          className="rounded-lg border border-white/10 bg-zinc-900 p-2 text-zinc-300 hover:border-white/30 hover:text-white transition-colors"
                          title="Quick View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={(e) => handleQuickAdd(p, e)}
                          className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-2 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-all active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                        >
                          {addedId === p.id ? (
                            <>
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                              <span>SECURED</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="h-3.5 w-3.5" />
                              <span>BAG</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Quick View Modal */}
      {inspectProduct && (
        <QuickViewModal
          jersey={inspectProduct}
          isOpen={!!inspectProduct}
          onClose={() => setInspectProduct(null)}
          onAddToCart={(jersey, size, customConfig) => {
            setCartItems((prev) => {
              const updated = [...prev, { jersey, size, quantity: 1, customConfig }];
              saveStoredCart(updated);
              return updated;
            });
            setIsCartOpen(true);
          }}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={(idx, delta) => {
          setCartItems((prev) => {
            const updated = [...prev];
            const newQty = updated[idx].quantity + delta;
            if (newQty <= 0) {
              const filtered = updated.filter((_, i) => i !== idx);
              saveStoredCart(filtered);
              return filtered;
            }
            updated[idx].quantity = newQty;
            saveStoredCart(updated);
            return updated;
          });
        }}
        onRemoveItem={(idx) => {
          setCartItems((prev) => {
            const filtered = prev.filter((_, i) => i !== idx);
            saveStoredCart(filtered);
            return filtered;
          });
        }}
      />
    </div>
  );
}
