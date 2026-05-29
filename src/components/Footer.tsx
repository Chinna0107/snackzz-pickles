"use client";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, MessageCircle, Phone, MapPin, Plus, Minus } from "lucide-react";
import { categories, getWhatsAppLink } from "@/lib/products";

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
            <div className="flex gap-3">
              <a href="https://www.instagram.com/snak_zee" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <MessageCircle className="w-4 h-4 text-white" />
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
                <li><Link href="/shop" className="footer-link-hover text-white/80 hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/shop?category=hot-items" className="footer-link-hover text-white/80 hover:text-white transition-colors">Hot Items</Link></li>
                <li><Link href="/shop?category=sweet-items" className="footer-link-hover text-white/80 hover:text-white transition-colors">Sweet Items</Link></li>
                <li><Link href="/shop?category=podis-powders" className="footer-link-hover text-white/80 hover:text-white transition-colors">Podis & Powders</Link></li>
                <li><Link href="/shop?category=vadiyalu-papads" className="footer-link-hover text-white/80 hover:text-white transition-colors">Vadiyalu & Papads</Link></li>
                <li><Link href="/shop?filter=best-sellers" className="footer-link-hover text-white/80 hover:text-white transition-colors">Best Sellers</Link></li>
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
                <li><Link href="/about#festival-calendar" className="footer-link-hover text-white/80 hover:text-white transition-colors">Festival Specials</Link></li>
                <li><Link href="/how-its-made" className="footer-link-hover text-white/80 hover:text-white transition-colors">How It’s Made</Link></li>
                <li>{scrollOrLink("ingredients", "Our Ingredients")}</li>
                <li><Link href="/about#rewards" className="footer-link-hover text-white/80 hover:text-white transition-colors">Snakzee Rewards</Link></li>
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
                <li>{scrollOrLink("bulk-order", "Bulk Orders")}</li>
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
                <li>{scrollOrLink("faq", "FAQ")}</li>
                <li><Link href="/contact" className="footer-link-hover text-white/80 hover:text-white transition-colors">Contact Us</Link></li>
                <li>
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="footer-link-hover flex items-center gap-1.5 text-white/80 hover:text-white transition-colors font-semibold">
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
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2">
            {[
              { href: "/privacy-policy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms & Conditions" },
              { href: "/refund-policy", label: "Refund Policy" },
              { href: "/shipping-policy", label: "Shipping Policy" },
            ].map((p) => (
              <Link key={p.href} href={p.href} className="text-white/70 hover:text-white text-xs font-sans transition-colors">{p.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
