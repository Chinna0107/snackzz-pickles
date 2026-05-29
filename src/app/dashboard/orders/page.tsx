"use client";

import { useEffect, useState } from "react";
import { Package, ExternalLink, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
  items: { name: string; qty: number; price: number }[];
  address: { name: string; line1: string; city: string; state: string; pincode: string };
  tracking_id?: string;
  tracking_link?: string;
  coupon?: string;
  discount?: number;
}

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function getDelhiveryTrackingUrl(order: Order) {
  return order.tracking_link || (order.tracking_id ? `https://www.delhivery.com/track/package/${order.tracking_id}` : "");
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState<Record<number, any>>({});
  const [trackingLoading, setTrackingLoading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const token = localStorage.getItem("snackzee_token");
    if (!token) return;
    fetch(`${BACKEND_URL}/orders/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.orders) setOrders(d.orders); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleTrack = async (order: Order) => {
    const trackingUrl = getDelhiveryTrackingUrl(order);
    if (trackingUrl) {
      window.open(trackingUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const orderId = order.id;
    const token = localStorage.getItem("snackzee_token");
    setTrackingLoading((p) => ({ ...p, [orderId]: true }));
    try {
      const res = await fetch(`${BACKEND_URL}/orders/${orderId}/track`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTrackingData((p) => ({ ...p, [orderId]: data }));
    } catch {
      setTrackingData((p) => ({ ...p, [orderId]: { error: "Failed to fetch tracking" } }));
    } finally {
      setTrackingLoading((p) => ({ ...p, [orderId]: false }));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-terracotta/10 p-10 text-center">
          <Package className="w-12 h-12 text-brown-light/20 mx-auto mb-4" />
          <p className="font-serif text-xl font-bold text-brown mb-2">No orders yet</p>
          <p className="text-brown-light/50 font-sans text-sm">Your orders will appear here after checkout.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-terracotta/10 p-4 sm:p-6">

              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-serif font-bold text-brown text-base sm:text-lg">Order #{order.id}</p>
                  <p className="text-brown-light/40 text-xs font-sans">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className={`text-[10px] sm:text-xs font-sans px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${STATUS_COLORS[order.status] || "bg-cream text-brown-light"}`}>
                  {order.status}
                </span>
              </div>

              {/* Items — scrollable on mobile */}
              <div className="space-y-1 mb-3 max-h-28 overflow-y-auto">
                {(order.items || []).map((item, j) => (
                  <div key={j} className="flex justify-between text-xs sm:text-sm font-sans text-brown-light/70">
                    <span className="truncate pr-2">{item.name} × {item.qty}</span>
                    <span className="flex-shrink-0">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-terracotta/5 space-y-2">
                {order.address && (
                  <p className="text-xs font-sans text-brown-light/50 flex items-start gap-1">
                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{order.address.line1}, {order.address.city}, {order.address.state}</span>
                  </p>
                )}

                {order.tracking_id && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-sans text-brown-light/50">
                      AWB: <span className="font-semibold text-brown">{order.tracking_id}</span>
                    </span>
                    {order.tracking_link && (
                      <a href={order.tracking_link} target="_blank" rel="noopener noreferrer"
                        className="text-terracotta hover:text-terracotta-dark transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {order.tracking_id && (
                      <button onClick={() => handleTrack(order)}
                        disabled={trackingLoading[order.id]}
                        className="flex items-center gap-1.5 text-xs font-sans font-semibold text-terracotta border border-terracotta/30 px-3 py-1.5 rounded-lg hover:bg-terracotta/5 transition-colors disabled:opacity-50">
                        <MapPin className="w-3 h-3" />
                        {trackingLoading[order.id] ? "..." : "Live Track"}
                      </button>
                    )}
                  </div>
                  <p className="font-serif font-bold text-gold text-lg sm:text-xl">₹{order.total}</p>
                </div>
              </div>

              {/* Live tracking info */}
              {trackingData[order.id] && (
                <div className="mt-3 p-3 sm:p-4 bg-cream rounded-xl border border-terracotta/10">
                  {trackingData[order.id].error ? (
                    <p className="text-xs text-red-500 font-sans">{trackingData[order.id].error}</p>
                  ) : (
                    <div>
                      <p className="text-xs font-sans font-semibold text-brown mb-2">Live Tracking — {order.tracking_id}</p>
                      {trackingData[order.id]?.tracking?.ShipmentData?.[0]?.Shipment?.Scans?.slice(0, 5).map((scan: { ScanDetail?: { ScanDateTime: string; Instructions: string; ScannedLocation: string } }, k: number) => (
                        <div key={k} className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-xs font-sans text-brown-light/70 mb-1.5">
                          <span className="text-brown-light/40 sm:w-32 flex-shrink-0 text-[10px]">
                            {new Date(scan.ScanDetail?.ScanDateTime ?? "").toLocaleString("en-IN")}
                          </span>
                          <span>{scan.ScanDetail?.Instructions} — {scan.ScanDetail?.ScannedLocation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
