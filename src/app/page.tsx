"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import TopAnnouncementBar from "@/components/TopAnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  MessageCircle,
  Phone,
  Instagram,
  MapPin,
  Clock,
  Truck,
  HomeIcon,
  Leaf,
  Star,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  Heart,
  ExternalLink,
  Send,
  Package,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Gift,
  Tag,
  Search,
  XCircle,
  BookOpen,
  Mail,
  Users,
  Flame,
  Crown,
  Share2,
  Minus,
  Plus,
  ChefHat,
  UtensilsCrossed,
  CalendarClock,
  UsersRound,
  Timer,
  Wheat,
  Beaker,
  Zap,
  Medal,
  Award,
  Gem,
  BarChart3,
  Filter,
  Check,
  Bot,
  SendHorizonal,
  ShoppingCart,
  ShoppingBag,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import BulkOrderSection from "@/components/BulkOrderSection";
import {
  products as staticProducts,
  categories,
  GRAM_OPTIONS,
  MARQUEE_ITEMS,
  REVIEWS,
  COMBOS,
  FAQS,
  GIFT_WRAP_OPTIONS,
  RECIPES,
  FESTIVALS,
  VIDEO_TESTIMONIALS,
  INGREDIENTS_GLOSSARY,
  GIFT_CARDS,
  CHATBOT_QA,
  compareProducts,
  getWhatsAppLink,
  getComboWhatsAppLink,
  getShareLink,
  getBulkOrderLink,
  priceForGramOption,
  productForGramOption,
  SPICE_LABELS,
  PROCESS_STEPS,
  type Category,
  type Product,
  type Combo,
  type SpiceLevel,
  type GiftWrapOption,
  type GiftCardOption,
  type IngredientInfo,
  type GramOption,
} from "@/lib/products";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function getProductRenderKey(product: Product & { slug?: string }, index: number): string {
  return `${product.id}:${product.slug || product.nameEnglish || product.name}:${index}`;
}

// ─── Seasonal Banner ────────────────────────────────────────
function SeasonalBanner() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem("banner-dismissed") === "true";
    }
    return false;
  });

  if (dismissed) return null;

  return (
    <div className="banner-slide-down bg-gradient-to-r from-terracotta via-terracotta-light to-terracotta text-cream text-center py-2 px-4 relative z-[60]" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-sans font-medium">
        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
        <span>
          🎉 Ugadi Special! Free delivery on all orders this week!{" "}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold hover:text-gold transition-colors"
          >
            Order Now
          </a>
        </span>
        <button
          onClick={() => {
            setDismissed(true);
            sessionStorage.setItem("banner-dismissed", "true");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-cream/10 rounded-full transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Announcement Bar ────────────────────────────────────────
function AnnouncementBar() {
  return (
    <div className="announcement-bar text-cream/80 text-center py-1.5 px-4 text-[11px] sm:text-xs font-sans tracking-wide relative z-[55]">
      <span className="inline-flex items-center gap-1.5">
        <Truck className="w-3 h-3" />
        Free delivery on orders above ₹1,000 across Telangana!
        <span className="text-cream/40 mx-2">|</span>
        <Phone className="w-3 h-3" />
        <a href={`tel:+919305550051`} className="hover:text-gold transition-colors">+91 93055 50051</a>
      </span>
    </div>
  );
}

// ─── Sticky Navigation ───────────────────────────────────────
function StickyNav({ onCategorySelect, searchQuery, onSearchChange }: { onCategorySelect: (id: string) => void; searchQuery: string; onSearchChange: (q: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; email: string } | null>(null);
  const { count: cartCount, total } = useCart();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Real-time wishlist count listener
  useEffect(() => {
    const updateWishlistCount = () => {
      const stored = localStorage.getItem("snackzee_wishlist");
      if (stored) {
        try {
          setWishlistCount(JSON.parse(stored).length);
        } catch {
          setWishlistCount(0);
        }
      } else {
        setWishlistCount(0);
      }
    };
    updateWishlistCount();
    window.addEventListener("storage", updateWishlistCount);
    return () => window.removeEventListener("storage", updateWishlistCount);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("snackzee_user");
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoggedInUser(JSON.parse(stored));
      } catch { }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("snackzee_token");
    localStorage.removeItem("snackzee_user");
    setLoggedInUser(null);
    setUserMenuOpen(false);
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    setSearchOpen(false);
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-[100] w-full">
      <TopAnnouncementBar hidden={false} />
      <nav
        className={`w-full transition-all duration-300 ${scrolled
          ? "bg-white/98 backdrop-blur-xl shadow-xl border-b-2 border-terracotta/20"
          : "bg-cream/95 backdrop-blur-md border-b border-transparent"
          }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link href="/">
            <motion.div className="cursor-pointer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="relative h-10 sm:h-12 w-[140px] sm:w-[190px]">
                <Image src="/logo-removebg-preview.png" alt="Snakzee" fill className="object-contain object-left" priority sizes="160px" />
              </div>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link href="/">
              <motion.span whileHover={{ scale: 1.05 }} className="relative group flex items-center gap-1.5 px-3 py-2 text-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide uppercase cursor-pointer">
                <HomeIcon className="w-4 h-4" />Home
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.span>
            </Link>

            {/* Products Dropdown */}
            <div className="relative" ref={dropdownRef} onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)} onClick={() => router.push('/products')}
                className="relative group flex items-center gap-1.5 px-3 py-2 text-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide uppercase"
              >
                Products
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`} />
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.button>
              <AnimatePresence>
                {productsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-terracotta/10 overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <Link href="/products" onClick={() => setProductsOpen(false)}>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-terracotta/5 transition-colors cursor-pointer group">
                          <span className="text-xl">🛍️</span>
                          <div>
                            <p className="font-sans font-semibold text-brown text-sm group-hover:text-terracotta transition-colors">All Products</p>
                            <p className="text-brown-light/40 text-[10px] font-sans">Browse everything</p>
                          </div>
                        </div>
                      </Link>
                      <div className="h-px bg-terracotta/10 my-1" />
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => { setProductsOpen(false); router.push(`/products?category=${cat.id}`); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-terracotta/5 transition-colors group text-left"
                        >
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-cream"><Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="40px" /></div>
                          <div>
                            <p className="font-sans font-semibold text-brown text-sm group-hover:text-terracotta transition-colors">{cat.name}</p>
                            <p className="text-brown-light/40 text-[10px] font-sans">{cat.nameTelugu}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/cook-with-snakzee">
              <motion.span whileHover={{ scale: 1.05 }} className="relative group flex items-center gap-1.5 px-3 py-2 text-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide uppercase cursor-pointer">
                Cook with Snakzee
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.span>
            </Link>

            <Link href="/about">
              <motion.span whileHover={{ scale: 1.05 }} className="relative group flex items-center gap-1.5 px-3 py-2 text-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide uppercase cursor-pointer">
                About
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.span>
            </Link>

            <Link href="/contact">
              <motion.span whileHover={{ scale: 1.05 }} className="relative group flex items-center gap-1.5 px-3 py-2 text-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide uppercase cursor-pointer">
                Contact
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "180px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSearch}
                    className="overflow-hidden"
                  >
                    <input
                      ref={searchRef}
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                      onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                      placeholder="Search products..."
                      className="w-full px-3 py-2 rounded-xl bg-cream border border-terracotta/20 text-brown text-sm font-sans placeholder:text-brown-light/40 focus:outline-none focus:border-terracotta/40"
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                onClick={searchOpen ? handleSearch : openSearch}
                className="w-10 h-10 flex items-center justify-center text-brown hover:text-terracotta rounded-full hover:bg-terracotta/10 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>
            </div>

            {/* ♡ Wishlist Navigation Icon */}
            <Link href="/wishlist">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-10 h-10 rounded-full flex items-center justify-center text-brown hover:bg-terracotta/10 transition-colors cursor-pointer"
                title="My Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-terracotta text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md">
                    {wishlistCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            <Link href="/cart">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-terracotta hover:bg-terracotta-dark text-white rounded-full transition-all shadow-lg hover:shadow-xl">
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold text-sm">₹{total}</span>
                {cartCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-brown text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>
            {loggedInUser ? (
              <div className="relative hidden lg:block" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border border-terracotta/20 hover:bg-terracotta/5 transition-colors">
                  <div className="w-7 h-7 bg-terracotta text-white rounded-full flex items-center justify-center text-xs font-bold font-sans">
                    {loggedInUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-brown font-sans font-semibold text-sm max-w-[80px] truncate">{loggedInUser.name.split(" ")[0]}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-brown-light/50 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-terracotta/10 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-terracotta/10">
                        <p className="font-sans font-semibold text-brown text-sm truncate">{loggedInUser.name}</p>
                        <p className="text-brown-light/40 text-[10px] font-sans truncate">{loggedInUser.email}</p>
                      </div>
                      <Link href="/orders" onClick={() => setUserMenuOpen(false)}>
                        <div className="flex items-center gap-2 px-4 py-3 hover:bg-terracotta/5 text-brown font-sans text-sm cursor-pointer transition-colors">
                          <ShoppingBag className="w-4 h-4 text-terracotta" /> My Orders
                        </div>
                      </Link>
                      <button onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-400 font-sans text-sm w-full transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="hidden lg:flex items-center gap-1.5 border-2 border-terracotta/30 text-terracotta hover:bg-terracotta hover:text-white px-4 py-2.5 rounded-full font-semibold text-sm transition-all font-sans">
                Sign In
              </Link>
            )}
            <button className="md:hidden p-2 text-brown hover:bg-terracotta/10 rounded-full transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cream/98 backdrop-blur-lg border-b border-terracotta/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <Link href="/">
                <div onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium cursor-pointer">
                  <HomeIcon className="w-4 h-4" /> Home
                </div>
              </Link>
              <div className="px-4 pt-2 pb-1">
                <p className="text-brown-light/40 text-[10px] font-sans uppercase tracking-widest mb-1">Products</p>
                <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-2 px-3 py-2.5 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium text-sm cursor-pointer">
                    🛍️ All Products
                  </div>
                </Link>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => { setMobileMenuOpen(false); router.push(`/products?category=${cat.id}`); }} className="w-full flex items-center gap-2 px-3 py-2.5 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium text-sm text-left">
                    <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-cream mr-2"><Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="32px" /></div> {cat.name} <span className="text-brown-light/40 text-[11px] font-sans">({cat.nameTelugu})</span>
                  </button>
                ))}
              </div>
              <Link href="/about">
                <div onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium cursor-pointer">
                  About Us
                </div>
              </Link>
              <Link href="/contact">
                <div onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium cursor-pointer">
                  Contact Us
                </div>
              </Link>
              {loggedInUser ? (
                <>
                  <div className="px-4 py-2 border-t border-terracotta/10">
                    <p className="text-brown font-sans font-semibold text-sm">{loggedInUser.name}</p>
                    <p className="text-brown-light/40 text-xs font-sans">{loggedInUser.email}</p>
                  </div>
                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center gap-2 px-4 py-3 text-brown hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium cursor-pointer">
                      <ShoppingBag className="w-4 h-4" /> My Orders
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors font-medium w-full">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <Link href="/login">
                  <div onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full bg-terracotta hover:bg-terracotta-dark text-white px-4 py-3 rounded-full font-semibold text-sm transition-all mt-2 cursor-pointer">
                    Sign In
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </div>
  );
}

// ─── Hero Section ────────────────────────────────────────────
function HeroSection() {
  const [banners, setBanners] = useState<{ id: string; url: string; public_id: string; label: string; active: boolean }[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    fetch(`${backendUrl}/banners`)
      .then((r) => r.json())
      .then((d) => {
        const all = (d.banners || []).filter((b: { active: boolean }) => b.active);
        if (all.length > 0) { setBanners(all); return; }
        try {
          const stored = localStorage.getItem("snackzee_hero_banners");
          if (stored) {
            const local = JSON.parse(stored).filter((b: { active: boolean }) => b.active);
            if (local.length > 0) setBanners(local);
          }
        } catch { }
      })
      .catch(() => {
        try {
          const stored = localStorage.getItem("snackzee_hero_banners");
          if (stored) {
            const local = JSON.parse(stored).filter((b: { active: boolean }) => b.active);
            if (local.length > 0) setBanners(local);
          }
        } catch { }
      });
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrentBanner((p) => (p + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const fallbackImages = [
    { url: "/products/Hot_Items/Crispy_Murukulu.jpg", label: "" },
    { url: "/products/Sweet_Items/Kaju_Katli.jpg", label: "" },
    { url: "/products/Podis_Powders/Peanut_Spice_Powder.jpg", label: "" },
    { url: "/products/Vadiyalu_Papads/Flower_Vadiyalu.jpg", label: "" },
  ];

  const slides = banners.length > 0 ? banners : fallbackImages;

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 h-[35vh] sm:h-[40vh] md:h-[62vh] lg:h-[58vh] xl:h-[60vh] overflow-hidden py-4 md:py-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex justify-center"
        >
          <div className="relative h-full w-[90vw] sm:w-[85vw] md:w-[80vw] lg:w-[92vw] xl:w-[88vw] max-w-[1500px] mx-auto overflow-hidden rounded-[2rem] shadow-2xl bg-cream-dark">
            <Image
              src={slides[currentBanner].url}
              alt={slides[currentBanner].label || "Snakzee Banner"}
              fill
              className="object-contain md:object-cover"
              priority
              sizes="100vw"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBanner(i)}
              className={`rounded-full transition-all ${i === currentBanner ? "w-5 sm:w-6 h-1.5 sm:h-2 bg-white" : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80"
                }`}
              aria-label={`Go to banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Marquee Strip ───────────────────────────────────────────
function MarqueeStrip() {
  const items = Array(6).fill("For Telangana and Andhra Pradesh free delivery on order above ₹999");
  return (
    <div className="bg-terracotta py-2.5 sm:py-3 md:py-4 marquee-wrapper overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center text-cream font-sans text-base sm:text-lg md:text-xl font-semibold mx-3 sm:mx-4 md:mx-8"
          >
            {item}
            <span className="ml-3 sm:ml-4 md:ml-8 text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Category Grid ───────────────────────────────────────────
// ─── Best Sellers Horizontal Scroll ──────────────────────────────────
function BestSellers({ products, onCategorySelect }: { products: Product[]; onCategorySelect: (id: string) => void }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const catIds = ["hot-items", "sweet-items", "podis-powders", "vadiyalu-papads"];
  const bestsellers = catIds.flatMap(catId =>
    products.filter(p => p.category === catId).slice(0, 2)
  );
  if (bestsellers.length === 0) return null;

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem(product);
    setAddedId(product.id);
    toast({ title: "Added to cart! 🛒", description: product.nameEnglish });
    setTimeout(() => setAddedId(null), 2000);
  };

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section className="py-8 sm:py-10 md:py-14 bg-white border-y border-terracotta/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-gold fill-current" />
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-brown">Bestsellers</h2>
            </div>
            <p className="text-brown-light/50 text-xs sm:text-sm font-sans">Most loved by our customers</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => scroll("left")}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-terracotta/20 flex items-center justify-center hover:bg-terracotta/10 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brown" />
            </button>
            <button onClick={() => scroll("right")}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-terracotta/20 flex items-center justify-center hover:bg-terracotta/10 transition-colors">
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brown" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-3 scrollbar-hide snap-x snap-mandatory touch-scroll">
          {bestsellers.map((product, index) => (
            <div key={getProductRenderKey(product, index)}
              onClick={() => router.push(`/products/${(product as any).slug || product.id}`)}
              className="flex-shrink-0 w-40 sm:w-48 md:w-56 bg-cream rounded-xl sm:rounded-2xl border border-terracotta/10 overflow-hidden cursor-pointer hover:shadow-lg hover:border-terracotta/20 transition-all snap-start group active:scale-95">
              <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden bg-cream-dark">
                <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 160px, 224px" />
                <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-gold text-brown text-[8px] sm:text-[9px] font-bold font-sans px-1.5 py-0.5 sm:px-2 rounded-full flex items-center gap-0.5 sm:gap-1">
                  <Crown className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current" /> Bestseller
                </div>
              </div>
              <div className="p-2.5 sm:p-3">
                <p className="font-serif font-bold text-brown text-xs sm:text-sm leading-tight mb-0.5 line-clamp-1">{product.name}</p>
                <p className="text-brown-light/50 text-[10px] sm:text-[11px] font-sans mb-1.5 sm:mb-2 line-clamp-1">{product.nameEnglish}</p>
                <div className="flex items-center justify-between">
                  <span className="font-sans font-normal text-gold text-base sm:text-lg">₹{product.price}</span>
                  <button onClick={(e) => handleAdd(e, product)}
                    className={`flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold font-sans transition-all ${addedId === product.id
                        ? "bg-green-500 text-white"
                        : "bg-terracotta hover:bg-terracotta-dark text-white active:scale-95"
                      }`}>
                    {addedId === product.id ? <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <ShoppingCart className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                    {addedId === product.id ? "Added" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Browse by Category ──────────────────────────────────
function CategoryGrid({ products, onCategorySelect }: { products: Product[]; onCategorySelect: (id: string) => void }) {
  const scrollToProducts = (catId: string) => {
    onCategorySelect(catId);
    setTimeout(() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <section className="py-8 sm:py-12 md:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 md:mb-12"
        >
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brown mb-2 sm:mb-3 md:mb-4">
            Browse by Category
          </h2>
          <p className="text-brown-light/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            From crispy snacks to wholesome sweets, aromatic podis to sun-dried
            vadiyalu — explore our heritage collection
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => scrollToProducts(cat.id)}
              className="category-card-compact group relative bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-terracotta/10 hover:border-terracotta/30 text-center overflow-hidden active:scale-95 transition-all"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C8401A' fill-opacity='0.5'%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3C/g%3E%3C/svg%3E")` }} />
              </div>
              <div className="relative z-10">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-3 mx-auto group-hover:scale-110 transition-transform duration-300 rounded-full overflow-hidden border-2 border-terracotta/20 bg-cream">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="96px" />
                </div>
                <h3 className="category-underline font-serif text-base sm:text-lg md:text-xl font-bold text-brown mb-0.5 group-hover:text-terracotta transition-colors">{cat.name}</h3>
                <p className="text-brown-light/50 text-[11px] sm:text-[13px] mb-1 sm:mb-1.5 font-sans">{cat.nameTelugu}</p>
                <Badge variant="secondary" className="bg-terracotta/10 text-terracotta font-sans text-[9px] sm:text-[10px]">
                  {products.filter(p => p.category === cat.id).length} varieties
                </Badge>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trust Strip ─────────────────────────────────────────────
function TrustStrip() {
  const items = [
    {
      icon: <HomeIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Made at Home",
      subtitle: "Traditional recipes, handmade",
    },
    {
      icon: <Leaf className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "No Preservatives",
      subtitle: "100% natural ingredients",
    },
    {
      icon: <Truck className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Free Delivery",
      subtitle: "Orders above ₹1,000",
    },
    {
      icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Fresh Every Order",
      subtitle: "Made after you order",
    },
  ];

  return (
    <section className="py-8 sm:py-10 md:py-16 bg-white border-y border-terracotta/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <p className="text-center text-terracotta text-[10px] sm:text-[11px] font-sans tracking-[2px] sm:tracking-[2.5px] uppercase font-medium mb-6 sm:mb-8">WHY SNAKZEE</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 relative">

          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center relative z-10"
            >
              <div className="trust-icon-glow inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#FEE8DF] border border-[#F5C4A8] text-terracotta rounded-xl sm:rounded-2xl mb-2 sm:mb-3 md:mb-4 trust-icon-float" style={{ animationDelay: `${i * 0.5}s` }}>
                {item.icon}
              </div>
              <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold text-brown mb-0.5 sm:mb-1">
                {item.title}
              </h3>
              <p className="text-brown-light/60 text-[11px] sm:text-xs md:text-sm font-sans">
                {item.subtitle}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── "How It's Made" Process Section ─────────────────────────
function HowItsMadeSection() {
  return (
    <section className="py-12 sm:py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 mb-4 font-sans">
            <ChefHat className="w-3 h-3 mr-1" />
            Our Process
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-3 sm:mb-4">
            How It&apos;s <span className="text-terracotta">Made</span>
          </h2>
          <p className="text-brown-light/70 text-base sm:text-lg max-w-2xl mx-auto font-sans">
            Every Snakzee product goes through a meticulous 4-step journey — from farm-fresh ingredients to your doorstep
          </p>
        </motion.div>

        {/* Desktop Timeline */}
        <div className="hidden lg:grid grid-cols-4 gap-0 relative">
          {/* Connecting line across all steps */}
          <div className="absolute top-[48px] left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-terracotta/30 via-gold/40 to-terracotta/30 z-0" />

          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="process-timeline-connector text-center relative z-10"
            >
              {/* Step dot */}
              <div className="mx-auto w-[96px] h-[96px] rounded-full bg-gradient-to-br from-terracotta to-terracotta-dark text-white flex items-center justify-center text-3xl shadow-lg process-dot-pulse mb-6 relative" style={{ animationDelay: `${i * 0.7}s` }}>
                {step.icon}
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-gold text-brown rounded-full flex items-center justify-center text-xs font-bold font-sans shadow-md">
                  {step.step}
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold text-brown mb-2">
                {step.title}
              </h3>
              <p className="text-brown-light/60 text-sm leading-relaxed font-sans max-w-[220px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-6 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-terracotta/30 via-gold/40 to-terracotta/30 z-0" />

          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="flex items-start gap-4 relative z-10"
            >
              {/* Step dot */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-terracotta to-terracotta-dark text-white flex items-center justify-center text-lg shadow-md process-dot-pulse relative" style={{ animationDelay: `${i * 0.7}s` }}>
                {step.icon}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-brown rounded-full flex items-center justify-center text-[9px] font-bold font-sans">
                  {step.step}
                </div>
              </div>
              <div className="bg-cream rounded-xl p-4 border border-terracotta/10 flex-1">
                <h3 className="font-serif text-lg font-bold text-brown mb-1">
                  {step.title}
                </h3>
                <p className="text-brown-light/60 text-sm leading-relaxed font-sans">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Our Story Section ──────────────────────────────────────
function OurStorySection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="our-story" className="story-gradient py-12 sm:py-20 relative overflow-hidden">
      {/* Decorative corner patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C8401A' fill-opacity='0.6'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23C8401A' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">
              <BookOpen className="w-3 h-3 mr-1" />
              Our Story
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-4 sm:mb-6">
              From Grandmother&apos;s
              <br />
              <span className="text-terracotta">Kitchen to Yours</span>
            </h2>

            {/* Decorative quote */}
            <div className="relative pl-6 border-l-3 border-gold/30 mb-6">
              <p className="font-serif text-lg sm:text-xl text-brown-light/80 italic leading-relaxed">
                &ldquo;Every recipe we make carries the warmth of three generations of Telangana women who believed food is love.&rdquo;
              </p>
            </div>

            <p className="text-brown-light/70 text-base sm:text-lg leading-relaxed mb-4 font-sans">
              Snakzee was born from a simple longing — the taste of home. Growing up in the heart of Telangana,
              our founder watched her grandmother prepare sweets under the warm sun, grind podis on a stone
              mortar, and fry murukulu to golden perfection for every festival.
            </p>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-brown-light/70 text-base sm:text-lg leading-relaxed mb-4 font-sans">
                    When she moved to the city, that taste was impossible to find. Store-bought pickles lacked soul.
                    Packaged snacks had preservatives. The authentic flavors of Telangana were fading.
                  </p>
                  <p className="text-brown-light/70 text-base sm:text-lg leading-relaxed mb-4 font-sans">
                    So she went back to her roots — literally. Dusting off her grandmother&apos;s handwritten recipe book,
                    she started making small batches at home. Word spread through WhatsApp. Friends told friends. And
                    before long, Snakzee became Telangana&apos;s most loved homemade snacks brand.
                  </p>
                  <p className="text-brown-light/70 text-base sm:text-lg leading-relaxed mb-4 font-sans">
                    Today, every item is still made fresh after you order. No factories. No preservatives. Just honest,
                    traditional Telangana food — delivered with love.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 text-terracotta hover:text-terracotta-dark font-semibold text-sm font-sans transition-colors"
            >
              {expanded ? "Show Less" : "Read Our Full Story"}
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-gold/10">
                  <Image
                    src="/products/Hot_Items/Crispy_Murukulu.jpg"
                    alt="Traditional snack making"
                    width={300}
                    height={300}
                    className="object-cover w-full h-36 sm:h-44"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-gold/10">
                  <Image
                    src="/products/Podis_Powders/Peanut_Spice_Powder.jpg"
                    alt="Fresh masala preparation"
                    width={300}
                    height={300}
                    className="object-cover w-full h-36 sm:h-44"
                  />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-gold/10">
                  <Image
                    src="/products/Sweet_Items/Sunnundalu.jpg"
                    alt="Sweet making tradition"
                    width={300}
                    height={300}
                    className="object-cover w-full h-36 sm:h-44"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-gold/10">
                  <Image
                    src="/products/Vadiyalu_Papads/Flower_Vadiyalu.jpg"
                    alt="Sun-dried vadiyalu"
                    width={300}
                    height={300}
                    className="object-cover w-full h-36 sm:h-44"
                  />
                </div>
              </div>
            </div>
            {/* Stats overlay card */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 border border-terracotta/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-terracotta/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-terracotta" />
                </div>
                <div>
                  <p className="font-serif font-bold text-brown text-sm">Loved by 500+ Families</p>
                  <p className="text-brown-light/50 text-[10px] font-sans">across Telangana</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Spice Level Indicator ───────────────────────────────────
function SpiceLevelBadge({ level }: { level: SpiceLevel }) {
  const spice = SPICE_LABELS[level] ?? SPICE_LABELS["none"];
  return (
    <span className={`spice-badge ${spice.color}`}>
      <span>{spice.emoji}</span>
      <span>{spice.label}</span>
    </span>
  );
}

// ─── Product Card (Enhanced) ─────────────────────────────────
function ProductCard({
  product,
  isCompareSelected,
  onToggleCompare,
  onAddToQuickOrder,
}: {
  product: Product;
  isCompareSelected: boolean;
  onToggleCompare: (id: string) => void;
  onAddToQuickOrder: (id: string) => void;
}) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  // Admin-defined quantity variants (from backend)
  const variants = (product as any).quantity_prices as { quantity: string; price: number; mrp?: number }[] | undefined;
  const hasVariants = variants && variants.length > 0;

  // Build a unified options list: value="base" or "v-{i}"
  const [selectedOption, setSelectedOption] = useState<string>("base");
  const [quantity, setQuantity] = useState(1);
  // Fallback gram state
  const [selectedGram, setSelectedGram] = useState<GramOption>("500g");

  const selectedPrice = hasVariants
    ? (selectedOption === "base"
        ? product.price
        : variants![Number(selectedOption.replace("v-", ""))].price)
    : priceForGramOption(product, selectedGram);

  const selectedUnit = hasVariants
    ? (selectedOption === "base"
        ? product.priceUnit
        : variants![Number(selectedOption.replace("v-", ""))].quantity)
    : selectedGram;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cartProduct = hasVariants
      ? { ...product, price: selectedPrice, priceUnit: selectedUnit }
      : productForGramOption(product, selectedGram);
    addItem(cartProduct, quantity);
    toast({
      title: "Added to cart! 🛒",
      description: `${quantity} × ${selectedUnit} ${product.nameEnglish} added to your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={() => router.push(`/products/${(product as any).slug || product.id}`)}
      className="group bg-white rounded-2xl border border-terracotta/10 overflow-hidden product-card-hover relative cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream-dark">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.badge && (
          <div className="product-ribbon bg-terracotta text-white font-sans badge-shimmer" style={{ backgroundImage: "linear-gradient(90deg, #C8401A, #E05A35, #C8401A)", backgroundSize: "200% 100%" }}>
            {product.badge}
          </div>
        )}
        {product.popular && !product.badge && (
          <div className="absolute top-3 right-3 bg-gold text-brown w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
            <Crown className="w-4 h-4 fill-current" />
          </div>
        )}
        {/* Non-veg indicator */}
        {product.tags.includes("non-veg-pairing") && (
          <div className="absolute top-3 right-3 bg-red-600 text-white w-6 h-6 rounded-sm flex items-center justify-center shadow-md z-10" title="Pairs with non-veg">
            <span className="text-[10px] font-bold">🐟</span>
          </div>
        )}

        {/* Compare checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(product.id);
          }}
          className={`absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${isCompareSelected
            ? "bg-gold text-brown"
            : "bg-white/60 text-brown-light/40 hover:text-gold hover:bg-white/80"
            }`}
          aria-label={isCompareSelected ? "Remove from comparison" : "Add to comparison"}
        >
          <BarChart3 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge
            variant="secondary"
            className="bg-terracotta/10 text-terracotta font-sans text-[10px] uppercase tracking-wider"
          >
            {product.category}
          </Badge>
          <SpiceLevelBadge level={product.spiceLevel} />
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown mb-1 group-hover:text-terracotta transition-colors">
          {product.name}
        </h3>
        <span className="text-brown-light/50 text-[13px] font-sans block mb-1">({product.nameEnglish})</span>
        <p className="text-brown-light/60 text-sm leading-relaxed mb-2 line-clamp-2 font-sans">
          {product.description}
        </p>

        {/* Shelf life & Serves info */}
        <div className="flex items-center gap-3 mb-3 text-brown-light/50 text-[11px] font-sans">
          <span className="flex items-center gap-1">
            <CalendarClock className="w-3 h-3" />
            {product.shelfLife}
          </span>
          <span className="flex items-center gap-1">
            <UsersRound className="w-3 h-3" />
            {product.serves}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-2xl font-normal text-gold font-sans">
              ₹{selectedPrice}
            </span>
            <span className="text-brown-light/40 text-xs ml-1 font-sans">
              / {selectedUnit}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href={getShareLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center w-9 h-9 bg-cream hover:bg-terracotta/10 text-brown-light hover:text-terracotta rounded-full transition-all"
              aria-label="Share product"
            >
              <Share2 className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={(e) => { e.stopPropagation(); onAddToQuickOrder(product.id); }}
              className="inline-flex items-center justify-center w-9 h-9 bg-cream hover:bg-gold/20 text-brown-light hover:text-gold rounded-full transition-all"
              aria-label="Add to Quick Order List"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quantity Dropdown + Count + Add to Cart */}
        <div onClick={(e) => e.stopPropagation()} className="space-y-2">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            {hasVariants ? (
              // Admin-defined quantity variants as a dropdown
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="min-w-0 rounded-xl border border-terracotta/10 bg-cream px-3 py-2 text-sm font-semibold text-brown focus:outline-none focus:border-terracotta/30"
                aria-label="Select quantity"
              >
                <option value="base">{product.priceUnit} — ₹{product.price}</option>
                {variants!.map((v, i) => (
                  <option key={`${product.id}-v-${i}-${v.quantity}`} value={`v-${i}`}>
                    {v.quantity} — ₹{v.price}{v.mrp && v.mrp > v.price ? ` (MRP ₹${v.mrp})` : ""}
                  </option>
                ))}
              </select>
            ) : (
              // Fallback: static gram options
              <select
                value={selectedGram}
                onChange={(e) => setSelectedGram(e.target.value as GramOption)}
                className="min-w-0 rounded-xl border border-terracotta/10 bg-cream px-3 py-2 text-sm font-semibold text-brown focus:outline-none focus:border-terracotta/30"
                aria-label="Select weight"
              >
                {GRAM_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
            <input
              type="number" min={1} max={10} value={quantity}
              onChange={(e) => setQuantity(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
              className="w-16 rounded-xl border border-terracotta/10 bg-cream px-2 py-2 text-center text-sm font-semibold text-brown focus:outline-none focus:border-terracotta/30"
              aria-label="Quantity"
            />
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white px-4 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-[1.02] shadow-md shadow-terracotta/20 font-sans"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
function FeaturedProducts({
  products,
  compareIds,
  onToggleCompare,
  onAddToQuickOrder,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: {
  products: Product[];
  compareIds: Set<string>;
  onToggleCompare: (id: string) => void;
  onAddToQuickOrder: (id: string) => void;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) {
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Get all unique tags from products
  const allTags = Array.from(new Set(products.flatMap(p => p.tags))).sort();

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = activeTags.length === 0 || activeTags.every(tag => p.tags.includes(tag));
    return matchesCategory && matchesSearch && matchesTags;
  });

  return (
    <section id="products" className="py-12 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-3 sm:mb-4">
            Our Heritage Collection
          </h2>
          <p className="text-brown-light/70 text-base sm:text-lg max-w-2xl mx-auto">
            Every item is handmade with traditional recipes passed down through
            generations. Fresh, authentic, and absolutely no preservatives.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
            <input
              type="text"
              placeholder="Search by name, Telugu name, or category..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input w-full pl-10 pr-10 py-3 rounded-xl bg-white text-brown text-sm font-sans placeholder:text-brown-light/40"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light/40 hover:text-brown-light transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter + Favorites Toggle */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          <button
            onClick={() => onCategoryChange("all")}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all font-sans ${activeCategory === "all"
              ? "bg-terracotta text-white shadow-lg shadow-terracotta/20"
              : "bg-white text-brown-light border border-terracotta/10 hover:border-terracotta/30"
              }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all font-sans ${activeCategory === cat.id
                ? "bg-terracotta text-white shadow-lg shadow-terracotta/20"
                : "bg-white text-brown-light border border-terracotta/10 hover:border-terracotta/30"
                }`}
            >
              <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-cream mr-2"><Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="32px" /></div> {cat.name}
            </button>
          ))}

        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-6">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setActiveTags(prev =>
                    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                  );
                }}
                className={`ingredient-tag cursor-pointer transition-all ${activeTags.includes(tag)
                  ? "bg-terracotta/15 border-terracotta/30 text-terracotta font-semibold"
                  : "hover:bg-terracotta/5 hover:border-terracotta/15"
                  }`}
              >
                {tag}
              </button>
            ))}
            {activeTags.length > 0 && (
              <button
                onClick={() => setActiveTags([])}
                className="ingredient-tag bg-terracotta/10 border-terracotta/20 text-terracotta cursor-pointer"
              >
                ✕ Clear tags
              </button>
            )}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto bg-terracotta/10 rounded-full flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-terracotta/40" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brown mb-2">No products found</h3>
            <p className="text-brown-light/60 text-sm font-sans">
              {activeCategory !== "all"
                ? `No products available in "${categories.find(c => c.id === activeCategory)?.name || activeCategory}" yet.`
                : "Try a different search term or category."}
            </p>
            {(searchQuery || activeCategory !== "all" || activeTags.length > 0) && (
              <button
                onClick={() => { onSearchChange(""); onCategoryChange("all"); setActiveTags([]); }}
                className="mt-4 text-terracotta hover:text-terracotta-dark font-semibold text-sm font-sans transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={getProductRenderKey(product, index)}
                  product={product}

                  isCompareSelected={compareIds.has(product.id)}
                  onToggleCompare={onToggleCompare}
                  onAddToQuickOrder={onAddToQuickOrder}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── WhatsApp Order Section with Delivery Timeline ───────────
function WhatsAppOrderSection() {
  const steps = [
    {
      num: "1",
      title: "Browse & Pick",
      desc: "Choose your favorite items from our menu",
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      num: "2",
      title: "WhatsApp Us",
      desc: "Click the order button — your message is pre-filled!",
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      num: "3",
      title: "Confirm & Pay",
      desc: "We confirm your order & share payment details",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      num: "4",
      title: "Delivered Fresh",
      desc: "Your order is made fresh & delivered to your door",
      icon: <Package className="w-5 h-5" />,
    },
  ];

  const deliverySteps = [
    { label: "Order", icon: <MessageCircle className="w-4 h-4" />, time: "" },
    { label: "Preparing", icon: <ChefHat className="w-4 h-4" />, time: "1 day" },
    { label: "Shipping", icon: <Truck className="w-4 h-4" />, time: "1 day" },
    { label: "Delivered", icon: <CheckCircle2 className="w-4 h-4" />, time: "2-3 days total" },
  ];

  return (
    <section id="order" className="py-12 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-whatsapp/10 text-whatsapp-dark border-whatsapp/20 mb-4 font-sans">
              <MessageCircle className="w-3 h-3 mr-1" />
              WhatsApp Ordering
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-4 sm:mb-6">
              Order in <span className="text-whatsapp">4 Simple Steps</span>
            </h2>
            <p className="text-brown-light/70 text-base sm:text-lg mb-8 sm:mb-10 font-sans">
              No app downloads. No complicated forms. Just WhatsApp us and
              your order is placed!
            </p>

            <div className="space-y-4 sm:space-y-6">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-terracotta/10 text-terracotta rounded-xl flex items-center justify-center font-serif font-bold text-lg relative">
                    {step.num}
                    {i < steps.length - 1 && (
                      <div className="absolute -bottom-6 left-1/2 w-[1px] h-4 bg-terracotta/20" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-brown">
                      {step.title}
                    </h4>
                    <p className="text-brown-light/60 text-sm font-sans">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Delivery Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 sm:mt-10 bg-white rounded-2xl border border-terracotta/10 p-5 sm:p-6"
            >
              <p className="font-serif text-sm font-bold text-brown mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-terracotta" />
                Estimated Delivery Timeline
              </p>
              <div className="grid grid-cols-4 gap-0">
                {deliverySteps.map((ds, i) => (
                  <div key={i} className="delivery-timeline-step text-center">
                    <div className="mx-auto w-10 h-10 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mb-2 relative z-10">
                      {ds.icon}
                    </div>
                    <p className="text-brown text-[11px] sm:text-xs font-semibold font-sans">{ds.label}</p>
                    {ds.time && (
                      <p className="text-terracotta text-[9px] sm:text-[10px] font-sans font-medium mt-0.5">{ds.time}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* WhatsApp Chat Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-terracotta/10 overflow-hidden max-w-sm mx-auto">
              {/* WhatsApp header */}
              <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-terracotta rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo-removebg-preview.png"
                    alt="Snakzee"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm font-sans">
                    Snakzee
                  </p>
                  <p className="text-green-200 text-xs font-sans">online</p>
                </div>
              </div>

              {/* Chat area */}
              <div className="bg-[#ECE5DD] p-4 space-y-3 min-h-[300px]">
                {/* Customer message */}
                <div className="flex justify-end chat-message-stagger">
                  <div className="bg-[#DCF8C6] rounded-xl rounded-tr-sm px-3 py-2 max-w-[80%] shadow-sm">
                    <p className="text-sm text-brown font-sans">
                      Hi! I want to order Avakaya (500g) and Chakli (500g).
                      Please confirm availability.
                    </p>
                    <p className="text-[10px] text-brown-light/50 text-right mt-1 font-sans">
                      10:30 AM ✓✓
                    </p>
                  </div>
                </div>

                {/* Snakzee reply */}
                <div className="flex justify-start chat-message-stagger">
                  <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 max-w-[80%] shadow-sm">
                    <p className="text-sm text-brown font-sans">
                      Namaste! 🙏 Both are available! Your order:
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-brown-light font-sans">
                        ✅ Avakaya 500g — ₹350
                      </p>
                      <p className="text-xs text-brown-light font-sans">
                        ✅ Chakli 500g — ₹250
                      </p>
                      <p className="text-xs text-terracotta font-bold font-sans mt-1">
                        Total: ₹600
                      </p>
                    </div>
                    <p className="text-[10px] text-brown-light/50 mt-1 font-sans">
                      10:31 AM ✓✓
                    </p>
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex justify-start chat-message-stagger">
                  <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 shadow-sm inline-flex items-center gap-0.5">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              </div>

              {/* Input area */}
              <div className="bg-[#F0F0F0] px-3 py-2 flex items-center gap-2">
                <div className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-brown-light/50 font-sans">
                  Type a message...
                </div>
                <div className="w-9 h-9 bg-whatsapp rounded-full flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Decorative badge */}
            <div className="absolute -top-4 -right-4 bg-whatsapp text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl font-sans">
              Zero Friction ⚡
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Instagram Feed Section ──────────────────────────────────
function InstagramSection() {


  return (
    <section className="py-12 sm:py-20 bg-white border-y border-terracotta/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge className="bg-pink-50 text-pink-600 border-pink-200 mb-4 font-sans">
            <Instagram className="w-3 h-3 mr-1" />
            @snak_zee
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-3 sm:mb-4">
            Follow Us on Instagram
          </h2>
          <p className="text-brown-light/70 text-base sm:text-lg max-w-2xl mx-auto">
            Behind-the-scenes of our kitchen, new product launches, and
            mouth-watering close-ups. Don&apos;t miss out!
          </p>
        </motion.div>



        <div className="text-center">
          <a
            href="https://www.instagram.com/snak_zee"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all hover:scale-105 shadow-xl"
          >
            <Instagram className="w-5 h-5" />
            Follow @snak_zee
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Customer Reviews (Enhanced with all 6 reviews) ──────────
function CustomerReviews() {
  return (
    <section id="reviews" className="py-12 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-3 sm:mb-4">
            What Our Family Says
          </h2>
          <p className="text-brown-light/70 text-base sm:text-lg max-w-2xl mx-auto">
            True stories of nostalgic delight from households across India.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="review-card bg-white rounded-2xl p-6 sm:p-8 border border-terracotta/10 shadow-sm hover:shadow-lg hover:border-terracotta/20 transition-all"
            >
              {/* Stars + Verified */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-gold text-gold"
                    />
                  ))}
                </div>
                <Badge className="bg-whatsapp/10 text-whatsapp-dark text-[9px] font-sans px-1.5 py-0">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                  Verified
                </Badge>
              </div>
              <p className="text-brown-light text-sm sm:text-base leading-relaxed mb-6 font-sans italic">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center font-serif font-bold text-sm">
                  {review.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-serif font-bold text-brown text-sm sm:text-base">
                    {review.name}
                  </p>
                  <p className="text-brown-light/50 text-xs sm:text-sm font-sans flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {review.location}
                  </p>
                </div>
                {/* Product badge */}
                {review.product && (
                  <Badge className="bg-terracotta/5 text-terracotta text-[9px] font-sans border-terracotta/10 shrink-0">
                    {review.product}
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Video Testimonials Section ─────────────────────────────────
function VideoTestimonialsSection() {
  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-cream to-white relative overflow-hidden">
      {/* Decorative gradient circles */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-terracotta/3 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gold/3 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 mb-4 font-sans">
            🎥 Video Stories
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-3 sm:mb-4">
            Nostalgia Shared from Heart to Heart
          </h2>
          <p className="text-brown-light/70 text-base sm:text-lg max-w-2xl mx-auto font-sans">
            Hear it straight from the families who love Snakzee
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {VIDEO_TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.avatar}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative bg-white rounded-2xl border border-terracotta/10 overflow-hidden shadow-sm hover:shadow-xl hover:border-terracotta/20 transition-all duration-300"
            >
              {/* Video placeholder with gradient overlay */}
              <div className="relative aspect-video bg-gradient-to-br from-brown via-brown-light to-terracotta-dark overflow-hidden">
                {/* Fake video play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                    <div className="ml-1 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-white/90" />
                  </div>
                </div>
                {/* Customer name overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-brown font-serif font-bold text-xs">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-cream text-sm font-sans font-semibold">{testimonial.name}</p>
                    <p className="text-cream/50 text-[10px] font-sans">{testimonial.location}</p>
                  </div>
                </div>
                {/* Duration badge */}
                <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-sans px-2 py-0.5 rounded">
                  0:{30 + i * 15}
                </div>
                {/* Product badge */}
                <div className="absolute top-3 left-3 bg-terracotta text-white text-[9px] font-sans px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                  {testimonial.product}
                </div>
              </div>
              {/* Quote */}
              <div className="p-4 sm:p-5">
                <div className="text-gold/20 text-4xl font-serif leading-none mb-1">&ldquo;</div>
                <p className="text-brown-light/70 text-sm font-sans leading-relaxed line-clamp-3 -mt-3">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Festive Combos Section ──────────────────────────────────
function FestiveCombos() {
  return (
    <section id="combos" className="py-12 sm:py-20 bg-white border-y border-terracotta/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">
            <Gift className="w-3 h-3 mr-1" />
            Save More with Combos
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-3 sm:mb-4">
            Festive Combo Packs
          </h2>
          <p className="text-brown-light/70 text-base sm:text-lg max-w-2xl mx-auto">
            Curated gift boxes & combo packs — perfect for festivals, gifting, or treating yourself. Save up to 20%!
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {COMBOS.map((combo, i) => {
            const isValueBadge = combo.badge.includes("Value") || combo.badge.includes("Deal");
            return (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-gradient-to-b from-cream to-white rounded-2xl border border-terracotta/10 overflow-hidden product-card-hover relative"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
                  <Image
                    src={combo.image}
                    alt={combo.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                  <Badge className={`absolute top-3 left-3 font-sans text-xs shadow-lg ${isValueBadge ? "bg-whatsapp text-white" : "bg-terracotta text-white"}`}>
                    {combo.badge}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-brown mb-2 group-hover:text-terracotta transition-colors">
                    {combo.name}
                  </h3>
                  <p className="text-brown-light/60 text-xs leading-relaxed mb-3 line-clamp-2 font-sans">
                    {combo.description}
                  </p>

                  {/* Items included */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {combo.items.map((item, j) => (
                      <span
                        key={j}
                        className="text-[10px] px-2 py-0.5 bg-terracotta/5 text-brown-light rounded-full font-sans"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-gold font-serif">
                      ₹{combo.comboPrice}
                    </span>
                    <span className="text-brown-light/40 text-sm line-through font-sans">
                      ₹{combo.originalPrice}
                    </span>
                    <Badge className="bg-whatsapp/10 text-whatsapp-dark font-sans text-[10px]">
                      <Tag className="w-2.5 h-2.5 mr-0.5" />
                      Save ₹{combo.originalPrice - combo.comboPrice}
                    </Badge>
                  </div>

                  <a
                    href={getComboWhatsAppLink(combo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-whatsapp hover:bg-whatsapp-dark text-white px-4 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105 shadow-md shadow-whatsapp/20 font-sans wa-ripple"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Order Combo
                  </a>
                </div>
              </motion.div>
            );
          })}
          {/* Build Your Own Combo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-cream/50 rounded-2xl border-2 border-dashed border-terracotta/30 overflow-hidden flex flex-col items-center justify-center p-8 sm:p-10 text-center min-h-[320px] hover:border-terracotta/50 transition-all"
          >
            <span className="text-4xl mb-3">🎁</span>
            <h3 className="font-serif text-xl font-bold text-brown mb-2">Build Your Own</h3>
            <p className="text-brown-light/60 text-sm font-sans mb-4">Chat with us to mix & match your perfect combo</p>
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105 shadow-md shadow-whatsapp/20 font-sans wa-ripple">
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Bulk Order Section ──────────────────────────────────────
// ─── Product Quick View Modal (Enhanced) ─────────────────────
function ProductQuickView({
  product,
  open,
  onClose,
  isFavorite,
  onToggleFavorite,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [counterKey, setCounterKey] = useState(0);
  const [selectedGiftWrap, setSelectedGiftWrap] = useState<GiftWrapOption | null>(null);

  if (!product) return null;

  const totalPrice = product.price * quantity + (selectedGiftWrap ? selectedGiftWrap.price : 0);
  const spice = SPICE_LABELS[product.spiceLevel] ?? SPICE_LABELS["none"];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent key={product.id} className="max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar p-0 bg-white border-terracotta/10 rounded-2xl">
        <VisuallyHidden>
          <DialogTitle>{product.name} — Quick View</DialogTitle>
        </VisuallyHidden>
        <div className="relative aspect-square overflow-hidden bg-cream-dark">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {product.badge && (
            <Badge className="absolute top-4 left-4 bg-terracotta text-white font-sans text-sm shadow-lg">
              {product.badge}
            </Badge>
          )}
          {/* Favorite in modal */}
          <button
            onClick={() => onToggleFavorite(product.id)}
            className={`absolute top-4 right-14 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${isFavorite
              ? "bg-terracotta text-white heart-pop"
              : "bg-white/80 text-brown-light/50 hover:text-terracotta"
              }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
          <DialogClose className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-brown transition-colors">
            <X className="w-5 h-5" />
          </DialogClose>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge
              variant="secondary"
              className="bg-terracotta/10 text-terracotta font-sans text-xs uppercase tracking-wider"
            >
              {product.category}
            </Badge>
            <SpiceLevelBadge level={product.spiceLevel} />
          </div>
          <span className="text-brown-light/50 text-[13px] font-sans block mb-1">({product.nameEnglish})</span>
          <h3 className="font-serif text-3xl font-bold text-brown mb-3">
            {product.name}
          </h3>
          <p className="text-brown-light/70 text-base leading-relaxed mb-4 font-sans">
            {product.description}
          </p>

          {/* Product Details Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-cream rounded-xl p-3 text-center">
              <CalendarClock className="w-4 h-4 text-terracotta mx-auto mb-1" />
              <p className="text-brown text-xs font-bold font-sans">{product.shelfLife}</p>
              <p className="text-brown-light/50 text-[9px] font-sans">Shelf Life</p>
            </div>
            <div className="bg-cream rounded-xl p-3 text-center">
              <UsersRound className="w-4 h-4 text-terracotta mx-auto mb-1" />
              <p className="text-brown text-xs font-bold font-sans">{product.serves}</p>
              <p className="text-brown-light/50 text-[9px] font-sans">Serves</p>
            </div>
            <div className="bg-cream rounded-xl p-3 text-center">
              <Flame className="w-4 h-4 text-terracotta mx-auto mb-1" />
              <p className="text-brown text-xs font-bold font-sans">{spice.label}</p>
              <p className="text-brown-light/50 text-[9px] font-sans">Spice</p>
            </div>
          </div>

          {/* Ingredients */}
          {product.ingredients.length > 0 && (
            <div className="mb-5">
              <p className="text-brown font-semibold text-xs font-sans mb-2 flex items-center gap-1">
                <UtensilsCrossed className="w-3 h-3" />
                Ingredients
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((ingredient, i) => (
                  <span key={i} className="ingredient-tag">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Info */}
          <div className="mb-5">
            <p className="text-brown font-semibold text-xs font-sans mb-2 flex items-center gap-1">
              <Beaker className="w-3 h-3" />
              Nutrition per serving
            </p>
            <div className="space-y-1.5">
              {[
                { label: "Calories", value: product.nutrition.calories, color: "bg-terracotta", max: 250 },
                { label: "Protein", value: product.nutrition.protein, color: "bg-gold", max: 15 },
                { label: "Carbs", value: product.nutrition.carbs, color: "bg-terracotta-light", max: 35 },
                { label: "Fat", value: product.nutrition.fat, color: "bg-gold-dark", max: 18 },
                { label: "Fiber", value: product.nutrition.fiber, color: "bg-green-600", max: 5 },
              ].map((item) => {
                const numVal = parseFloat(item.value);
                const pct = Math.min((numVal / item.max) * 100, 100);
                return (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-[10px] text-brown-light/50 font-sans w-14 text-right">{item.label}</span>
                    <div className="flex-1 h-2 bg-cream rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                    <span className="text-[10px] text-brown font-bold font-sans w-12">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="mb-5">
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 bg-terracotta/5 text-terracotta rounded-full font-sans border border-terracotta/10"
                  >
                    {tag.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-4 bg-cream rounded-xl p-4">
            <div>
              <span className="text-2xl font-bold text-gold font-serif">₹{totalPrice}</span>
              <span className="text-brown-light/40 text-sm ml-1 font-sans">
                / {quantity} × ₹{product.price}
                {selectedGiftWrap && ` + ₹${selectedGiftWrap.price} gift wrap`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setQuantity(Math.max(1, quantity - 1)); setCounterKey((k) => k + 1); }}
                className="quantity-btn"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-bold text-brown font-sans w-8 text-center counter-bump" key={counterKey}>
                {quantity}
              </span>
              <button
                onClick={() => { setQuantity(Math.min(10, quantity + 1)); setCounterKey((k) => k + 1); }}
                className="quantity-btn"
                disabled={quantity >= 10}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Gift Wrap Options */}
          <div className="mb-5">
            <p className="text-brown font-semibold text-xs font-sans mb-2 flex items-center gap-1">
              <Gift className="w-3 h-3" />
              Add Gift Wrapping
            </p>
            <div className="grid grid-cols-2 gap-2">
              {GIFT_WRAP_OPTIONS.map((option) => {
                const isSelected = selectedGiftWrap?.id === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedGiftWrap(isSelected ? null : option)}
                    className={`text-left p-2.5 rounded-xl border transition-all ${isSelected
                      ? "border-terracotta bg-terracotta/5 shadow-sm"
                      : "border-terracotta/10 bg-cream/50 hover:border-terracotta/20"
                      }`}
                  >
                    <p className="text-brown text-[11px] font-bold font-sans">{option.name}</p>
                    <p className="text-brown-light/40 text-[9px] font-sans line-clamp-1">{option.description}</p>
                    <p className="text-terracotta text-[10px] font-bold font-sans mt-0.5">+₹{option.price}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/919305550051?text=${encodeURIComponent(
                `Hi! I want to order ${quantity}x ${product.nameEnglish} (${product.name}) — ${product.priceUnit} @ ₹${product.price} each. Total: ₹${totalPrice}.${selectedGiftWrap ? ` Gift wrapping: ${selectedGiftWrap.name} (+₹${selectedGiftWrap.price}).` : ""} Please confirm availability and delivery details.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-lg shadow-whatsapp/20 font-sans wa-ripple"
            >
              <MessageCircle className="w-4 h-4" />
              Order {quantity > 1 ? `${quantity}x ` : ""}on WhatsApp
            </a>
            <a
              href={getShareLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 bg-cream hover:bg-terracotta/10 text-brown-light hover:text-terracotta rounded-full transition-all"
              aria-label="Share product"
            >
              <Share2 className="w-5 h-5" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────
function FAQSection() {
  return (
    <section id="faq" className="py-12 sm:py-20 bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 mb-4 font-sans">
            Got Questions?
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-3 sm:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-brown-light/70 text-base sm:text-lg">
            Everything you need to know about ordering from Snakzee
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-white rounded-xl border border-terracotta/10 px-6 data-[state=open]:shadow-md data-[state=open]:border-terracotta/20 transition-all"
            >
              <AccordionTrigger className="text-left font-serif text-base sm:text-lg font-semibold text-brown hover:text-terracotta hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-brown-light/70 text-sm sm:text-base leading-relaxed pb-5 font-sans">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ─── Newsletter Section ──────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, message: "Newsletter subscription" }),
      });
      if (res.ok) {
        setSubmitted(true);
        setEmail("");
        setPhone("");
        toast({
          title: "Welcome to the Snakzee family! 🎉",
          description: "You'll receive updates on new products, offers, and more.",
        });
      }
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or message us on WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-20 bg-white border-y border-terracotta/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">
            <Mail className="w-3 h-3 mr-1" />
            Stay Connected
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-3">
            Get Fresh Updates from Snakzee
          </h2>
          <p className="text-brown-light/70 text-base sm:text-lg mb-8 font-sans">
            Be the first to know about new products, festival specials, and exclusive offers. No spam — just pure Telangana goodness!
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-terracotta/5 border border-terracotta/10 rounded-2xl p-8"
            >
              <CheckCircle2 className="w-12 h-12 text-whatsapp mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-brown mb-2">You&apos;re In! 🎉</h3>
              <p className="text-brown-light/60 text-sm font-sans">
                Welcome to the Snakzee family. We&apos;ll keep you updated on all things delicious.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input w-full pl-10 pr-4 py-3 rounded-xl bg-cream text-brown text-sm font-sans placeholder:text-brown-light/40"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
                <input
                  type="tel"
                  placeholder="WhatsApp number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="newsletter-input w-full pl-10 pr-4 py-3 rounded-xl bg-cream text-brown text-sm font-sans placeholder:text-brown-light/40"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-terracotta hover:bg-terracotta-dark text-white py-3 rounded-xl font-bold font-sans text-sm transition-all hover:scale-[1.02] shadow-lg shadow-terracotta/20"
              >
                {loading ? "Subscribing..." : "Get Updates →"}
              </Button>
              <p className="text-brown-light/40 text-[11px] font-sans">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Quick Order List ─────────────────────────────────────────
function QuickOrderList({
  open,
  onClose,
  items,
  onRemoveItem,
  onUpdateQty,
  products,
}: {
  open: boolean;
  onClose: () => void;
  items: Map<string, number>;
  onRemoveItem: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  products: Product[];
}) {
  if (!open) return null;

  const orderedProducts = products.filter((p) => items.has(p.id));
  const total = orderedProducts.reduce((sum, p) => sum + p.price * (items.get(p.id) || 1), 0);

  const sendWhatsApp = () => {
    const lines = orderedProducts.map((p) => `${items.get(p.id) || 1}x ${p.name} (${p.priceUnit}) @ ₹${p.price} each`);
    const msg = `Hi! I'd like to order:\n\n${lines.join("\n")}\n\nTotal: ₹${total}\n\nPlease confirm availability and delivery details.`;
    window.open(`https://wa.me/919305550051?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[70] exit-popup-overlay flex items-end sm:items-center justify-center" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[80vh] overflow-hidden shadow-2xl border border-terracotta/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-terracotta/10 flex items-center justify-between bg-cream/50">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-terracotta" />
            <h3 className="font-serif text-lg font-bold text-brown">Quick Order List</h3>
            <Badge className="bg-terracotta/10 text-terracotta text-[10px] font-sans">{orderedProducts.length} items</Badge>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-terracotta/10 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-brown-light" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[50vh] custom-scrollbar p-4 space-y-3">
          {orderedProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-10 h-10 text-brown-light/20 mx-auto mb-3" />
              <p className="text-brown-light/50 font-sans text-sm">Your order list is empty</p>
              <p className="text-brown-light/30 font-sans text-xs mt-1">Click the + button on products to add them</p>
            </div>
          ) : (
            orderedProducts.map((product) => {
              const qty = items.get(product.id) || 1;
              return (
                <div key={product.id} className="flex items-center gap-3 bg-cream/50 rounded-xl p-3 border border-terracotta/5">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-cream-dark">
                    <Image src={product.image} alt={product.name} width={48} height={48} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-semibold text-brown truncate">{product.name}</p>
                    <p className="text-brown-light/50 text-xs font-sans">₹{product.price}/{product.priceUnit}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onUpdateQty(product.id, Math.max(1, qty - 1))} className="w-7 h-7 rounded-full border border-terracotta/20 flex items-center justify-center text-xs hover:bg-terracotta/10 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-sm font-bold font-sans text-brown">{qty}</span>
                    <button onClick={() => onUpdateQty(product.id, Math.min(10, qty + 1))} className="w-7 h-7 rounded-full border border-terracotta/20 flex items-center justify-center text-xs hover:bg-terracotta/10 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-serif font-bold text-gold text-sm min-w-[50px] text-right">₹{product.price * qty}</p>
                  <button onClick={() => onRemoveItem(product.id)} className="w-6 h-6 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors">
                    <XCircle className="w-4 h-4 text-red-300 hover:text-red-500" />
                  </button>
                </div>
              );
            })
          )}
        </div>
        {orderedProducts.length > 0 && (
          <div className="p-4 border-t border-terracotta/10 bg-cream/30">
            <div className="flex items-center justify-between mb-3">
              <span className="font-sans text-sm text-brown-light">Subtotal ({orderedProducts.reduce((s, p) => s + (items.get(p.id) || 1), 0)} items)</span>
              <span className="font-serif text-xl font-bold text-gold">₹{total}</span>
            </div>
            <button onClick={sendWhatsApp} className="w-full flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white py-3.5 rounded-full font-bold text-base transition-all hover:scale-[1.02] shadow-lg shadow-whatsapp/20 wa-ripple font-sans">
              <MessageCircle className="w-5 h-5" />
              Send Order via WhatsApp
            </button>
            {total < 1000 && (
              <p className="text-center text-xs text-brown-light/50 font-sans mt-2">Add ₹{1000 - total} more for free delivery!</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── "Before You Go" Exit Intent Popup ───────────────────────
function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const hasShownRef = useRef(false);

  useEffect(() => {
    // Only show once per session
    if (typeof window !== "undefined" && localStorage.getItem("snakzee-exit-shown") === "true") {
      return;
    }

    let lastScrollTop = 0;
    let scrollUpCount = 0;

    const handleScroll = () => {
      const st = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Detect quick scroll back to top from far down
      if (st < lastScrollTop && lastScrollTop > docHeight * 0.3 && st < docHeight * 0.15) {
        scrollUpCount++;
        if (scrollUpCount >= 2 && !hasShownRef.current) {
          setShow(true);
          hasShownRef.current = true;
          localStorage.setItem("snakzee-exit-shown", "true");
        }
      }
      lastScrollTop = st;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="exit-popup-overlay fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={() => setShow(false)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-terracotta/10 max-w-md w-full overflow-hidden relative"
      >
        {/* Top gradient bar */}
        <div className="bg-gradient-to-r from-terracotta to-gold h-2" />

        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 w-8 h-8 bg-cream hover:bg-terracotta/10 rounded-full flex items-center justify-center text-brown-light/60 hover:text-terracotta transition-colors z-10"
          aria-label="Close popup"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-gold" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brown mb-2">
            Wait! Don&apos;t Leave Hungry 🍽️
          </h3>
          <p className="text-brown-light/70 text-sm sm:text-base font-sans mb-6 leading-relaxed">
            Get <span className="font-bold text-terracotta">10% off</span> your first order! Just mention &ldquo;SNAKZEE10&rdquo; when you message us on WhatsApp.
          </p>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShow(false)}
            className="inline-flex items-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white px-8 py-4 rounded-full font-bold text-base sm:text-lg transition-all hover:scale-105 shadow-xl shadow-whatsapp/20 font-sans wa-ripple"
          >
            <MessageCircle className="w-5 h-5" />
            Claim Your Discount
          </a>
          <p className="text-brown-light/40 text-[11px] font-sans mt-4">
            Limited time offer for new customers
          </p>
        </div>
      </motion.div>
    </div>
  );
}


// ─── Order Tracking Section ──────────────────────────────────
function OrderTrackingSection() {
  return (
    <section className="py-12 sm:py-20 bg-cream relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-terracotta/10 p-8 sm:p-12 shadow-sm text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-whatsapp/10 rounded-full mb-6">
            <Phone className="w-8 h-8 text-whatsapp" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-3">
            Track Your <span className="text-terracotta">Order</span>
          </h2>
          <p className="text-brown-light/70 text-base sm:text-lg max-w-lg mx-auto font-sans mb-8">
            WhatsApp us your order date and we&apos;ll send you an instant update.
          </p>
          <a
            href={`https://wa.me/918897586142?text=${encodeURIComponent("Hi! I want to track my Snakzee order. Can you share the status?")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 shadow-xl shadow-whatsapp/20 font-sans wa-ripple"
          >
            <MessageCircle className="w-5 h-5" />
            Track via WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Recipe Section ──────────────────────────────────────────
function RecipeSection() {
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  return (
    <section className="py-12 sm:py-20 relative overflow-hidden gradient-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">
            <ChefHat className="w-3 h-3 mr-1" />
            Recipes
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-3 sm:mb-4">
            Cook with <span className="text-terracotta">Snakzee</span>
          </h2>
          <p className="text-brown-light/70 text-base sm:text-lg max-w-2xl mx-auto font-sans">
            Quick, delicious recipes using our products — from easy breakfasts to festive feasts
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {RECIPES.map((recipe, i) => {
            const isExpanded = expandedRecipe === recipe.id;
            const recipeProducts = compareProducts(recipe.products);
            return (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl overflow-hidden border border-terracotta/10 hover:border-terracotta/20 transition-all"
              >
                <div className="p-5 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown">{recipe.name}</h3>
                      <p className="text-brown-light/60 text-sm font-sans mt-1 line-clamp-2">{recipe.description}</p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="flex items-center gap-1 text-brown-light/50 text-xs font-sans bg-cream px-2.5 py-1 rounded-full">
                      <Timer className="w-3 h-3 text-terracotta" />
                      {recipe.cookTime}
                    </span>
                    <span className="flex items-center gap-1 text-brown-light/50 text-xs font-sans bg-cream px-2.5 py-1 rounded-full">
                      <Users className="w-3 h-3 text-terracotta" />
                      {recipe.servings} servings
                    </span>
                    <Badge className={`font-sans text-[10px] ${recipe.difficulty === "Easy"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : recipe.difficulty === "Medium"
                        ? "bg-gold/10 text-gold border-gold/20"
                        : "bg-terracotta/10 text-terracotta border-terracotta/20"
                      }`}>
                      {recipe.difficulty}
                    </Badge>
                  </div>

                  {/* Products used */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {recipeProducts.map((p) => (
                      <span key={p.id} className="ingredient-tag">
                        {p.name}
                      </span>
                    ))}
                  </div>

                  {/* Expand/collapse steps */}
                  <button
                    onClick={() => setExpandedRecipe(isExpanded ? null : recipe.id)}
                    className="flex items-center gap-1 text-terracotta hover:text-terracotta-dark font-semibold text-sm font-sans transition-colors mb-2"
                  >
                    {isExpanded ? "Hide Steps" : "View Recipe"}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <ol className="space-y-2 mb-4">
                          {recipe.steps.map((step, j) => (
                            <li key={j} className="flex gap-2 text-sm text-brown-light/70 font-sans">
                              <span className="flex-shrink-0 w-5 h-5 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center text-[10px] font-bold font-sans">
                                {j + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Order Ingredients CTA */}
                  <a
                    href={`https://wa.me/919305550051?text=${encodeURIComponent(
                      `Hi! I want to order ingredients for ${recipe.name}: ${recipeProducts.map((p) => p.name).join(", ")}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-whatsapp hover:bg-whatsapp-dark text-white px-4 py-2 rounded-full font-semibold text-xs transition-all hover:scale-105 shadow-md shadow-whatsapp/20 font-sans wa-ripple"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Order Ingredients
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Festive Calendar Section ────────────────────────────────
function FestiveCalendarSection({ products }: { products: Product[] }) {
  return (
    <section className="py-12 sm:py-20 relative overflow-hidden bg-gradient-to-br from-cream via-gold/5 to-cream">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C8401A' fill-opacity='0.4'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23C8401A' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">
            🪔 Festival Calendar
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-3 sm:mb-4">
            Celebrate Every <span className="text-terracotta">Festival</span> 🎉
          </h2>
          <p className="text-brown-light/70 text-base sm:text-lg max-w-2xl mx-auto font-sans">
            From Sankranti to Diwali — every Telangana festival deserves authentic homemade flavors. Find the perfect Snakzee products for each celebration!
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FESTIVALS.map((festival, i) => (
            <motion.div
              key={festival.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl border-2 border-gold/10 hover:border-terracotta/20 transition-all p-5 sm:p-6 relative overflow-hidden"
            >
              {/* Rangoli-inspired corner decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.08]">
                <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="30" cy="30" r="28" stroke="#C8401A" strokeWidth="1" />
                  <circle cx="30" cy="30" r="20" stroke="#D4912A" strokeWidth="1" />
                  <circle cx="30" cy="30" r="12" stroke="#C8401A" strokeWidth="1" />
                  <path d="M30 2L30 58M2 30L58 30" stroke="#D4912A" strokeWidth="0.5" />
                </svg>
              </div>

              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl sm:text-4xl">{festival.emoji}</span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-brown">{festival.name}</h3>
                  <p className="text-brown-light/50 text-[13px] font-sans">{festival.nameTelugu} • {festival.date}</p>
                </div>
              </div>

              <p className="text-brown-light/60 text-sm font-sans leading-relaxed mb-4 line-clamp-3">
                {festival.description}
              </p>

              {/* Recommended products */}
              <div className="mb-4">
                <p className="text-brown-light/40 text-[10px] font-sans uppercase tracking-wider mb-1.5">Recommended</p>
                <div className="flex flex-wrap gap-1">
                  {festival.recommendedProducts.map((pid) => {
                    const p = products.find((pr) => pr.id === pid);
                    return p ? (
                      <span key={pid} className="text-[10px] px-2 py-0.5 bg-terracotta/5 text-brown-light rounded-full font-sans">
                        {p.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <a
                href={`https://wa.me/919305550051?text=${encodeURIComponent(
                  `Hi! I want to order Snakzee products for ${festival.name}: ${festival.recommendedProducts
                    .map((pid) => products.find((p) => p.id === pid)?.name)
                    .filter(Boolean)
                    .join(", ")}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-terracotta hover:text-terracotta-dark font-semibold text-xs font-sans transition-colors"
              >
                Shop for {festival.name}
                <ArrowRight className="w-3 h-3" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Free Delivery Banner ────────────────────────────────────
function FreeDeliveryBanner() {
  return (
    <section className="py-8 sm:py-12 bg-terracotta relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center">
          <Truck className="w-10 h-10 sm:w-12 sm:h-12 text-cream" />
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-cream">
              Free Delivery on Orders Above ₹1,000
            </h3>
            <p className="text-cream/70 text-sm sm:text-base mt-1 font-sans">
              Across Telangana • Fresh & Fast • Order Now!
            </p>
          </div>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cream text-terracotta px-6 py-3 rounded-full font-bold text-sm sm:text-base transition-all hover:scale-105 shadow-xl font-sans whitespace-nowrap wa-ripple"
          >
            Order Now →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Floating WhatsApp Button ────────────────────────────────
function FloatingWhatsApp() {
  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp whatsapp-tooltip bg-whatsapp hover:bg-whatsapp-dark text-white rounded-full flex items-center justify-center shadow-2xl shadow-whatsapp/30 transition-all hover:scale-110 animate-pulse-whatsapp wa-ripple"
      aria-label="Order on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
    </a>
  );
}

// ─── Social Proof Notification ────────────────────────────────
const TELANGANA_CITIES = ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Medak", "Rangareddy", "Secunderabad", "Miyapur", "Gachibowli", "Hitech City", "Kukatpally"];
const TIME_LABELS = ["just now", "1 minute ago", "2 minutes ago", "3 minutes ago", "5 minutes ago", "8 minutes ago"];

function SocialProofNotification({ products }: { products: Product[] }) {
  const [notification, setNotification] = useState<{ city: string; product: string; time: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [shown, setShown] = useState(0);

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    if (typeof window !== "undefined") sessionStorage.setItem("snackzee-notif-dismissed", "true");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("snackzee-notif-dismissed") === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDismissed(true);
      return;
    }
    if (dismissed || shown >= 4 || products.length === 0) return;
    const schedule = () => {
      const delay = 8000 + Math.random() * 7000;
      return setTimeout(() => {
        if (sessionStorage.getItem("snackzee-notif-dismissed") === "true") return;
        const city = TELANGANA_CITIES[Math.floor(Math.random() * TELANGANA_CITIES.length)];
        const product = products[Math.floor(Math.random() * products.length)];
        const time = TIME_LABELS[Math.floor(Math.random() * TIME_LABELS.length)];
        if (product && product.name) {
          setNotification({ city, product: product.name, time });
          setIsVisible(true);
          setShown(prev => prev + 1);
          setTimeout(() => setIsVisible(false), 4000);
        }
      }, delay);
    };
    const timer = schedule();
    return () => clearTimeout(timer);
  }, [shown, products, dismissed]);

  return (
    <AnimatePresence>
      {isVisible && notification && (
        <motion.div
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -120, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-28 left-5 z-40 max-w-[280px] bg-white rounded-xl shadow-xl border border-terracotta/10 p-3 flex items-start gap-3 backdrop-blur-sm"
          suppressHydrationWarning
        >
          <div className="flex-shrink-0 w-9 h-9 bg-whatsapp/10 rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-whatsapp" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-brown font-sans leading-snug">
              <span className="font-bold">{notification.city}</span> — Someone just ordered{" "}
              <span className="font-bold text-terracotta">{notification.product}</span>!
            </p>
            <p className="text-[10px] text-brown-light/50 mt-0.5 font-sans">{notification.time}</p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-brown-light/30 hover:text-brown-light transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Loyalty Rewards Section ──────────────────────────────────
const LOYALTY_TIERS = [
  { name: "Bronze", icon: <Medal className="w-6 h-6" />, orders: "0-4", discount: "5%", perks: ["5% off all orders"], color: "bg-amber-800 text-amber-100", borderColor: "border-amber-700" },
  { name: "Silver", icon: <Award className="w-6 h-6" />, orders: "5-9", discount: "10%", perks: ["10% off all orders", "Free delivery"], color: "bg-gray-400 text-gray-100", borderColor: "border-gray-400" },
  { name: "Gold", icon: <Crown className="w-6 h-6" />, orders: "10-19", discount: "15%", perks: ["15% off all orders", "Priority delivery", "Free gift wrap"], color: "bg-gold text-brown", borderColor: "border-gold" },
  { name: "Platinum", icon: <Gem className="w-6 h-6" />, orders: "20+", discount: "20%", perks: ["20% off all orders", "All Gold perks", "Exclusive products", "First access to new items"], color: "bg-gradient-to-br from-terracotta to-terracotta-dark text-cream", borderColor: "border-terracotta" },
];

function LoyaltyRewardsSection() {
  return (
    <section className="py-12 sm:py-20 bg-cream dotted-pattern-bg relative overflow-hidden" id="rewards">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">
            <Sparkles className="w-3 h-3 mr-1" />
            Snakzee Rewards
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-3 sm:mb-4">
            Earn <span className="text-terracotta">Rewards</span> with Every Order
          </h2>
          <p className="text-brown-light/70 text-base sm:text-lg max-w-2xl mx-auto font-sans">
            The more you order, the more you save. Join our loyalty program and unlock exclusive perks!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {LOYALTY_TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border-2 ${tier.borderColor} bg-white p-5 sm:p-6 text-center card-3d-tilt overflow-hidden`}
            >
              {/* Tier badge */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${tier.color} mb-4 shadow-md`}>
                {tier.icon}
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown mb-1">{tier.name}</h3>
              <p className="text-brown-light/50 text-xs font-sans mb-3">{tier.orders} orders</p>
              <div className="inline-block bg-terracotta/10 text-terracotta font-bold text-2xl font-serif px-4 py-1 rounded-lg mb-4">
                {tier.discount} OFF
              </div>
              <ul className="space-y-1.5 text-left">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-xs sm:text-sm text-brown-light/70 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-whatsapp flex-shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>
              {/* Highlight border for Gold tier */}
              {tier.name === "Gold" && (
                <div className="absolute top-0 right-0 bg-gold text-brown text-[9px] font-bold font-sans px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href={getWhatsAppLink("Hi! I want to join the Snakzee Rewards program!")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105 shadow-lg shadow-whatsapp/20 wa-ripple"
          >
            <MessageCircle className="w-4 h-4" />
            Join Rewards on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Product Comparison Modal ─────────────────────────────────
function ProductComparisonModal({
  open,
  onClose,
  compareIds,
}: {
  open: boolean;
  onClose: () => void;
  compareIds: string[];
}) {
  const comparisonProducts = compareIds.length >= 2 ? compareProducts(compareIds) : [];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto custom-scrollbar">
        <VisuallyHidden>
          <DialogTitle>Product Comparison</DialogTitle>
        </VisuallyHidden>
        <DialogClose className="absolute right-4 top-4" />
        <div className="p-2">
          <h2 className="font-serif text-2xl font-bold text-brown mb-1">Product Comparison</h2>
          <p className="text-brown-light/60 text-sm font-sans mb-4">Compare side by side</p>

          {comparisonProducts.length >= 2 ? (
            <div className="overflow-x-auto">
              <table className="comparison-table w-full text-sm font-sans">
                <thead>
                  <tr>
                    <th className="text-left p-3 bg-terracotta text-cream rounded-tl-lg">Feature</th>
                    {comparisonProducts.map((p) => (
                      <th key={p.id} className="text-center p-3 bg-terracotta text-cream min-w-[140px]">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-3 font-medium text-brown">Price</td>{comparisonProducts.map((p) => <td key={p.id} className="p-3 text-center">₹{p.price}</td>)}</tr>
                  <tr><td className="p-3 font-medium text-brown">Category</td>{comparisonProducts.map((p) => <td key={p.id} className="p-3 text-center capitalize">{p.category}</td>)}</tr>
                  <tr><td className="p-3 font-medium text-brown">Spice Level</td>{comparisonProducts.map((p) => { const s = SPICE_LABELS[p.spiceLevel] ?? SPICE_LABELS["none"]; return <td key={p.id} className="p-3 text-center">{s.emoji} {s.label}</td>; })}</tr>
                  <tr><td className="p-3 font-medium text-brown">Shelf Life</td>{comparisonProducts.map((p) => <td key={p.id} className="p-3 text-center">{p.shelfLife}</td>)}</tr>
                  <tr><td className="p-3 font-medium text-brown">Serves</td>{comparisonProducts.map((p) => <td key={p.id} className="p-3 text-center">{p.serves}</td>)}</tr>
                  <tr><td className="p-3 font-medium text-brown">Calories</td>{comparisonProducts.map((p) => <td key={p.id} className="p-3 text-center">{p.nutrition.calories}</td>)}</tr>
                  <tr><td className="p-3 font-medium text-brown">Protein</td>{comparisonProducts.map((p) => <td key={p.id} className="p-3 text-center">{p.nutrition.protein}</td>)}</tr>
                  <tr><td className="p-3 font-medium text-brown">Carbs</td>{comparisonProducts.map((p) => <td key={p.id} className="p-3 text-center">{p.nutrition.carbs}</td>)}</tr>
                  <tr>
                    <td className="p-3 font-medium text-brown rounded-bl-lg">Tags</td>
                    {comparisonProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {p.tags.slice(0, 3).map((t) => (
                            <span key={t} className="ingredient-tag text-[9px]">{t}</span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-brown-light/60 text-center py-8 font-sans">Select at least 2 products to compare.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Gift Card Section ────────────────────────────────────────
function GiftCardSection() {
  return (
    <section className="py-12 sm:py-20 bg-cream relative overflow-hidden" id="gift-cards">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 mb-4 font-sans">
            <Gift className="w-3 h-3 mr-1" />
            Gift a Taste of Home
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-3 sm:mb-4">
            Snakzee <span className="text-terracotta">Gift Cards</span>
          </h2>
          <p className="text-brown-light/70 text-base sm:text-lg max-w-2xl mx-auto font-sans">
            Give the gift of authentic Telangana flavors. Perfect for festivals, birthdays, housewarmings, or just because!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {GIFT_CARDS.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="gift-card p-5 sm:p-6 text-center relative"
            >
              <div className="text-3xl sm:text-4xl mb-3">{card.icon}</div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-brown mb-1">
                {card.name}
              </h3>
              <div className="inline-block bg-gradient-to-r from-terracotta to-gold text-white font-serif font-bold text-2xl sm:text-3xl px-5 py-1.5 rounded-lg my-3 shadow-md">
                ₹{card.amount}
              </div>
              <p className="text-brown-light/60 text-xs sm:text-sm font-sans leading-relaxed mb-4">
                {card.description}
              </p>
              <a
                href={`https://wa.me/919305550051?text=${encodeURIComponent(
                  `Hi! I want to purchase a ₹${card.amount} Snakzee Gift Card ("${card.name}"). Please share details!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-whatsapp hover:bg-whatsapp-dark text-white px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all hover:scale-105 shadow-md shadow-whatsapp/20 font-sans wa-ripple"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Buy Gift Card
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Ingredients Glossary Section ─────────────────────────────
function IngredientsGlossarySection() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  return (
    <section className="py-12 sm:py-20 bg-white border-y border-terracotta/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">
            <Leaf className="w-3 h-3 mr-1" />
            Know Your Ingredients
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-3 sm:mb-4">
            The <span className="text-terracotta">Heritage</span> Ingredients
          </h2>
          <p className="text-brown-light/70 text-base sm:text-lg max-w-2xl mx-auto font-sans">
            Every Snakzee product is crafted with time-honored ingredients sourced from local Telangana farms
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {(showAllIngredients ? INGREDIENTS_GLOSSARY : INGREDIENTS_GLOSSARY.slice(0, 6)).map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="ingredient-glossary-card"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl sm:text-3xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="font-serif text-lg font-bold text-brown">{item.name}</h3>
                    <span className="text-brown-light/50 text-[13px] font-sans">{item.nameTelugu}</span>
                  </div>
                  <p className="text-brown-light/60 text-sm font-sans leading-relaxed">
                    {item.description}
                  </p>
                  {expanded === item.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2"
                    >
                      <p className="text-terracotta text-xs font-sans flex items-start gap-1">
                        <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span><strong>Health benefits:</strong> {item.benefits}</span>
                      </p>
                    </motion.div>
                  )}
                  <button
                    onClick={() => setExpanded(expanded === item.name ? null : item.name)}
                    className="text-terracotta hover:text-terracotta-dark text-[11px] font-semibold font-sans mt-1 transition-colors"
                  >
                    {expanded === item.name ? "Show less" : "Health benefits →"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {INGREDIENTS_GLOSSARY.length > 6 && !showAllIngredients && (
          <button onClick={() => setShowAllIngredients(true)} className="mt-6 mx-auto block text-terracotta hover:text-terracotta-dark font-semibold text-sm font-sans transition-colors">
            Show all {INGREDIENTS_GLOSSARY.length} ingredients <ChevronDown className="w-4 h-4 inline" />
          </button>
        )}
      </div>
    </section>
  );
}

// ─── AI Chatbot Widget ────────────────────────────────────────
function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "Namaste! 🙏 I'm Snakzee Bot. How can I help you today? Choose a question below or type your own!" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuickQuestion = (qa: { question: string; answer: string }) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: qa.question },
      { role: "bot", text: qa.answer },
    ]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");

    // Find matching Q&A or default response
    const match = CHATBOT_QA.find(
      (qa) =>
        qa.question.toLowerCase().includes(userMsg.toLowerCase()) ||
        userMsg.toLowerCase().includes(qa.question.split(" ").slice(0, 2).join(" ").toLowerCase())
    );

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMsg },
      {
        role: "bot",
        text: match
          ? match.answer
          : `Great question! For "${userMsg}", I'd recommend messaging us directly on WhatsApp for the most accurate answer. Our team responds within minutes! 😊`,
      },
    ]);
  };

  return (
    <>
      {/* Chat bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="chatbot-bubble"
        aria-label="Open chat assistant"
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="chatbot-window chatbot-enter"
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="w-9 h-9 bg-terracotta rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo-removebg-preview.png"
                  alt="Snakzee"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="font-serif font-bold text-sm">Snakzee Bot</p>
                <p className="text-cream/50 text-[10px] font-sans">Online • Replies instantly</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-cream/10 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-cream/60" />
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === "user" ? "chat-message-user" : "chat-message-bot"}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            <div className="px-3 py-2 border-t border-terracotta/10 bg-cream/50">
              <p className="text-[9px] text-brown-light/40 font-sans mb-1.5 uppercase tracking-wider">Quick questions</p>
              <div className="flex flex-wrap gap-1">
                {CHATBOT_QA.slice(0, 4).map((qa, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(qa)}
                    className="text-[10px] px-2 py-1 bg-white border border-terracotta/10 rounded-full text-brown-light hover:text-terracotta hover:border-terracotta/20 transition-colors font-sans"
                  >
                    {qa.question}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="chatbot-input-area">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a question..."
                className="flex-1 bg-white border border-terracotta/10 rounded-full px-4 py-2 text-xs text-brown font-sans placeholder:text-brown-light/40 focus:outline-none focus:border-terracotta/30"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-8 h-8 bg-terracotta hover:bg-terracotta-dark text-cream rounded-full flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <SendHorizonal className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Preloader / Splash Screen ────────────────────────────────
function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="snakzee-preloader"
        >
          <div className="w-16 h-16 border-4 border-cream/20 border-t-cream rounded-full animate-spin mb-4" />
          <p className="font-serif text-2xl text-cream font-bold tracking-wide">Snakzee</p>
          <p className="text-cream/50 text-xs font-sans mt-1 tracking-widest uppercase">Art of Authentic Snacking</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



// ─── Testimonial Highlight Strip ──────────────────────────────
function TestimonialHighlightStrip() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const review = REVIEWS[activeIndex];

  return (
    <section className="py-8 sm:py-10 bg-gradient-to-r from-brown via-brown-light to-brown relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")` }} />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-center gap-1 mb-3">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-cream text-base sm:text-lg lg:text-xl font-serif italic leading-relaxed mb-3">
              &ldquo;{review.text}&rdquo;
            </p>
            <p className="text-cream/60 text-sm font-sans">
              — <span className="text-gold font-semibold">{review.name}</span>, {review.location}
            </p>
            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? "bg-gold w-6" : "bg-cream/30 hover:bg-cream/50"}`}
                  aria-label={`Show review ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Section Reveal Wrapper ───────────────────────────────────
function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`section-reveal ${revealed ? "revealed" : ""} ${className}`}>
      {children}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
function HomeContent() {
  const { products, loading: productsLoading } = useProducts();
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const searchParams = useSearchParams();

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCategory(cat);
      setTimeout(() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, [searchParams]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [quickOrderOpen, setQuickOrderOpen] = useState(false);
  const [quickOrderItems, setQuickOrderItems] = useState<Map<string, number>>(new Map());
  const [mounted, setMounted] = useState(false);

  // Fetch products from backend — handled by useProducts hook
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);



  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  const addToQuickOrder = useCallback((id: string) => {
    setQuickOrderItems((prev) => {
      const next = new Map(prev);
      next.set(id, (next.get(id) || 0) + 1);
      return next;
    });
  }, []);

  const removeFromQuickOrder = useCallback((id: string) => {
    setQuickOrderItems((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const updateQuickOrderQty = useCallback((id: string, qty: number) => {
    setQuickOrderItems((prev) => {
      const next = new Map(prev);
      next.set(id, qty);
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-cream" suppressHydrationWarning>
      <Preloader />

      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        <HeroSection />
        <SectionReveal><CategoryGrid products={products} onCategorySelect={setActiveCategory} /></SectionReveal>
        <BestSellers products={products} onCategorySelect={setActiveCategory} />
        <MarqueeStrip />
        <FeaturedProducts
          products={products}
          compareIds={new Set(compareIds)}
          onToggleCompare={toggleCompare}
          onAddToQuickOrder={addToQuickOrder}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <SectionReveal><CustomerReviews /></SectionReveal>
        {/* Sections moved to /about page
        <TestimonialHighlightStrip />
        <TrustStrip />
        <SectionReveal><HowItsMadeSection /></SectionReveal>
        <SectionReveal><OurStorySection /></SectionReveal>
        <SectionReveal><IngredientsGlossarySection /></SectionReveal>
        <SectionReveal><WhatsAppOrderSection /></SectionReveal>
        <SectionReveal><OrderTrackingSection /></SectionReveal>
        <SectionReveal><InstagramSection /></SectionReveal>
        <SectionReveal><RecipeSection /></SectionReveal>
        <SectionReveal><CustomerReviews /></SectionReveal>
        <SectionReveal><LoyaltyRewardsSection /></SectionReveal>
        <SectionReveal><BulkOrderSection products={products} /></SectionReveal>
        <SectionReveal><FestiveCalendarSection products={products} /></SectionReveal>
        <FAQSection />
        <NewsletterSection />
        <FreeDeliveryBanner />
        */}
      </main>
      <Footer />

      <ChatbotWidget />
      <FloatingWhatsApp />
      <SocialProofNotification products={products} />
      {compareIds.length >= 2 && (
        <button
          onClick={() => setCompareOpen(true)}
          className="fixed bottom-[8.5rem] left-5 z-50 bg-terracotta hover:bg-terracotta-dark text-cream px-4 py-2.5 rounded-full font-semibold text-sm shadow-lg transition-all hover:scale-105 flex items-center gap-2 wa-ripple"
        >
          <BarChart3 className="w-4 h-4" />
          Compare ({compareIds.length})
        </button>
      )}

      <ExitIntentPopup />
      <ProductComparisonModal
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        compareIds={compareIds}
      />
      {/* Quick Order List floating button */}
      {quickOrderItems.size > 0 && (
        <button
          onClick={() => setQuickOrderOpen(true)}
          className="fixed bottom-24 right-5 z-50 bg-gold hover:bg-gold-light text-brown w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-gold/30 transition-all hover:scale-110 font-sans"
        >
          <Package className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {Array.from(quickOrderItems.values()).reduce((a, b) => a + b, 0)}
          </span>
        </button>
      )}
      <QuickOrderList
        open={quickOrderOpen}
        onClose={() => setQuickOrderOpen(false)}
        items={quickOrderItems}
        onRemoveItem={removeFromQuickOrder}
        onUpdateQty={updateQuickOrderQty}
        products={products}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
