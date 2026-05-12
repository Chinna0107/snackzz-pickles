"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Package, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function DashboardHome() {
  const [orders, setOrders] = useState<{ id: number; total: number; status: string; created_at: string }[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("snackzee_token");
    if (!token) return;
    fetch(`${BACKEND_URL}/orders/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.orders) setOrders(d.orders); })
      .catch(() => {});
  }, []);

  const stats = [
    { label: "Total Orders", value: orders.length, icon: <ShoppingBag className="w-6 h-6" />, color: "bg-terracotta/10 text-terracotta" },
    { label: "Delivered", value: orders.filter((o) => o.status === "delivered").length, icon: <Package className="w-6 h-6" />, color: "bg-green-100 text-green-600" },
    { label: "Pending", value: orders.filter((o) => o.status === "paid" || o.status === "processing").length, icon: <Heart className="w-6 h-6" />, color: "bg-gold/10 text-gold" },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown mb-6">My Dashboard</h1>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-terracotta/10 p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>{s.icon}</div>
            <div className="text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-serif font-bold text-brown">{s.value}</p>
              <p className="text-brown-light/50 text-[10px] sm:text-xs font-sans leading-tight">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-terracotta/10 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-bold text-brown">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-terracotta text-sm font-sans font-semibold flex items-center gap-1 hover:text-terracotta-dark">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="w-10 h-10 text-brown-light/20 mx-auto mb-3" />
            <p className="text-brown-light/50 font-sans text-sm">No orders yet</p>
            <Link href="/" className="mt-3 inline-block text-terracotta font-semibold text-sm font-sans hover:underline">Start Shopping →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-terracotta/5 last:border-0">
                <div>
                  <p className="font-sans font-semibold text-brown text-sm">Order #{order.id}</p>
                  <p className="text-brown-light/40 text-xs font-sans">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif font-bold text-gold">₹{order.total}</p>
                  <span className={`text-[10px] font-sans px-2 py-0.5 rounded-full font-semibold ${
                    order.status === "delivered" ? "bg-green-100 text-green-700" :
                    order.status === "paid" ? "bg-blue-100 text-blue-700" : "bg-gold/10 text-gold"
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
