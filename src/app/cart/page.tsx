"use client";

import Footer from "@/components/Footer";
import { useEffect } from "react";
import { getCartItemKey, useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("snackzee_token");
    if (!token) router.push("/login");
  }, [router]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-24 h-24 bg-terracotta/10 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-12 h-12 text-terracotta/40" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-brown">Your cart is empty</h2>
        <p className="text-brown-light/60 font-sans text-center">Add some delicious Telangana snacks to get started!</p>
        <Link href="/" className="bg-terracotta hover:bg-terracotta-dark text-white px-8 py-3 rounded-full font-bold font-sans transition-all hover:scale-105">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-16 sm:pt-20">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-5 sm:mb-8">
          <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-brown">Your Cart</h1>
          <button onClick={clearCart} className="text-xs sm:text-sm text-red-400 hover:text-red-600 font-sans transition-colors">
            Clear all
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item) => {
                const itemKey = getCartItemKey(item);
                return (
                <motion.div
                  key={itemKey}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="bg-white rounded-2xl border border-terracotta/10 p-3 sm:p-4 flex gap-3 sm:gap-4 items-center"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-cream-dark relative">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-brown text-sm sm:text-lg leading-tight line-clamp-1">{item.product.name}</p>
                    <p className="text-brown-light/50 text-[10px] sm:text-xs font-sans">{item.product.nameEnglish} · {item.product.priceUnit}</p>
                    <p className="text-gold font-sans font-bold text-base sm:text-lg mt-0.5">₹{item.product.price * item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <button onClick={() => updateQty(itemKey, item.quantity - 1)} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-terracotta/20 flex items-center justify-center hover:bg-terracotta/10 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 sm:w-8 text-center font-bold text-brown font-sans text-sm">{item.quantity}</span>
                    <button onClick={() => updateQty(itemKey, item.quantity + 1)} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-terracotta/20 flex items-center justify-center hover:bg-terracotta/10 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeItem(itemKey)} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors ml-1">
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                    </button>
                  </div>
                </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-terracotta/10 p-5">
              <h3 className="font-serif font-bold text-brown text-lg mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm font-sans">
                <div className="flex justify-between text-brown-light/70">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>₹{total}</span>
                </div>
                <div className="border-t border-terracotta/10 pt-2 flex justify-between font-bold text-brown text-base">
                  <span>Total</span>
                  <span className="text-gold font-sans text-xl">₹{total}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-4 flex items-center justify-center gap-2 w-full bg-terracotta hover:bg-terracotta-dark text-white py-3.5 rounded-full font-bold text-base transition-all hover:scale-[1.02] shadow-lg shadow-terracotta/20 font-sans"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/" className="mt-3 block text-center text-terracotta hover:text-terracotta-dark text-sm font-sans font-semibold transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
