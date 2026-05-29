"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ExternalLink, MapPin, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
  items: { name: string; qty: number; price: number }[];
  address: { name: string; phone?: string; line1: string; line2?: string; city: string; state: string; pincode: string };
  tracking_id?: string;
  tracking_link?: string;
  coupon?: string;
  discount?: number;
  payment_id?: string;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; step: number }> = {
  paid:       { color: "text-blue-700",   bg: "bg-blue-100",   label: "Order Placed",  step: 1 },
  processing: { color: "text-yellow-700", bg: "bg-yellow-100", label: "Processing",    step: 2 },
  shipped:    { color: "text-purple-700", bg: "bg-purple-100", label: "Shipped",       step: 3 },
  delivered:  { color: "text-green-700",  bg: "bg-green-100",  label: "Delivered",     step: 4 },
  cancelled:  { color: "text-red-700",    bg: "bg-red-100",    label: "Cancelled",     step: 0 },
};

const STEPS = ["Order Placed", "Processing", "Shipped", "Delivered"];

function getDelhiveryTrackingUrl(order: Order) {
  return order.tracking_link || (order.tracking_id ? `https://www.delhivery.com/track/package/${order.tracking_id}` : "");
}

function OrderCard({ order, index }: { order: Order; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.paid;

  const handleTrack = async () => {
    const trackingUrl = getDelhiveryTrackingUrl(order);
    if (trackingUrl) {
      window.open(trackingUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (trackingData) { setExpanded(true); return; }
    const token = localStorage.getItem("snackzee_token");
    setTrackingLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/orders/${order.id}/track`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTrackingData(data);
      setExpanded(true);
    } catch {
      setTrackingData({ error: "Failed to fetch tracking info" });
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white rounded-2xl border border-terracotta/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-terracotta/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-terracotta" />
          </div>
          <div>
            <p className="font-serif font-bold text-brown text-base">Order #{order.id}</p>
            <p className="text-brown-light/40 text-xs font-sans">
              {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        <span className={`text-xs font-bold font-sans px-3 py-1.5 rounded-full ${status.bg} ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Progress bar — only for non-cancelled */}
      {order.status !== "cancelled" && (
        <div className="px-5 py-4 border-b border-terracotta/5">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-3 h-0.5 bg-terracotta/10 z-0" />
            <div
              className="absolute left-0 top-3 h-0.5 bg-terracotta z-0 transition-all duration-700"
              style={{ width: `${((status.step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
            {STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center z-10 flex-1">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
                  i + 1 <= status.step
                    ? "bg-terracotta border-terracotta text-white"
                    : "bg-white border-terracotta/20 text-brown-light/30"
                }`}>
                  {i + 1 <= status.step ? "✓" : i + 1}
                </div>
                <p className={`text-[9px] font-sans mt-1 text-center leading-tight ${i + 1 <= status.step ? "text-terracotta font-semibold" : "text-brown-light/30"}`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items summary */}
      <div className="px-5 py-4">
        <div className="space-y-1.5 mb-4">
          {(order.items || []).slice(0, 3).map((item, j) => (
            <div key={j} className="flex justify-between text-sm font-sans text-brown-light/70">
              <span className="truncate pr-2">{item.name} × {item.qty}</span>
              <span className="flex-shrink-0 font-medium">₹{item.price * item.qty}</span>
            </div>
          ))}
          {(order.items || []).length > 3 && (
            <p className="text-xs text-brown-light/40 font-sans">+{order.items.length - 3} more items</p>
          )}
        </div>

        {/* Address */}
        {order.address && (
          <div className="flex items-start gap-1.5 mb-4">
            <MapPin className="w-3.5 h-3.5 text-brown-light/40 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-sans text-brown-light/50">
              {order.address.name} · {order.address.line1}, {order.address.city}, {order.address.state} — {order.address.pincode}
            </p>
          </div>
        )}

        {/* Tracking AWB */}
        {order.tracking_id && (
          <div className="flex items-center gap-2 mb-4 bg-purple-50 rounded-xl px-3 py-2">
            <span className="text-xs font-sans text-purple-700 font-semibold">AWB: {order.tracking_id}</span>
            {order.tracking_link && (
              <a href={order.tracking_link} target="_blank" rel="noopener noreferrer"
                className="ml-auto text-purple-500 hover:text-purple-700 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-terracotta/5">
          <div className="flex items-center gap-2">
            {order.discount ? (
              <span className="text-xs font-sans text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                Saved ₹{order.discount}
              </span>
            ) : null}
            {order.tracking_id && (
              <button onClick={handleTrack} disabled={trackingLoading}
                className="flex items-center gap-1.5 text-xs font-sans font-semibold text-terracotta border border-terracotta/30 px-3 py-1.5 rounded-lg hover:bg-terracotta/5 transition-colors disabled:opacity-50">
                <MapPin className="w-3 h-3" />
                {trackingLoading ? "Loading..." : "Live Track"}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <p className="font-serif font-bold text-gold text-xl">₹{order.total}</p>
            <button onClick={() => setExpanded(!expanded)}
              className="text-brown-light/40 hover:text-brown transition-colors">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded tracking */}
      <AnimatePresence>
        {expanded && trackingData && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border-t border-terracotta/5 overflow-hidden">
            <div className="px-5 py-4 bg-cream/50">
              {trackingData.error ? (
                <p className="text-xs text-red-500 font-sans">{trackingData.error}</p>
              ) : (
                <div>
                  <p className="text-xs font-sans font-semibold text-brown mb-3">Live Tracking — {order.tracking_id}</p>
                  {trackingData?.tracking?.ShipmentData?.[0]?.Shipment?.Scans?.slice(0, 5).map((scan: any, k: number) => (
                    <div key={k} className="flex gap-3 text-xs font-sans text-brown-light/70 mb-2 pb-2 border-b border-terracotta/5 last:border-0">
                      <span className="text-brown-light/40 w-28 flex-shrink-0 text-[10px]">
                        {new Date(scan.ScanDetail?.ScanDateTime).toLocaleString("en-IN")}
                      </span>
                      <span>{scan.ScanDetail?.Instructions} — {scan.ScanDetail?.ScannedLocation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("snackzee_token");
    if (!token) { router.push("/login"); return; }
    fetch(`${BACKEND_URL}/orders/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.orders) setOrders(d.orders); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="pt-16 sm:pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

          {/* Page Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-terracotta/10 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-terracotta" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown">My Orders</h1>
              <p className="text-brown-light/50 text-sm font-sans">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-terracotta/10 p-12 text-center">
              <Package className="w-14 h-14 text-brown-light/20 mx-auto mb-4" />
              <p className="font-serif text-xl font-bold text-brown mb-2">No orders yet</p>
              <p className="text-brown-light/50 font-sans text-sm mb-6">Your orders will appear here after checkout.</p>
              <Link href="/shop"
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white px-6 py-3 rounded-full font-bold font-sans text-sm transition-all hover:scale-105">
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => (
                <OrderCard key={order.id} order={order} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
