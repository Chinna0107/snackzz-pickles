import { useState, useEffect } from "react";
import { type Product } from "@/lib/products";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const CACHE_KEY = "snackzee_products_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export type MappedProduct = Product & {
  slug: string;
  quantity_prices: { quantity: string; price: number; mrp?: number }[];
};

// Module-level cache — persists across navigations in same session
let memoryCache: { data: MappedProduct[]; ts: number } | null = null;
let inflight: Promise<MappedProduct[]> | null = null;

function mapProduct(p: any): MappedProduct {
  return {
    id: String(p.id),
    name: p.name,
    nameEnglish: p.name_english,
    category: (() => {
      const cat = (p.category || 'hot-items').replace(/_/g, '-');
      if (cat === 'snacks') return 'hot-items';
      if (cat === 'sweets') return 'sweet-items';
      if (cat === 'powders') return 'podis-powders';
      if (cat === 'pickles') return 'pickles';
      if (cat === 'papads') return 'vadiyalu-papads';
      return cat;
    })(),
    description: p.description || "",
    price: p.price,
    mrp: p.mrp && Number(p.mrp) > 0 ? Number(p.mrp) : null,
    priceUnit: p.price_unit && p.price_unit !== "per pack" ? p.price_unit : "500g",
    image: p.image || "/placeholder.jpg",
    badge: p.badge,
    popular: p.popular || false,
    spiceLevel: p.spice_level || "none",
    shelfLife: p.shelf_life || "N/A",
    serves: p.serves || "N/A",
    ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
    nutrition: p.nutrition || { calories: "0", protein: "0g", carbs: "0g", fat: "0g", fiber: "0g" },
    tags: Array.isArray(p.tags) ? p.tags : [],
    slug: p.slug || String(p.id),
    couponApplicable: p.coupon_applicable !== false,
    quantity_prices: Array.isArray(p.quantity_prices) ? p.quantity_prices.map((qp: { quantity: string; price: number; mrp?: any }) => {
      // Normalize quantity format: "250grms" -> "250g", "100" -> "100g", "1kg" -> "1kg"
      let qty = qp.quantity.trim().toLowerCase();
      // Replace various gram suffixes with 'g'
      qty = qty.replace(/\s*grms?\s*$/i, 'g').replace(/\s*gms?\s*$/i, 'g').replace(/\s*grams?\s*$/i, 'g');
      // If it's just a number, add 'g' suffix
      if (/^\d+$/.test(qty)) {
        qty = `${qty}g`;
      }
      return { 
        ...qp, 
        quantity: qty, 
        mrp: qp.mrp && Number(qp.mrp) > 0 ? Number(qp.mrp) : null 
      };
    }) : [],
  };
}

function getLocalCache(): MappedProduct[] | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch { return null; }
}

function setLocalCache(data: MappedProduct[]) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); }
  catch {}
}

async function fetchFromAPI(): Promise<MappedProduct[]> {
  const res = await fetch(`${BACKEND_URL}/products`);
  const data = await res.json();
  if (!data.products || !Array.isArray(data.products)) return [];
  return data.products.map(mapProduct).sort((a: MappedProduct, b: MappedProduct) => Number(a.id) - Number(b.id));
}

// Call this on hover/focus of nav links to pre-warm cache
export function prefetchProducts() {
  if (memoryCache && Date.now() - memoryCache.ts < CACHE_TTL) return;
  if (inflight) return;
  inflight = fetchFromAPI()
    .then((data) => {
      if (data.length > 0) {
        memoryCache = { data, ts: Date.now() };
        setLocalCache(data);
      }
      return data;
    })
    .finally(() => { inflight = null; });
}

export function useProducts() {
  // Initialize synchronously from memory cache — no flash
  const [products, setProducts] = useState<MappedProduct[]>(() => {
    if (memoryCache && Date.now() - memoryCache.ts < CACHE_TTL) return memoryCache.data;
    return [];
  });
  const [loading, setLoading] = useState(() => {
    return !(memoryCache && Date.now() - memoryCache.ts < CACHE_TTL);
  });

  useEffect(() => {
    // Already have fresh memory cache — done
    if (memoryCache && Date.now() - memoryCache.ts < CACHE_TTL) {
      setProducts(memoryCache.data);
      setLoading(false);
      return;
    }

    // Show localStorage cache immediately while fetching
    const local = getLocalCache();
    if (local && local.length > 0) {
      setProducts(local);
      setLoading(false);
    }

    // Fetch fresh data
    if (!inflight) {
      inflight = fetchFromAPI()
        .then((data) => {
          if (data.length > 0) {
            memoryCache = { data, ts: Date.now() };
            setLocalCache(data);
          }
          return data;
        })
        .finally(() => { inflight = null; });
    }

    inflight
      .then((data) => { if (data.length > 0) setProducts(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const invalidate = () => {
    memoryCache = null;
    try { localStorage.removeItem(CACHE_KEY); } catch {}
  };

  return { products, loading, invalidate };
}
