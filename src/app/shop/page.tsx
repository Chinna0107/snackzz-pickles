"use client";

import Footer from "@/components/Footer";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Check, Search, XCircle, Crown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { categories, SPICE_LABELS, type Product, type SpiceLevel } from "@/lib/products";
import Header from "@/components/Header";

function SpiceBadge({ level }: { level: SpiceLevel }) {
  const spice = SPICE_LABELS[level] ?? SPICE_LABELS["none"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold font-sans ${spice.color}`}>
      {spice.emoji} {spice.label}
    </span>
  );
}

function ProductCard({ product, isFavorite, onToggleFavorite }: {
  product: Product & { slug?: string };
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  const { addItem, items } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const inCart = items.some((i) => i.product.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    toast({ title: "Added to cart! 🛒", description: product.nameEnglish });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      onClick={() => router.push(`/products/${product.slug || product.id}`)}
      className="group bg-white rounded-2xl border border-terracotta/10 overflow-hidden cursor-pointer hover:shadow-lg hover:border-terracotta/20 transition-all duration-300 flex"
    >
      {/* Image — left side */}
      <div className="relative w-36 sm:w-44 flex-shrink-0 overflow-hidden bg-cream-dark">
        <Image src={product.image} alt={product.name} fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 144px, 176px" />
        {product.badge && (
          <span className="absolute top-2 left-2 bg-terracotta text-white text-[9px] font-bold font-sans px-2 py-0.5 rounded-full">
            {product.badge}
          </span>
        )}
        {product.popular && !product.badge && (
          <div className="absolute top-2 right-2 bg-gold text-brown w-7 h-7 rounded-full flex items-center justify-center shadow">
            <Crown className="w-3.5 h-3.5 fill-current" />
          </div>
        )}
        <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}
          className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${isFavorite ? "bg-terracotta text-white" : "bg-white/80 text-brown-light/50 hover:text-terracotta"}`}>
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Content — right side */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-sans font-semibold text-terracotta uppercase tracking-wider bg-terracotta/10 px-2 py-0.5 rounded-full">
              {product.category}
            </span>
            <SpiceBadge level={product.spiceLevel} />
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-brown group-hover:text-terracotta transition-colors leading-tight">
            {product.name}
          </h3>
          <p className="text-brown-light/50 text-xs font-sans mb-1">{product.nameEnglish}</p>
          <p className="text-brown-light/60 text-sm font-sans line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3 gap-3">
          <div>
            <span className="font-serif text-2xl font-bold text-gold">₹{product.price}</span>
            <span className="text-brown-light/40 text-xs ml-1 font-sans">/ {product.priceUnit}</span>
          </div>

          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm font-sans transition-all duration-300 flex-shrink-0 ${
              added || inCart
                ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                : "bg-terracotta hover:bg-terracotta-dark text-white shadow-md shadow-terracotta/20 hover:scale-105"
            }`}
          >
            <AnimatePresence mode="wait">
              {added || inCart ? (
                <motion.span key="added" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> {inCart && !added ? "In Cart" : "Added!"}
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const { products, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get("category") || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("snakzee-favorites");
      if (stored) setFavorites(new Set(JSON.parse(stored)));
    } catch {}
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("snakzee-favorites", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-2">Our Collection</h1>
            <p className="text-brown-light/70 text-base font-sans">Handmade with traditional recipes. Fresh, authentic, no preservatives.</p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
              <input type="text" placeholder="Search products..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white text-brown text-sm font-sans placeholder:text-brown-light/40 border border-terracotta/10 focus:outline-none focus:border-terracotta/30" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light/40 hover:text-brown-light">
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
            <button onClick={() => setActiveCategory("all")}
              className={`px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all font-sans ${activeCategory === "all" ? "bg-terracotta text-white shadow-lg shadow-terracotta/20" : "bg-white text-brown-light border border-terracotta/10 hover:border-terracotta/30"}`}>
              All Items
            </button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all font-sans ${activeCategory === cat.id ? "bg-terracotta text-white shadow-lg shadow-terracotta/20" : "bg-white text-brown-light border border-terracotta/10 hover:border-terracotta/30"}`}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Count */}
          {!loading && (
            <p className="text-brown-light/50 text-sm font-sans mb-4">{filteredProducts.length} products</p>
          )}

          {/* Products List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto bg-terracotta/10 rounded-full flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-terracotta/40" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brown mb-2">No products found</h3>
              <p className="text-brown-light/60 text-sm font-sans">
                {activeCategory !== "all"
                  ? `No products in "${categories.find(c => c.id === activeCategory)?.name}" yet.`
                  : "Try a different search term."}
              </p>
              <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="mt-4 text-terracotta font-semibold text-sm font-sans hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product}
                    isFavorite={favorites.has(product.id)}
                    onToggleFavorite={toggleFavorite} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
