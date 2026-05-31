"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Timer, ArrowRight, PlayCircle, ChevronDown, ChevronUp, MessageCircle, Leaf, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BulkOrderSection from "@/components/BulkOrderSection";
import { products, getWhatsAppLink } from "@/lib/products";

const recipes = [
  {
    title: "Palli Karam Rice",
    description: "Hot steaming rice mixed with Palli Karam Podi and ghee — the ultimate Telangana and Andhra comfort meal",
    time: "10 min",
    servings: "2 servings",
    difficulty: "Easy",
    tag: "పల్లి కారం పొడి",
    image: "/products/Podis_Powders/Peanut_Spice_Powder.jpg",
    ingredients: "Palli Karam Podi",
    steps: [
      "Cook 1 cup of rice and let it cool slightly so grains stay separate.",
      "Add 2-3 tbsp Snakzee Palli Karam Podi directly onto the hot rice.",
      "Add 1 tbsp of ghee and mix gently until evenly coated.",
      "Garnish with roasted peanuts and curry leaves. Serve hot!"
    ]
  },
  {
    title: "Spicy Podi Dosa",
    description: "Crispy dosa sprinkled generously with Idli Podi and ghee — a South Indian breakfast dream",
    time: "15 min",
    servings: "2 servings",
    difficulty: "Easy",
    tag: "ఇడ్లీ పొడి",
    image: "/products/Podis_Powders/Idli_Podi.jpg",
    ingredients: "Idli Podi",
    steps: [
      "Prepare your dosa batter and heat a tawa (griddle).",
      "Pour a ladle of batter and spread it thinly.",
      "Drizzle ghee around the edges and sprinkle 1-2 tbsp of Snakzee Idli Podi all over the dosa.",
      "Cook until crispy and golden brown. Fold and serve hot!"
    ]
  },
  {
    title: "Instant Pulihora",
    description: "Tangy tamarind rice made instantly with our Pulihora Paste — perfect for festivals and lunchboxes",
    time: "15 min",
    servings: "4 servings",
    difficulty: "Easy",
    tag: "పులిహోర పేస్ట్",
    image: "/products/Podis_Powders/Pulihora_Paste.jpg",
    ingredients: "Pulihora Paste",
    steps: [
      "Cook 2 cups of rice and spread it on a wide plate to cool.",
      "Add 3-4 tbsp of Snakzee Pulihora Paste to the rice.",
      "Mix thoroughly but gently until the paste coats every grain of rice.",
      "Serve with papad or vadiyalu for a complete meal!"
    ]
  },
  {
    title: "Traditional Sambar",
    description: "Rich, aromatic sambar made with our stone-ground Sambar Podi — perfect with rice, idli or dosa",
    time: "30 min",
    servings: "4 servings",
    difficulty: "Medium",
    tag: "సాంబార్ పొడి",
    image: "/products/Podis_Powders/Sambar_Powder.jpg",
    ingredients: "Sambar Podi",
    steps: [
      "Boil 1 cup of toor dal until soft and mash it.",
      "Cook your choice of vegetables in tamarind water with turmeric and salt.",
      "Add the mashed dal and 2 tbsp of Snakzee Sambar Podi to the boiling vegetables.",
      "Temper with mustard seeds, curry leaves, and red chilies in ghee. Pour over sambar and simmer."
    ]
  }
];

function RecipeCard({ recipe }: { recipe: typeof recipes[0] }) {
  const [showSteps, setShowSteps] = useState(false);

  // For WhatsApp order
  const waLink = getWhatsAppLink(`Hi Snakzee, I would like to order ${recipe.ingredients} for making ${recipe.title}.`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-terracotta/10 flex flex-col sm:flex-row gap-6 hover:shadow-[0_20px_40px_rgb(200,64,26,0.08)] transition-all duration-300 group"
    >
      <div className="relative w-full sm:w-48 aspect-square rounded-2xl overflow-hidden bg-cream-dark flex-shrink-0 self-start">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-terracotta shadow-sm backdrop-blur-sm border-none font-sans font-semibold text-xs px-2.5 py-0.5">
            {recipe.tag}
          </Badge>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="font-serif text-2xl font-bold text-brown mb-3 group-hover:text-terracotta transition-colors">
          {recipe.title}
        </h3>
        <p className="text-brown-light/80 text-sm mb-5 font-sans leading-relaxed">
          {recipe.description}
        </p>
        
        <div className="flex items-center gap-4 text-xs font-semibold text-brown-light mb-6 font-sans bg-cream-dark/50 px-4 py-2.5 rounded-xl w-fit flex-wrap">
          <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-terracotta" /> {recipe.time}</div>
          <div className="w-1 h-1 rounded-full bg-terracotta/30" />
          <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-terracotta" /> {recipe.servings}</div>
          <div className="w-1 h-1 rounded-full bg-terracotta/30" />
          <div className="flex items-center gap-1.5"><Timer className="w-3.5 h-3.5 text-terracotta" /> {recipe.difficulty}</div>
        </div>

        {/* Steps Toggle */}
        <AnimatePresence>
          {showSteps && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="space-y-4 pt-2">
                {recipe.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center text-xs font-bold font-sans">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-brown-light/80 font-sans leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-auto pt-2">
          <button 
            onClick={() => setShowSteps(!showSteps)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-terracotta text-terracotta px-5 py-2.5 rounded-full text-sm font-semibold font-sans hover:bg-terracotta/5 transition-colors wa-ripple"
          >
            {showSteps ? "Hide Steps" : "View Recipe"}
            {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <a 
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none text-center bg-cream-dark text-brown px-5 py-2.5 rounded-full text-sm font-semibold font-sans hover:bg-gold/20 hover:text-terracotta transition-colors flex items-center justify-center gap-2"
          >
            Order Ingredients <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// Health benefits data for each ingredient
const ingredientHealthBenefits: Record<string, string> = {
  "Peanuts": "Capsaicin boosts metabolism, vitamin C, pain relief",
  "Ghee": "Rich in vitamins A, D, E, K. Supports digestion and immunity",
  "Jaggery": "Natural detoxifier, rich in iron and minerals, aids digestion",
  "Red Chili": "Capsaicin boosts metabolism, rich in vitamin C and A, pain relief",
  "Sesame Seeds": "High in protein, calcium, and fiber. Supports bone health",
  "Rice Flour": "Gluten-free, easy to digest, provides energy",
  "Urad Dal": "High protein, rich in iron and folate, supports muscle health",
  "Curry Leaves": "Rich in antioxidants, aids digestion, controls diabetes",
  "Cashew": "Heart-healthy fats, magnesium, supports brain function",
  "Millets": "Gluten-free, high fiber, controls blood sugar, rich in minerals",
  "Tamarind": "Rich in antioxidants, aids digestion, anti-inflammatory",
  "Cold-Pressed Oil": "Heart-healthy, retains nutrients, natural antioxidants",
};

function IngredientCard({ ingredient, index }: { ingredient: { icon: string; name: string; telugu: string; desc: string }; index: number }) {
  const [showBenefits, setShowBenefits] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-terracotta/10 p-5 hover:shadow-lg hover:border-terracotta/20 transition-all group"
    >
      <div className="text-4xl mb-3">{ingredient.icon}</div>
      <h3 className="font-serif text-lg font-bold text-brown">{ingredient.name}</h3>
      <p className="text-terracotta text-xs font-sans mb-2">{ingredient.telugu}</p>
      <p className="text-brown-light/70 text-sm font-sans leading-relaxed mb-4">{ingredient.desc}</p>
      
      <AnimatePresence>
        {showBenefits && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-2 bg-gold/10 rounded-lg p-3 mb-3">
              <Sparkles className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <p className="text-sm text-brown font-sans leading-relaxed">
                {ingredientHealthBenefits[ingredient.name]}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={() => setShowBenefits(!showBenefits)}
        className="inline-flex items-center gap-1 text-terracotta font-sans font-semibold text-sm hover:text-terracotta-dark transition-colors"
      >
        {showBenefits ? (
          <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
        ) : (
          <>Health benefits <ArrowRight className="w-3.5 h-3.5" /></>
        )}
      </button>
    </motion.div>
  );
}

export default function CookWithSnakzee() {
  return (
    <div className="min-h-screen bg-cream selection:bg-terracotta/20 font-sans flex flex-col">
      <Header />
      
      <main className="flex-1 pb-12">
        {/* Page Header */}
        <section className="px-4 sm:px-6 lg:px-8 pt-12 mb-16 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 mb-4 font-sans px-4 py-1.5 text-sm">
              <PlayCircle className="w-4 h-4 mr-2" />
              Recipes & Bulk Orders
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brown mb-6 leading-tight">
              Cook with <span className="text-terracotta">Snakzee</span>
            </h1>
            <p className="text-brown-light/80 text-lg sm:text-xl font-sans max-w-2xl mx-auto">
              Quick, delicious recipes using our products — from easy breakfasts to festive feasts
            </p>
          </motion.div>
        </section>

        {/* Recipes Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.title} recipe={recipe} />
            ))}
          </div>
        </section>

        {/* Bulk Order Section imported from page.tsx */}
        <BulkOrderSection products={products} />

        {/* Our Ingredients Section */}
        <section className="py-16 sm:py-20 bg-cream border-t border-terracotta/10 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 mb-4 font-sans">Our Ingredients</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-3">Pure & Authentic Ingredients</h2>
              <p className="text-brown-light/60 font-sans max-w-xl mx-auto">We source only the finest ingredients from Telangana and Andhra farms and traditional suppliers.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "🥜", name: "Peanuts", telugu: "పల్లీలు", desc: "Roasted peanuts — the heart of our podis and laddus, adding protein and crunch" },
                { icon: "🧈", name: "Ghee", telugu: "నెయ్యి", desc: "Clarified butter made from cow's milk — used in sweets and tempering" },
                { icon: "🟤", name: "Jaggery", telugu: "బెల్లం", desc: "Unrefined cane sugar — the traditional sweetener in all our Telangana and Andhra sweets" },
                { icon: "🌶️", name: "Red Chili", telugu: "ఎర్రమిర్చి", desc: "Sun-dried Guntur chilies — the fire behind every spicy podi and snack" },
                { icon: "⚪", name: "Sesame Seeds", telugu: "నువ్వులు", desc: "Nutty seeds used in snacks and chutneys — a protein and calcium powerhouse" },
                { icon: "🍚", name: "Rice Flour", telugu: "బియ్యం పిండి", desc: "Fine ground rice used in murukulu, nippatlu and other crispy snacks" },
                { icon: "⚫", name: "Urad Dal", telugu: "మినప పప్పు", desc: "Black gram lentil — key ingredient in vadiyalu and snack doughs" },
                { icon: "🍃", name: "Curry Leaves", telugu: "కరివేపాకు", desc: "Aromatic leaves for tempering — adds authentic South Indian flavour" },
                { icon: "🌰", name: "Cashew", telugu: "జీడిపప్పు", desc: "Premium cashew nuts — used in Kaju Katli, laddus and as garnish" },
                { icon: "🌾", name: "Millets", telugu: "చిరుధాన్యాలు", desc: "Ancient grains like ragi, jowar and foxtail — the base of our healthy range" },
                { icon: "🫘", name: "Tamarind", telugu: "చింతపండు", desc: "Sour fruit pulp essential in pulihora paste and South Indian cooking" },
                { icon: "🫒", name: "Cold-Pressed Oil", telugu: "నూనె", desc: "Traditional wood-pressed groundnut/sesame oil for authentic flavour" },
              ].map((ingredient, i) => (
                <IngredientCard key={ingredient.name} ingredient={ingredient} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Loyalty Rewards */}
        <section id="rewards" className="py-16 sm:py-20 bg-cream border-t border-terracotta/10 scroll-mt-20">
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
                  className={`rounded-2xl border-2 p-5 text-center relative ${tier.color} ${tier.popular ? "ring-2 ring-purple-400" : ""}`}>
                  {tier.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full font-sans">POPULAR</span>}
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
        <section id="festival-calendar" className="py-16 sm:py-20 bg-white border-y border-terracotta/10 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 mb-4 font-sans">🪔 Festival Calendar</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-3">Celebrate Every Festival 🎉</h2>
              <p className="text-brown-light/60 font-sans max-w-xl mx-auto">From Sankranti to Diwali — every Telangana and Andhra festival deserves authentic homemade flavors.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: "🪁", name: "Sankranti", telugu: "సంక్రాంతి", month: "January", desc: "The harvest festival — a time for Athrasalu, sweets and snacks." },
                { icon: "🥭", name: "Ugadi", telugu: "ఉగాది", month: "March/April", desc: "Telugu New Year! A time for new beginnings and homemade sweets." },
                { icon: "🪔", name: "Bonalu", telugu: "బోనాలు", month: "July/August", desc: "Honoring Goddess Mahankali with special homemade snacks." },
                { icon: "🌸", name: "Bathukamma", telugu: "బతుకమ్మ", month: "September/October", desc: "Telangana's and Andhra's floral festival with folk songs and traditional foods." },
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
            <p className="text-cream/70 text-lg font-sans mb-8">Order fresh, authentic Telangana and Andhra snacks delivered to your doorstep.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-terracotta px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 shadow-xl font-sans">
                <MessageCircle className="w-5 h-5" />Order on WhatsApp
              </a>
              <Link href="/shop" className="inline-flex items-center gap-2 border-2 border-white/40 text-cream hover:bg-white/10 px-8 py-4 rounded-full font-bold text-base transition-all font-sans">
                Browse Products
              </Link>
            </div>
          </div>
        </section>
              </main>
        {/* New Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-cream">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brown mb-6 text-center">Cooking Tips & Tricks</h2>
          <p className="text-brown-light/80 text-lg leading-relaxed max-w-3xl mx-auto text-center">
            Explore our curated cooking tips, ingredient hacks, and seasonal recipes to elevate your Snakzee experience. From perfecting the art of tempering to creative serving ideas, we’ve got you covered.
          </p>
        </section>

      <Footer />
    </div>
  );
}
