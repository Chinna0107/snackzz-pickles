"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Home as HomeIcon, Users, Heart, Award, ChefHat, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PROCESS_STEPS, VIDEO_TESTIMONIALS, REVIEWS } from "@/lib/products";

const VALUES = [
  { icon: <HomeIcon className="w-6 h-6" />, title: "Made at Home", desc: "Every product is handcrafted in small batches using traditional kitchen methods — never in a factory." },
  { icon: <Leaf className="w-6 h-6" />, title: "No Preservatives", desc: "We use only fresh, natural ingredients sourced from local Telangana and Andhra farms. Zero artificial additives." },
  { icon: <Heart className="w-6 h-6" />, title: "Made with Love", desc: "Every recipe carries the warmth of three generations of Telangana and Andhra women who believed food is love." },
  { icon: <Award className="w-6 h-6" />, title: "Authentic Recipes", desc: "Our recipes are passed down through generations — unchanged, uncompromised, and utterly authentic." },
];

const TEAM = [
  { name: "Founder", role: "Recipe Curator & Head Chef", avatar: "👩‍🍳", desc: "Grew up watching her grandmother prepare traditional Telangana and Andhra snacks for every festival." },
  { name: "Quality Team", role: "Freshness Guardians", avatar: "🌿", desc: "Ensures every batch meets our strict no-preservative, fresh-ingredient standards." },
  { name: "Delivery Team", role: "Last-Mile Heroes", avatar: "🚚", desc: "Delivers your orders fresh across Telangana and Andhra within 2-3 days of preparation." },
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
                Snakzee was born from a simple longing — the taste of home. We bring authentic, homemade Telangana and Andhra flavours to families across India.
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
        <section id="our-story" className="py-16 sm:py-24 bg-cream scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">Our Journey</Badge>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-6">
                  A Story Born from <span className="text-terracotta">Nostalgia</span>
                </h2>
                <div className="relative pl-6 border-l-2 border-gold/30 mb-6">
                  <p className="font-serif text-lg text-brown-light/80 italic leading-relaxed">
                    &ldquo;Every recipe we make carries the warmth of three generations of Telangana and Andhra women who believed food is love.&rdquo;
                  </p>
                </div>
                <div className="space-y-4 text-brown-light/70 font-sans leading-relaxed">
                  <p>Snakzee was born from a simple longing — the taste of home. Growing up in the heart of Telangana and Andhra, our founder watched her grandmother prepare sweets under the warm sun, grind podis on a stone mortar, and fry murukulu to golden perfection for every festival.</p>
                  <p>When she moved to the city, that taste was impossible to find. Store-bought pickles lacked soul. Packaged snacks had preservatives. The authentic flavours of Telangana and Andhra were fading.</p>
                  <p>So she went back to her roots — literally. Dusting off her grandmother&apos;s handwritten recipe book, she started making small batches at home. Word spread through WhatsApp. Friends told friends. And before long, Snakzee became Telangana&apos;s most loved homemade snacks brand.</p>
                  <p>Today, every item is still made fresh after you order. No factories. No preservatives. Just honest, traditional Telangana and Andhra food — delivered with love.</p>
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
        <section id="values" className="py-16 sm:py-20 bg-white border-y border-terracotta/10 scroll-mt-20">
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

        {/* Why Snakzee is Different Section */}
        <section id="why-different" className="py-16 sm:py-20 bg-cream border-b border-terracotta/10 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">The Comparison</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-4">Why Snakzee is Different</h2>
              <p className="text-brown-light/60 font-sans max-w-lg mx-auto">See how our heirloom small-batch method stands up against conventional snacks.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "100% Homemade",
                  snakzee: "Handcrafted in small batches in domestic kitchens by local home chefs.",
                  commercial: "Mass-manufactured on high-heat automated factory conveyors.",
                  badge: "🏡 Domestic vs Factory"
                },
                {
                  title: "Fresh Farm Ingredients",
                  snakzee: "Directly sourced from partner farms in Jagtial and Warangal.",
                  commercial: "Sourced from old wholesale storage stocks and synthetic substitutes.",
                  badge: "🌱 Pure vs Processed"
                },
                {
                  title: "Made to Order Fresh",
                  snakzee: "Prepared only after you click order, cooled and dispatched in 24 hours.",
                  commercial: "Sitting in distributor warehouses and retail shelves for 6-9 months.",
                  badge: "📦 Hot vs Stale"
                },
                {
                  title: "Heirloom Stone Mortar",
                  snakzee: "Ground slowly on traditional stone grinders to preserve natural essential oils.",
                  commercial: "Pulverized in high-heat steel crushers that oxidize nutrients.",
                  badge: "🏺 Hand vs Machine"
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white rounded-2xl border border-terracotta/10 p-6 flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div>
                    <span className="text-[10px] font-sans font-bold text-terracotta tracking-wider uppercase bg-terracotta/5 px-2.5 py-1 rounded-full">{item.badge}</span>
                    <h3 className="font-serif text-lg font-bold text-brown mt-3 mb-4 border-b border-terracotta/5 pb-2">{item.title}</h3>
                    
                    <div className="space-y-3 font-sans text-xs">
                      <div className="bg-green-50/50 border border-green-200/50 p-2.5 rounded-xl">
                        <span className="font-bold text-green-700 block mb-0.5">Snakzee way:</span>
                        <p className="text-green-600/90 leading-normal">{item.snakzee}</p>
                      </div>
                      <div className="bg-red-50/50 border border-red-150/40 p-2.5 rounded-xl">
                        <span className="font-bold text-red-600 block mb-0.5">Others:</span>
                        <p className="text-red-500/80 leading-normal">{item.commercial}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="py-16 sm:py-20 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 mb-4 font-sans"><ChefHat className="w-3 h-3 mr-1 inline" />Our Process</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-4">How It&apos;s <span className="text-terracotta">Made</span></h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
              {PROCESS_STEPS.map((step, i) => (
                <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-cream rounded-2xl p-5 border border-terracotta/10 text-center hover:shadow-lg transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-terracotta to-terracotta-dark text-white flex items-center justify-center text-2xl shadow-lg mx-auto mb-4 relative">
                      {step.icon}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-brown rounded-full flex items-center justify-center text-[10px] font-bold font-sans shadow-md">{step.step}</div>
                    </div>
                    <h3 className="font-serif text-base font-bold text-brown mb-1.5 leading-tight">{step.title.split(" (")[0]}</h3>
                    <p className="text-brown-light/60 text-xs font-sans leading-normal">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/how-its-made" className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white font-sans font-bold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-md text-sm">
                Explore Full Interactive Process <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="py-16 sm:py-20 bg-cream border-y border-terracotta/10 scroll-mt-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans"><Users className="w-3 h-3 mr-1 inline" />The Team</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-4">The People Behind Snakzee</h2>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-6">
              {TEAM.map((member, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 border border-terracotta/10 text-center hover:shadow-lg hover:border-terracotta/20 transition-all">
                  <div className="text-5xl mb-4">{member.avatar}</div>
                  <h3 className="font-serif text-xl font-bold text-brown mb-1">{member.name}</h3>
                  <p className="text-terracotta text-sm font-sans font-semibold mb-3">{member.role}</p>
                  <p className="text-brown-light/60 text-sm font-sans leading-relaxed">{member.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Love / Testimonials Section */}
        <section id="testimonials" className="py-16 sm:py-20 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 mb-4 font-sans">♡ Customer Love</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown">What Our Family Says</h2>
              <p className="text-brown-light/60 font-sans max-w-md mx-auto mt-2">True stories of nostalgic delight from households across India.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {REVIEWS.map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-cream rounded-2xl border border-terracotta/10 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Stars */}
                    <div className="flex gap-0.5 text-gold text-sm mb-3">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </div>
                    <p className="font-sans text-sm text-brown-light/80 leading-relaxed italic mb-4">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 border-t border-terracotta/5 pt-3 mt-4">
                    <div className="w-10 h-10 bg-terracotta text-white rounded-full flex items-center justify-center font-bold font-sans text-sm shadow">
                      {review.avatar}
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-sm text-brown">{review.name}</h4>
                      <p className="text-[10px] text-brown-light/50 font-sans">{review.location} • Loved {review.product}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Video Testimonials quotes formatted beautifully */}
            <div className="bg-cream rounded-3xl p-6 sm:p-10 border border-terracotta/10">
              <h3 className="font-serif text-xl font-bold text-brown text-center mb-6">Nostalgia Shared from Heart to Heart</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {VIDEO_TESTIMONIALS.map((t, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-terracotta/5">
                    <p className="font-sans text-xs text-brown-light/70 italic leading-relaxed mb-3">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-between border-t border-terracotta/5 pt-2 mt-2">
                      <span className="font-sans font-bold text-xs text-brown">{t.name} ({t.location})</span>
                      <span className="text-[9px] font-sans font-semibold text-terracotta uppercase tracking-wider bg-terracotta/10 px-2 py-0.5 rounded-full">{t.product}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
