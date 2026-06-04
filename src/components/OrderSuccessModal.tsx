"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Package, MapPin, CreditCard, X } from "lucide-react";
import Link from "next/link";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails?: {
    orderId?: string;
    paymentId: string;
    total: number;
    items: number;
    address: {
      name: string;
      city: string;
      pincode: string;
    };
  };
}

export default function OrderSuccessModal({ isOpen, onClose, orderDetails }: OrderSuccessModalProps) {
  if (!isOpen || !orderDetails) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-brown-light/5 hover:bg-brown-light/10 transition-colors text-brown-light/50 hover:text-brown"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Success Animation */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-6 pt-12 pb-8 text-center relative overflow-hidden">
                {/* Confetti Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -20, opacity: 1 }}
                      animate={{
                        y: 300,
                        opacity: 0,
                        rotate: Math.random() * 360,
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        delay: Math.random() * 0.5,
                        ease: "easeOut",
                      }}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        backgroundColor: ['#10b981', '#fbbf24', '#f97316', '#8b5cf6'][Math.floor(Math.random() * 4)],
                      }}
                    />
                  ))}
                </div>

                {/* Green Checkmark Circle */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.7, delay: 0.2 }}
                  className="mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 mb-6 relative z-10"
                >
                  <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-serif text-3xl font-bold text-green-700 mb-2"
                >
                  Order Placed! 🎉
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-green-600/80 font-sans text-sm"
                >
                  Your order has been confirmed successfully
                </motion.p>
              </div>

              {/* Order Details */}
              <div className="p-6 space-y-4">
                {/* Payment ID */}
                <div className="bg-cream rounded-2xl p-4 border border-terracotta/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-xs font-semibold text-brown-light/50 font-sans uppercase">Payment ID</span>
                  </div>
                  <p className="font-mono text-sm text-brown font-semibold break-all">{orderDetails.paymentId}</p>
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-cream rounded-xl p-3 border border-terracotta/10">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Package className="w-3.5 h-3.5 text-terracotta" />
                      <span className="text-xs text-brown-light/50 font-sans">Items</span>
                    </div>
                    <p className="text-lg font-bold text-brown font-sans">{orderDetails.items}</p>
                  </div>
                  <div className="bg-cream rounded-xl p-3 border border-terracotta/10">
                    <div className="flex items-center gap-2 mb-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-gold" />
                      <span className="text-xs text-brown-light/50 font-sans">Total</span>
                    </div>
                    <p className="text-lg font-bold text-gold font-sans">₹{orderDetails.total}</p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-cream rounded-xl p-4 border border-terracotta/10">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-terracotta" />
                    <span className="text-xs font-semibold text-brown-light/50 font-sans uppercase">Delivering To</span>
                  </div>
                  <p className="text-sm font-sans text-brown font-semibold">{orderDetails.address.name}</p>
                  <p className="text-xs font-sans text-brown-light/60 mt-0.5">
                    {orderDetails.address.city}, {orderDetails.address.pincode}
                  </p>
                </div>

                {/* What's Next */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-xs font-bold text-blue-700 font-sans mb-2">📦 What's Next?</p>
                  <ul className="space-y-1.5 text-xs text-blue-600/80 font-sans">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>We'll start preparing your order within 24 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>You'll receive tracking details via WhatsApp & Email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Expected delivery: 4-7 business days</span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/orders"
                    className="flex-1 bg-terracotta hover:bg-terracotta-dark text-white py-3 px-4 rounded-xl font-bold font-sans text-sm text-center transition-colors"
                  >
                    View Order
                  </Link>
                  <Link
                    href="/shop"
                    className="flex-1 border-2 border-terracotta/20 text-terracotta hover:bg-terracotta/5 py-3 px-4 rounded-xl font-bold font-sans text-sm text-center transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
