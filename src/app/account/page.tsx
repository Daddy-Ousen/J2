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
  Edit3,
  Save,
  X,
  CreditCard,
  Building,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("Dhaka");
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/auth/login");
        } else {
          setUser(data.user);
          setEditName(data.user.name || "");
          setEditPhone(data.user.phone || "");
          setEditAddress(data.user.address || "");
          setEditCity(data.user.city || "Dhaka");

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          address: editAddress,
          city: editCity,
        }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setSaveSuccess(true);
        setTimeout(() => {
          setIsEditing(false);
          setSaveSuccess(false);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
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
        {/* Profile Header Card */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
                    <Mail className="h-3.5 w-3.5 text-zinc-500" />
                    {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-zinc-500" />
                      {user.phone}
                    </span>
                  )}
                  {user.city && (
                    <span className="flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-zinc-500" />
                      {user.city}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 font-mono text-xs text-zinc-300 hover:text-white hover:border-amber-400/50 transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5 text-amber-400" />
                <span>{isEditing ? "CLOSE EDIT" : "EDIT PROFILE"}</span>
              </button>

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

          {/* Edit Profile Dropdown Panel */}
          {isEditing && (
            <form
              onSubmit={handleSaveProfile}
              className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200"
            >
              <div>
                <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3.5 py-2.5 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                  Phone Number (Mobile)
                </label>
                <input
                  type="tel"
                  placeholder="017XXXXXXXX"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3.5 py-2.5 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                  Default Delivery Address
                </label>
                <textarea
                  rows={2}
                  placeholder="House, Road, Area, Thana..."
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3.5 py-2.5 text-xs font-mono text-white focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between pt-2">
                <div className="text-xs font-mono text-emerald-400">
                  {saveSuccess && "✓ Profile updated successfully!"}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 font-mono text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-5 py-2 font-mono text-xs font-bold text-black hover:bg-amber-300 disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{savingProfile ? "SAVING..." : "SAVE PROFILE"}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
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
                          <span className="rounded-full bg-zinc-800 border border-white/10 px-2 py-0.5 font-mono text-[9px] text-zinc-300 uppercase">
                            {order.orderStatus}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-zinc-400 mt-1">
                          Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.paymentMethod.toUpperCase()} (TrxID: <span className="text-zinc-200 font-bold">{order.trxId}</span>)
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
                          <span>LIVE TRACK</span>
                        </Link>
                      </div>
                    </div>

                    {/* Item list */}
                    <div className="pt-4 flex flex-wrap gap-3">
                      {items.map((item: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-zinc-900/60 px-3.5 py-2 text-xs font-mono"
                        >
                          <span className="font-bold text-white">{item.name}</span>
                          <span className="text-zinc-400">({item.size})</span>
                          <span className="text-amber-400 font-bold">×{item.quantity}</span>
                          {item.customName && (
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                              {item.customName} #{item.customNumber}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Courier info if dispatched */}
                    {order.courierTracking && (
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-xs text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Truck className="h-3.5 w-3.5 text-amber-400" />
                          <span>Courier: <strong className="text-white">{order.courierPartner || "Steadfast"}</strong> (Consignment: <strong className="text-amber-300">{order.courierTracking}</strong>)</span>
                        </div>
                      </div>
                    )}
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
