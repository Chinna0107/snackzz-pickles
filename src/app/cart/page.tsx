"use client";

import Footer from "@/components/Footer";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();

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
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brown">Your Cart</h1>
          <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 font-sans transition-colors">
            Clear all
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="bg-white rounded-2xl border border-terracotta/10 p-4 flex gap-4 items-center"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-cream-dark relative">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-brown text-lg leading-tight">{item.product.name}</p>
                    <p className="text-brown-light/50 text-xs font-sans">{item.product.nameEnglish} · {item.product.priceUnit}</p>
                    <p className="text-gold font-sans font-bold text-lg mt-1">₹{item.product.price * item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-terracotta/20 flex items-center justify-center hover:bg-terracotta/10 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-bold text-brown font-sans">{item.quantity}</span>
                    <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-terracotta/20 flex items-center justify-center hover:bg-terracotta/10 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeItem(item.product.id)} className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors ml-1">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
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
