"use client";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Plus, Minus } from "lucide-react";
import { getWhatsAppLink } from "@/lib/products";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16.02 3C8.86 3 3.04 8.79 3.04 15.91c0 2.28.6 4.51 1.75 6.47L3 29l6.81-1.78a13.08 13.08 0 0 0 6.21 1.58C23.18 28.8 29 23 29 15.91S23.18 3 16.02 3Zm0 23.61c-1.92 0-3.79-.52-5.43-1.5l-.39-.23-4.04 1.06 1.08-3.93-.25-.4a10.67 10.67 0 0 1-1.65-5.7c0-5.91 4.79-10.72 10.68-10.72S26.7 10 26.7 15.91 21.91 26.61 16.02 26.61Zm5.86-8.01c-.32-.16-1.9-.94-2.19-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.58-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.07 1.3 3.28c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.9-.77 2.17-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [footerOpenSections, setFooterOpenSections] = useState({
    shop: false,
    discover: false,
    company: false,
    support: false,
  });

  const toggleFooterSection = (section: string) => {
    setFooterOpenSections((prev: any) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const scrollOrLink = (id: string, label: string) => {
    if (isHome) {
      return (
        <button
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
          className="footer-link-hover text-white/80 hover:text-white transition-colors text-sm text-left font-sans"
        >
          {label}
        </button>
      );
    }
    return (
      <Link href={`/#${id}`} className="footer-link-hover text-white/80 hover:text-white transition-colors text-sm font-sans">
        {label}
      </Link>
    );
  };

  return (
    <footer className="bg-terracotta text-white pt-12 sm:pt-16 pb-6 sm:pb-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-black/10 rounded-t-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-5 group">
              <div className="relative h-20 w-[240px]">
                <Image
                  src="/logo-removebg-preview.png"
                  alt="Snakzee"
                  fill
                  className="object-contain drop-shadow-md bg-white/90 p-2 rounded-xl"
                  sizes="240px"
                />
              </div>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed mb-4 font-sans">
              Bringing the authentic taste of Telangana and Andhra Pradesh to your doorstep.
              Homemade snacks, sweets, podis & vadiyalu — crafted with love
              and tradition.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://www.instagram.com/snak_zee" target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-4.5 h-4.5 text-white" />
              </a>
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-11 h-11 bg-whatsapp hover:bg-whatsapp-dark text-white rounded-full flex items-center justify-center shadow-lg shadow-black/10 transition-all hover:scale-105">
                <WhatsAppIcon className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* SHOP */}
          <div>
            <div className="md:hidden">
              <button type="button" onClick={() => toggleFooterSection("shop")} className="w-full flex items-center justify-between py-2 text-left">
                <span className="font-serif text-lg font-bold text-white">SHOP</span>
                {footerOpenSections.shop ? <Minus className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
              </button>
            </div>
            <h4 className="hidden md:block font-serif text-lg font-bold mb-4 text-white">SHOP</h4>
            <div className={`${footerOpenSections.shop ? "block" : "hidden"} md:block mt-2 md:mt-0`}>
              <ul className="space-y-2.5 font-sans text-sm">
                <li><Link href="/products" className="footer-link-hover text-white/80 hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/products?category=snacks" className="footer-link-hover text-white/80 hover:text-white transition-colors">Snacks</Link></li>
                <li><Link href="/products?category=sweet-items" className="footer-link-hover text-white/80 hover:text-white transition-colors">Sweet Items</Link></li>
                <li><Link href="/products?category=podis-and-powders" className="footer-link-hover text-white/80 hover:text-white transition-colors">Masalas & Powders</Link></li>
                <li><Link href="/products?category=pickles" className="footer-link-hover text-white/80 hover:text-white transition-colors">Pickles</Link></li>
                <li><Link href="/products?category=fryums" className="footer-link-hover text-white/80 hover:text-white transition-colors">Fryums</Link></li>
                {/* <li><Link href="/products?category=vadiyalu-papads" className="footer-link-hover text-white/80 hover:text-white transition-colors">Vadiyalu & Papads</Link></li> */}
                {/* <li><Link href="/products?filter=best-sellers" className="footer-link-hover text-white/80 hover:text-white transition-colors">Best Sellers</Link></li> */}
              </ul>
            </div>
          </div>

          {/* DISCOVER */}
          <div>
            <div className="md:hidden">
              <button type="button" onClick={() => toggleFooterSection("discover")} className="w-full flex items-center justify-between py-2 text-left">
                <span className="font-serif text-lg font-bold text-white">DISCOVER</span>
                {footerOpenSections.discover ? <Minus className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
              </button>
            </div>
            <h4 className="hidden md:block font-serif text-lg font-bold mb-4 text-white">DISCOVER</h4>
            <div className={`${footerOpenSections.discover ? "block" : "hidden"} md:block mt-2 md:mt-0`}>
              <ul className="space-y-2.5 font-sans text-sm">
                <li><Link href="/cook-with-snakzee" className="footer-link-hover text-white/80 hover:text-white transition-colors">Cook with Snakzee (Recipes)</Link></li>
                <li><Link href="/cook-with-snakzee#festival-calendar" className="footer-link-hover text-white/80 hover:text-white transition-colors">Festival Specials</Link></li>
                <li><Link href="/how-its-made" className="footer-link-hover text-white/80 hover:text-white transition-colors">How It’s Made</Link></li>
                <li>{scrollOrLink("ingredients", "Our Ingredients")}</li>
                <li><Link href="/cook-with-snakzee#rewards" className="footer-link-hover text-white/80 hover:text-white transition-colors">Snakzee Rewards</Link></li>
              </ul>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <div className="md:hidden">
              <button type="button" onClick={() => toggleFooterSection("company")} className="w-full flex items-center justify-between py-2 text-left">
                <span className="font-serif text-lg font-bold text-white">COMPANY</span>
                {footerOpenSections.company ? <Minus className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
              </button>
            </div>
            <h4 className="hidden md:block font-serif text-lg font-bold mb-4 text-white">COMPANY</h4>
            <div className={`${footerOpenSections.company ? "block" : "hidden"} md:block mt-2 md:mt-0`}>
              <ul className="space-y-2.5 font-sans text-sm">
                <li><Link href="/about" className="footer-link-hover text-white/80 hover:text-white transition-colors">About Snakzee</Link></li>
                <li><Link href="/about#team" className="footer-link-hover text-white/80 hover:text-white transition-colors">Team Behind Snakzee</Link></li>
                <li>
                  <a href={getWhatsAppLink("Hi! I want to place a bulk order from Snakzee. Can you share pricing and packaging options?")} target="_blank" rel="noopener noreferrer" className="footer-link-hover text-white/80 hover:text-white transition-colors">
                    Bulk Orders
                  </a>
                </li>
                <li><Link href="/about#testimonials" className="footer-link-hover text-white/80 hover:text-white transition-colors">Customer Reviews</Link></li>
              </ul>
            </div>
          </div>

          {/* Support */}
          <div>
            <div className="md:hidden">
              <button type="button" onClick={() => toggleFooterSection("support")} className="w-full flex items-center justify-between py-2 text-left">
                <span className="font-serif text-lg font-bold text-white">Support</span>
                {footerOpenSections.support ? <Minus className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
              </button>
            </div>
            <h4 className="hidden md:block font-serif text-lg font-bold mb-4 text-white">Support</h4>
            <div className={`${footerOpenSections.support ? "block" : "hidden"} md:block mt-2 md:mt-0`}>
              <ul className="space-y-2.5 font-sans text-sm">
                <li><Link href="/orders" className="footer-link-hover text-white/80 hover:text-white transition-colors">Order Tracking</Link></li>
                {/* <li>{scrollOrLink("faq", "FAQ")}</li> */}
                <li><Link href="/contact" className="footer-link-hover text-white/80 hover:text-white transition-colors">Contact Us</Link></li>
                <li className="pt-1">
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-whatsapp hover:bg-cream px-3 py-2 rounded-full font-bold shadow-md shadow-black/10 transition-all hover:scale-[1.02]">
                    <WhatsAppIcon className="w-4.5 h-4.5" />
                    WhatsApp Support
                  </a>
                </li>
                
                <li className="pt-2 border-t border-white/10 mt-2">
                  <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wider mb-1">Policies</span>
                  <div className="flex flex-col gap-1.5 text-xs">
                    <Link href="/privacy-policy" className="footer-link-hover text-white/70 hover:text-white">Privacy Policy</Link>
                    <Link href="/terms" className="footer-link-hover text-white/70 hover:text-white">Terms & Conditions</Link>
                    <Link href="/refund-policy" className="footer-link-hover text-white/70 hover:text-white">Refund Policy</Link>
                    <Link href="/shipping-policy" className="footer-link-hover text-white/70 hover:text-white">Shipping Policy</Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-black/10 pt-6 mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <p className="text-white/80 text-xs sm:text-sm font-sans">
              © {new Date().getFullYear()} Snakzee. All rights reserved. Made with ❤️ in Telangana and Andhra Pradesh
            </p>
            <p className="text-white/80 text-xs sm:text-sm font-sans font-medium bg-white/10 px-3 py-1.5 rounded-full">Homemade • No Preservatives • Fresh Every Order</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
