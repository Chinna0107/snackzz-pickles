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
    categories: false,
    quickLinks: false,
    policies: false,
    contact: false,
  });

  const toggleFooterSection = (section) => {
    setFooterOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const scrollOrLink = (id, label) => {
    if (isHome) {
      return (
        <button
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
          className="footer-link-hover text-white/80 hover:text-white transition-colors text-sm text-left"
        >
          {label}
        </button>
      );
    }
    return (
      <Link href={`/#${id}`} className="footer-link-hover text-white/80 hover:text-white transition-colors text-sm">
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

          {/* Categories */}
          <div>
            <div className="md:hidden">
              <button type="button" onClick={() => toggleFooterSection("categories")} className="w-full flex items-center justify-between py-2 text-left">
                <span className="font-serif text-lg font-bold text-white">Categories</span>
                {footerOpenSections.categories ? <Minus className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
              </button>
            </div>
            <h4 className="hidden md:block font-serif text-lg font-bold mb-4 text-white">Categories</h4>
            <div className={`${footerOpenSections.categories ? "block" : "hidden"} md:block mt-2 md:mt-0`}>
              <ul className="space-y-3 font-sans">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/shop?category=${cat.id}`} className="footer-link-hover flex items-center gap-2.5 text-white/80 hover:text-white transition-colors text-sm group">
                      <div className="relative w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 bg-white/10 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="28px"
                        />
                      </div>
                      <span className="font-medium">{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="md:hidden">
              <button type="button" onClick={() => toggleFooterSection("quickLinks")} className="w-full flex items-center justify-between py-2 text-left">
                <span className="font-serif text-lg font-bold text-white">Quick Links</span>
                {footerOpenSections.quickLinks ? <Minus className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
              </button>
            </div>
            <h4 className="hidden md:block font-serif text-lg font-bold mb-4 text-white">Quick Links</h4>
            <div className={`${footerOpenSections.quickLinks ? "block" : "hidden"} md:block mt-2 md:mt-0`}>
              <ul className="space-y-2 font-sans">
                <li><Link href="/shop" className="footer-link-hover text-white/80 hover:text-white transition-colors text-sm">All Products</Link></li>
                <li><Link href="/about" className="footer-link-hover text-white/80 hover:text-white transition-colors text-sm">About Us</Link></li>
                <li><Link href="/contact" className="footer-link-hover text-white/80 hover:text-white transition-colors text-sm">Contact Us</Link></li>
                <li>{scrollOrLink("order", "How to Order")}</li>
                <li>{scrollOrLink("reviews", "Customer Reviews")}</li>
                <li>{scrollOrLink("bulk-order", "Bulk Orders")}</li>
              </ul>
            </div>
          </div>

          {/* Policies */}
          <div>
            <div className="md:hidden">
              <button type="button" onClick={() => toggleFooterSection("policies")} className="w-full flex items-center justify-between py-2 text-left">
                <span className="font-serif text-lg font-bold text-white">Policies</span>
                {footerOpenSections.policies ? <Minus className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
              </button>
            </div>
            <h4 className="hidden md:block font-serif text-lg font-bold mb-4 text-white">Policies</h4>
            <div className={`${footerOpenSections.policies ? "block" : "hidden"} md:block mt-2 md:mt-0`}>
              <ul className="space-y-2 font-sans">
                <li><Link href="/privacy-policy" className="footer-link-hover text-white/80 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link href="/terms" className="footer-link-hover text-white/80 hover:text-white transition-colors text-sm">Terms & Conditions</Link></li>
                <li><Link href="/refund-policy" className="footer-link-hover text-white/80 hover:text-white transition-colors text-sm">Return & Refund Policy</Link></li>
                <li><Link href="/shipping-policy" className="footer-link-hover text-white/80 hover:text-white transition-colors text-sm">Shipping & Delivery</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="md:hidden">
              <button type="button" onClick={() => toggleFooterSection("contact")} className="w-full flex items-center justify-between py-2 text-left">
                <span className="font-serif text-lg font-bold text-white">Contact Us</span>
                {footerOpenSections.contact ? <Minus className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
              </button>
            </div>
            <h4 className="hidden md:block font-serif text-lg font-bold mb-4 text-white">Contact Us</h4>
            <div className={`${footerOpenSections.contact ? "block" : "hidden"} md:block mt-2 md:mt-0`}>
              <ul className="space-y-3 font-sans">
                <li>
                  <a href="tel:+919505550051" className="footer-link-hover flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                    <Phone className="w-4 h-4 flex-shrink-0" /> +91 95055 50051
                  </a>
                </li>
                <li>
                  <a href="tel:+918897586142" className="footer-link-hover flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                    <Phone className="w-4 h-4 flex-shrink-0" /> +91 88975 86142
                  </a>
                </li>
                <li>
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="footer-link-hover flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-3 py-2 text-white transition-colors text-sm font-semibold w-max">
                    <MessageCircle className="w-4 h-4 flex-shrink-0" /> WhatsApp Order
                  </a>
                </li>
                <li className="flex items-start gap-2 text-white/80 text-sm mt-3">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>House No 1/2/32, Taka Street, Near Main Road, Jagtial, Telangana — 505327</span>
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
