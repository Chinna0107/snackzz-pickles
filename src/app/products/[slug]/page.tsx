"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Share2, Clock, Users, Flame, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const SPICE_LABELS = [
  { label: "No Spice", emoji: "😊", color: "bg-green-100 text-green-700" },
  { label: "Mild", emoji: "🌶️", color: "bg-yellow-100 text-yellow-700" },
  { label: "Medium", emoji: "🌶️🌶️", color: "bg-orange-100 text-orange-700" },
  { label: "Hot", emoji: "🌶️🌶️🌶️", color: "bg-red-100 text-red-700" },
];

interface Product {
  id: number;
  name: string;
  name_english: string;
  category: string;
  description: string;
  price: number;
  price_unit: string;
  mrp?: number;
  quantity_prices: { quantity: string; price: number; mrp?: number }[];
  image: string;
  images: string[];
  badge?: string;
  popular: boolean;
  spice_level: number;
  shelf_life: string;
  serves: string;
  ingredients: string[];
  nutrition: { calories: string; protein: string; carbs: string; fat: string; fiber: string };
  tags: string[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      // Try slug first, fallback to ID
      const isNumeric = /^\d+$/.test(String(params.slug));
      const url = isNumeric
        ? `${BACKEND_URL}/products/${params.slug}`
        : `${BACKEND_URL}/products/slug/${params.slug}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.product) {
        setProduct(data.product);
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to load product", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!product) return;
    const price = selectedQuantity !== null ? product.quantity_prices[selectedQuantity].price : product.price;
    const priceUnit = selectedQuantity !== null ? product.quantity_prices[selectedQuantity].quantity : product.price_unit;
    addItem({
      id: String(product.id),
      name: product.name,
      nameEnglish: product.name_english,
      category: product.category,
      description: product.description || "",
      price,
      priceUnit,
      image: product.image || "/placeholder.jpg",
      badge: product.badge,
      popular: product.popular,
      spiceLevel: product.spice_level as any,
      shelfLife: product.shelf_life || "",
      serves: product.serves || "",
      ingredients: product.ingredients || [],
      nutrition: product.nutrition || { calories: "0", protein: "0g", carbs: "0g", fat: "0g", fiber: "0g" },
      tags: product.tags || [],
    });
    toast({ title: "Added to cart! 🛒", description: `${product.name_english} added successfully` });
  };

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <p className="text-brown-light/50 font-sans">Product not found</p>
    </div>
  );

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const currentPrice = selectedQuantity !== null ? product.quantity_prices[selectedQuantity].price : product.price;
  const currentMRP = selectedQuantity !== null ? product.quantity_prices[selectedQuantity].mrp : product.mrp;
  const discount = currentMRP ? Math.round(((currentMRP - currentPrice) / currentMRP) * 100) : 0;

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      {/* Header */}
      <div className="bg-white border-b border-terracotta/10 sticky top-16 sm:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="text-brown-light hover:text-brown transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-serif font-bold text-brown text-lg sm:text-xl truncate">{product.name}</h1>
            <p className="text-brown-light/50 text-xs font-sans">{product.name_english}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 mt-16 sm:mt-20">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="relative aspect-square bg-white rounded-2xl border border-terracotta/10 overflow-hidden">
              {product.badge && (
                <span className="absolute top-4 left-4 bg-terracotta text-white text-xs font-bold font-sans px-3 py-1 rounded-full z-10">
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold font-sans px-3 py-1 rounded-full z-10">
                  {discount}% OFF
                </span>
              )}
              {allImages[selectedImage] ? (
                <Image src={allImages[selectedImage]} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brown-light/30">No Image</div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl border-2 overflow-hidden transition-all ${
                      selectedImage === i ? "border-terracotta" : "border-terracotta/10 hover:border-terracotta/30"
                    }`}>
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h2 className="font-serif text-3xl font-bold text-brown mb-2">{product.name}</h2>
              <p className="text-brown-light/70 text-lg font-sans mb-4">{product.name_english}</p>
              
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-serif text-4xl font-bold text-terracotta">₹{currentPrice}</span>
                {currentMRP && currentMRP > currentPrice && (
                  <>
                    <span className="text-brown-light/40 text-xl line-through">₹{currentMRP}</span>
                    <span className="text-green-600 text-sm font-bold font-sans">{discount}% OFF</span>
                  </>
                )}
              </div>
              <p className="text-brown-light/50 text-sm font-sans">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-sans font-bold text-brown mb-2">About this product</h3>
                <p className="text-brown-light/70 text-sm font-sans leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity Selection */}
            {product.quantity_prices && product.quantity_prices.length > 0 && (
              <div>
                <h3 className="font-sans font-bold text-brown mb-3">Select Quantity</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button onClick={() => setSelectedQuantity(null)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedQuantity === null ? "border-terracotta bg-terracotta/5" : "border-terracotta/10 hover:border-terracotta/30"
                    }`}>
                    <p className="font-sans font-bold text-brown text-sm">{product.price_unit}</p>
                    <p className="font-serif font-bold text-terracotta">₹{product.price}</p>
                  </button>
                  {product.quantity_prices.map((qp, i) => (
                    <button key={i} onClick={() => setSelectedQuantity(i)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedQuantity === i ? "border-terracotta bg-terracotta/5" : "border-terracotta/10 hover:border-terracotta/30"
                      }`}>
                      <p className="font-sans font-bold text-brown text-sm">{qp.quantity}</p>
                      <p className="font-serif font-bold text-terracotta">₹{qp.price}</p>
                      {qp.mrp && qp.mrp > qp.price && (
                        <p className="text-brown-light/40 text-xs line-through">₹{qp.mrp}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button onClick={addToCart}
                className="flex-1 bg-terracotta hover:bg-terracotta-dark text-white px-6 py-4 rounded-xl font-bold font-sans text-lg transition-all hover:scale-[1.02] shadow-lg shadow-terracotta/20 flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button className="w-14 h-14 bg-white hover:bg-cream border border-terracotta/10 rounded-xl flex items-center justify-center transition-colors">
                <Heart className="w-5 h-5 text-brown-light" />
              </button>
              <button className="w-14 h-14 bg-white hover:bg-cream border border-terracotta/10 rounded-xl flex items-center justify-center transition-colors">
                <Share2 className="w-5 h-5 text-brown-light" />
              </button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-3">
              {product.shelf_life && (
                <div className="bg-white rounded-xl border border-terracotta/10 p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-terracotta flex-shrink-0" />
                  <div>
                    <p className="text-brown-light/50 text-xs font-sans">Shelf Life</p>
                    <p className="font-sans font-semibold text-brown text-sm">{product.shelf_life}</p>
                  </div>
                </div>
              )}
              {product.serves && (
                <div className="bg-white rounded-xl border border-terracotta/10 p-4 flex items-center gap-3">
                  <Users className="w-5 h-5 text-terracotta flex-shrink-0" />
                  <div>
                    <p className="text-brown-light/50 text-xs font-sans">Serves</p>
                    <p className="font-sans font-semibold text-brown text-sm">{product.serves}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Spice Level */}
            {product.spice_level !== undefined && (
              <div className="bg-white rounded-xl border border-terracotta/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-terracotta" />
                  <h3 className="font-sans font-bold text-brown">Spice Level</h3>
                </div>
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${SPICE_LABELS[product.spice_level]?.color || "bg-cream text-brown"}`}>
                  <span>{SPICE_LABELS[product.spice_level]?.emoji}</span>
                  <span>{SPICE_LABELS[product.spice_level]?.label}</span>
                </span>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="bg-white rounded-xl border border-terracotta/10 p-4">
                <h3 className="font-sans font-bold text-brown mb-3">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, i) => (
                    <span key={i} className="px-3 py-1 bg-cream rounded-full text-brown-light text-sm font-sans">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition */}
            {product.nutrition && (
              <div className="bg-white rounded-xl border border-terracotta/10 p-4">
                <h3 className="font-sans font-bold text-brown mb-3">Nutrition Facts (per 100g)</h3>
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(product.nutrition).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="font-serif font-bold text-brown text-lg">{value}</p>
                      <p className="text-brown-light/50 text-xs font-sans capitalize">{key}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-terracotta/5 text-terracotta rounded-full text-xs font-sans font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
