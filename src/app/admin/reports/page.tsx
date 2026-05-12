"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Users, Package } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type Period = "daily" | "weekly" | "monthly";

interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
  items?: { name: string; qty: number; price: number }[];
}

function isWithin(date: Date, period: Period): boolean {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (period === "daily") return diff < 86400000;
  if (period === "weekly") return diff < 7 * 86400000;
  return diff < 30 * 86400000;
}

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [period, setPeriod] = useState<Period>("weekly");

  useEffect(() => {
    const token = localStorage.getItem("snackzee_token");
    if (!token) return;
    fetch(`${BACKEND_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.orders) setOrders(d.orders); })
      .catch(() => {});
  }, []);

  const filtered = orders.filter((o) => isWithin(new Date(o.created_at), period));
  const revenue = filtered.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const delivered = filtered.filter((o) => o.status === "delivered").length;
  const cancelled = filtered.filter((o) => o.status === "cancelled").length;
  const avgOrder = filtered.length > 0 ? Math.round(revenue / filtered.length) : 0;

  // Top products
  const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  filtered.forEach((o) => {
    (o.items || []).forEach((item) => {
      if (!productMap[item.name]) productMap[item.name] = { name: item.name, qty: 0, revenue: 0 };
      productMap[item.name].qty += item.qty;
      productMap[item.name].revenue += item.price * item.qty;
    });
  });
  const topProducts = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Daily breakdown for chart (last 7 or 30 days)
  const days = period === "daily" ? 1 : period === "weekly" ? 7 : 30;
  const dailyData = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const dayOrders = orders.filter((o) => {
      const od = new Date(o.created_at);
      return od.toDateString() === d.toDateString() && o.status !== "cancelled";
    });
    return { label, revenue: dayOrders.reduce((s, o) => s + o.total, 0), count: dayOrders.length };
  });

  const maxRevenue = Math.max(...dailyData.map((d) => d.revenue), 1);

  const stats = [
    { label: "Orders", value: filtered.length, icon: <ShoppingBag className="w-5 h-5" />, color: "bg-terracotta/10 text-terracotta" },
    { label: "Revenue", value: `₹${revenue.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: "bg-green-100 text-green-600" },
    { label: "Delivered", value: delivered, icon: <Package className="w-5 h-5" />, color: "bg-blue-100 text-blue-600" },
    { label: "Avg Order", value: `₹${avgOrder}`, icon: <Users className="w-5 h-5" />, color: "bg-gold/10 text-gold" },
    { label: "Cancelled", value: cancelled, icon: <ShoppingBag className="w-5 h-5" />, color: "bg-red-100 text-red-500" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown">Reports</h1>
        <div className="flex gap-2">
          {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-sans font-semibold capitalize transition-colors ${period === p ? "bg-terracotta text-white" : "bg-white text-brown-light border border-terracotta/10 hover:border-terracotta/30"}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl sm:rounded-2xl border border-terracotta/10 p-3 sm:p-4">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 ${s.color}`}>{s.icon}</div>
            <p className="font-serif font-bold text-brown text-lg sm:text-xl">{s.value}</p>
            <p className="text-brown-light/50 text-[10px] sm:text-xs font-sans">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-terracotta/10 p-4 sm:p-6">
          <h2 className="font-serif text-base sm:text-lg font-bold text-brown mb-4 sm:mb-6">
            Revenue — {period === "daily" ? "Today" : period === "weekly" ? "Last 7 Days" : "Last 30 Days"}
          </h2>
          {days <= 7 ? (
            <div className="flex items-end gap-2 h-40">
              {dailyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-sans text-brown-light/50">{d.revenue > 0 ? `₹${d.revenue}` : ""}</span>
                  <div className="w-full bg-terracotta/10 rounded-t-lg transition-all" style={{ height: `${(d.revenue / maxRevenue) * 120 + 4}px`, backgroundColor: d.revenue > 0 ? "#C8401A" : "#f5e8e0" }} />
                  <span className="text-[9px] font-sans text-brown-light/50 text-center">{d.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {dailyData.filter((d) => d.revenue > 0).map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-sans text-brown-light/50 w-20 flex-shrink-0">{d.label}</span>
                  <div className="flex-1 bg-cream rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-terracotta rounded-full" style={{ width: `${(d.revenue / maxRevenue) * 100}%` }} />
                  </div>
                  <span className="text-xs font-sans font-semibold text-brown w-20 text-right">₹{d.revenue}</span>
                </div>
              ))}
              {dailyData.every((d) => d.revenue === 0) && (
                <p className="text-brown-light/40 text-sm font-sans text-center py-8">No revenue data for this period.</p>
              )}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-terracotta/10 p-4 sm:p-6">
          <h2 className="font-serif text-base sm:text-lg font-bold text-brown mb-4 sm:mb-6">Top Products</h2>
          {topProducts.length === 0 ? (
            <p className="text-brown-light/40 text-sm font-sans text-center py-8">No product data for this period.</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center text-xs font-bold font-sans flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-semibold text-brown text-sm truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 bg-cream rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-terracotta rounded-full" style={{ width: `${(p.revenue / (topProducts[0]?.revenue || 1)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-serif font-bold text-gold text-sm">₹{p.revenue}</p>
                    <p className="text-brown-light/40 text-[10px] font-sans">{p.qty} units</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-terracotta/10 p-4 sm:p-6 mt-4 sm:mt-6">
        <h2 className="font-serif text-base sm:text-lg font-bold text-brown mb-3 sm:mb-4">Orders in Period ({filtered.length})</h2>
        {filtered.length === 0 ? (
          <p className="text-brown-light/40 text-sm font-sans text-center py-6">No orders in this period.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="text-brown-light/40 text-xs uppercase tracking-wider border-b border-terracotta/5">
                  <th className="text-left py-3 pr-4">Order</th>
                  <th className="text-left py-3 pr-4">Date</th>
                  <th className="text-left py-3 pr-4">Total</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-terracotta/5">
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2.5 pr-4 font-semibold text-brown">#{o.id}</td>
                    <td className="py-2.5 pr-4 text-brown-light/60">{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                    <td className="py-2.5 pr-4 font-serif font-bold text-gold">₹{o.total}</td>
                    <td className="py-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        o.status === "delivered" ? "bg-green-100 text-green-700" :
                        o.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-700"
                      }`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
