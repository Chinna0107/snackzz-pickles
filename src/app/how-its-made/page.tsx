"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { PROCESS_STEPS } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Leaf, Shield, ChefHat, Sparkles, Sun, CheckCircle, Truck } from "lucide-react";
import Link from "next/link";

// Custom icons mapping for premium illustration
const STEP_ICONS = [
  <Leaf className="w-8 h-8" key="sourcing" />,
  <ChefHat className="w-8 h-8" key="preparation" />,
  <Sparkles className="w-8 h-8" key="cooking" />,
  <Sun className="w-8 h-8" key="sundrying" />,
  <Shield className="w-8 h-8" key="packing" />,
  <Truck className="w-8 h-8" key="delivery" />
];

const STEP_IDS = [
  "sourcing",
  "preparation",
  "cooking",
  "sun-drying",
  "packing-hygiene",
  "delivery-process"
];

// Rich specific details for each step to blow the user away
const STEP_DETAILS = [
  {
    subtitle: "From Telangana and Andhra Farms",
    highlights: ["Sourced from Jagtial & Warangal local farmers", "100% natural, pesticide-free fresh chilies", "Strict selection of premium oilseeds"],
    story: "We believe great food starts with authentic ingredients. Our team works directly with traditional farmers across Telangana and Andhra, sourcing premium wood-dried Guntur red chilies, freshly harvested peanuts, organic jaggery, and unrefined grains. No cold storages, no mass wholesale markets — only pure, raw goodness from soil to stove."
  },
  {
    subtitle: "Stone Grinding & Hand Rolling",
    highlights: ["Traditional granite mortars for grinding", "Heirloom family rolling pins", "Slow-grinding to lock in natural essential oils"],
    story: "Modern mixer-grinders generate high heat that burns away vital nutrients and aromatic essential oils. At Snakzee, we return to the basics. Our podis and powders are ground patiently on heavy stone mortars. Every single piece of muruku is hand-shaped, and every sweet laddu is meticulously rolled by hand by skilled local home-chefs."
  },
  {
    subtitle: "Small Batches & Cold Pressed Oils",
    highlights: ["Slow-cooked on controlled open flames", "Wood-pressed (Chekku) groundnut & sesame oils", "Zero recycled oil — fresh batch for every fry"],
    story: "We refuse to cook in massive, automated factory kettles. Everything is slow-cooked in small, artisanal batches to ensure perfect heat distribution and individual quality control. We exclusively use traditional wood-pressed (cold-pressed) groundnut and sesame oils that retain their natural vitamins, rich flavor, and absolute purity."
  },
  {
    subtitle: "The Sun-Drying Vadiyalu Process",
    highlights: ["100% natural solar heat dehydration", "Strict dust-protected solar terraces", "Traditional cotton-cloth peeling technique"],
    story: "The authentic crunch of a vadiyam cannot be recreated in a commercial dehydrator machine. Our vadiyalu and papads are laid out on clean cotton sheets on raised solar terraces under the intense Telangana and Andhra sun. This gradual, natural heat-locking process ensures they bloom into light, crispy perfection when fried."
  },
  {
    subtitle: "Uncompromised Hygiene Standards",
    highlights: ["Double-sanitized packing workspace", "Food-grade, thick airtight standing pouches", "Individually sealed with batch freshness stamps"],
    story: "Homemade does not mean compromising on professional hygiene. Our cooking and packing chambers are strictly sanitized multiple times a day. Our packaging materials are selected specifically to preserve the crispness and authentic aroma for weeks, strictly without using any artificial chemical preservatives or moisture absorbers."
  },
  {
    subtitle: "Made to Order & Dispatched in 24 Hours",
    highlights: ["Zero inventory stocking — baked after order", "Dispatched within 24 hours of cooling", "Safe transit packaging to prevent breakage"],
    story: "We do not keep shelves of pre-packed snacks waiting for buyers. When you click order, we begin preparing your batch fresh. Once cooled, it is immediately packaged and dispatched. We deliver your orders fresh across Telangana, Andhra Pradesh, and all of India in highly secure protective boxes."
  }
];

export default function HowItsMadePage() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const index = STEP_IDS.indexOf(hash);
        if (index !== -1) {
          setActiveStep(index);
          document.getElementById("interactive-section")?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, []);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `#${STEP_IDS[index]}`);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="pt-20 sm:pt-24 pb-16">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brown via-brown-light to-terracotta-dark py-20 text-white rounded-b-[2.5rem] shadow-2xl">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54 48c-2 0-3 1-4 2v4c1 1 2 2 4 2s3-1 4-2v-4c-1-1-2-2-4-2zM6 48c-2 0-3 1-4 2v4c1 1 2 2 4 2s3-1 4-2v-4c-1-1-2-2-4-2zM30 20c-2 0-3 1-4 2v4c1 1 2 2 4 2s3-1 4-2v-4c-1-1-2-2-4-2z' fill='%23ffffff' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="bg-white/10 text-cream border-white/20 mb-4 font-sans px-3 py-1">🏺 Crafted with Tradition</Badge>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-cream mb-6 leading-tight">
                Authentic Taste, <span className="text-gold">No Shortcuts</span>
              </h1>
              <p className="text-cream/80 text-lg sm:text-xl max-w-3xl mx-auto font-sans leading-relaxed">
                Take a behind-the-scenes journey into the meticulous 6-stage process behind your favorite Snakzee delicacies. Made fresh, made by hand, made with love.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Process Steps Timeline Navigation */}
        <section id="interactive-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-2">Our Interactive Process</h2>
            <p className="text-brown-light/60 font-sans">Click on any step below to explore the detailed tradition and story of how it is crafted.</p>
          </div>

          {/* Steps Timeline Horizontal Picker */}
          <div className="relative mb-12">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-terracotta/10 -translate-y-1/2 hidden lg:block z-0" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
              {PROCESS_STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={step.step}
                    onClick={() => handleStepClick(idx)}
                    className={`flex flex-col items-center p-5 rounded-2xl border transition-all duration-300 ${
                      isActive
                        ? "bg-white border-terracotta shadow-xl scale-105"
                        : "bg-white/60 border-terracotta/10 hover:border-terracotta/30 hover:bg-white/80"
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                      isActive 
                        ? "bg-gradient-to-br from-terracotta to-terracotta-dark text-white" 
                        : "bg-cream text-brown-light"
                    }`}>
                      {STEP_ICONS[idx]}
                    </div>
                    <span className="text-xs font-bold text-terracotta font-sans tracking-wider uppercase mt-4">Step 0{step.step}</span>
                    <span className={`text-sm font-serif font-bold text-center mt-1 line-clamp-1 ${isActive ? "text-brown" : "text-brown-light/60"}`}>
                      {step.title.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Step Display Panel */}
          <div className="bg-white rounded-3xl border border-terracotta/10 shadow-2xl overflow-hidden p-6 sm:p-10 lg:p-12 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                
                {/* Content Area */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 font-sans px-3 py-1 font-bold text-xs uppercase tracking-wider">
                      Stage 0{activeStep + 1}
                    </Badge>
                    <span className="text-brown-light/40 text-sm font-sans">•</span>
                    <span className="text-gold font-sans font-semibold text-sm">{STEP_DETAILS[activeStep].subtitle}</span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-brown leading-tight">
                    {PROCESS_STEPS[activeStep].title}
                  </h3>

                  <p className="text-brown-light/80 font-sans text-base leading-relaxed">
                    {STEP_DETAILS[activeStep].story}
                  </p>

                  <div className="h-px bg-terracotta/10" />

                  {/* Highlights Bullet List */}
                  <div>
                    <h4 className="font-serif text-lg font-bold text-brown mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-gold" /> Key Highlights
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {STEP_DETAILS[activeStep].highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm font-sans text-brown-light/70">
                          <div className="w-1.5 h-1.5 rounded-full bg-terracotta mt-1.5 flex-shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Navigating Buttons */}
                  <div className="flex items-center gap-4 pt-4">
                    <button
                      onClick={() => handleStepClick((activeStep - 1 + 6) % 6)}
                      className="px-5 py-2.5 rounded-full border border-terracotta/20 hover:border-terracotta text-brown font-sans font-semibold text-sm transition-all"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => handleStepClick((activeStep + 1) % 6)}
                      className="px-6 py-2.5 rounded-full bg-terracotta hover:bg-terracotta-dark text-white font-sans font-semibold text-sm transition-all shadow-md flex items-center gap-1.5"
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Aesthetic Visual Illustration Frame */}
                <div className="lg:col-span-5 relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-cream-dark to-white border border-terracotta/10 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-3xl bg-terracotta/5 border border-terracotta/15 text-terracotta flex items-center justify-center shadow-lg text-5xl mb-6 transform hover:rotate-12 transition-transform duration-300">
                      {PROCESS_STEPS[activeStep].icon}
                    </div>
                    <h4 className="font-serif text-xl font-bold text-brown mb-2">{PROCESS_STEPS[activeStep].title.split(" (")[0]}</h4>
                    <p className="text-brown-light/50 text-xs font-sans max-w-xs">{PROCESS_STEPS[activeStep].description}</p>
                    <div className="absolute top-4 right-4 text-7xl font-sans font-extrabold text-black/[0.03] select-none">
                      0{activeStep + 1}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Brand Promise Section */}
        <section className="bg-white border-y border-terracotta/10 py-16 sm:py-20 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <Badge className="bg-gold/10 text-gold border-gold/20 font-sans mb-3 px-3 py-1">🏆 Quality Promise</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown">The Snakzee Difference</h2>
              <p className="text-brown-light/60 font-sans mt-2 max-w-xl mx-auto">Why thousands of families trust us with their snack time.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "No Industrial Machinery", desc: "No mass automation, no conveyor belts. Every item is cooked carefully by hand in heavy brass & iron kadhais to capture traditional depth of flavor.", icon: "🧑‍🍳" },
                { title: "100% Zero Preservatives", desc: "We use strictly traditional preservative methods (like sun drying and natural oil seal) without chemical stabilizers, artificial food colorings, or MSG.", icon: "🌿" },
                { title: "Direct Farm Support", desc: "By purchasing directly from rural Telangana and Andhra farming families, we ensure maximum freshness for you and fair compensation for our hard-working growers.", icon: "🏡" }
              ].map((item, i) => (
                <div key={i} className="bg-cream rounded-2xl border border-terracotta/10 p-6 sm:p-8 hover:shadow-lg transition-all text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-serif text-xl font-bold text-brown mb-3">{item.title}</h3>
                  <p className="text-brown-light/60 text-sm leading-relaxed font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center mt-16">
          <div className="bg-gradient-to-br from-terracotta to-terracotta-dark rounded-3xl p-10 sm:p-12 shadow-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream mb-4">Ready to Taste the Freshness?</h2>
              <p className="text-cream/80 font-sans max-w-lg mx-auto mb-8">
                Now that you know how much care and tradition goes into our products, order a fresh batch today and feel the difference yourself.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/shop" className="bg-white hover:bg-cream text-terracotta font-sans font-bold px-8 py-3.5 rounded-full transition-all shadow-lg hover:scale-105">
                  Browse Products
                </Link>
                <a href="https://wa.me/919505550051?text=Hi! I want to order some fresh homemade snacks from Snakzee!" target="_blank" rel="noopener noreferrer" className="border-2 border-white/40 hover:bg-white/10 text-white font-sans font-bold px-8 py-3.5 rounded-full transition-all hover:scale-105">
                  WhatsApp Support
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
