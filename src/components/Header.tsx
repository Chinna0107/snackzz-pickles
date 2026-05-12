"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Home as HomeIcon, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { categories } from "@/lib/products";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { count: cartCount, total } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryClick = (catId: string) => {
    setMobileMenuOpen(false);
    router.push(`/?category=${catId}`);
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
            <motion.div
              className="flex items-center gap-2 cursor-pointer -ml-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
                <Image src="/snakzee-logo.png" alt="Snakzee Logo" width={48} height={48} className="object-contain" priority loading="eager" />
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
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group text-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide uppercase flex items-center gap-1.5"
              >
                <HomeIcon className="w-4 h-4" />
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all group-hover:w-full" />
              </motion.button>
            </Link>
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(cat.id)}
                className="relative group text-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide uppercase"
              >
                {cat.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all group-hover:w-full" />
              </motion.button>
            ))}
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

            <Link
              href="/login"
              className="hidden lg:flex items-center gap-1.5 border-2 border-terracotta/30 text-terracotta hover:bg-terracotta hover:text-white px-4 py-2.5 rounded-full font-semibold text-sm transition-all font-sans"
            >
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
            <div className="px-4 py-4 space-y-2">
              <Link href="/">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-lg transition-colors font-medium"
                >
                  <HomeIcon className="w-4 h-4" /> Home
                </button>
              </Link>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="block w-full text-left px-4 py-3 text-brown-light hover:text-terracotta hover:bg-terracotta/5 rounded-lg transition-colors font-medium"
                >
                  {cat.icon} {cat.name} ({cat.nameTelugu})
                </button>
              ))}
              <Link href="/login">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-terracotta hover:bg-terracotta-dark text-white px-4 py-3 rounded-full font-semibold text-sm transition-all mt-3"
                >
                  Sign In
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
