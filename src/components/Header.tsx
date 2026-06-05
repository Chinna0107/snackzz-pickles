"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import TopAnnouncementBar from "@/components/TopAnnouncementBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, ChevronDown, Home as HomeIcon, Info, Phone, ShoppingBag, LogOut, User, Search, Heart, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { prefetchProducts } from "@/hooks/useProducts";
import { categories } from "@/lib/products";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Mobile accordion state toggle
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);

  const { count: cartCount, total } = useCart();
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const headerRootRef = useRef<HTMLDivElement>(null);

  // Scrolled effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch logged in user
  useEffect(() => {
    const stored = localStorage.getItem("snackzee_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

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

  // Click outside to close dropdowns — use both mousedown and touchstart for iOS
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) setProductsOpen(false);
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(target)) setAboutOpen(false);
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(target)) setMoreOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(target)) setUserMenuOpen(false);
      if (mobileMenuOpen && headerRootRef.current && !headerRootRef.current.contains(target)) setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleCategoryClick = (catId: string) => {
    setMobileMenuOpen(false);
    setProductsOpen(false);
    router.push(`/products?category=${catId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("snackzee_token");
    localStorage.removeItem("snackzee_user");
    setUser(null);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  return (
    <div ref={headerRootRef} className="fixed top-0 left-0 right-0 z-[100] w-full mb-6">
      <TopAnnouncementBar hidden={false} />
      
      <nav className={`w-full transition-all duration-300 ${
        scrolled ? "bg-white/98 backdrop-blur-xl shadow-xl border-b-2 border-terracotta/20" : "bg-cream/95 backdrop-blur-md border-b border-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <Link href="/">
              <motion.div className="cursor-pointer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="relative h-9 sm:h-12 lg:h-14 w-[120px] sm:w-[160px] lg:w-[200px]">
                  <Image
                    src="/logo-removebg-preview.png"
                    alt="Snakzee"
                    fill
                    className="object-contain object-left"
                    priority
                    loading="eager"
                    sizes="180px"
                  />
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-0.5 lg:gap-1.5">
              
              {/* HOME */}
              <Link href="/" onMouseEnter={prefetchProducts}>
                <motion.span whileHover={{ scale: 1.03 }} className="relative group flex items-center gap-1 px-2.5 py-2 text-brown hover:text-terracotta transition-colors font-medium text-xs lg:text-sm tracking-wide uppercase cursor-pointer">
                  <HomeIcon className="w-3.5 h-3.5" /> Home
                  <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </motion.span>
              </Link>

              {/* PRODUCTS Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={() => { setProductsOpen(!productsOpen); setAboutOpen(false); setMoreOpen(false); }}
                  className="relative group flex items-center gap-1 px-2.5 py-2 text-brown hover:text-terracotta transition-colors font-medium text-xs lg:text-sm tracking-wide uppercase select-none">
                  Products <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`} />
                  <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </motion.button>
                <AnimatePresence>
                  {productsOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-56 bg-white rounded-2xl shadow-2xl border border-terracotta/10 overflow-hidden z-50">
                      <div className="p-2">
                        <Link href="/products" onClick={() => setProductsOpen(false)}>
                          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-terracotta/5 active:bg-terracotta/10 transition-colors cursor-pointer group">
                            <span className="text-xl">🛍️</span>
                            <p className="font-sans font-semibold text-brown text-sm group-hover:text-terracotta">All Products</p>
                          </div>
                        </Link>
                        <div className="h-px bg-terracotta/10 my-1" />
                        {categories.map((cat) => (
                          <Link href={`/products?category=${cat.id}`} key={cat.id} onClick={() => setProductsOpen(false)}>
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-terracotta/5 active:bg-terracotta/10 transition-colors cursor-pointer group">
                              <span className="text-lg">{cat.icon}</span>
                              <div>
                                <p className="font-sans font-semibold text-brown text-sm group-hover:text-terracotta">{cat.name}</p>
                                <p className="text-brown-light/40 text-[10px] font-sans">{cat.nameTelugu}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ABOUT Dropdown */}
              <div className="relative" ref={aboutDropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={() => { setAboutOpen(!aboutOpen); setProductsOpen(false); setMoreOpen(false); }}
                  className="relative group flex items-center gap-1 px-2.5 py-2 text-brown hover:text-terracotta transition-colors font-medium text-xs lg:text-sm tracking-wide uppercase select-none">
                  About <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`} />
                  <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </motion.button>
                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-60 bg-white rounded-2xl shadow-2xl border border-terracotta/10 overflow-hidden z-50">
                      <div className="p-2 space-y-0.5">
                        {[
                          { href: "/about#our-story", label: "Our Story", icon: "📖" },
                          { href: "/about#team", label: "Team Behind Snakzee", icon: "👥" },
                          { href: "/about#values", label: "Mission & Values", icon: "🌱" },
                          { href: "/about#why-different", label: "Why Snakzee is Different", icon: "✨" },
                          { href: "/about#testimonials", label: "Customer Love", icon: "♡" }
                        ].map((item) => (
                          <Link key={item.href} href={item.href} onClick={() => setAboutOpen(false)}>
                            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-terracotta/5 active:bg-terracotta/10 transition-colors cursor-pointer group">
                              <span className="text-sm">{item.icon}</span>
                              <span className="font-sans font-semibold text-brown text-sm group-hover:text-terracotta">{item.label}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* MORE Dropdown */}
              <div className="relative" ref={moreDropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={() => { setMoreOpen(!moreOpen); setProductsOpen(false); setAboutOpen(false); }}
                  className="relative group flex items-center gap-1 px-2.5 py-2 text-brown hover:text-terracotta transition-colors font-medium text-xs lg:text-sm tracking-wide uppercase select-none">
                  More <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
                  <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </motion.button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-terracotta/10 overflow-hidden z-50">
                      <div className="p-2 space-y-0.5">
                        
                        {/* Interactive How It's Made Mega item */}
                        <div className="px-3 py-2 border-b border-terracotta/5 mb-1 bg-cream/30 rounded-xl">
                          <Link href="/how-its-made" onClick={() => setMoreOpen(false)} className="flex items-center gap-2 font-serif font-bold text-sm text-terracotta hover:underline">
                            💡 How It’s Made
                          </Link>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2 pl-2 border-l border-terracotta/15">
                            {[
                              { h: "#sourcing", l: "Sourcing" },
                              { h: "#preparation", l: "Preparation" },
                              { h: "#cooking", l: "Cooking" },
                              { h: "#sun-drying", l: "Sun Drying" },
                              { h: "#packing-hygiene", l: "Hygiene" },
                              { h: "#delivery-process", l: "Delivery" }
                            ].map((s) => (
                              <Link key={s.h} href={`/how-its-made${s.h}`} onClick={() => setMoreOpen(false)} className="text-[11px] font-sans text-brown-light/70 hover:text-terracotta transition-colors truncate">
                                ├ {s.l}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {[
                          { href: "/cook-with-snakzee", label: "Cook with Snakzee (Recipes)", icon: "🍳" },
                          {href: "/cook-with-snakzee#heritage", label: "Our Heritage Ingredients", icon: "🧈" },
                          { href: "/cook-with-snakzee#festival-calendar", label: "Festival Specials", icon: "🪔" },
                          { href: "/cook-with-snakzee#rewards", label: "Snakzee Rewards", icon: "🎁" }
                        ].map((item) => (
                          <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)}>
                            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-terracotta/5 transition-colors cursor-pointer group text-left">
                              <span className="text-sm">{item.icon}</span>
                              <span className="font-sans font-semibold text-brown text-sm group-hover:text-terracotta">{item.label}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact Us */}
              <Link href="/contact">
                <motion.span whileHover={{ scale: 1.03 }} className="relative group flex items-center gap-1 px-2.5 py-2 text-brown hover:text-terracotta transition-colors font-medium text-xs lg:text-sm tracking-wide uppercase cursor-pointer">
                  Contact Us
                  <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </motion.span>
              </Link>
            </div>

            {/* Right Side Controls Bar */}
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
              
              {/* 🔍 Interactive Search Overlay Toggle */}
              <motion.button
                onClick={() => setSearchOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-brown hover:bg-terracotta/10 transition-colors"
                title="Search products"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>

              {/* ♡ Wishlist Navigation Icon */}
              <Link href="/wishlist">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-brown hover:bg-terracotta/10 transition-colors cursor-pointer"
                  title="My Wishlist"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  {wishlistCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute top-0 right-0 w-3.5 h-3.5 bg-terracotta text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-md">
                      {wishlistCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              {/* 🛒 Shopping Cart Mini Button */}
              <Link href="/cart">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="relative flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-terracotta hover:bg-terracotta-dark text-white rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer">
                  <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  {cartCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-brown text-[8px] font-bold rounded-full flex items-center justify-center shadow-md">
                      {cartCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              {/* 👤 Account Options Controller */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-full border border-terracotta/20 hover:bg-terracotta/5 transition-colors">
                    <div className="w-6 h-6 bg-terracotta text-white rounded-full flex items-center justify-center text-[10px] font-bold font-sans flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-brown font-sans font-semibold text-xs max-w-[60px] truncate hidden md:inline">{user.name.split(" ")[0]}</span>
                    <ChevronDown className={`w-3 h-3 text-brown-light/50 transition-transform hidden md:block ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-terracotta/10 overflow-hidden z-50">
                        
                        <div className="px-4 py-3 border-b border-terracotta/10 bg-cream/20">
                          <p className="font-sans font-semibold text-brown text-xs truncate">{user.name}</p>
                          <p className="text-brown-light/40 text-[9px] font-sans truncate">{user.email}</p>
                        </div>
                        
                        <div className="p-1 space-y-0.5">
                          {[
                            { href: "/orders", label: "My Orders", icon: <ShoppingBag className="w-4 h-4 text-terracotta" /> },
                            { href: "/orders", label: "Orders Tracking", icon: <Sparkles className="w-4 h-4 text-gold" /> },
                            { href: "/wishlist", label: "Wishlist", icon: <Heart className="w-4 h-4 text-red-400" /> },
                            { href: "/cook-with-snakzee#rewards", label: "Rewards", icon: <Sparkles className="w-4 h-4 text-yellow-600" /> },
                            { href: "/profile", label: "Profile", icon: <User className="w-4 h-4 text-blue-400" /> }
                          ].map((option, key) => (
                            <Link key={key} href={option.href} onClick={() => setUserMenuOpen(false)}>
                              <div className="flex items-center gap-2.5 px-3 py-2 hover:bg-terracotta/5 rounded-xl text-brown font-sans text-xs cursor-pointer transition-colors font-medium">
                                {option.icon} {option.label}
                              </div>
                            </Link>
                          ))}
                          
                          <div className="h-px bg-terracotta/10 my-1" />
                          
                          <button onClick={handleLogout}
                            className="flex items-center gap-2.5 px-3 py-2 hover:bg-red-50 text-red-500 font-sans text-xs w-full transition-colors rounded-xl font-medium">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login" className="hidden md:flex items-center gap-1.5 border-2 border-terracotta/30 text-terracotta hover:bg-terracotta hover:text-white px-3 py-1.5 rounded-full font-semibold text-xs transition-all font-sans">
                  Sign In
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button className="lg:hidden p-1.5 text-brown hover:bg-terracotta/10 rounded-full transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Accordion Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-cream/98 backdrop-blur-lg border-b border-terracotta/10 overflow-hidden max-h-[80vh] overflow-y-auto">
              <div className="px-4 py-4 space-y-2.5">
                
                {user && (
                  <div className="flex items-center gap-3 px-3.5 py-3 mb-2 bg-terracotta/5 rounded-2xl">
                    <div className="w-8 h-8 bg-terracotta text-white rounded-full flex items-center justify-center font-bold font-sans text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-brown text-xs">{user.name}</p>
                      <p className="text-brown-light/40 text-[9px] font-sans">{user.email}</p>
                    </div>
                  </div>
                )}

                {/* HOME */}
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-2 px-3 py-2.5 text-brown hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-semibold text-sm">
                    <HomeIcon className="w-4 h-4" /> Home
                  </div>
                </Link>

                {/* PRODUCTS Accordion */}
                <div className="border border-terracotta/5 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-brown text-sm font-semibold hover:bg-terracotta/5 transition-colors">
                    <span>🛍️ Products</span>
                    <ChevronDown className={`w-4 h-4 text-brown-light/50 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {mobileProductsOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-white/40 pl-3 pr-2 py-1 space-y-0.5">
                        <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
                          <div className="px-3 py-2 text-xs text-brown-light font-sans font-semibold hover:text-terracotta">All Products</div>
                        </Link>
                        {categories.map((cat) => (
                          <Link href={`/products?category=${cat.id}`} key={cat.id} onClick={() => setMobileMenuOpen(false)}>
                            <div className="px-3 py-2 text-xs text-brown-light font-sans font-semibold hover:text-terracotta flex items-center gap-2">
                              <span className="text-lg">{cat.icon}</span>
                              {cat.name}
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ABOUT Accordion */}
                <div className="border border-terracotta/5 rounded-xl overflow-hidden">
                  <button onClick={() => setMobileAboutOpen(!mobileAboutOpen)} className="w-full flex items-center justify-between px-3 py-2.5 text-brown text-sm font-semibold hover:bg-terracotta/5 transition-colors">
                    <span>📖 About</span>
                    <ChevronDown className={`w-4 h-4 text-brown-light/50 transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {mobileAboutOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-white/40 pl-3 pr-2 py-1 space-y-0.5">
                        {[
                          { href: "/about#our-story", label: "Our Story" },
                          { href: "/about#team", label: "Team Behind Snakzee" },
                          { href: "/about#values", label: "Mission & Values" },
                          { href: "/about#why-different", label: "Why Snakzee is Different" },
                          { href: "/about#testimonials", label: "Customer Love" }
                        ].map((sub) => (
                          <Link key={sub.href} href={sub.href} onClick={() => setMobileMenuOpen(false)}>
                            <div className="px-3 py-2 text-xs text-brown-light font-sans font-semibold hover:text-terracotta">{sub.label}</div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* MORE Accordion */}
                <div className="border border-terracotta/5 rounded-xl overflow-hidden">
                  <button onClick={() => setMobileMoreOpen(!mobileMoreOpen)} className="w-full flex items-center justify-between px-3 py-2.5 text-brown text-sm font-semibold hover:bg-terracotta/5 transition-colors">
                    <span>✨ More</span>
                    <ChevronDown className={`w-4 h-4 text-brown-light/50 transition-transform ${mobileMoreOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {mobileMoreOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-white/40 pl-3 pr-2 py-1 space-y-1">
                        
                        {/* How It's Made nested */}
                        <div className="bg-cream/40 p-2 rounded-lg text-left">
                          <Link href="/how-its-made" onClick={() => setMobileMenuOpen(false)} className="text-xs font-serif font-bold text-terracotta block mb-1">
                            💡 How It’s Made
                          </Link>
                          <div className="grid grid-cols-2 gap-1.5 pl-2 border-l border-terracotta/15">
                            {[
                              { h: "#sourcing", l: "Sourcing" },
                              { h: "#preparation", l: "Preparation" },
                              { h: "#cooking", l: "Cooking" },
                              { h: "#sun-drying", l: "Sun Drying" },
                              { h: "#packing-hygiene", l: "Hygiene" },
                              { h: "#delivery-process", l: "Delivery" }
                            ].map((s) => (
                              <Link key={s.h} href={`/how-its-made${s.h}`} onClick={() => setMobileMenuOpen(false)} className="text-[10px] text-brown-light hover:text-terracotta block truncate">
                                ├ {s.l}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {[
                          { href: "/cook-with-snakzee", label: "Cook with Snakzee (Recipes)" },
                          {href: "/cook-with-snakzee#heritage", label: "Our Heritage Ingredients", icon: "🧈" },
                          { href: "/cook-with-snakzee#festival-calendar", label: "Festival Specials" },
                          { href: "/cook-with-snakzee#rewards", label: "Snakzee Rewards" }
                        ].map((sub) => (
                          <Link key={sub.href} href={sub.href} onClick={() => setMobileMenuOpen(false)}>
                            <div className="px-3 py-2 text-xs text-brown-light font-sans font-semibold hover:text-terracotta">{sub.label}</div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Contact Us */}
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-2 px-3 py-2.5 text-brown hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-semibold text-sm">
                    Contact Us
                  </div>
                </Link>

                {/* Account mobile */}
                {user ? (
                  <div className="border-t border-terracotta/10 pt-3 space-y-1 bg-cream/10 rounded-b-xl">
                    {/* <span className="text-[9px] font-sans font-bold text-brown-light/40 uppercase tracking-widest px-3 block mb-1">My Account Menu</span>
                    {[
                      { href: "/orders", label: "My Orders" },
                      { href: "/orders", label: "Orders Tracking" },
                      { href: "/wishlist", label: "My Wishlist" },
                      { href: "/cook-with-snakzee#rewards", label: "My Rewards" },
                      { href: "/profile", label: "My Profile" }
                    ].map((opt) => (
                      <Link key={`${opt.href}:${opt.label}`} href={opt.href} onClick={() => setMobileMenuOpen(false)}>
                        <div className="px-4 py-2 text-xs font-sans font-medium text-brown hover:text-terracotta transition-colors">{opt.label}</div>
                      </Link>
                    ))}
                    <button onClick={handleLogout} className="px-4 py-2 text-xs font-sans font-semibold text-red-500 hover:bg-red-50 transition-colors w-full text-left rounded-xl mt-1">
                      Logout
                    </button> */}
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center justify-center gap-2 w-full bg-terracotta hover:bg-terracotta-dark text-white px-4 py-2.5 rounded-full font-semibold text-xs sm:text-sm shadow-md transition-all">
                      <User className="w-3.5 h-3.5" /> Sign In
                    </div>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 🔍 Glassmorphism Search Modal Dialog */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white/95 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-white/20 relative"
            >
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream hover:bg-terracotta/10 text-brown transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-serif text-2xl font-bold text-brown mb-2 text-center">Search Snakzee Cravings</h3>
              <p className="text-brown-light/60 font-sans text-xs text-center mb-6">Type in details of any sweet, snack, papad or podi you are looking for.</p>
              
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-light/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="E.g., Murukulu, Laddu, Karam, Podi..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-cream border border-terracotta/10 focus:border-terracotta/30 focus:outline-none text-brown font-sans font-medium text-sm placeholder:text-brown-light/35 shadow-inner"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-sans font-bold py-3.5 rounded-2xl shadow-lg transition-all"
                >
                  Find Delicacies
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
