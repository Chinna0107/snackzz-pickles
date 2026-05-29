"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { products, type Product } from "@/lib/products";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Heart, Search, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { addItem, items: cartItems } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  // Load wishlist from local storage
  useEffect(() => {
    const stored = localStorage.getItem("snackzee_wishlist");
    if (stored) {
      try {
        setWishlistIds(JSON.parse(stored));
      } catch (err) {}
    }
  }, []);

  const handleRemoveFromWishlist = (id: string, nameEnglish: string) => {
    const updated = wishlistIds.filter((item) => item !== id);
    setWishlistIds(updated);
    localStorage.setItem("snackzee_wishlist", JSON.stringify(updated));
    
    // Dispatch a storage event to alert Header component in real time
    window.dispatchEvent(new Event("storage"));

    toast({
      title: "Removed from Wishlist 💔",
      description: nameEnglish,
    });
  };

  const handleAddToCart = (product: Product) => {
    addItem(product as any);
    toast({
      title: "Added to Cart! 🛒",
      description: product.nameEnglish,
    });
  };

  // Map wishlist IDs to full product objects
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="pt-20 sm:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Header Area */}
          <div className="text-center mb-10">
            <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 mb-3 px-3 py-1 font-sans">
              ♡ My Favorites
            </Badge>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown">My Wishlist</h1>
            <p className="text-brown-light/60 font-sans mt-2">Your saved cravings, ready to order whenever you are.</p>
          </div>

          <AnimatePresence mode="wait">
            {wishlistedProducts.length === 0 ? (
              
              // Empty State
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="text-center py-20 bg-white rounded-3xl border border-terracotta/10 max-w-xl mx-auto px-6 shadow-xl"
              >
                <div className="w-20 h-20 bg-terracotta/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-terracotta/10 shadow-inner">
                  <Heart className="w-10 h-10 text-terracotta-light" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-brown mb-2">Your Wishlist is Empty</h2>
                <p className="text-brown-light/60 font-sans mb-8">
                  Browse our authentic homemade snacks and save your favorite treats here!
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white font-sans font-bold px-8 py-3.5 rounded-full transition-all shadow-lg hover:scale-105"
                >
                  <Search className="w-4 h-4" /> Start Exploring
                </Link>
              </motion.div>
            ) : (
              
              // Wishlist Grid
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {wishlistedProducts.map((product) => {
                  const inCart = cartItems.some((i) => i.product.id === product.id);
                  return (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="group bg-white rounded-2xl border border-terracotta/10 overflow-hidden shadow-md hover:shadow-xl hover:border-terracotta/20 transition-all flex flex-col justify-between"
                    >
                      {/* Product Image Frame */}
                      <div className="relative aspect-square w-full bg-cream-dark overflow-hidden cursor-pointer" onClick={() => router.push(`/products/${product.id}`)}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        {product.badge && (
                          <span className="absolute top-3 left-3 bg-terracotta text-white text-[9px] font-bold font-sans px-2.5 py-1 rounded-full shadow">
                            {product.badge}
                          </span>
                        )}
                        
                        {/* Remove Action Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromWishlist(product.id, product.nameEnglish);
                          }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-red-500 shadow hover:shadow-lg flex items-center justify-center transition-all duration-200"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Product Content Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-sans font-semibold text-terracotta uppercase tracking-wider bg-terracotta/10 px-2.5 py-0.5 rounded-full">
                              {product.category.replace("-", " ")}
                            </span>
                            <span className="text-xs text-brown-light/50 font-sans">{product.shelfLife} shelf</span>
                          </div>
                          
                          <h3 className="font-serif text-lg font-bold text-brown group-hover:text-terracotta transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-brown-light/50 text-xs font-sans mb-2">{product.nameEnglish}</p>
                          <p className="text-brown-light/70 text-xs font-sans line-clamp-2 leading-relaxed mb-4">
                            {product.description}
                          </p>
                        </div>

                        {/* Price & Add to Cart Action */}
                        <div className="flex items-center justify-between mt-auto border-t border-terracotta/5 pt-3">
                          <div>
                            <span className="font-sans text-xl font-normal text-gold">₹{product.price}</span>
                            <span className="text-brown-light/40 text-[10px] ml-0.5 font-sans">/ {product.priceUnit}</span>
                          </div>

                          <motion.button
                            onClick={() => handleAddToCart(product)}
                            whileTap={{ scale: 0.95 }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                              inCart
                                ? "bg-green-500 text-white shadow shadow-green-500/20"
                                : "bg-terracotta hover:bg-terracotta-dark text-white shadow shadow-terracotta/20 hover:scale-105"
                            }`}
                            title={inCart ? "Already in Cart" : "Add to Cart"}
                          >
                            {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
      <Footer />
    </div>
  );
}
