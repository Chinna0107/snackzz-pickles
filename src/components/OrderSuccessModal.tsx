"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Package, MapPin, CreditCard, Mail, Phone, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
  name: string;
  image?: string;
  qty: number;
  price: number;
  unit?: string;
}

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails?: {
    orderId?: number;
    paymentId: string;
    total: number;
    items: OrderItem[] | number;
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
  };
}

export default function OrderSuccessModal({ isOpen, onClose, orderDetails }: OrderSuccessModalProps) {
  if (!isOpen || !orderDetails) return null;

  const itemList = Array.isArray(orderDetails.items) ? orderDetails.items : [];
  const itemCount = Array.isArray(orderDetails.items) ? orderDetails.items.length : orderDetails.items;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-3 sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 px-6 pt-10 pb-8 text-center relative overflow-hidden rounded-t-3xl">
              {/* Confetti */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(16)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -20, opacity: 1, x: `${Math.random() * 100}%` }}
                    animate={{ y: 280, opacity: 0, rotate: Math.random() * 360 }}
                    transition={{ duration: 2 + Math.random() * 1.5, delay: Math.random() * 0.5, ease: "easeOut" }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: ["#fbbf24", "#f97316", "#fff", "#a3e635"][Math.floor(Math.random() * 4)] }}
                  />
                ))}
              </div>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.7, delay: 0.2 }}
                className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-4 relative z-10"
              >
                <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={2.5} />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1"
              >
                Order Placed! 🎉
              </motion.h2>
              <p className="text-white/80 font-sans text-sm">
                {orderDetails.orderId ? `Order #${orderDetails.orderId}` : "Your order has been confirmed"}
              </p>
            </div>

            <div className="p-5 space-y-4">

              {/* Email confirmation notice */}
              {orderDetails.address.email && (
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-blue-700 font-sans">Confirmation email sent!</p>
                    <p className="text-xs text-blue-600/80 font-sans mt-0.5">
                      We've sent your order confirmation to <span className="font-semibold">{orderDetails.address.email}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Payment ID */}
              <div className="bg-cream rounded-2xl p-4 border border-terracotta/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <CreditCard className="w-4 h-4 text-gold" />
                  <span className="text-xs font-bold text-brown-light/50 font-sans uppercase tracking-wider">Payment ID</span>
                </div>
                <p className="font-mono text-sm text-brown font-semibold break-all">{orderDetails.paymentId}</p>
                <p className="text-xs text-brown-light/50 font-sans mt-1">Total paid: <span className="font-bold text-gold">₹{orderDetails.total}</span></p>
              </div>

              {/* Products ordered */}
              {itemList.length > 0 && (
                <div className="bg-cream rounded-2xl p-4 border border-terracotta/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-terracotta" />
                    <span className="text-xs font-bold text-brown-light/50 font-sans uppercase tracking-wider">
                      {itemCount} Item{itemCount !== 1 ? "s" : ""} Ordered
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {itemList.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {item.image && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative bg-white border border-terracotta/10">
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
                    <span className="text-base font-bold text-gold font-serif">₹{orderDetails.total}</span>
                  </div>
                </div>
              )}

              {/* Delivery address */}
              <div className="bg-cream rounded-2xl p-4 border border-terracotta/10">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-terracotta" />
                  <span className="text-xs font-bold text-brown-light/50 font-sans uppercase tracking-wider">Delivering To</span>
                </div>
                <p className="text-sm font-bold text-brown font-sans">{orderDetails.address.name}</p>
                {orderDetails.address.phone && (
                  <p className="text-xs text-brown-light/60 font-sans flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {orderDetails.address.phone}
                  </p>
                )}
                {orderDetails.address.line1 && (
                  <p className="text-xs text-brown-light/60 font-sans mt-1">
                    {orderDetails.address.line1}{orderDetails.address.line2 ? `, ${orderDetails.address.line2}` : ""}
                  </p>
                )}
                <p className="text-xs text-brown-light/60 font-sans">
                  {orderDetails.address.city}{orderDetails.address.state ? `, ${orderDetails.address.state}` : ""} — {orderDetails.address.pincode}
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
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link
                  href="/orders"
                  onClick={onClose}
                  className="flex-1 bg-terracotta hover:bg-terracotta-dark text-white py-3 px-4 rounded-xl font-bold font-sans text-sm text-center transition-colors"
                >
                  View My Orders
                </Link>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="flex-1 border-2 border-terracotta/20 text-terracotta hover:bg-terracotta/5 py-3 px-4 rounded-xl font-bold font-sans text-sm text-center transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
