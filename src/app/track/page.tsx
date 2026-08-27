"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  PackageCheck,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  MapPin,
  CreditCard,
} from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams?.get("orderNumber") || "");
  const [phone, setPhone] = useState(searchParams?.get("phone") || "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderNumber && phone) {
      handleTrack();
    }
  }, []);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setOrder(null);

    if (!orderNumber || !phone) {
      setError("Please enter both your Order Number (e.g. JV-92841) and Phone Number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order not found");
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || "Failed to locate order. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (!order) return "upcoming";

    // 1: Pending Verification
    // 2: Payment Verified
    // 3: Printing / Processing
    // 4: Dispatched
    // 5: Delivered

    const status = order.orderStatus;
    const payment = order.paymentStatus;

    if (stepIndex === 1) {
      return "completed";
    }

    if (stepIndex === 2) {
      if (payment === "VERIFIED") return "completed";
      if (payment === "FAILED") return "failed";
      return "active";
    }

    if (stepIndex === 3) {
      if (["PRINTING", "DISPATCHED", "DELIVERED"].includes(status)) return "completed";
      if (payment === "VERIFIED" && status === "CONFIRMED") return "active";
      return "upcoming";
    }

    if (stepIndex === 4) {
      if (["DISPATCHED", "DELIVERED"].includes(status)) return "completed";
      if (status === "PRINTING") return "active";
      return "upcoming";
    }

    if (stepIndex === 5) {
      if (status === "DELIVERED") return "completed";
      if (status === "DISPATCHED") return "active";
      return "upcoming";
    }

    return "upcoming";
  };

  const STEPS = [
    { title: "Commission Registered", desc: "Upfront TrxID submitted", icon: Clock },
    { title: "Payment Verified", desc: "bKash/Nagad verified by admin", icon: CreditCard },
    { title: "Custom Printing & Inspection", desc: "Heat-press & stitching quality control", icon: Printer },
    { title: "Courier Dispatched", desc: "En route with Steadfast/Pathao", icon: Truck },
    { title: "Mantle Delivered", desc: "Delivered to your doorstep", icon: PackageCheck },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-400 selection:text-black">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-3">
            <Truck className="h-3.5 w-3.5" />
            <span>REAL-TIME COURIER TRACKING</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Track Your <span className="text-amber-400">Mantle</span>
          </h1>

          <p className="mt-2 text-sm text-zinc-400 font-mono max-w-md mx-auto">
            Enter your Jersey verse order ID and phone number to monitor verification, printing, and courier delivery.
          </p>
        </div>

        {/* Tracking Search Card */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl mb-8">
          <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-5">
              <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                Order Tracking ID (e.g. JV-92841)
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="JV-XXXXX"
                className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-2.5 font-mono text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                Mobile Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-2.5 font-mono text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 py-2.5 px-4 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">TRACKING...</span>
                ) : (
                  <>
                    <Search className="h-3.5 w-3.5" />
                    <span>TRACK</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 flex items-center gap-2.5 text-red-400 text-xs font-mono">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Live Tracking Result */}
        {order && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Overview Header Banner */}
            <div className="rounded-2xl border border-amber-500/30 bg-zinc-950 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] text-zinc-500 uppercase">
                  ORDER COMMISSION
                </span>
                <div className="font-mono text-2xl font-bold text-amber-400">
                  {order.orderNumber}
                </div>
                <div className="font-mono text-xs text-zinc-400 mt-0.5">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5">
                <span
                  className={`rounded-full px-3 py-1 font-mono text-xs font-bold ${
                    order.paymentStatus === "VERIFIED"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {order.paymentStatus === "VERIFIED" ? "PAYMENT VERIFIED" : "VERIFYING UPFRONT PAYMENT"}
                </span>

                <span className="font-mono text-xs text-zinc-300">
                  Fulfillment: <strong className="text-white uppercase">{order.orderStatus}</strong>
                </span>
              </div>
            </div>

            {/* Courier Consignment Banner if Shipped */}
            {order.consignmentId && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-emerald-400" />
                  <div>
                    <div className="font-mono text-xs font-bold text-white">
                      Dispatched via {order.courierPartner || "Steadfast Courier"}
                    </div>
                    <div className="font-mono text-[11px] text-emerald-300">
                      Consignment Tracking No: <strong>{order.consignmentId}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5-Step Timeline Stage */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
              <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">
                DISPATCH PIPELINE STATUS
              </h3>

              <div className="space-y-6">
                {STEPS.map((step, idx) => {
                  const state = getStepStatus(idx + 1);
                  const Icon = step.icon;

                  return (
                    <div key={step.title} className="relative flex items-start gap-4">
                      {/* Vertical line connecting steps */}
                      {idx !== STEPS.length - 1 && (
                        <div
                          className={`absolute left-5 top-10 bottom-0 w-0.5 -ml-[1px] ${
                            state === "completed" ? "bg-amber-400" : "bg-white/10"
                          }`}
                        />
                      )}

                      {/* Step Circle */}
                      <div
                        className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                          state === "completed"
                            ? "border-amber-400 bg-amber-400 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                            : state === "active"
                            ? "border-amber-400 bg-amber-400/20 text-amber-300 animate-pulse"
                            : "border-white/10 bg-zinc-900 text-zinc-600"
                        }`}
                      >
                        {state === "completed" ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="pt-1.5 flex-1">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`font-mono text-sm font-bold ${
                              state === "completed"
                                ? "text-white"
                                : state === "active"
                                ? "text-amber-300"
                                : "text-zinc-500"
                            }`}
                          >
                            {step.title}
                          </h4>
                          {state === "active" && (
                            <span className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-300">
                              CURRENT STAGE
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-xs text-zinc-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Specification Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Info */}
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300">
                  <MapPin className="h-4 w-4" />
                  <span>DELIVERY DESTINATION</span>
                </div>
                <div className="font-mono text-xs text-zinc-300 space-y-1">
                  <div><strong>Customer:</strong> {order.customerName}</div>
                  <div><strong>Phone:</strong> {order.phone}</div>
                  <div><strong>Address:</strong> {order.address}</div>
                  <div><strong>Zone:</strong> {order.zone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"}</div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300">
                  <CreditCard className="h-4 w-4" />
                  <span>UPFRONT PAYMENT DETAILS</span>
                </div>
                <div className="font-mono text-xs text-zinc-300 space-y-1">
                  <div><strong>Method:</strong> <span className="uppercase text-amber-400 font-bold">{order.paymentMethod}</span></div>
                  <div><strong>Sender Number:</strong> {order.senderNumber}</div>
                  <div><strong>Transaction ID:</strong> <span className="text-white font-bold">{order.trxId}</span></div>
                  <div><strong>Total Paid:</strong> ৳{order.total.toLocaleString()} BDT</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
          Loading courier dispatch tracker...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
