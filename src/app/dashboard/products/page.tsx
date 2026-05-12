"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { products, categories } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function DashboardProductsPage() {
  const { addItem, count } = useCart();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [added, setAdded] = useState<Set<string>>(new Set());

  const filtered = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);

  const handleAdd = (productId: string) => {
    const product = products.find((p) => p.id === productId)!;
    addItem(product);
    setAdded((prev) => new Set([...prev, productId]));
    toast({ title: "Added to cart!", description: `${product.nameEnglish} added.` });
    setTimeout(() => setAdded((prev) => { const n = new Set(prev); n.delete(productId); return n; }), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown">Products</h1>
        {count > 0 && (
          <Link href="/cart" className="flex items-center gap-2 bg-terracotta text-white px-3 sm:px-4 py-2 rounded-full font-sans font-semibold text-xs sm:text-sm hover:bg-terracotta-dark transition-colors">
            <ShoppingCart className="w-4 h-4" /> Cart ({count})
          </Link>
        )}
      </div>

      {/* Category Filter — horizontal scroll on mobile */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        <button onClick={() => setActiveCategory("all")}
          className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-sans font-semibold transition-colors ${activeCategory === "all" ? "bg-terracotta text-white" : "bg-white text-brown-light border border-terracotta/10"}`}>
          All
        </button>
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-sans font-semibold transition-colors ${activeCategory === cat.id ? "bg-terracotta text-white" : "bg-white text-brown-light border border-terracotta/10"}`}>
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filtered.map((product, i) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="bg-white rounded-2xl border border-terracotta/10 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-square bg-cream-dark">
              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width:640px) 50vw, 200px" />
              {product.badge && (
                <span className="absolute top-2 left-2 bg-terracotta text-white text-[9px] font-bold font-sans px-1.5 py-0.5 rounded-full">{product.badge}</span>
              )}
            </div>
            <div className="p-2.5 sm:p-3">
              <p className="font-serif font-bold text-brown text-sm leading-tight line-clamp-1">{product.name}</p>
              <p className="text-brown-light/50 text-[10px] font-sans mb-2 line-clamp-1">{product.nameEnglish} · {product.priceUnit}</p>
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-gold text-sm sm:text-base">₹{product.price}</span>
                <button onClick={() => handleAdd(product.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${added.has(product.id) ? "bg-green-500 text-white" : "bg-terracotta/10 text-terracotta hover:bg-terracotta hover:text-white"}`}>
                  {added.has(product.id) ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
