"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, CheckCircle2, Minus, Plus, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getBulkOrderLink, type Product } from "@/lib/products";

export default function BulkOrderSection({ products }: { products: Product[] }) {
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());

  const toggleItem = (productId: string) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.set(productId, 5);
      }
      return next;
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      const current = next.get(productId) || 5;
      const newQty = Math.max(1, Math.min(100, current + delta));
      next.set(productId, newQty);
      return next;
    });
  };

  const bulkItems = Array.from(selectedItems.entries()).map(([id, qty]) => {
    const product = products.find((p) => p.id === id);
    return { name: product?.name || id, qty };
  });

  const hasSelection = selectedItems.size > 0;

  return (
    <section id="bulk-order" className="py-12 sm:py-20 bg-white border-y border-terracotta/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">
            <Users className="w-3 h-3 mr-1" />
            Bulk & Catering
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-3 sm:mb-4">
            Planning an <span className="text-terracotta">Event?</span>
          </h2>
          <p className="text-brown-light/70 text-base sm:text-lg max-w-2xl mx-auto font-sans">
            Weddings, housewarmings, festivals, or corporate events — we handle bulk orders with custom packaging and special pricing
          </p>
        </motion.div>

        {/* Product Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 max-h-96 overflow-y-auto custom-scrollbar pr-2">
          {products.map((product, index) => {
            const isSelected = selectedItems.has(product.id);
            const qty = selectedItems.get(product.id) || 0;
            return (
              <motion.div
                key={`${product.id}:${product.nameEnglish || product.name}:${index}`}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleItem(product.id)}
                className={`bulk-card rounded-xl p-3 sm:p-4 ${isSelected ? "selected" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 relative rounded-lg overflow-hidden flex-shrink-0 bg-cream-dark">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif font-bold text-brown text-xs sm:text-sm truncate">{product.name}</p>
                    <p className="text-brown-light/50 text-[10px] sm:text-xs font-sans">₹{product.price}/{product.priceUnit}</p>
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0 w-5 h-5 bg-terracotta text-white rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 flex items-center justify-between"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[10px] text-brown-light/60 font-sans">Qty:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(product.id, -1)}
                        className="quantity-btn w-7 h-7 text-sm"
                        disabled={qty <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold text-brown font-sans w-6 text-center counter-bump" key={qty}>
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQty(product.id, 1)}
                        className="quantity-btn w-7 h-7 text-sm"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          {!hasSelection ? (
            <p className="text-brown-light/50 text-sm font-sans mb-4">
              👆 Select products above to build your bulk order
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <p className="text-brown font-semibold text-sm font-sans mb-2">
                {selectedItems.size} product{selectedItems.size > 1 ? "s" : ""} selected for bulk order
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {Array.from(selectedItems.entries()).map(([id, qty]) => {
                  const product = products.find((p) => p.id === id);
                  return (
                    <Badge key={id} className="bg-terracotta/10 text-terracotta font-sans text-xs">
                      {product?.name} × {qty}
                    </Badge>
                  );
                })}
              </div>
            </motion.div>
          )}
          <a
            href={hasSelection ? getBulkOrderLink(bulkItems) : undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => { if (!hasSelection) e.preventDefault(); }}
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base sm:text-lg transition-all shadow-xl font-sans wa-ripple ${hasSelection
              ? "bg-whatsapp hover:bg-whatsapp-dark text-white hover:scale-105 shadow-whatsapp/20"
              : "bg-terracotta/20 text-terracotta/50 cursor-not-allowed shadow-none"
              }`}
          >
            <MessageCircle className="w-5 h-5" />
            {hasSelection ? "Send Bulk Inquiry" : "Select Products to Continue"}
          </a>
        </div>
      </div>
    </section>
  );
}
