"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Home as HomeIcon, Users, Heart, Award, ChefHat, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getWhatsAppLink, PROCESS_STEPS } from "@/lib/products";

const VALUES = [
  { icon: <HomeIcon className="w-6 h-6" />, title: "Made at Home", desc: "Every product is handcrafted in small batches using traditional kitchen methods — never in a factory." },
  { icon: <Leaf className="w-6 h-6" />, title: "No Preservatives", desc: "We use only fresh, natural ingredients sourced from local Telangana farms. Zero artificial additives." },
  { icon: <Heart className="w-6 h-6" />, title: "Made with Love", desc: "Every recipe carries the warmth of three generations of Telangana women who believed food is love." },
  { icon: <Award className="w-6 h-6" />, title: "Authentic Recipes", desc: "Our recipes are passed down through generations — unchanged, uncompromised, and utterly authentic." },
];

const TEAM = [
  { name: "Founder", role: "Recipe Curator & Head Chef", avatar: "👩‍🍳", desc: "Grew up watching her grandmother prepare traditional Telangana snacks for every festival." },
  { name: "Quality Team", role: "Freshness Guardians", avatar: "🌿", desc: "Ensures every batch meets our strict no-preservative, fresh-ingredient standards." },
  { name: "Delivery Team", role: "Last-Mile Heroes", avatar: "🚚", desc: "Delivers your orders fresh across Telangana within 2-3 days of preparation." },
];

const STATS = [
  { value: "500+", label: "Happy Customers" },
  { value: "44+", label: "Authentic Products" },
  { value: "3", label: "Generations of Recipes" },
  { value: "100%", label: "No Preservatives" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="pt-20 sm:pt-24">

        {/* Hero */}
        <section className="bg-gradient-to-br from-brown via-brown-light to-terracotta-dark py-16 sm:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }} />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="bg-white/10 text-cream border-white/20 mb-6 font-sans">🌿 Our Story</Badge>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-cream mb-6 leading-tight">
                From Grandmother&apos;s Kitchen<br />
                <span className="text-gold">to Your Doorstep</span>
              </h1>
              <p className="text-cream/70 text-lg sm:text-xl max-w-2xl mx-auto font-sans leading-relaxed">
                Snakzee was born from a simple longing — the taste of home. We bring authentic, homemade Telangana flavours to families across India.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-white border-b border-terracotta/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {STATS.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                  <p className="font-serif text-4xl sm:text-5xl font-bold text-terracotta mb-2">{stat.value}</p>
                  <p className="text-brown-light/60 text-sm font-sans">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 sm:py-24 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">Our Journey</Badge>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-6">
                  A Story Born from <span className="text-terracotta">Nostalgia</span>
                </h2>
                <div className="relative pl-6 border-l-2 border-gold/30 mb-6">
                  <p className="font-serif text-lg text-brown-light/80 italic leading-relaxed">
                    &ldquo;Every recipe we make carries the warmth of three generations of Telangana women who believed food is love.&rdquo;
                  </p>
                </div>
                <div className="space-y-4 text-brown-light/70 font-sans leading-relaxed">
                  <p>Snakzee was born from a simple longing — the taste of home. Growing up in the heart of Telangana, our founder watched her grandmother prepare sweets under the warm sun, grind podis on a stone mortar, and fry murukulu to golden perfection for every festival.</p>
                  <p>When she moved to the city, that taste was impossible to find. Store-bought pickles lacked soul. Packaged snacks had preservatives. The authentic flavours of Telangana were fading.</p>
                  <p>So she went back to her roots — literally. Dusting off her grandmother&apos;s handwritten recipe book, she started making small batches at home. Word spread through WhatsApp. Friends told friends. And before long, Snakzee became Telangana&apos;s most loved homemade snacks brand.</p>
                  <p>Today, every item is still made fresh after you order. No factories. No preservatives. Just honest, traditional Telangana food — delivered with love.</p>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
                {[
                  { src: "/products/Hot_Items/Crispy_Murukulu.jpg", label: "Crispy Murukulu" },
                  { src: "/products/Sweet_Items/Sunnundalu.jpg", label: "Sunnundalu" },
                  { src: "/products/Podis_Powders/Peanut_Spice_Powder.jpg", label: "Palli Karam Podi" },
                  { src: "/products/Vadiyalu_Papads/Flower_Vadiyalu.jpg", label: "Flower Vadiyalu" },
                ].map((img, i) => (
                  <div key={i} className={`rounded-2xl overflow-hidden shadow-lg border border-gold/10 ${i % 2 === 1 ? "mt-6" : ""}`}>
                    <div className="relative h-40 sm:h-48">
                      <Image src={img.src} alt={img.label} fill className="object-cover" sizes="200px" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brown/60 to-transparent p-2">
                        <p className="text-cream text-[10px] font-sans font-semibold uppercase tracking-wider">{img.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 sm:py-20 bg-white border-y border-terracotta/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 mb-4 font-sans">Why Snakzee</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-4">Our Core Values</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((val, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-cream rounded-2xl p-6 border border-terracotta/10 text-center hover:shadow-lg hover:border-terracotta/20 transition-all">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-terracotta/10 text-terracotta rounded-2xl mb-4">{val.icon}</div>
                  <h3 className="font-serif text-xl font-bold text-brown mb-2">{val.title}</h3>
                  <p className="text-brown-light/60 text-sm font-sans leading-relaxed">{val.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 sm:py-20 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 mb-4 font-sans"><ChefHat className="w-3 h-3 mr-1 inline" />Our Process</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-4">How It&apos;s <span className="text-terracotta">Made</span></h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROCESS_STEPS.map((step, i) => (
                <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="bg-white rounded-2xl p-6 border border-terracotta/10 text-center hover:shadow-lg transition-all">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-terracotta to-terracotta-dark text-white flex items-center justify-center text-3xl shadow-lg mx-auto mb-4 relative">
                    {step.icon}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gold text-brown rounded-full flex items-center justify-center text-xs font-bold font-sans shadow-md">{step.step}</div>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-brown mb-2">{step.title}</h3>
                  <p className="text-brown-light/60 text-sm font-sans leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 sm:py-20 bg-white border-y border-terracotta/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans"><Users className="w-3 h-3 mr-1 inline" />The Team</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-4">The People Behind Snakzee</h2>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-6">
              {TEAM.map((member, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-cream rounded-2xl p-6 border border-terracotta/10 text-center hover:shadow-lg hover:border-terracotta/20 transition-all">
                  <div className="text-5xl mb-4">{member.avatar}</div>
                  <h3 className="font-serif text-xl font-bold text-brown mb-1">{member.name}</h3>
                  <p className="text-terracotta text-sm font-sans font-semibold mb-3">{member.role}</p>
                  <p className="text-brown-light/60 text-sm font-sans leading-relaxed">{member.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Loyalty Rewards */}
        <section className="py-16 sm:py-20 bg-cream">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">Snakzee Rewards</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-3">Earn Rewards with Every Order</h2>
              <p className="text-brown-light/60 font-sans">The more you order, the more you save.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { tier: "Bronze", orders: "0-4 orders", discount: "5% OFF", perks: ["5% off all orders"], color: "bg-amber-100 border-amber-200", badge: "text-amber-700" },
                { tier: "Silver", orders: "5-9 orders", discount: "10% OFF", perks: ["10% off all orders", "Free delivery"], color: "bg-slate-100 border-slate-200", badge: "text-slate-600" },
                { tier: "Gold", orders: "10-19 orders", discount: "15% OFF", perks: ["15% off all orders", "Priority delivery", "Free gift wrap"], color: "bg-yellow-50 border-yellow-200", badge: "text-yellow-700" },
                { tier: "Platinum", orders: "20+ orders", discount: "20% OFF", perks: ["20% off all orders", "All Gold perks", "Exclusive products", "First access"], color: "bg-purple-50 border-purple-200", badge: "text-purple-700", popular: true },
              ].map((tier, i) => (
                <motion.div key={tier.tier} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl border-2 p-5 text-center relative ${tier.color} ${(tier as any).popular ? "ring-2 ring-purple-400" : ""}`}>
                  {(tier as any).popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full font-sans">POPULAR</span>}
                  <p className={`font-serif text-xl font-bold mb-1 ${tier.badge}`}>{tier.tier}</p>
                  <p className="text-brown-light/50 text-xs font-sans mb-3">{tier.orders}</p>
                  <p className={`font-serif text-3xl font-bold mb-4 ${tier.badge}`}>{tier.discount}</p>
                  <ul className="space-y-1">{tier.perks.map((p) => <li key={p} className="text-brown-light/70 text-xs font-sans">{p}</li>)}</ul>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <a href="https://wa.me/918897586142?text=I want to join Snakzee Rewards!" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold font-sans transition-all hover:scale-105">
                <MessageCircle className="w-5 h-5" /> Join Rewards on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Festival Calendar */}
        <section className="py-16 sm:py-20 bg-white border-y border-terracotta/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 mb-4 font-sans">🪔 Festival Calendar</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-3">Celebrate Every Festival 🎉</h2>
              <p className="text-brown-light/60 font-sans max-w-xl mx-auto">From Sankranti to Diwali — every Telangana festival deserves authentic homemade flavors.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: "🪁", name: "Sankranti", telugu: "సంక్రాంతి", month: "January", desc: "The harvest festival — a time for Athrasalu, sweets and snacks." },
                { icon: "🥭", name: "Ugadi", telugu: "ఉగాది", month: "March/April", desc: "Telugu New Year! A time for new beginnings and homemade sweets." },
                { icon: "🪔", name: "Bonalu", telugu: "బోనాలు", month: "July/August", desc: "Honoring Goddess Mahankali with special homemade snacks." },
                { icon: "🌸", name: "Bathukamma", telugu: "బతుకమ్మ", month: "September/October", desc: "Telangana's floral festival with folk songs and traditional foods." },
                { icon: "🏹", name: "Dasara", telugu: "దసరా", month: "October", desc: "Families exchange sweets and celebrate with grand feasts." },
                { icon: "🪔", name: "Diwali", telugu: "దీపావళి", month: "October/November", desc: "Perfect time for Snakzee hampers and traditional sweets." },
              ].map((fest, i) => (
                <motion.div key={fest.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-cream rounded-2xl border border-terracotta/10 p-5 hover:shadow-lg hover:border-terracotta/20 transition-all">
                  <div className="text-4xl mb-3">{fest.icon}</div>
                  <h3 className="font-serif text-xl font-bold text-brown">{fest.name}</h3>
                  <p className="text-terracotta text-xs font-sans mb-1">{fest.telugu} • {fest.month}</p>
                  <p className="text-brown-light/60 text-sm font-sans leading-relaxed mb-3">{fest.desc}</p>
                  <Link href="/shop" className="text-terracotta font-sans font-semibold text-sm hover:underline">Shop for {fest.name} →</Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-terracotta to-terracotta-dark">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream mb-4">Taste the Tradition Today</h2>
            <p className="text-cream/70 text-lg font-sans mb-8">Order fresh, authentic Telangana snacks delivered to your doorstep.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-terracotta px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 shadow-xl font-sans">
                <MessageCircle className="w-5 h-5" />Order on WhatsApp
              </a>
              <Link href="/products" className="inline-flex items-center gap-2 border-2 border-white/40 text-cream hover:bg-white/10 px-8 py-4 rounded-full font-bold text-base transition-all font-sans">
                Browse Products
              </Link>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
