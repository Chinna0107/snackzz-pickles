"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import TopAnnouncementBar from "@/components/TopAnnouncementBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, ChevronDown, Home as HomeIcon, Info, Phone, ShoppingBag, LogOut, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { prefetchProducts } from "@/hooks/useProducts";
import { categories } from "@/lib/products";


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const { count: cartCount, total } = useCart();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("snackzee_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setProductsOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (catId: string) => {
    setMobileMenuOpen(false);
    setProductsOpen(false);
    router.push(`/shop?category=${catId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("snackzee_token");
    localStorage.removeItem("snackzee_user");
    setUser(null);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <div className="sticky top-0 z-[100] w-full">
      <TopAnnouncementBar hidden={false} />
      <nav className={`w-full transition-all duration-300 ${
        scrolled ? "bg-white/98 backdrop-blur-xl shadow-xl border-b-2 border-terracotta/20" : "bg-cream/95 backdrop-blur-md border-b border-transparent"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link href="/">
            <motion.div className="cursor-pointer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="relative h-10 sm:h-14 w-[140px] sm:w-[200px]">
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link href="/" onMouseEnter={prefetchProducts}>
              <motion.span whileHover={{ scale: 1.05 }} className="relative group flex items-center gap-1.5 px-3 py-2 text-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide uppercase cursor-pointer">
                <HomeIcon className="w-4 h-4" /> Home
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.span>
            </Link>

            {/* Products Dropdown */}
            <div className="relative" ref={dropdownRef} onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => setProductsOpen(!productsOpen)}
                className="relative group flex items-center gap-1.5 px-3 py-2 text-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide uppercase">
                Products <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`} />
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.button>
              <AnimatePresence>
                {productsOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-terracotta/10 overflow-hidden z-50">
                    <div className="p-2">
                      <Link href="/shop" onClick={() => setProductsOpen(false)}>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-terracotta/5 transition-colors cursor-pointer group">
                          <span className="text-xl">🛍️</span>
                          <div>
                            <p className="font-sans font-semibold text-brown text-sm group-hover:text-terracotta">All Products</p>
                            <p className="text-brown-light/40 text-[10px] font-sans">Browse everything</p>
                          </div>
                        </div>
                      </Link>
                      <div className="h-px bg-terracotta/10 my-1" />
                      {categories.map((cat) => (
                        <button key={cat.id} onClick={() => handleCategoryClick(cat.id)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-terracotta/5 transition-colors group text-left">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-cream"><Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="40px" /></div>
                          <div>
                            <p className="font-sans font-semibold text-brown text-sm group-hover:text-terracotta">{cat.name}</p>
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
                <Info className="w-4 h-4" /> About
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.span>
            </Link>

            <Link href="/contact">
              <motion.span whileHover={{ scale: 1.05 }} className="relative group flex items-center gap-1.5 px-3 py-2 text-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide uppercase cursor-pointer">
                <Phone className="w-4 h-4" /> Contact
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart */}
            <Link href="/cart">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-terracotta hover:bg-terracotta-dark text-white rounded-full transition-all shadow-lg hover:shadow-xl">
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold text-sm">₹{total}</span>
                {cartCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-brown text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* User avatar or Sign In */}
            {user ? (
              <div className="relative hidden lg:block" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border border-terracotta/20 hover:bg-terracotta/5 transition-colors">
                  <div className="w-7 h-7 bg-terracotta text-white rounded-full flex items-center justify-center text-xs font-bold font-sans">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-brown font-sans font-semibold text-sm max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-brown-light/50 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-terracotta/10 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-terracotta/10">
                        <p className="font-sans font-semibold text-brown text-sm truncate">{user.name}</p>
                        <p className="text-brown-light/40 text-[10px] font-sans truncate">{user.email}</p>
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

            <button className="md:hidden p-2 text-brown hover:bg-terracotta/10 rounded-full transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cream/98 backdrop-blur-lg border-b border-terracotta/10 overflow-hidden">
            <div className="px-4 py-4 space-y-1">
              {user && (
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-terracotta/5 rounded-xl">
                  <div className="w-9 h-9 bg-terracotta text-white rounded-full flex items-center justify-center font-bold font-sans">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-brown text-sm">{user.name}</p>
                    <p className="text-brown-light/40 text-[10px] font-sans">{user.email}</p>
                  </div>
                </div>
              )}

              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-2 px-4 py-3 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium">
                  <HomeIcon className="w-4 h-4" /> Home
                </div>
              </Link>

              <div className="px-4 py-2">
                <p className="text-brown-light/40 text-[10px] font-sans uppercase tracking-widest mb-2">Products</p>
                <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-2 px-3 py-2.5 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium text-sm">
                    🛍️ All Products
                  </div>
                </Link>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => handleCategoryClick(cat.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium text-sm text-left">
                    <div className="relative h-10 w-10 rounded-2xl overflow-hidden bg-cream">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="flex-1 text-left font-sans">
                      <div className="font-medium">{cat.name}</div>
                      <div className="text-brown-light/40 text-[11px]">{cat.nameTelugu}</div>
                    </div>
                  </button>
                ))}
              </div>

              <Link href="/cook-with-snakzee" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-2 px-4 py-3 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium">
                  Cook with Snakzee
                </div>
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-2 px-4 py-3 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium">
                  <Info className="w-4 h-4" /> About Us
                </div>
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-2 px-4 py-3 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium">
                  <Phone className="w-4 h-4" /> Contact Us
                </div>
              </Link>

              {user ? (
                <>
                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center gap-2 px-4 py-3 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium">
                      <ShoppingBag className="w-4 h-4" /> My Orders
                    </div>
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors font-medium w-full">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center justify-center gap-2 w-full bg-terracotta hover:bg-terracotta-dark text-white px-4 py-3 rounded-full font-semibold text-sm transition-all mt-2">
                    <User className="w-4 h-4" /> Sign In
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
