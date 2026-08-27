"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { CartItem } from "@/components/ui/CartDrawer";
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Truck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

import { getStoredCart, saveStoredCart } from "@/lib/cartStore";

export default function CheckoutPage() {
  const router = useRouter();

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [zone, setZone] = useState<"inside_dhaka" | "outside_dhaka">("inside_dhaka");
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad">("bkash");
  const [senderNumber, setSenderNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [notes, setNotes] = useState("");

  // Store Settings (bKash/Nagad numbers)
  const [settings, setSettings] = useState<Record<string, string>>({
    bkash_number: "01755-998877 (Merchant / Send Money)",
    nagad_number: "01855-998877 (Personal / Send Money)",
  });

  // Cart & Order Placement State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState<any>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);

  useEffect(() => {
    // Load stored cart
    const stored = getStoredCart();
    setCartItems(stored);

    // Load store settings
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});

    // Check if user is logged in to autofill
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCustomerName(data.user.name || "");
          setEmail(data.user.email || "");
          if (data.user.phone) setPhone(data.user.phone);
          if (data.user.address) setAddress(data.user.address);
          if (data.user.city) setCity(data.user.city);
        }
      })
      .catch(() => {});
  }, []);

  // Calculate pricing
  const subtotal = cartItems.reduce((acc, item) => acc + item.jersey.price * item.quantity, 0);
  const customizationFee = cartItems.reduce(
    (acc, item) => (item.customConfig ? acc + 200 * item.quantity : acc),
    0
  );
  const shippingFee = subtotal >= 3000 ? 0 : zone === "outside_dhaka" ? 130 : 80;
  const total = subtotal + customizationFee + shippingFee;

  const handleCopyNumber = (numText: string) => {
    const rawNumber = numText.split(" ")[0].replace(/\D/g, "");
    navigator.clipboard.writeText(rawNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName || !phone || !address) {
      setError("Please complete all shipping address fields.");
      return;
    }

    if (!senderNumber || !trxId) {
      setError("Please provide your payment sender number and Transaction ID (TrxID).");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your bag is currently empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsPayload = cartItems.map((item) => ({
        productId: item.jersey.id,
        name: item.jersey.name,
        size: item.size,
        price: item.jersey.price,
        quantity: item.quantity,
        customName: item.customConfig?.playerName || null,
        customNumber: item.customConfig?.jerseyNumber || null,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          email,
          address,
          city,
          zone,
          paymentMethod,
          senderNumber,
          trxId,
          items: itemsPayload,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      setOrderComplete(data.order);
      setCartItems([]);
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Success Screen
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-400 selection:text-black">
        <Navbar />

        <div className="max-w-3xl mx-auto px-4 pt-36 pb-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6 animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <span className="font-mono text-[11px] uppercase tracking-widest text-amber-400 font-bold">
            COMMISSION REGISTERED // JERSEY VERSE
          </span>

          <h1 className="mt-2 text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Mantle Commissioned Successfully
          </h1>

          <p className="mt-3 text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Thank you, <strong className="text-white">{customerName}</strong>. Your order has been placed with upfront {paymentMethod.toUpperCase()} payment verification.
          </p>

          {/* Receipt Card */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-6 text-left max-w-lg mx-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-[10px] text-zinc-500">ORDER TRACKING ID</span>
                <div className="font-mono text-xl font-bold text-amber-400">
                  {orderComplete.orderNumber}
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-zinc-500">TOTAL AMOUNT</span>
                <div className="font-mono text-xl font-bold text-white">
                  ৳{orderComplete.total?.toLocaleString()} BDT
                </div>
              </div>
            </div>

            <div className="py-4 space-y-2 text-xs font-mono text-zinc-300 border-b border-white/5">
              <div className="flex justify-between">
                <span className="text-zinc-500">Payment Channel:</span>
                <span className="uppercase text-amber-300 font-bold">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Sender Number:</span>
                <span>{senderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Transaction ID (TrxID):</span>
                <span className="font-bold text-white">{trxId.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Payment Status:</span>
                <span className="text-amber-400 font-bold">Awaiting Verification</span>
              </div>
            </div>

            <p className="mt-4 text-[11px] font-mono text-zinc-400 leading-relaxed">
              Our dispatch team will verify your {paymentMethod.toUpperCase()} TrxID shortly and initiate printing & courier dispatch.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/track?orderNumber=${orderComplete.orderNumber}&phone=${phone}`}
              className="w-full sm:w-auto rounded-xl bg-amber-400 px-6 py-3 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              TRACK LIVE DISPATCH STATUS
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-auto rounded-xl border border-white/10 bg-zinc-900 px-6 py-3 font-mono text-xs font-bold text-zinc-300 hover:text-white"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-400 selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>SECURE UPFRONT CHECKOUT // BANGLADESH</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Mantle Dispatch Terminal
          </h1>
          <p className="font-mono text-xs text-zinc-400 mt-1">
            Complete your shipping details and send full upfront payment via bKash or Nagad.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3 text-red-400 text-xs font-mono">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Shipping Details & Payment Terminal */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-black font-mono text-[11px] font-bold">
                  1
                </span>
                <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  SHIPPING & COURIER DESTINATION
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 text-xs font-mono text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    Phone Number (Active Mobile) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 text-xs font-mono text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                  Email Address (For Invoice Confirmation)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tanvir@example.com"
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 text-xs font-mono text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                  Full Street Address (House, Road, Area, Thana) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House 12, Road 4, Sector 7, Uttara, Dhaka"
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 text-xs font-mono text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Delivery Zone Selector */}
              <div>
                <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-2">
                  Delivery Region *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setZone("inside_dhaka")}
                    className={`flex flex-col items-start p-3.5 rounded-xl border font-mono transition-all text-left ${
                      zone === "inside_dhaka"
                        ? "border-amber-400 bg-amber-400/10 text-white"
                        : "border-white/10 bg-zinc-900/40 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <span className="text-xs font-bold text-white">Inside Dhaka</span>
                    <span className="text-[10px] text-amber-400 mt-0.5">৳80 Courier (24-48h)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setZone("outside_dhaka")}
                    className={`flex flex-col items-start p-3.5 rounded-xl border font-mono transition-all text-left ${
                      zone === "outside_dhaka"
                        ? "border-amber-400 bg-amber-400/10 text-white"
                        : "border-white/10 bg-zinc-900/40 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <span className="text-xs font-bold text-white">Outside Dhaka</span>
                    <span className="text-[10px] text-amber-400 mt-0.5">৳130 Courier (2-3 Days)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Upfront bKash / Nagad Payment Terminal */}
            <div className="rounded-2xl border border-amber-500/30 bg-zinc-950 p-6 space-y-4 shadow-[0_0_30px_rgba(245,158,11,0.08)]">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-black font-mono text-[11px] font-bold">
                    2
                  </span>
                  <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                    UPFRONT MOBILE PAYMENT TERMINAL
                  </h2>
                </div>
                <span className="font-mono text-[10px] text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  NO COD (100% UPFRONT)
                </span>
              </div>

              {/* Payment Channel Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bkash")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-mono text-xs font-bold transition-all ${
                    paymentMethod === "bkash"
                      ? "border-[#e2136e] bg-[#e2136e]/15 text-[#e2136e] shadow-[0_0_15px_rgba(226,19,110,0.2)]"
                      : "border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>bKash Payment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("nagad")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-mono text-xs font-bold transition-all ${
                    paymentMethod === "nagad"
                      ? "border-[#f7941d] bg-[#f7941d]/15 text-[#f7941d] shadow-[0_0_15px_rgba(247,148,29,0.2)]"
                      : "border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Nagad Payment</span>
                </button>
              </div>

              {/* How to Pay Box */}
              <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-zinc-400">
                    Send full amount (<strong>৳{total.toLocaleString()}</strong>) to:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyNumber(
                        paymentMethod === "bkash"
                          ? settings.bkash_number || "01755998877"
                          : settings.nagad_number || "01855998877"
                      )
                    }
                    className="flex items-center gap-1 font-mono text-[10px] text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    {copiedNumber ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedNumber ? "COPIED" : "COPY NUMBER"}</span>
                  </button>
                </div>

                {/* Account Number Box */}
                <div className="rounded-lg bg-black/80 border border-white/10 p-3 font-mono text-base font-bold text-amber-400 flex items-center justify-between">
                  <span>
                    {paymentMethod === "bkash"
                      ? settings.bkash_number || "01755-998877"
                      : settings.nagad_number || "01855-998877"}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase">
                    {paymentMethod.toUpperCase()}
                  </span>
                </div>

                <div className="font-mono text-[11px] text-zinc-400 space-y-1 pl-1">
                  <div>1. Open your {paymentMethod.toUpperCase()} App or dial *247# / *167#</div>
                  <div>2. Select <strong>Send Money / Make Payment</strong> to the number above</div>
                  <div>3. Enter exact amount: <strong>৳{total.toLocaleString()} BDT</strong></div>
                  <div>4. Enter reference: <strong>MANTLE</strong></div>
                  <div>5. Copy the <strong>Transaction ID (TrxID)</strong> and paste it below</div>
                </div>
              </div>

              {/* Verification Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    Your {paymentMethod.toUpperCase()} Sender Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    placeholder="017XXXXXXXX (Number you paid from)"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 text-xs font-mono text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    Transaction ID (TrxID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                    placeholder="e.g. BLX9827419"
                    className="w-full rounded-xl border border-amber-500/40 bg-zinc-900/80 px-3.5 py-2.5 text-xs font-mono text-amber-300 font-bold placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 space-y-4">
              <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
                COMMISSION SUMMARY ({cartItems.length} ITEMS)
              </h2>

              {cartItems.length === 0 ? (
                <div className="py-8 text-center text-zinc-500 font-mono text-xs">
                  <p>Your bag is empty.</p>
                  <Link href="/shop" className="text-amber-400 underline mt-2 inline-block">
                    Browse in-stock kits
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/5 max-h-80 overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="py-3 flex gap-3 items-center">
                      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-900 border border-white/10">
                        <Image
                          src={item.jersey.image}
                          alt={item.jersey.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans text-xs font-bold text-white truncate">
                          {item.jersey.name}
                        </h4>
                        <div className="font-mono text-[10px] text-zinc-400 flex items-center gap-2 mt-0.5">
                          <span>Size: {item.size}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                        {item.customConfig && (
                          <div className="font-mono text-[9px] text-amber-300 mt-0.5">
                            Custom Print: {item.customConfig.playerName} #{item.customConfig.jerseyNumber}
                          </div>
                        )}
                      </div>
                      <div className="font-mono text-xs font-bold text-amber-400">
                        ৳{((item.jersey.price + (item.customConfig ? 200 : 0)) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border-t border-white/10 pt-4 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal:</span>
                  <span className="text-white">৳{subtotal.toLocaleString()} BDT</span>
                </div>

                {customizationFee > 0 && (
                  <div className="flex justify-between text-amber-300">
                    <span>Custom Name/Number Printing:</span>
                    <span>+৳{customizationFee.toLocaleString()} BDT</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>Courier Delivery ({zone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"}):</span>
                  <span>{shippingFee === 0 ? "FREE" : `৳${shippingFee} BDT`}</span>
                </div>

                {subtotal >= 3000 && (
                  <div className="flex justify-between text-emerald-400 text-[11px]">
                    <span>Free Shipping Applied (Orders ≥ ৳3,000):</span>
                    <span>-৳{zone === "outside_dhaka" ? 130 : 80}</span>
                  </div>
                )}

                <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-bold">
                  <span className="text-white">Total Amount:</span>
                  <span className="font-mono text-lg text-amber-400">
                    ৳{total.toLocaleString()} BDT
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 py-3.5 px-6 font-mono text-xs font-bold tracking-widest text-black shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>REGISTERING COMMISSION...</span>
                ) : (
                  <>
                    <span>CONFIRM UPFRONT PAYMENT — ৳{total.toLocaleString()}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
