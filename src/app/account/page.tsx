"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import {
  User,
  Package,
  LogOut,
  Truck,
  MapPin,
  Mail,
  Phone,
  Shield,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/auth/login");
        } else {
          setUser(data.user);
          // Fetch user orders
          fetch("/api/orders")
            .then((r) => r.json())
            .then((orderData) => {
              if (orderData.orders) setOrders(orderData.orders);
            })
            .catch(console.error);
        }
      })
      .catch(() => router.push("/auth/login"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
        Loading user portal...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-400 selection:text-black">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Profile Header */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-xl">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 font-mono text-[9px] font-bold text-amber-300">
                  {user.role}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-1 font-mono text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="rounded-xl bg-amber-400 px-4 py-2.5 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-colors"
              >
                ADMIN DASHBOARD
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 font-mono text-xs text-zinc-300 hover:text-white hover:border-white/20 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* Order History Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-amber-400" />
              <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                COMMISSIONED MATCHDAY KITS ({orders.length})
              </h2>
            </div>
            <Link
              href="/shop"
              className="font-mono text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Explore More Kits</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-zinc-900/20 p-12 text-center">
              <Shield className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Commissions Yet</h3>
              <p className="font-mono text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                You have not placed any matchday jersey commissions yet. Browse the repository to claim your armor.
              </p>
              <Link
                href="/shop"
                className="mt-5 inline-block rounded-xl bg-amber-400 px-5 py-2.5 font-mono text-xs font-bold text-black"
              >
                BROWSE IN-STOCK KITS
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => {
                let items = [];
                try {
                  items = JSON.parse(order.itemsJson);
                } catch {
                  items = [];
                }

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6 transition-all hover:border-amber-500/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-amber-400">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold ${
                              order.paymentStatus === "VERIFIED"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {order.paymentStatus === "VERIFIED" ? "PAYMENT VERIFIED" : "VERIFYING TrxID"}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-zinc-400 mt-0.5">
                          Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.paymentMethod.toUpperCase()} (TrxID: {order.trxId})
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-mono text-[10px] text-zinc-500">TOTAL</div>
                          <div className="font-mono text-base font-bold text-white">
                            ৳{order.total.toLocaleString()} BDT
                          </div>
                        </div>

                        <Link
                          href={`/track?orderNumber=${order.orderNumber}&phone=${order.phone}`}
                          className="flex items-center gap-1 rounded-xl bg-zinc-900 border border-white/10 hover:border-amber-400 px-3 py-2 font-mono text-xs font-bold text-amber-300 transition-colors"
                        >
                          <Truck className="h-3.5 w-3.5" />
                          <span>TRACK</span>
                        </Link>
                      </div>
                    </div>

                    {/* Item list */}
                    <div className="pt-4 flex flex-wrap gap-4">
                      {items.map((item: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-xl border border-white/5 bg-zinc-900/40 px-3 py-2 text-xs font-mono"
                        >
                          <span className="font-bold text-white">{item.name}</span>
                          <span className="text-zinc-500">({item.size})</span>
                          <span className="text-amber-400">Qty: {item.quantity}</span>
                          {item.customName && (
                            <span className="text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              Print: {item.customName} #{item.customNumber}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
