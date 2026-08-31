"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/ui/Navbar";
import {
  ShieldCheck,
  Package,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Search,
  CheckCircle2,
  XCircle,
  Truck,
  Edit,
  Save,
  Lock,
  RefreshCw,
  Sliders,
  Settings,
  Flame,
  ArrowUpRight,
  ExternalLink,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Eye,
  Layers,
  Check,
  Upload,
  UploadCloud,
  Camera,
} from "lucide-react";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Admin login form state
  const [email, setEmail] = useState("admin@jerseyverse.com");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "inventory" | "settings">("overview");
  const [metrics, setMetrics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loadingData, setLoadingData] = useState(false);

  // Filters
  const [orderSearch, setOrderSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Full Product Edit Modal State
  const [editingProductModal, setEditingProductModal] = useState<any | null>(null);
  const [editProductForm, setEditProductForm] = useState<any>({});
  const [savingFullProduct, setSavingFullProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Quick Price / Stock edit in table
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<any>({});
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // New Kit Creation State
  const [isCreatingKit, setIsCreatingKit] = useState(false);
  const [inventorySearch, setInventorySearch] = useState("");
  const [newKitForm, setNewKitForm] = useState({
    code: "",
    name: "",
    subtitle: "Official Matchday Kit",
    price: 1200,
    originalPrice: 1500,
    league: "Premier League",
    club: "",
    image: "/jerseys_3d/atletico_volt.jpg",
    sleeve: "Half sleeve",
    dominantColor: "#0d0f14",
    accentColor: "#f59e0b",
    weightGsm: 240,
    fabric: "Aero-Fit Engineered Knit",
    badgeType: "3D Heat-pressed liquid silicone crest",
    stockS: 10,
    stockM: 15,
    stockL: 20,
    stockXL: 10,
    stockXXL: 5,
    isFeatured: false,
    inStock: true,
    story: "Official matchday edition armor with bonded aerodynamic seams and moisture-wicking weave.",
  });
  const [creatingKitLoading, setCreatingKitLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setAuthLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user && data.user.role === "ADMIN") {
        setUser(data.user);
        loadDashboardData();
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      if (data.user.role !== "ADMIN") {
        throw new Error("This account does not have Admin access.");
      }

      setUser(data.user);
      loadDashboardData();
    } catch (err: any) {
      setLoginError(err.message || "Failed to log in as admin");
    }
  };

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      // 1. Metrics
      const mRes = await fetch("/api/admin/metrics");
      const mData = await mRes.json();
      if (mData.metrics) setMetrics(mData.metrics);

      // 2. Orders
      const oRes = await fetch("/api/admin/orders");
      const oData = await oRes.json();
      if (oData.orders) setOrders(oData.orders);

      // 3. Products
      const pRes = await fetch("/api/products");
      const pData = await pRes.json();
      if (pData.products) setProducts(pData.products);

      // 4. Settings
      const sRes = await fetch("/api/admin/settings");
      const sData = await sRes.json();
      if (sData.settings) setSettings(sData.settings);
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    paymentStatus?: string,
    orderStatus?: string,
    courierPartner?: string,
    consignmentId?: string
  ) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          ...(paymentStatus && { paymentStatus }),
          ...(orderStatus && { orderStatus }),
          ...(courierPartner !== undefined && { courierPartner }),
          ...(consignmentId !== undefined && { consignmentId }),
        }),
      });

      if (res.ok) {
        loadDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (file: File, target: "edit" | "new") => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload photo");
      }

      if (target === "edit") {
        setEditProductForm((prev: any) => ({ ...prev, image: data.url }));
      } else {
        setNewKitForm((prev: any) => ({ ...prev, image: data.url }));
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err.message || "Failed to upload photo. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenFullEdit = (p: any) => {
    setEditingProductModal(p);
    setEditProductForm({
      id: p.id,
      name: p.name || "",
      code: p.code || "",
      slug: p.slug || "",
      subtitle: p.subtitle || "",
      price: p.price ?? 0,
      originalPrice: p.originalPrice ?? "",
      league: p.league || "Premier League",
      club: p.club || "",
      image: p.image || "/jerseys_3d/atletico_volt.jpg",
      sleeve: p.sleeve || "Half sleeve",
      story: p.story || "",
      fabric: p.fabric || "",
      badgeType: p.badgeType || "",
      weightGsm: p.weightGsm ?? 240,
      dominantColor: p.dominantColor || "#0d0f14",
      accentColor: p.accentColor || "#f59e0b",
      stockS: p.stockS ?? 0,
      stockM: p.stockM ?? 0,
      stockL: p.stockL ?? 0,
      stockXL: p.stockXL ?? 0,
      stockXXL: p.stockXXL ?? 0,
      isFeatured: Boolean(p.isFeatured),
      inStock: Boolean(p.inStock ?? true),
    });
  };

  const handleCloseFullEdit = () => {
    setEditingProductModal(null);
    setEditProductForm({});
  };

  const handleSaveFullEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductModal) return;
    setSavingFullProduct(true);
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProductForm),
      });
      const data = await res.json();
      if (res.ok) {
        setEditingProductModal(null);
        loadDashboardData();
      } else {
        alert(data.error || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving product changes");
    } finally {
      setSavingFullProduct(false);
    }
  };

  const handleDeleteProduct = async (pId: string, pName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${pName}" from the store inventory? This cannot be undone.`)) {
      return;
    }
    setDeletingProductId(pId);
    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(pId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        if (editingProductModal?.id === pId) {
          setEditingProductModal(null);
        }
        loadDashboardData();
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleQuickToggleFeatured = async (p: any) => {
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: p.id,
          isFeatured: !p.isFeatured,
        }),
      });
      if (res.ok) {
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickToggleInStock = async (p: any) => {
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: p.id,
          inStock: !p.inStock,
        }),
      });
      if (res.ok) {
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProductEdit = async (pId: string) => {
    setSavingProduct(true);
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: pId,
          price: productForm.price,
          stockS: productForm.stockS,
          stockM: productForm.stockM,
          stockL: productForm.stockL,
          stockXL: productForm.stockXL,
          stockXXL: productForm.stockXXL,
          isFeatured: productForm.isFeatured,
          inStock: productForm.inStock,
        }),
      });

      if (res.ok) {
        setEditingProductId(null);
        loadDashboardData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCreateKit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingKitLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKitForm),
      });
      if (res.ok) {
        setIsCreatingKit(false);
        setNewKitForm({
          code: "",
          name: "",
          subtitle: "Official Matchday Kit",
          price: 1200,
          originalPrice: 1500,
          league: "Premier League",
          club: "",
          image: "/jerseys_3d/atletico_volt.jpg",
          dominantColor: "#0d0f14",
          accentColor: "#f59e0b",
          weightGsm: 240,
          fabric: "Aero-Fit Engineered Knit",
          badgeType: "3D Heat-pressed liquid silicone crest",
          stockS: 10,
          stockM: 15,
          stockL: 20,
          stockXL: 10,
          stockXXL: 5,
          isFeatured: false,
          inStock: true,
          story: "Official matchday edition armor with bonded aerodynamic seams and moisture-wicking weave.",
        });
        loadDashboardData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingKitLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
        Verifying admin authorization...
      </div>
    );
  }

  // Admin Login Screen if not logged in as Admin
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-400 selection:text-black">
        <Navbar />

        <main className="max-w-md mx-auto px-4 pt-36 pb-24">
          <div className="rounded-3xl border border-amber-500/30 bg-zinc-950 p-8 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/15 text-amber-400">
                <Lock className="h-6 w-6" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                Admin <span className="text-amber-400">Control Panel</span>
              </h1>
              <p className="font-mono text-xs text-zinc-400 mt-1">
                Authorized command desk for Jersey verse inventory, pricing & payments.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-400 text-xs font-mono">
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123456"
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-amber-400 py-3 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              >
                ACCESS ADMIN DESK
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-white/5 text-center font-mono text-[10px] text-zinc-500">
              Default credentials: <span className="text-zinc-400">admin@jerseyverse.com / admin123456</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (paymentFilter !== "ALL" && o.paymentStatus !== paymentFilter) return false;
    if (statusFilter !== "ALL" && o.orderStatus !== statusFilter) return false;
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.trxId.toLowerCase().includes(q) ||
        o.senderNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-400 selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 font-mono text-[9px] font-bold text-amber-300">
                MASTER ADMIN MODE
              </span>
              <span className="font-mono text-xs text-zinc-400">Logged in as {user.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
              Command & Inventory Desk
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-zinc-950 border border-white/10 p-1 rounded-2xl">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "orders", label: `Orders (${orders.length})`, icon: Package },
              { id: "inventory", label: `Pricing & Stock (${products.length})`, icon: Sliders },
              { id: "settings", label: "Payment Numbers", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-mono text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: OVERVIEW & METRICS */}
        {/* ============================================================ */}
        {activeTab === "overview" && metrics && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">
                  TOTAL VERIFIED REVENUE
                </span>
                <div className="font-mono text-2xl font-black text-amber-400 mt-1">
                  ৳{metrics.totalRevenue?.toLocaleString()} BDT
                </div>
                <div className="font-mono text-[10px] text-emerald-400 mt-1">
                  Verified Upfront Payments
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">
                  TOTAL COMMISSIONS
                </span>
                <div className="font-mono text-2xl font-black text-white mt-1">
                  {metrics.totalOrders}
                </div>
                <div className="font-mono text-[10px] text-zinc-400 mt-1">
                  All-time customer orders
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
                <span className="font-mono text-[10px] text-amber-400 uppercase font-bold">
                  PENDING TrxID VERIFICATIONS
                </span>
                <div className="font-mono text-2xl font-black text-amber-300 mt-1">
                  {metrics.pendingVerification}
                </div>
                <button
                  onClick={() => {
                    setPaymentFilter("PENDING_VERIFICATION");
                    setActiveTab("orders");
                  }}
                  className="font-mono text-[10px] text-amber-400 underline mt-1 block"
                >
                  Review now & approve
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">
                  ACTIVE INVENTORY
                </span>
                <div className="font-mono text-2xl font-black text-white mt-1">
                  {products.length}
                </div>
                <div className="font-mono text-[10px] text-zinc-400 mt-1">
                  Matchday kits in stock
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  RECENT INCOMING COMMISSIONS
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="font-mono text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>View All Orders</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] text-zinc-500">
                      <th className="pb-3">ORDER ID</th>
                      <th className="pb-3">CUSTOMER</th>
                      <th className="pb-3">CHANNEL</th>
                      <th className="pb-3">TrxID</th>
                      <th className="pb-3">AMOUNT</th>
                      <th className="pb-3">PAYMENT</th>
                      <th className="pb-3">FULFILLMENT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-300">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 font-bold text-amber-400">{o.orderNumber}</td>
                        <td className="py-3">
                          <div>{o.customerName}</div>
                          <div className="text-[10px] text-zinc-500">{o.phone}</div>
                        </td>
                        <td className="py-3 uppercase font-bold text-amber-300">{o.paymentMethod}</td>
                        <td className="py-3 font-mono font-bold text-white">{o.trxId}</td>
                        <td className="py-3 font-bold">৳{o.total.toLocaleString()}</td>
                        <td className="py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                              o.paymentStatus === "VERIFIED"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-[10px] text-zinc-400 uppercase font-bold">
                            {o.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: ORDERS & TrxID VERIFICATION DESK */}
        {/* ============================================================ */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Search & Filter Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-4">
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by Order ID, Phone, TrxID..."
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/80 pl-9 pr-3 py-2 font-mono text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-300 focus:border-amber-400 focus:outline-none"
                >
                  <option value="ALL">All Payments</option>
                  <option value="PENDING_VERIFICATION">Awaiting TrxID Verification</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="FAILED">Failed / Rejected</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-300 focus:border-amber-400 focus:outline-none"
                >
                  <option value="ALL">All Stages</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PRINTING">Custom Printing</option>
                  <option value="DISPATCHED">Dispatched</option>
                  <option value="DELIVERED">Delivered</option>
                </select>

                <button
                  onClick={loadDashboardData}
                  className="flex items-center gap-1 rounded-xl bg-zinc-900 border border-white/10 px-3 py-2 font-mono text-xs text-zinc-300 hover:text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={() => {
                    const headers = [
                      "Order Number",
                      "Customer Name",
                      "Phone Number",
                      "Address",
                      "Zone",
                      "Total Amount (BDT)",
                      "Payment Method",
                      "Sender Mobile",
                      "Transaction ID (TrxID)",
                      "Payment Status",
                      "Order Status",
                      "Courier Consignment",
                      "Created At",
                    ];
                    const rows = filteredOrders.map((o) => [
                      `"${o.orderNumber}"`,
                      `"${o.customerName}"`,
                      `"${o.phone}"`,
                      `"${(o.address || '').replace(/"/g, '""')}"`,
                      `"${o.zone}"`,
                      o.total,
                      `"${o.paymentMethod}"`,
                      `"${o.senderNumber}"`,
                      `"${o.trxId}"`,
                      `"${o.paymentStatus}"`,
                      `"${o.orderStatus}"`,
                      `"${o.consignmentId || ''}"`,
                      `"${new Date(o.createdAt).toISOString()}"`,
                    ]);
                    const csvContent =
                      "data:text/csv;charset=utf-8," +
                      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `jerseyverse_orders_${Date.now()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-colors flex-shrink-0"
                >
                  <span>📥 EXPORT CSV</span>
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-zinc-900/20 p-12 text-center font-mono text-xs text-zinc-500">
                  No orders found matching current filters.
                </div>
              ) : (
                filteredOrders.map((order) => {
                  let items = [];
                  try {
                    items = JSON.parse(order.itemsJson);
                  } catch {
                    items = [];
                  }

                  return (
                    <div
                      key={order.id}
                      className="rounded-3xl border border-white/10 bg-zinc-950 p-6 space-y-4 shadow-xl"
                    >
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-lg font-bold text-amber-400">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold ${
                                order.paymentStatus === "VERIFIED"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </div>
                          <div className="font-mono text-xs text-zinc-400 mt-0.5">
                            Customer: <strong className="text-white">{order.customerName}</strong> • Phone:{" "}
                            <strong className="text-white">{order.phone}</strong> • Zone:{" "}
                            <span className="text-amber-400">
                              {order.zone === "inside_dhaka" ? "Inside Dhaka (৳80)" : "Outside Dhaka (৳130)"}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono text-[10px] text-zinc-500">ORDER TOTAL</div>
                          <div className="font-mono text-xl font-bold text-amber-400">
                            ৳{order.total.toLocaleString()} BDT
                          </div>
                        </div>
                      </div>

                      {/* Payment Verification Box */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl border border-amber-500/20 bg-zinc-900/40 p-4">
                        <div>
                          <div className="font-mono text-[9px] text-zinc-500 uppercase">
                            PAYMENT CHANNEL
                          </div>
                          <div className="font-mono text-xs font-bold text-white uppercase mt-0.5">
                            {order.paymentMethod}
                          </div>
                        </div>

                        <div>
                          <div className="font-mono text-[9px] text-zinc-500 uppercase">
                            SENDER MOBILE NUMBER
                          </div>
                          <div className="font-mono text-xs font-bold text-amber-300 mt-0.5">
                            {order.senderNumber}
                          </div>
                        </div>

                        <div>
                          <div className="font-mono text-[9px] text-zinc-500 uppercase">
                            TRANSACTION ID (TrxID)
                          </div>
                          <div className="font-mono text-xs font-bold text-emerald-400 tracking-wider mt-0.5">
                            {order.trxId}
                          </div>
                        </div>
                      </div>

                      {/* Items Ordered List */}
                      <div className="rounded-xl border border-white/5 bg-zinc-900/20 p-3 space-y-2">
                        <div className="font-mono text-[10px] text-zinc-500 uppercase">
                          ITEMS COMMISSIONED ({items.length})
                        </div>
                        <div className="divide-y divide-white/5">
                          {items.map((it: any, i: number) => (
                            <div key={i} className="py-2 flex items-center justify-between font-mono text-xs">
                              <div>
                                <span className="font-bold text-white">{it.name}</span>
                                <span className="text-zinc-500 ml-2">Size: {it.size}</span>
                                {it.customName && (
                                  <span className="ml-2 rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[9px] text-amber-300 font-bold">
                                    Print: {it.customName} #{it.customNumber} (+৳200)
                                  </span>
                                )}
                              </div>
                              <span className="text-amber-400">Qty: {it.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Admin Actions Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5 pt-4">
                        {/* One-click Verify Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, "VERIFIED", "CONFIRMED")
                            }
                            className="flex items-center gap-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 px-3 py-1.5 font-mono text-xs font-bold text-emerald-300 transition-colors"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>APPROVE PAYMENT</span>
                          </button>

                          <button
                            onClick={async () => {
                              if (!confirm(`Book Order ${order.orderNumber} directly with Steadfast Courier and send Dispatch SMS?`)) return;
                              try {
                                const res = await fetch("/api/admin/orders", {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    id: order.id,
                                    action: "book_steadfast",
                                  }),
                                });
                                const data = await res.json();
                                if (data.success) {
                                  alert(`⚡ Steadfast Consignment Generated: ${data.order.consignmentId}\nSMS Dispatched to ${data.order.phone}`);
                                  loadDashboardData();
                                } else {
                                  alert(data.error || "Failed to book with Steadfast");
                                }
                              } catch (e) {
                                alert("Failed to connect to Steadfast dispatch service");
                              }
                            }}
                            className="flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 px-3 py-1.5 font-mono text-xs font-bold text-black transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                          >
                            <span>⚡ BOOK WITH STEADFAST</span>
                          </button>

                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, "FAILED", "CANCELLED")
                            }
                            className="flex items-center gap-1 rounded-xl bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 px-3 py-1.5 font-mono text-xs font-bold text-red-300 transition-colors"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>REJECT TrxID</span>
                          </button>
                        </div>

                        {/* Status update & Courier consignment */}
                        <div className="flex items-center gap-2">
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, undefined, e.target.value)
                            }
                            className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PRINTING">Custom Printing</option>
                            <option value="DISPATCHED">Dispatched</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>

                          <button
                            onClick={() => {
                              const tracking = prompt(
                                "Enter Courier Consignment ID (e.g. STEADFAST-98421):",
                                order.consignmentId || ""
                              );
                              if (tracking !== null) {
                                handleUpdateOrderStatus(
                                  order.id,
                                  undefined,
                                  "DISPATCHED",
                                  "Steadfast Courier",
                                  tracking
                                );
                              }
                            }}
                            className="flex items-center gap-1 rounded-xl bg-zinc-900 border border-white/10 hover:border-amber-400 px-3 py-1.5 font-mono text-xs text-zinc-300 transition-colors"
                          >
                            <Truck className="h-3.5 w-3.5" />
                            <span>
                              {order.consignmentId ? `Tracking: ${order.consignmentId}` : "Assign Courier"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: PRICING & INVENTORY LIVE EDITOR */}
        {/* ============================================================ */}
        {activeTab === "inventory" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-mono text-sm font-bold text-white uppercase">
                  MATCHDAY KIT INVENTORY & PRODUCT MANAGEMENT
                </h3>
                <p className="font-mono text-xs text-zinc-400 mt-0.5">
                  Full control over kit titles, 3D photos, descriptions, technical specs, pricing, and live inventory.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search kit, club, or serial..."
                    className="w-48 sm:w-64 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 pl-8 font-mono text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                </div>

                <button
                  onClick={() => setIsCreatingKit(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-colors flex-shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>+ ADD NEW KIT</span>
                </button>
              </div>
            </div>

            {/* ============================================================ */}
            {/* FULL PRODUCT EDIT MODAL */}
            {/* ============================================================ */}
            {editingProductModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
                <div className="w-full max-w-4xl rounded-3xl border border-amber-500/50 bg-zinc-950 p-6 sm:p-8 shadow-[0_0_100px_rgba(245,158,11,0.25)] my-8 max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-amber-500/20 text-amber-300 px-2 py-0.5 font-mono text-[10px] font-bold">
                          EDITING PRODUCT
                        </span>
                        <span className="font-mono text-xs text-zinc-400">
                          ID: {editingProductModal.id}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {editProductForm.name || "Edit Kit Information"}
                      </h3>
                    </div>

                    <button
                      onClick={handleCloseFullEdit}
                      className="rounded-xl p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <XCircle className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Edit Form */}
                  <form onSubmit={handleSaveFullEdit} className="space-y-6 font-mono text-xs">
                    {/* Top Grid: Photo Upload & Preview + Identity */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Photo Upload & Preview Box */}
                      <div className="md:col-span-1 space-y-3">
                        <label className="block text-[10px] uppercase text-amber-400 font-bold">
                          Product Photo / 3D Render
                        </label>
                        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/15 bg-zinc-900 shadow-inner flex items-center justify-center group">
                          {editProductForm.image ? (
                            <Image
                              src={editProductForm.image}
                              alt={editProductForm.name || "Preview"}
                              fill
                              className="object-cover object-center filter contrast-[1.05]"
                            />
                          ) : (
                            <div className="text-zinc-600 text-center p-4">
                              <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                              <span>No image set</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/20 pointer-events-none" />
                          <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-black/75 px-2 py-1 text-[10px] text-zinc-300 backdrop-blur-md truncate">
                            {editProductForm.image || "No path"}
                          </div>

                          {/* Quick Change Overlay on hover */}
                          <label className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 cursor-pointer transition-opacity text-white">
                            <UploadCloud className="h-8 w-8 text-amber-400 animate-bounce" />
                            <span className="font-mono text-xs font-bold">CHANGE PHOTO</span>
                            <span className="text-[9px] text-zinc-400">JPG, PNG, WEBP, AVIF</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingImage}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, "edit");
                              }}
                              className="hidden"
                            />
                          </label>

                          {uploadingImage && (
                            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-2 text-amber-400 font-mono text-xs z-10">
                              <RefreshCw className="h-6 w-6 animate-spin" />
                              <span>UPLOADING PHOTO...</span>
                            </div>
                          )}
                        </div>

                        {/* Direct Upload Button */}
                        <div>
                          <label className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 py-2.5 px-3 text-amber-300 font-mono text-xs font-bold cursor-pointer transition-colors w-full text-center">
                            <Upload className="h-4 w-4" />
                            <span>{uploadingImage ? "UPLOADING..." : "UPLOAD NEW PHOTO"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingImage}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, "edit");
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                            Direct Image Path or URL
                          </label>
                          <input
                            type="text"
                            required
                            value={editProductForm.image || ""}
                            onChange={(e) =>
                              setEditProductForm({ ...editProductForm, image: e.target.value })
                            }
                            placeholder="/jerseys_3d/... or /uploads/... or https://..."
                            className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none text-xs"
                          />
                        </div>
                      </div>

                      {/* General Identity & Pricing Box */}
                      <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                              Kit Title / Display Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={editProductForm.name || ""}
                              onChange={(e) =>
                                setEditProductForm({ ...editProductForm, name: e.target.value })
                              }
                              placeholder="e.g. FC Barcelona 24/25 Blaugrana Matchday"
                              className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2.5 text-white font-bold focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                              Unique Serial Code *
                            </label>
                            <input
                              type="text"
                              required
                              value={editProductForm.code || ""}
                              onChange={(e) =>
                                setEditProductForm({
                                  ...editProductForm,
                                  code: e.target.value.toUpperCase(),
                                })
                              }
                              placeholder="e.g. JV-FCB/BLAU"
                              className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                              Subtitle / Edition Weave
                            </label>
                            <input
                              type="text"
                              value={editProductForm.subtitle || ""}
                              onChange={(e) =>
                                setEditProductForm({
                                  ...editProductForm,
                                  subtitle: e.target.value,
                                })
                              }
                              placeholder="e.g. Spotify Sunburst Matchday Aero-Fit"
                              className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                              Club / Team Name
                            </label>
                            <input
                              type="text"
                              value={editProductForm.club || ""}
                              onChange={(e) =>
                                setEditProductForm({ ...editProductForm, club: e.target.value })
                              }
                              placeholder="e.g. FC Barcelona"
                              className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                              League / Category
                            </label>
                            <select
                              value={editProductForm.league || "Premier League"}
                              onChange={(e) =>
                                setEditProductForm({
                                  ...editProductForm,
                                  league: e.target.value,
                                })
                              }
                              className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                            >
                              <option value="Premier League">Premier League</option>
                              <option value="La Liga">La Liga</option>
                              <option value="Serie A">Serie A</option>
                              <option value="Bundesliga">Bundesliga</option>
                              <option value="Saudi Pro League">Saudi Pro League</option>
                              <option value="International">International</option>
                              <option value="Retro">Retro Vault</option>
                            </select>
                          </div>

                          {/* Sleeve Field Selection */}
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] uppercase text-amber-400 font-bold mb-1.5">
                              Sleeve Cut / Edition *
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { id: "Half sleeve", label: "Half sleeve (Standard)" },
                                { id: "Full sleeve", label: "Full sleeve (Long Sleeve)" },
                              ].map((sl) => (
                                <button
                                  key={sl.id}
                                  type="button"
                                  onClick={() =>
                                    setEditProductForm({ ...editProductForm, sleeve: sl.id })
                                  }
                                  className={`py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                                    (editProductForm.sleeve || "Half sleeve") === sl.id
                                      ? "border-amber-400 bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                                      : "border-white/10 bg-zinc-900 text-zinc-400 hover:border-white/20 hover:text-white"
                                  }`}
                                >
                                  <span>{sl.label}</span>
                                  {(editProductForm.sleeve || "Half sleeve") === sl.id && (
                                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                              Price in BDT (৳) *
                            </label>
                            <input
                              type="number"
                              required
                              value={editProductForm.price ?? ""}
                              onChange={(e) =>
                                setEditProductForm({
                                  ...editProductForm,
                                  price: Number(e.target.value),
                                })
                              }
                              className="w-full rounded-xl border border-amber-400 bg-zinc-900 px-3 py-2 font-bold text-amber-300 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                              Original MRP Price (৳) (Optional)
                            </label>
                            <input
                              type="number"
                              value={editProductForm.originalPrice ?? ""}
                              onChange={(e) =>
                                setEditProductForm({
                                  ...editProductForm,
                                  originalPrice: e.target.value ? Number(e.target.value) : null,
                                })
                              }
                              placeholder="e.g. 1500"
                              className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-zinc-300 focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                              Fabric Weight (GSM)
                            </label>
                            <input
                              type="number"
                              value={editProductForm.weightGsm ?? 240}
                              onChange={(e) =>
                                setEditProductForm({
                                  ...editProductForm,
                                  weightGsm: Number(e.target.value),
                                })
                              }
                              placeholder="240"
                              className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                              Product URL Slug
                            </label>
                            <input
                              type="text"
                              value={editProductForm.slug || ""}
                              onChange={(e) =>
                                setEditProductForm({
                                  ...editProductForm,
                                  slug: e.target.value,
                                })
                              }
                              placeholder="e.g. fcb-blaugrana-2425"
                              className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-zinc-400 focus:border-amber-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Status Toggles */}
                        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/10">
                          <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-white/10 bg-zinc-900/60 px-3.5 py-2 hover:border-white/20">
                            <input
                              type="checkbox"
                              checked={Boolean(editProductForm.inStock)}
                              onChange={(e) =>
                                setEditProductForm({
                                  ...editProductForm,
                                  inStock: e.target.checked,
                                })
                              }
                              className="rounded border-white/20 text-emerald-500 focus:ring-emerald-400 h-4 w-4"
                            />
                            <span className={editProductForm.inStock ? "text-emerald-400 font-bold" : "text-zinc-400"}>
                              {editProductForm.inStock ? "● IN STOCK & ACTIVE" : "○ MARK AS SOLD OUT"}
                            </span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-white/10 bg-zinc-900/60 px-3.5 py-2 hover:border-white/20">
                            <input
                              type="checkbox"
                              checked={Boolean(editProductForm.isFeatured)}
                              onChange={(e) =>
                                setEditProductForm({
                                  ...editProductForm,
                                  isFeatured: e.target.checked,
                                })
                              }
                              className="rounded border-white/20 text-amber-500 focus:ring-amber-400 h-4 w-4"
                            />
                            <span className={editProductForm.isFeatured ? "text-amber-400 font-bold" : "text-zinc-400"}>
                              ★ FEATURED ON STOREFRONT
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Middle Section: Technical Specs & Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                          Product Description / Heritage Story *
                        </label>
                        <textarea
                          rows={3}
                          value={editProductForm.story || ""}
                          onChange={(e) =>
                            setEditProductForm({ ...editProductForm, story: e.target.value })
                          }
                          placeholder="Write the full matchday story and heritage description of the kit..."
                          className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                          Fabric Specification
                        </label>
                        <input
                          type="text"
                          value={editProductForm.fabric || ""}
                          onChange={(e) =>
                            setEditProductForm({ ...editProductForm, fabric: e.target.value })
                          }
                          placeholder="e.g. Aero-Fit Engineered Knit"
                          className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                          Badge & Crest Construction
                        </label>
                        <input
                          type="text"
                          value={editProductForm.badgeType || ""}
                          onChange={(e) =>
                            setEditProductForm({ ...editProductForm, badgeType: e.target.value })
                          }
                          placeholder="e.g. 3D Heat-pressed liquid silicone crest"
                          className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Stock Counts Grid */}
                    <div className="border-t border-white/10 pt-4">
                      <label className="block text-[10px] uppercase text-zinc-400 mb-2">
                        Stock Quantities by Size
                      </label>
                      <div className="grid grid-cols-5 gap-3">
                        {["stockS", "stockM", "stockL", "stockXL", "stockXXL"].map((key) => (
                          <div key={key} className="rounded-xl border border-white/10 bg-zinc-900 p-2 text-center">
                            <span className="block text-[10px] font-bold text-amber-400 uppercase mb-1">
                              Size {key.replace("stock", "")}
                            </span>
                            <input
                              type="number"
                              value={editProductForm[key] ?? 0}
                              onChange={(e) =>
                                setEditProductForm({
                                  ...editProductForm,
                                  [key]: Number(e.target.value),
                                })
                              }
                              className="w-full text-center rounded-lg border border-white/20 bg-zinc-950 py-1.5 text-white font-bold focus:border-amber-400 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Modal Actions Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-5">
                      <button
                        type="button"
                        disabled={deletingProductId === editingProductModal.id}
                        onClick={() => handleDeleteProduct(editingProductModal.id, editProductForm.name || "this kit")}
                        className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-4 py-2.5 text-red-300 font-bold transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>{deletingProductId === editingProductModal.id ? "DELETING..." : "DELETE PRODUCT"}</span>
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleCloseFullEdit}
                          className="px-5 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          disabled={savingFullProduct}
                          className="flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-2.5 font-bold text-black hover:bg-amber-300 transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50"
                        >
                          <Save className="h-4 w-4" />
                          <span>{savingFullProduct ? "SAVING CHANGES..." : "SAVE PRODUCT INFORMATION"}</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* MODAL FOR CREATING NEW KIT */}
            {/* ============================================================ */}
            {isCreatingKit && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
                <div className="w-full max-w-3xl rounded-3xl border border-amber-500/40 bg-zinc-950 p-6 sm:p-8 shadow-[0_0_80px_rgba(245,158,11,0.2)] my-8 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <h3 className="font-mono text-sm font-bold text-white uppercase">
                      ADD NEW MATCHDAY KIT TO REPOSITORY
                    </h3>
                    <button
                      onClick={() => setIsCreatingKit(false)}
                      className="rounded-lg p-1 text-zinc-400 hover:text-white"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateKit} className="space-y-4 font-mono text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                          Kit Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={newKitForm.name}
                          onChange={(e) =>
                            setNewKitForm({ ...newKitForm, name: e.target.value })
                          }
                          placeholder="e.g. Real Madrid 24/25 Home Classic White"
                          className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                          Unique Serial Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={newKitForm.code}
                          onChange={(e) =>
                            setNewKitForm({ ...newKitForm, code: e.target.value.toUpperCase() })
                          }
                          placeholder="e.g. JV-RMA/HOME25"
                          className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                          Subtitle / Edition
                        </label>
                        <input
                          type="text"
                          value={newKitForm.subtitle}
                          onChange={(e) =>
                            setNewKitForm({ ...newKitForm, subtitle: e.target.value })
                          }
                          placeholder="e.g. Official Matchday Armor"
                          className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                          League / Category
                        </label>
                        <select
                          value={newKitForm.league}
                          onChange={(e) =>
                            setNewKitForm({ ...newKitForm, league: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                        >
                          <option value="Premier League">Premier League</option>
                          <option value="La Liga">La Liga</option>
                          <option value="Serie A">Serie A</option>
                          <option value="Bundesliga">Bundesliga</option>
                          <option value="Saudi Pro League">Saudi Pro League</option>
                          <option value="International">International</option>
                          <option value="Retro">Retro Vault</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                          Club / Team Name
                        </label>
                        <input
                          type="text"
                          value={newKitForm.club}
                          onChange={(e) =>
                            setNewKitForm({ ...newKitForm, club: e.target.value })
                          }
                          placeholder="e.g. Real Madrid"
                          className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                          Price in BDT (৳) *
                        </label>
                        <input
                          type="number"
                          required
                          value={newKitForm.price}
                          onChange={(e) =>
                            setNewKitForm({ ...newKitForm, price: Number(e.target.value) })
                          }
                          className="w-full rounded-xl border border-amber-400 bg-zinc-900 px-3 py-2 text-amber-300 font-bold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                          Original MRP (৳) (Optional)
                        </label>
                        <input
                          type="number"
                          value={newKitForm.originalPrice}
                          onChange={(e) =>
                            setNewKitForm({ ...newKitForm, originalPrice: Number(e.target.value) })
                          }
                          className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      {/* Sleeve Selection in Add Kit Modal */}
                      <div>
                        <label className="block text-[10px] uppercase text-amber-400 font-bold mb-1">
                          Sleeve Type *
                        </label>
                        <select
                          value={newKitForm.sleeve}
                          onChange={(e) =>
                            setNewKitForm({ ...newKitForm, sleeve: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                        >
                          <option value="Half sleeve">Half sleeve (Standard)</option>
                          <option value="Full sleeve">Full sleeve (Long Sleeve)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 space-y-2">
                        <label className="block text-[10px] uppercase text-zinc-400">
                          Kit Image Photo / Render *
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                          <div className="relative h-16 w-14 rounded-xl overflow-hidden bg-zinc-900 border border-white/15 flex-shrink-0 flex items-center justify-center">
                            {newKitForm.image ? (
                              <Image src={newKitForm.image} alt="Preview" fill className="object-cover" />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-zinc-600" />
                            )}
                          </div>

                          <label className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 py-2.5 px-4 text-amber-300 font-mono text-xs font-bold cursor-pointer transition-colors flex-shrink-0">
                            <Upload className="h-4 w-4" />
                            <span>{uploadingImage ? "UPLOADING..." : "UPLOAD PHOTO FROM DEVICE"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingImage}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, "new");
                              }}
                              className="hidden"
                            />
                          </label>

                          <input
                            type="text"
                            value={newKitForm.image}
                            onChange={(e) =>
                              setNewKitForm({ ...newKitForm, image: e.target.value })
                            }
                            placeholder="/jerseys_3d/... or /uploads/..."
                            className="flex-1 rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                          Description / Story
                        </label>
                        <textarea
                          rows={2}
                          value={newKitForm.story}
                          onChange={(e) =>
                            setNewKitForm({ ...newKitForm, story: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Stock Counts Grid */}
                    <div className="pt-2">
                      <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                        Initial Stock Per Size (S / M / L / XL / XXL)
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {["stockS", "stockM", "stockL", "stockXL", "stockXXL"].map((key) => (
                          <div key={key}>
                            <span className="block text-center text-[10px] text-zinc-500 uppercase">
                              {key.replace("stock", "")}
                            </span>
                            <input
                              type="number"
                              value={(newKitForm as any)[key]}
                              onChange={(e) =>
                                setNewKitForm({
                                  ...newKitForm,
                                  [key]: Number(e.target.value),
                                })
                              }
                              className="w-full text-center rounded-lg border border-white/15 bg-zinc-900 py-1.5 text-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setIsCreatingKit(false)}
                        className="px-4 py-2 text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={creatingKitLoading}
                        className="rounded-xl bg-amber-400 px-6 py-2.5 font-bold text-black hover:bg-amber-300 disabled:opacity-50 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                      >
                        {creatingKitLoading ? "CREATING..." : "PUBLISH KIT TO STORE"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Product List */}
            <div className="space-y-4">
              {products
                .filter(
                  (p) =>
                    !inventorySearch ||
                    p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                    p.code.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                    p.club.toLowerCase().includes(inventorySearch.toLowerCase())
                )
                .map((p) => {
                  const isEditing = editingProductId === p.id;

                  return (
                    <div
                      key={p.id}
                      className={`rounded-2xl border bg-zinc-950 p-5 transition-all ${
                        isEditing ? "border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.15)]" : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Product identity */}
                        <div className="flex items-center gap-4">
                          <div className="relative h-20 w-16 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 flex-shrink-0 shadow-md">
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-[10px] text-amber-400 font-bold">{p.code}</span>
                              <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[9px] text-zinc-400">
                                {p.league}
                              </span>
                              <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[9px] text-amber-300/90 font-bold">
                                {p.sleeve || "Half sleeve"}
                              </span>
                              {p.isFeatured && (
                                <span className="rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono px-1.5 py-0.5 font-bold flex items-center gap-1">
                                  ★ FEATURED
                                </span>
                              )}
                              <span
                                className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold ${
                                  p.inStock ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {p.inStock ? "IN STOCK" : "OUT OF STOCK"}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-white mt-1">{p.name}</h4>
                            <p className="font-mono text-[11px] text-zinc-400 line-clamp-1">{p.subtitle}</p>
                            {p.story && (
                              <p className="font-sans text-[11px] text-zinc-500 line-clamp-1 mt-0.5 max-w-xl">
                                {p.story}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Stock & Price Controls & Edit Actions */}
                        {isEditing ? (
                          <div className="flex flex-wrap items-center gap-3">
                            {/* Price input */}
                            <div>
                              <label className="block font-mono text-[9px] text-zinc-400 uppercase">
                                Price (BDT)
                              </label>
                              <input
                                type="number"
                                value={productForm.price}
                                onChange={(e) =>
                                  setProductForm({ ...productForm, price: e.target.value })
                                }
                                className="w-24 rounded-lg border border-amber-400 bg-zinc-900 px-2 py-1 font-mono text-xs font-bold text-amber-300"
                              />
                            </div>

                            {/* Stocks */}
                            {["S", "M", "L", "XL", "XXL"].map((size) => (
                              <div key={size}>
                                <label className="block font-mono text-[9px] text-zinc-400 uppercase">
                                  {size}
                                </label>
                                <input
                                  type="number"
                                  value={productForm[`stock${size}`]}
                                  onChange={(e) =>
                                    setProductForm({
                                      ...productForm,
                                      [`stock${size}`]: e.target.value,
                                    })
                                  }
                                  className="w-14 rounded-lg border border-white/20 bg-zinc-900 px-2 py-1 font-mono text-xs text-white"
                                />
                              </div>
                            ))}

                            <button
                              disabled={savingProduct}
                              onClick={() => handleSaveProductEdit(p.id)}
                              className="flex items-center gap-1 rounded-xl bg-amber-400 px-4 py-2 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)] mt-3 sm:mt-0"
                            >
                              <Save className="h-3.5 w-3.5" />
                              <span>{savingProduct ? "SAVING..." : "SAVE"}</span>
                            </button>

                            <button
                              onClick={() => setEditingProductId(null)}
                              className="px-3 py-2 text-zinc-400 hover:text-white text-xs font-mono"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                            <div>
                              <span className="font-mono text-[9px] text-zinc-500 uppercase">PRICE</span>
                              <div className="font-mono text-base font-bold text-amber-400">
                                ৳{p.price.toLocaleString()} BDT
                              </div>
                            </div>

                            {/* Stock counts */}
                            <div className="flex items-center gap-1.5 font-mono text-xs">
                              <span className="text-zinc-500 text-[10px]">SIZES:</span>
                              <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-zinc-300">S:{p.stockS}</span>
                              <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-zinc-300">M:{p.stockM}</span>
                              <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-zinc-300">L:{p.stockL}</span>
                              <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-zinc-300">XL:{p.stockXL}</span>
                              <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-zinc-300">XXL:{p.stockXXL}</span>
                            </div>

                            {/* Actions Group */}
                            <div className="flex items-center gap-2">
                              {/* Full Edit Modal Trigger Button */}
                              <button
                                onClick={() => handleOpenFullEdit(p)}
                                className="flex items-center gap-1.5 rounded-xl bg-amber-400/15 border border-amber-500/40 hover:bg-amber-400 hover:text-black px-3.5 py-2 font-mono text-xs font-bold text-amber-300 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                                title="Edit full description, 3D photo, name, specs, price & stocks"
                              >
                                <Edit className="h-3.5 w-3.5" />
                                <span>EDIT PRODUCT INFO</span>
                              </button>

                              {/* Quick inline price/stock toggle */}
                              <button
                                onClick={() => {
                                  setEditingProductId(p.id);
                                  setProductForm({
                                    price: p.price,
                                    stockS: p.stockS,
                                    stockM: p.stockM,
                                    stockL: p.stockL,
                                    stockXL: p.stockXL,
                                    stockXXL: p.stockXXL,
                                    isFeatured: p.isFeatured,
                                    inStock: p.inStock,
                                  });
                                }}
                                className="rounded-xl bg-zinc-900 border border-white/10 hover:border-white/30 px-2.5 py-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors"
                                title="Quick Price & Stock Adjustment"
                              >
                                <span>⚡ QUICK</span>
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/30 p-2 text-red-400 hover:text-red-300 transition-colors"
                                title="Delete Kit"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PAYMENT NUMBERS & STORE SETTINGS */}
        {/* ============================================================ */}
        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-white/5 pb-4">
              <h3 className="font-mono text-sm font-bold text-white uppercase">
                STORE PAYMENT & DELIVERY SETTINGS
              </h3>
              <p className="font-mono text-xs text-zinc-400 mt-0.5">
                Configure bKash/Nagad accounts, courier shipping charges, and fees shown to customers.
              </p>
            </div>

            {settingsSuccess && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300 font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Store configuration saved and live!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                  bKash Account Number & Type (Shown at Checkout)
                </label>
                <input
                  type="text"
                  value={settings.bkash_number || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, bkash_number: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                  Nagad Account Number & Type (Shown at Checkout)
                </label>
                <input
                  type="text"
                  value={settings.nagad_number || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, nagad_number: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    Inside Dhaka Delivery Charge (BDT)
                  </label>
                  <input
                    type="number"
                    value={settings.shipping_inside_dhaka || "80"}
                    onChange={(e) =>
                      setSettings({ ...settings, shipping_inside_dhaka: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    Outside Dhaka Delivery Charge (BDT)
                  </label>
                  <input
                    type="number"
                    value={settings.shipping_outside_dhaka || "130"}
                    onChange={(e) =>
                      setSettings({ ...settings, shipping_outside_dhaka: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    Free Shipping Threshold (BDT)
                  </label>
                  <input
                    type="number"
                    value={settings.free_shipping_threshold || "3000"}
                    onChange={(e) =>
                      setSettings({ ...settings, free_shipping_threshold: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    Custom Name & Number Fee (BDT)
                  </label>
                  <input
                    type="number"
                    value={settings.custom_print_fee || "200"}
                    onChange={(e) =>
                      setSettings({ ...settings, custom_print_fee: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Global Currency Exchange Rate */}
              <div className="pt-4 border-t border-white/10">
                <h4 className="font-mono text-xs font-bold text-amber-300 uppercase mb-3">
                  🌐 GLOBAL & EXPAT CURRENCY RATE
                </h4>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    USD Exchange Rate (1 USD in BDT)
                  </label>
                  <input
                    type="number"
                    value={settings.usd_exchange_rate || "122"}
                    onChange={(e) =>
                      setSettings({ ...settings, usd_exchange_rate: e.target.value })
                    }
                    placeholder="e.g. 122"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Courier & SMS API Gateways */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <h4 className="font-mono text-xs font-bold text-amber-300 uppercase">
                  ⚡ API INTEGRATIONS & GATEWAYS
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                      Steadfast Courier API Key
                    </label>
                    <input
                      type="text"
                      value={settings.steadfast_api_key || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, steadfast_api_key: e.target.value })
                      }
                      placeholder="Paste Steadfast API Key"
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                      Steadfast Secret Key
                    </label>
                    <input
                      type="password"
                      value={settings.steadfast_secret_key || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, steadfast_secret_key: e.target.value })
                      }
                      placeholder="Paste Steadfast Secret"
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    Bangladesh SMS Gateway API Token (Greenweb / BulkSMSBD)
                  </label>
                  <input
                    type="password"
                    value={settings.sms_api_key || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, sms_api_key: e.target.value })
                    }
                    placeholder="Paste SMS Gateway Token"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="w-full rounded-xl bg-amber-400 py-3 font-mono text-xs font-bold text-black hover:bg-amber-300 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] mt-4"
              >
                {savingSettings ? "SAVING CONFIGURATION..." : "SAVE STORE CONFIGURATION"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
