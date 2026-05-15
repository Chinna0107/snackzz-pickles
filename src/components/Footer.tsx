"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, MessageCircle, Phone, MapPin } from "lucide-react";
import { categories, getWhatsAppLink } from "@/lib/products";

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const scrollOrLink = (id: string, label: string) => {
    if (isHome) {
      return (
        <button
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
          className="footer-link-hover text-cream/60 hover:text-gold transition-colors text-sm text-left"
        >
          {label}
        </button>
      );
    }
    return (
      <Link href={`/#${id}`} className="footer-link-hover text-cream/60 hover:text-gold transition-colors text-sm">
        {label}
      </Link>
    );
  };

  return (
    <footer className="bg-brown text-cream pt-12 sm:pt-16 pb-6 sm:pb-8 footer-gradient-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-8 sm:mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image src="/snakzee-logo.png" alt="Snackzee Foods" width={40} height={40} className="object-contain" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold">Snackzee Foods</h3>
                <p className="text-cream/50 text-xs tracking-wider uppercase">Art of Authentic Snacking</p>
              </div>
            </Link>
            <p className="text-cream/60 text-sm leading-relaxed mb-4 font-sans">
              Bringing the authentic taste of Telangana to your doorstep. Homemade snacks, sweets, podis & vadiyalu — crafted with love and tradition.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/snak_zee" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-cream/10 hover:bg-cream/20 rounded-full flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-cream/10 hover:bg-whatsapp/30 rounded-full flex items-center justify-center transition-colors" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-4">Categories</h4>
            <ul className="space-y-2 font-sans">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/products?category=${cat.id}`}
                    className="footer-link-hover text-cream/60 hover:text-gold transition-colors text-sm">
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 font-sans">
              <li><Link href="/products" className="footer-link-hover text-cream/60 hover:text-gold transition-colors text-sm">All Products</Link></li>
              <li><Link href="/about" className="footer-link-hover text-cream/60 hover:text-gold transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="footer-link-hover text-cream/60 hover:text-gold transition-colors text-sm">Contact Us</Link></li>
              <li>{scrollOrLink("order", "How to Order")}</li>
              <li>{scrollOrLink("reviews", "Customer Reviews")}</li>
              <li>{scrollOrLink("bulk-order", "Bulk Orders")}</li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-4">Policies</h4>
            <ul className="space-y-2 font-sans">
              <li><Link href="/privacy-policy" className="footer-link-hover text-cream/60 hover:text-gold transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="footer-link-hover text-cream/60 hover:text-gold transition-colors text-sm">Terms & Conditions</Link></li>
              <li><Link href="/refund-policy" className="footer-link-hover text-cream/60 hover:text-gold transition-colors text-sm">Return & Refund Policy</Link></li>
              <li><Link href="/shipping-policy" className="footer-link-hover text-cream/60 hover:text-gold transition-colors text-sm">Shipping & Delivery</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3 font-sans">
              <li>
                <a href="tel:+919505550051" className="footer-link-hover flex items-center gap-2 text-cream/60 hover:text-gold transition-colors text-sm">
                  <Phone className="w-4 h-4 flex-shrink-0" />+91 95055 50051
                </a>
              </li>
              <li>
                <a href="tel:+918897586142" className="footer-link-hover flex items-center gap-2 text-cream/60 hover:text-gold transition-colors text-sm">
                  <Phone className="w-4 h-4 flex-shrink-0" />+91 88975 86142
                </a>
              </li>
              <li>
                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                  className="footer-link-hover flex items-center gap-2 text-whatsapp hover:text-whatsapp-dark transition-colors text-sm font-semibold">
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />WhatsApp Order
                </a>
              </li>
              <li className="flex items-start gap-2 text-cream/60 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>57/14-A, Sri Raghavendra Swamy Temple, Kurnool, 518001, A.P, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/10 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
            <p className="text-cream/40 text-xs sm:text-sm font-sans">
              © {new Date().getFullYear()} Snackzee Foods. All rights reserved. Made with ❤️ in Telangana
            </p>
            <p className="text-cream/30 text-xs font-sans">Homemade • No Preservatives • Fresh Every Order</p>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1">
            {[
              { href: "/privacy-policy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms & Conditions" },
              { href: "/refund-policy", label: "Refund Policy" },
              { href: "/shipping-policy", label: "Shipping Policy" },
            ].map((p) => (
              <Link key={p.href} href={p.href} className="text-cream/30 hover:text-cream/60 text-[11px] font-sans transition-colors">
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
