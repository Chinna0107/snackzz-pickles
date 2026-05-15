"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, ChevronDown, Home as HomeIcon, Info, Phone, Store } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { prefetchProducts } from "@/hooks/useProducts";
import { categories } from "@/lib/products";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const { count: cartCount, total } = useCart();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleCategoryClick = (catId: string) => {
    setMobileMenuOpen(false);
    setProductsOpen(false);
    router.push(`/products?category=${catId}`);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-white/98 backdrop-blur-xl shadow-xl border-b-2 border-terracotta/20"
          : "bg-cream/95 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link href="/">
            <motion.div className="flex items-center gap-2 cursor-pointer -ml-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
                <Image src="/snakzee-logo.png" alt="Snakzee Logo" width={48} height={48} className="object-contain" priority />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-serif text-2xl font-bold bg-gradient-to-r from-terracotta to-terracotta-dark bg-clip-text text-transparent leading-tight">
                  Snakzee
                </h1>
                <p className="text-[10px] text-terracotta/70 tracking-wider uppercase -mt-1 font-medium">
                  Art of Authentic Snacking
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link href="/" onMouseEnter={prefetchProducts}>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="relative group flex items-center gap-1.5 px-3 py-2 text-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide uppercase cursor-pointer"
              >
                <HomeIcon className="w-4 h-4" />
                Home
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.span>
            </Link>

            {/* Products Dropdown */}
            <div className="relative" ref={dropdownRef} onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setProductsOpen(!productsOpen)}
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
                      <Link href="/shop" onClick={() => setProductsOpen(false)}>
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
                          onClick={() => handleCategoryClick(cat.id)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-terracotta/5 transition-colors group text-left"
                        >
                          <span className="text-xl">{cat.icon}</span>
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

            <Link href="/about">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="relative group flex items-center gap-1.5 px-3 py-2 text-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide uppercase cursor-pointer"
              >
                <Info className="w-4 h-4" />
                About
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.span>
            </Link>

            <Link href="/contact">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="relative group flex items-center gap-1.5 px-3 py-2 text-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide uppercase cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                Contact
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/cart">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-terracotta hover:bg-terracotta-dark text-white rounded-full transition-all shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold text-sm">₹{total}</span>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-brown text-[10px] font-bold rounded-full flex items-center justify-center shadow-md"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            <Link href="/login" className="hidden lg:flex items-center gap-1.5 border-2 border-terracotta/30 text-terracotta hover:bg-terracotta hover:text-white px-4 py-2.5 rounded-full font-semibold text-sm transition-all font-sans">
              Sign In
            </Link>

            <button
              className="md:hidden p-2 text-brown hover:bg-terracotta/10 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
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
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-2 px-4 py-3 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium">
                  <HomeIcon className="w-4 h-4" /> Home
                </div>
              </Link>

              {/* Products section */}
              <div className="px-4 py-2">
                <p className="text-brown-light/40 text-[10px] font-sans uppercase tracking-widest mb-2">Products</p>
                <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-2 px-3 py-2.5 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium text-sm">
                    🛍️ All Products
                  </div>
                </Link>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-colors font-medium text-sm text-left"
                  >
                    {cat.icon} {cat.name}
                    <span className="text-brown-light/40 text-[11px] font-sans ml-1">({cat.nameTelugu})</span>
                  </button>
                ))}
              </div>

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
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center justify-center gap-2 w-full bg-terracotta hover:bg-terracotta-dark text-white px-4 py-3 rounded-full font-semibold text-sm transition-all mt-2">
                  Sign In
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
