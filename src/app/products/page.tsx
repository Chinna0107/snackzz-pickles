"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, XCircle, ShoppingCart, Heart, Share2, Crown, BarChart3,
  CalendarClock, UsersRound, MessageCircle, Filter, ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import {
  products as staticProducts,
  categories,
  SPICE_LABELS,
  getWhatsAppLink,
  getShareLink,
  type Product,
  type SpiceLevel,
} from "@/lib/products";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function SpiceLevelBadge({ level }: { level: SpiceLevel }) {
  const spice = SPICE_LABELS[level] ?? SPICE_LABELS["none"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold font-sans ${spice.color}`}>
      <span>{spice.emoji}</span>
      <span>{spice.label}</span>
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isFav, setIsFav] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    toast({ title: "Added to cart! 🛒", description: `${product.name} added.` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={() => router.push(`/products/${product.id}`)}
      className="group bg-white rounded-2xl border border-terracotta/10 overflow-hidden cursor-pointer hover:shadow-xl hover:border-terracotta/20 transition-all"
    >
      <div className="relative aspect-square overflow-hidden bg-cream-dark">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.badge && (
          <div className="absolute top-0 right-0 bg-terracotta text-white text-[10px] font-bold font-sans px-3 py-1 rounded-bl-xl">
            {product.badge}
          </div>
        )}
        {product.popular && !product.badge && (
          <div className="absolute top-3 right-3 bg-gold text-brown w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
            <Crown className="w-4 h-4 fill-current" />
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setIsFav(!isFav); }}
          className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${isFav ? "bg-terracotta text-white" : "bg-white/80 text-brown-light/50 hover:text-terracotta"}`}
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="secondary" className="bg-terracotta/10 text-terracotta font-sans text-[10px] uppercase tracking-wider">
            {categories.find(c => c.id === product.category)?.name || product.category}
          </Badge>
          <SpiceLevelBadge level={product.spiceLevel} />
        </div>
        <h3 className="font-serif text-xl font-bold text-brown mb-0.5 group-hover:text-terracotta transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-brown-light/50 text-[12px] font-sans mb-1">({product.nameEnglish})</p>
        <p className="text-brown-light/60 text-sm leading-relaxed mb-3 line-clamp-2 font-sans">
          {product.description}
        </p>
        <div className="flex items-center gap-2 mb-3 text-brown-light/50 text-[11px] font-sans">
          <span className="flex items-center gap-1"><CalendarClock className="w-3 h-3" />{product.shelfLife}</span>
          <span className="flex items-center gap-1"><UsersRound className="w-3 h-3" />{product.serves}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-gold font-serif">₹{product.price}</span>
            <span className="text-brown-light/40 text-xs ml-1 font-sans">/ {product.priceUnit}</span>
          </div>
          <a
            href={getShareLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 bg-cream hover:bg-terracotta/10 text-brown-light hover:text-terracotta rounded-full flex items-center justify-center transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
          </a>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white px-4 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-[1.02] shadow-md shadow-terracotta/20 font-sans"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get("category") || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/products`);
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          const mapped = data.products.map((p: any) => ({
            id: String(p.id),
            name: p.name,
            nameEnglish: p.name_english,
            category: p.category ? p.category.replace(/_/g, "-") : "hot-items",
            description: p.description || "",
            price: p.price,
            priceUnit: p.price_unit || "per pack",
            image: p.image || "/placeholder.jpg",
            badge: p.badge,
            popular: p.popular || false,
            spiceLevel: p.spice_level || "none",
            shelfLife: p.shelf_life || "N/A",
            serves: p.serves || "N/A",
            ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
            nutrition: p.nutrition || { calories: "0", protein: "0g", carbs: "0g", fat: "0g", fiber: "0g" },
            tags: Array.isArray(p.tags) ? p.tags : [],
          }));
          setProducts(mapped);
        } else {
          setProducts(staticProducts);
        }
      } catch {
        setProducts(staticProducts);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    router.push(cat === "all" ? "/products" : `/products?category=${cat}`, { scroll: false });
  };

  const filtered = products
    .filter((p) => {
      const matchCat = activeCategory === "all" || p.category === activeCategory;
      const matchSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "popular") return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      return 0;
    });

  const activeCatInfo = categories.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="pt-20 sm:pt-24">
        {/* Page Header */}
        <div className="bg-gradient-to-br from-brown via-brown-light to-terracotta-dark py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <Badge className="bg-white/10 text-cream border-white/20 mb-4 font-sans">
              🌿 100% Homemade · No Preservatives
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-cream mb-4">
              {activeCatInfo ? (
                <>{activeCatInfo.icon} {activeCatInfo.name}</>
              ) : "Our Products"}
            </h1>
            <p className="text-cream/70 text-base sm:text-lg max-w-2xl mx-auto font-sans">
              {activeCatInfo
                ? `Authentic ${activeCatInfo.name} — handcrafted with traditional Telangana recipes`
                : "Handcrafted snacks, sweets, podis & vadiyalu — made fresh with traditional recipes"}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 justify-center">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all font-sans ${activeCategory === "all" ? "bg-terracotta text-white shadow-lg shadow-terracotta/20" : "bg-white text-brown-light border border-terracotta/10 hover:border-terracotta/30"}`}
            >
              All Products ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all font-sans flex items-center gap-1.5 ${activeCategory === cat.id ? "bg-terracotta text-white shadow-lg shadow-terracotta/20" : "bg-white text-brown-light border border-terracotta/10 hover:border-terracotta/30"}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70">({products.filter(p => p.category === cat.id).length})</span>
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-terracotta/10 text-brown text-sm font-sans placeholder:text-brown-light/40 focus:outline-none focus:border-terracotta/30"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light/40 hover:text-brown-light">
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-9 pr-8 py-3 rounded-xl bg-white border border-terracotta/10 text-brown text-sm font-sans focus:outline-none focus:border-terracotta/30 appearance-none cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40 pointer-events-none" />
            </div>
          </div>

          {/* Results count */}
          <p className="text-brown-light/50 text-sm font-sans mb-6">
            Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "all" && ` in ${activeCatInfo?.name}`}
            {searchQuery && ` for "${searchQuery}"`}
          </p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto bg-terracotta/10 rounded-full flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-terracotta/40" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brown mb-2">No products found</h3>
              <p className="text-brown-light/60 text-sm font-sans mb-4">Try a different search or category.</p>
              <button onClick={() => { setSearchQuery(""); handleCategoryChange("all"); }} className="text-terracotta font-semibold text-sm font-sans hover:text-terracotta-dark transition-colors">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* WhatsApp CTA */}
          <div className="mt-16 bg-gradient-to-r from-terracotta to-terracotta-dark rounded-2xl p-8 text-center">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream mb-3">Can't find what you're looking for?</h3>
            <p className="text-cream/70 font-sans mb-6">Message us on WhatsApp — we can make custom orders!</p>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-terracotta px-8 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 shadow-xl font-sans"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
