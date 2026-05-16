"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Timer, ArrowRight, PlayCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BulkOrderSection from "@/components/BulkOrderSection";
import { products, getWhatsAppLink } from "@/lib/products";

const recipes = [
  {
    title: "Palli Karam Rice",
    description: "Hot steaming rice mixed with Palli Karam Podi and ghee — the ultimate Telangana comfort meal",
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

export default function CookWithSnakzee() {
  return (
    <div className="min-h-screen bg-cream selection:bg-terracotta/20 font-sans flex flex-col">
      <Header />
      
      <main className="flex-1 pb-12">
        {/* Page Header */}
        <section className="px-4 sm:px-6 lg:px-8 mb-16 text-center max-w-4xl mx-auto">
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
      </main>

      <Footer />
    </div>
  );
}
