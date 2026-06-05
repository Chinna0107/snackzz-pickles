"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, MapPin, CreditCard, Mail, Phone, Star, Home } from "lucide-react";
import Header from "@/components/Header";

interface OrderDetails {
  orderId?: number;
  paymentId: string;
  total: number;
  items: { name: string; image?: string; qty: number; price: number; unit?: string }[];
  address: {
    name: string;
    email?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city: string;
    state?: string;
    pincode: string;
  };
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("snackzee_order_confirmation");
      if (!stored) { router.replace("/"); return; }
      setOrder(JSON.parse(stored));
    } catch {
      router.replace("/");
    }
  }, [router]);

  // Block browser back/forward navigation — keep user on this page
  useEffect(() => {
    if (!order) return;
    // Push a duplicate history entry so back button stays here
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [order]);

  const handleGoHome = () => {
    // Clear the confirmation data and navigate home
    try { sessionStorage.removeItem("snackzee_order_confirmation"); } catch {}
    // Replace entire history stack with home so back doesn't return here
    window.location.href = "/";
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pt-24 sm:pt-28">

        {/* Success Header */}
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl px-6 pt-10 pb-8 text-center mb-6 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(16)].map((_, i) => (
              <motion.div key={i}
                initial={{ y: -20, opacity: 1, x: `${Math.random() * 100}%` }}
                animate={{ y: 280, opacity: 0, rotate: Math.random() * 360 }}
                transition={{ duration: 2 + Math.random() * 1.5, delay: Math.random() * 0.5 }}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: ["#fbbf24","#f97316","#fff","#a3e635"][Math.floor(Math.random() * 4)] }}
              />
            ))}
          </div>
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.7, delay: 0.2 }}
            className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-4 relative z-10">
            <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={2.5} />
          </motion.div>
          <h1 className="font-serif text-3xl font-bold text-white mb-1">Order Placed! 🎉</h1>
          <p className="text-white/80 font-sans text-sm">
            {order.orderId ? `Order #${order.orderId}` : "Your order has been confirmed"}
          </p>
        </motion.div>

        <div className="space-y-4">
          {/* Email confirmation */}
          {order.address.email && (
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-700 font-sans">Confirmation email sent!</p>
                <p className="text-xs text-blue-600/80 font-sans mt-0.5">
                  We've sent your order confirmation to <span className="font-semibold">{order.address.email}</span>
                </p>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="bg-white rounded-2xl p-4 border border-terracotta/10">
            <div className="flex items-center gap-2 mb-1.5">
              <CreditCard className="w-4 h-4 text-gold" />
              <span className="text-xs font-bold text-brown-light/50 font-sans uppercase tracking-wider">Payment ID</span>
            </div>
            <p className="font-mono text-sm text-brown font-semibold break-all">{order.paymentId}</p>
            <p className="text-xs text-brown-light/50 font-sans mt-1">Total paid: <span className="font-bold text-gold">₹{order.total}</span></p>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl p-4 border border-terracotta/10">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-terracotta" />
              <span className="text-xs font-bold text-brown-light/50 font-sans uppercase tracking-wider">
                {order.items.length} Item{order.items.length !== 1 ? "s" : ""} Ordered
              </span>
            </div>
            <div className="space-y-2.5">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.image && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative bg-cream border border-terracotta/10">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brown font-sans truncate">{item.name}</p>
                    {item.unit && <p className="text-[11px] text-brown-light/50 font-sans">{item.unit}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-brown font-sans">×{item.qty}</p>
                    <p className="text-xs text-gold font-bold font-sans">₹{item.price * item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-terracotta/10 pt-2 mt-2 flex justify-between">
              <span className="text-xs font-sans text-brown-light/60">Total</span>
              <span className="text-base font-bold text-gold font-serif">₹{order.total}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-2xl p-4 border border-terracotta/10">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-terracotta" />
              <span className="text-xs font-bold text-brown-light/50 font-sans uppercase tracking-wider">Delivering To</span>
            </div>
            <p className="text-sm font-bold text-brown font-sans">{order.address.name}</p>
            {order.address.phone && (
              <p className="text-xs text-brown-light/60 font-sans flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" /> {order.address.phone}
              </p>
            )}
            {order.address.email && (
              <p className="text-xs text-brown-light/60 font-sans flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3" /> {order.address.email}
              </p>
            )}
            {order.address.line1 && (
              <p className="text-xs text-brown-light/60 font-sans mt-1">
                {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}
              </p>
            )}
            <p className="text-xs text-brown-light/60 font-sans">
              {order.address.city}{order.address.state ? `, ${order.address.state}` : ""} — {order.address.pincode}
            </p>
          </div>

          {/* What's next */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-amber-700 font-sans mb-2 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" /> What happens next?
            </p>
            <ul className="space-y-1.5 text-xs text-amber-700/80 font-sans">
              <li className="flex items-start gap-2"><span className="mt-0.5 flex-shrink-0">1.</span>We start preparing your order within 24 hours</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 flex-shrink-0">2.</span>Tracking details sent via WhatsApp &amp; Email once shipped</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 flex-shrink-0">3.</span>Expected delivery: 4–7 business days</li>
            </ul>
          </div>

          {/* Actions — Go Home is primary, View Orders is secondary */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoHome}
              className="w-full flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white py-4 rounded-2xl font-bold font-sans text-base transition-all hover:scale-[1.02] shadow-lg shadow-terracotta/20"
            >
              <Home className="w-5 h-5" /> Go to Home
            </button>
            <Link href="/orders"
              className="w-full border-2 border-terracotta/20 text-terracotta hover:bg-terracotta/5 py-3 px-4 rounded-2xl font-bold font-sans text-sm text-center transition-colors">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OrderDetails {
  orderId?: number;
  paymentId: string;
  total: number;
  items: { name: string; image?: string; qty: number; price: number; unit?: string }[];
  address: {
    name: string;
    email?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city: string;
    state?: string;
    pincode: string;
  };
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("snackzee_order_confirmation");
      if (!stored) { router.replace("/"); return; }
      setOrder(JSON.parse(stored));
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pt-24 sm:pt-28">

        {/* Success Header */}
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl px-6 pt-10 pb-8 text-center mb-6 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(16)].map((_, i) => (
              <motion.div key={i}
                initial={{ y: -20, opacity: 1, x: `${Math.random() * 100}%` }}
                animate={{ y: 280, opacity: 0, rotate: Math.random() * 360 }}
                transition={{ duration: 2 + Math.random() * 1.5, delay: Math.random() * 0.5 }}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: ["#fbbf24","#f97316","#fff","#a3e635"][Math.floor(Math.random() * 4)] }}
              />
            ))}
          </div>
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.7, delay: 0.2 }}
            className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-4 relative z-10">
            <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={2.5} />
          </motion.div>
          <h1 className="font-serif text-3xl font-bold text-white mb-1">Order Placed! 🎉</h1>
          <p className="text-white/80 font-sans text-sm">
            {order.orderId ? `Order #${order.orderId}` : "Your order has been confirmed"}
          </p>
        </motion.div>

        <div className="space-y-4">
          {/* Email confirmation */}
          {order.address.email && (
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-700 font-sans">Confirmation email sent!</p>
                <p className="text-xs text-blue-600/80 font-sans mt-0.5">
                  We've sent your order confirmation to <span className="font-semibold">{order.address.email}</span>
                </p>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="bg-white rounded-2xl p-4 border border-terracotta/10">
            <div className="flex items-center gap-2 mb-1.5">
              <CreditCard className="w-4 h-4 text-gold" />
              <span className="text-xs font-bold text-brown-light/50 font-sans uppercase tracking-wider">Payment ID</span>
            </div>
            <p className="font-mono text-sm text-brown font-semibold break-all">{order.paymentId}</p>
            <p className="text-xs text-brown-light/50 font-sans mt-1">Total paid: <span className="font-bold text-gold">₹{order.total}</span></p>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl p-4 border border-terracotta/10">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-terracotta" />
              <span className="text-xs font-bold text-brown-light/50 font-sans uppercase tracking-wider">
                {order.items.length} Item{order.items.length !== 1 ? "s" : ""} Ordered
              </span>
            </div>
            <div className="space-y-2.5">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.image && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative bg-cream border border-terracotta/10">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brown font-sans truncate">{item.name}</p>
                    {item.unit && <p className="text-[11px] text-brown-light/50 font-sans">{item.unit}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-brown font-sans">×{item.qty}</p>
                    <p className="text-xs text-gold font-bold font-sans">₹{item.price * item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-terracotta/10 pt-2 mt-2 flex justify-between">
              <span className="text-xs font-sans text-brown-light/60">Total</span>
              <span className="text-base font-bold text-gold font-serif">₹{order.total}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-2xl p-4 border border-terracotta/10">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-terracotta" />
              <span className="text-xs font-bold text-brown-light/50 font-sans uppercase tracking-wider">Delivering To</span>
            </div>
            <p className="text-sm font-bold text-brown font-sans">{order.address.name}</p>
            {order.address.phone && (
              <p className="text-xs text-brown-light/60 font-sans flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" /> {order.address.phone}
              </p>
            )}
            {order.address.email && (
              <p className="text-xs text-brown-light/60 font-sans flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3" /> {order.address.email}
              </p>
            )}
            {order.address.line1 && (
              <p className="text-xs text-brown-light/60 font-sans mt-1">
                {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}
              </p>
            )}
            <p className="text-xs text-brown-light/60 font-sans">
              {order.address.city}{order.address.state ? `, ${order.address.state}` : ""} — {order.address.pincode}
            </p>
          </div>

          {/* What's next */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-amber-700 font-sans mb-2 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" /> What happens next?
            </p>
            <ul className="space-y-1.5 text-xs text-amber-700/80 font-sans">
              <li className="flex items-start gap-2"><span className="mt-0.5 flex-shrink-0">1.</span>We start preparing your order within 24 hours</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 flex-shrink-0">2.</span>Tracking details sent via WhatsApp &amp; Email once shipped</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 flex-shrink-0">3.</span>Expected delivery: 4–7 business days</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/orders"
              className="flex-1 bg-terracotta hover:bg-terracotta-dark text-white py-3 px-4 rounded-xl font-bold font-sans text-sm text-center transition-colors">
              View My Orders
            </Link>
            <Link href="/products"
              className="flex-1 border-2 border-terracotta/20 text-terracotta hover:bg-terracotta/5 py-3 px-4 rounded-xl font-bold font-sans text-sm text-center transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
