export type Category = "hot-items" | "sweet-items" | "podis-and-powders" | "pickles" | "fryums";
export type SpiceLevel = "none" | "mild" | "medium" | "hot" | "extra-hot";

export interface NutritionInfo {
  calories: string;  // e.g. "150 kcal"
  protein: string;   // e.g. "4g"
  carbs: string;     // e.g. "20g"
  fat: string;       // e.g. "8g"
  fiber: string;     // e.g. "2g"
}

export interface Product {
  id: string;
  name: string;          // Telugu name (primary)
  nameEnglish: string;   // English name (secondary, shown in brackets)
  category: Category;
  description: string;
  price: number;
  mrp?: number | null;   // Maximum Retail Price (optional)
  priceUnit: string;
  image: string;
  badge?: string;
  popular?: boolean;
  spiceLevel: SpiceLevel;
  shelfLife: string;
  serves: string;
  ingredients: string[];
  nutrition: NutritionInfo;
  tags: string[];
  couponApplicable?: boolean;
}

export const GRAM_OPTIONS = ["250g", "500g", "1kg"] as const;
export type GramOption = (typeof GRAM_OPTIONS)[number];

export function normalizeGramUnit(unit?: string): GramOption {
  const clean = (unit || "").toLowerCase().replace(/\s+/g, "");
  if (clean === "250g") return "250g";
  if (clean === "1kg" || clean === "1000g") return "1kg";
  return "500g";
}

export function gramsFromUnit(unit?: string): number {
  const clean = normalizeGramUnit(unit);
  if (clean === "250g") return 250;
  if (clean === "1kg") return 1000;
  return 500;
}

export function priceForGramOption(product: Product, option: GramOption): number {
  const baseGrams = gramsFromUnit(product.priceUnit);
  const selectedGrams = gramsFromUnit(option);
  return Math.round((product.price / baseGrams) * selectedGrams);
}

export function productForGramOption(product: Product, option: GramOption): Product {
  return {
    ...product,
    price: priceForGramOption(product, option),
    priceUnit: option,
  };
}

export interface CategoryInfo {
  id: Category;
  name: string;
  nameTelugu: string;
  icon: string;
  image: string;
  count: number;
  color: string;
}

export interface GiftWrapOption {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface RecipeSuggestion {
  id: string;
  name: string;
  description: string;
  cookTime: string;
  servings: string;
  difficulty: "Easy" | "Medium" | "Hard";
  products: string[];  // product IDs used
  steps: string[];
}

export interface Festival {
  name: string;
  nameTelugu: string;
  date: string;    // month description like "January"
  description: string;
  recommendedProducts: string[];  // product IDs
  emoji: string;
}

export interface VideoTestimonial {
  name: string;
  location: string;
  product: string;
  quote: string;
  avatar: string;
}

export const SPICE_LABELS: Record<SpiceLevel, { label: string; color: string; emoji: string }> = {
  none: { label: "No Spice", color: "bg-green-100 text-green-700", emoji: "😊" },
  mild: { label: "Mild", color: "bg-yellow-100 text-yellow-700", emoji: "🌶️" },
  medium: { label: "Medium", color: "bg-orange-100 text-orange-700", emoji: "🌶️🌶️" },
  hot: { label: "Hot", color: "bg-red-100 text-red-700", emoji: "🌶️🌶️🌶️" },
  "extra-hot": { label: "Extra Hot", color: "bg-red-200 text-red-900", emoji: "🌶️🌶️🌶️🌶️" },
};

export const categories: CategoryInfo[] = [
  {
    id: "hot-items",
    name: "Snacks",
    nameTelugu: "హాట్ మిక్స్",
    icon: "🍿",
    image: "/products/Hot_Items/Crispy_Murukulu.jpg",
    count: 12,
    color: "bg-terracotta/10 text-terracotta",
  },
  {
    id: "sweet-items",
    name: "Sweets",
    nameTelugu: "స్వీట్ మిక్స్",
    icon: "🍬",
    image: "/products/Sweet_Items/Besan_Laddu.jpg",
    count: 11,
    color: "bg-gold/10 text-gold",
  },
  {
    id: "podis-and-powders",
    name: "Masalas & Powders",
    nameTelugu: "మసాలాలు & పొడులు",
    icon: "🌶️",
    image: "/products/Podis_Powders/Idli_Podi.jpg",
    count: 10,
    color: "bg-terracotta-light/10 text-terracotta-light",
  },
  {
    id: "pickles",
    name: "Pickles",
    nameTelugu: "పచ్చళ్ళు",
    icon: "🫙",
    image: "/products/Pickles/Pickles.jpg",
    count: 1,
    color: "bg-orange-100/60 text-orange-700",
  },
  {
    id: "fryums",
    name: "Fryums and Papads",
    nameTelugu: "ఫ్రైయమ్స్",
    icon: "🍘",
    image: "/products/Fryums/Fryums.jpg",
    count: 1,
    color: "bg-amber-100/60 text-amber-700",
  },

];

export const products: Product[] = [
  // ─── SNACKS (హాట్ మిక్స్) ─────────────────────────────────
  {
    id: "murukulu",
    name: "మురుకులు",
    nameEnglish: "Crispy Murukulu",
    category: "hot-items",

    description: "Crunchy twisted rice flour snack, deep-fried to golden perfection — a Telangana tea-time essential",
    price: 250,
    priceUnit: "500g",
    image: "/products/Hot_Items/Crispy_Murukulu.jpg",
    popular: true,
    spiceLevel: "medium",
    shelfLife: "30 days",
    serves: "4-5 people",
    ingredients: ["Rice flour", "Urad dal flour", "Sesame seeds", "Cumin", "Red chili powder", "Butter"],
    nutrition: { calories: "180 kcal", protein: "5g", carbs: "22g", fat: "9g", fiber: "1g" },
    tags: ["vegetarian", "gluten-free", "spicy", "daily-essential"],
  },
  {
    id: "nippatlu",
    name: "నిప్పట్లు",
    nameEnglish: "Spicy Nippatlu",
    category: "hot-items",

    description: "Crispy, paper-thin rice discs seasoned with cumin and pepper — a classic Andhra snack for all occasions",
    price: 220,
    priceUnit: "500g",
    image: "/products/Hot_Items/Spicy_Nippatlu.jpg",
    popular: true,
    spiceLevel: "medium",
    shelfLife: "30 days",
    serves: "4-5 people",
    ingredients: ["Rice flour", "Black pepper", "Cumin", "Sesame seeds", "Salt", "Oil"],
    nutrition: { calories: "170 kcal", protein: "3g", carbs: "24g", fat: "7g", fiber: "1g" },
    tags: ["vegetarian", "gluten-free", "spicy", "daily-essential"],
  },
  {
    id: "jantikalu",
    name: "జంతికాలు",
    nameEnglish: "Jantikalu",
    category: "hot-items",

    description: "Crispy string-shaped gram flour snack, spiced with carom seeds and chili — a festival favourite",
    price: 240,
    priceUnit: "500g",
    image: "/products/Hot_Items/Jantikalu.jpg",
    spiceLevel: "medium",
    shelfLife: "25 days",
    serves: "4-5 people",
    ingredients: ["Gram flour", "Rice flour", "Red chili powder", "Ajwain", "Sesame seeds", "Salt"],
    nutrition: { calories: "190 kcal", protein: "7g", carbs: "19g", fat: "10g", fiber: "2g" },
    tags: ["vegetarian", "spicy", "protein-rich", "festive-special"],
  },
  {
    id: "dry-fruits-karam-boondi",
    name: "డ్రై ఫ్రూట్స్ కారం బూందీ",
    nameEnglish: "Dry Fruits Karam Boondi",
    category: "hot-items",

    description: "Spicy gram flour pearls mixed with roasted dry fruits — a premium crunchy treat for snack lovers",
    price: 350,
    priceUnit: "500g",
    image: "/products/Hot_Items/Dry_Fruits_Karam_Boondi.jpg",
    badge: "Premium",
    spiceLevel: "hot",
    shelfLife: "20 days",
    serves: "4-5 people",
    ingredients: ["Gram flour", "Cashew", "Almonds", "Raisins", "Red chili", "Curry leaves", "Oil"],
    nutrition: { calories: "210 kcal", protein: "8g", carbs: "18g", fat: "13g", fiber: "2g" },
    tags: ["vegetarian", "spicy", "protein-rich", "dry-fruits"],
  },
  {
    id: "navadhanyala-mixture",
    name: "నవధాన్యాల మిక్స్చర్",
    nameEnglish: "Navadhanyala Mixture",
    category: "hot-items",

    description: "Nine-grain healthy mixture with spices — a nutritious crunchy snack packed with multigrain goodness",
    price: 280,
    priceUnit: "500g",
    image: "/products/Hot_Items/Navadhanyala_Mixture.jpg",
    badge: "Healthy Choice",
    spiceLevel: "medium",
    shelfLife: "25 days",
    serves: "4-5 people",
    ingredients: ["Nine grains mix", "Peanuts", "Curry leaves", "Green chili", "Mustard seeds", "Salt"],
    nutrition: { calories: "160 kcal", protein: "9g", carbs: "20g", fat: "6g", fiber: "4g" },
    tags: ["vegetarian", "multigrain", "protein-rich", "healthy"],
  },
  {
    id: "corn-flakes-mixture",
    name: "కార్న్ ఫ్లేక్స్ మిక్స్చర్",
    nameEnglish: "Corn Flakes Mixture",
    category: "hot-items",

    description: "Crispy corn flakes tossed with spiced nuts, curry leaves and tangy seasoning — light and irresistible",
    price: 260,
    priceUnit: "500g",
    image: "/products/Hot_Items/Cornflakes_Mixture.jpg",
    spiceLevel: "mild",
    shelfLife: "25 days",
    serves: "4-5 people",
    ingredients: ["Corn flakes", "Peanuts", "Cashew", "Curry leaves", "Red chili", "Turmeric", "Salt"],
    nutrition: { calories: "175 kcal", protein: "5g", carbs: "25g", fat: "7g", fiber: "1g" },
    tags: ["vegetarian", "mild", "daily-essential"],
  },
  {
    id: "millet-mixture",
    name: "మిల్లెట్ మిక్స్చర్",
    nameEnglish: "Millet Mixture",
    category: "hot-items",

    description: "Wholesome millet-based crunchy mixture — a guilt-free snack made with traditional millets and spices",
    price: 300,
    priceUnit: "500g",
    image: "/products/Hot_Items/Millet_Mixture.jpg",
    badge: "Healthy Choice",
    spiceLevel: "mild",
    shelfLife: "25 days",
    serves: "4-5 people",
    ingredients: ["Ragi", "Jowar", "Foxtail millet", "Peanuts", "Curry leaves", "Spices", "Salt"],
    nutrition: { calories: "155 kcal", protein: "7g", carbs: "22g", fat: "5g", fiber: "5g" },
    tags: ["vegetarian", "multigrain", "millet", "healthy", "gluten-free"],
  },
  {
    id: "butter-murukulu",
    name: "బటర్ మురుకులు",
    nameEnglish: "Butter Murukulu",
    category: "hot-items",

    description: "Rich, buttery twist on the classic murukku — melt-in-mouth texture with a hint of butter and spice",
    price: 280,
    priceUnit: "500g",
    image: "/products/Hot_Items/Butter_Murukulu.jpg",
    popular: true,
    spiceLevel: "mild",
    shelfLife: "25 days",
    serves: "4-5 people",
    ingredients: ["Rice flour", "Butter", "Urad dal flour", "Sesame seeds", "Cumin", "Salt"],
    nutrition: { calories: "195 kcal", protein: "4g", carbs: "20g", fat: "12g", fiber: "1g" },
    tags: ["vegetarian", "gluten-free", "mild", "daily-essential"],
  },
  {
    id: "gavvalu",
    name: "గవ్వలు",
    nameEnglish: "Gavvalu",
    category: "hot-items",

    description: "Shell-shaped crispy snack made from rice flour and spices — crunchy, savoury, and addictive",
    price: 230,
    priceUnit: "500g",
    image: "/products/Hot_Items/Gavvalu_Sweet.jpg",
    spiceLevel: "mild",
    shelfLife: "25 days",
    serves: "4-5 people",
    ingredients: ["Rice flour", "Gram flour", "Sesame seeds", "Ajwain", "Red chili", "Salt", "Oil"],
    nutrition: { calories: "185 kcal", protein: "4g", carbs: "22g", fat: "9g", fiber: "1g" },
    tags: ["vegetarian", "gluten-free", "mild", "festive-special"],
  },
  {
    id: "ribbon-murukulu",
    name: "రిబ్బన్ మురుకులు",
    nameEnglish: "Ribbon Murukulu",
    category: "hot-items",

    description: "Flat ribbon-shaped crispy rice snack with beautiful layers — light, crunchy and perfectly seasoned",
    price: 250,
    priceUnit: "500g",
    image: "/products/Hot_Items/Ribbon_Murukulu.jpg",
    spiceLevel: "medium",
    shelfLife: "30 days",
    serves: "4-5 people",
    ingredients: ["Rice flour", "Gram flour", "Sesame seeds", "Red chili powder", "Cumin", "Butter", "Salt"],
    nutrition: { calories: "180 kcal", protein: "5g", carbs: "21g", fat: "9g", fiber: "1g" },
    tags: ["vegetarian", "gluten-free", "spicy", "daily-essential"],
  },
  {
    id: "chakkodilu",
    name: "చక్కోడీలు",
    nameEnglish: "Chakkodilu",
    category: "hot-items",

    description: "Traditional ring-shaped moong dal fritters, crispy outside and flavourful inside — a festive must-have",
    price: 280,
    priceUnit: "500g",
    image: "/products/Hot_Items/Chakodilu.jpg",
    badge: "Festive Special",
    spiceLevel: "mild",
    shelfLife: "15 days",
    serves: "3-4 people",
    ingredients: ["Moong dal", "Rice flour", "Green chili", "Ginger", "Curry leaves", "Salt"],
    nutrition: { calories: "165 kcal", protein: "6g", carbs: "18g", fat: "8g", fiber: "2g" },
    tags: ["vegetarian", "festive-special", "mild", "protein-rich"],
  },
  {
    id: "sannakarapoosa",
    name: "సన్నకరపూస",
    nameEnglish: "Sannakarapoosa",
    category: "hot-items",

    description: "Delicate thin crispy diamond-shaped snack made with fine rice flour — a traditional Telangana delicacy",
    price: 260,
    priceUnit: "500g",
    image: "/products/Hot_Items/Sannakarapoosa.jpg",
    spiceLevel: "mild",
    shelfLife: "25 days",
    serves: "4-5 people",
    ingredients: ["Rice flour", "Sesame seeds", "Cumin", "Black pepper", "Salt", "Oil"],
    nutrition: { calories: "175 kcal", protein: "3g", carbs: "23g", fat: "8g", fiber: "1g" },
    tags: ["vegetarian", "gluten-free", "mild", "daily-essential"],
  },

  // ─── SWEET ITEMS (స్వీట్ మిక్స్) ──────────────────────────────
  // ─── PICKLES (పచ్చళ్ళు) ───────────────────────────────────────
  {
    id: "mango-pickle",
    name: "మామిడి పచ్చళ్ళు",
    nameEnglish: "Mango Pickle",
    category: "pickles",
    description: "Tangy and spicy mango pickle using traditional spices — a perfect accompaniment to rice and meals.",
    price: 300,
    priceUnit: "250g",
    image: "/products/Pickles/Mango_Pickle.jpg",
    spiceLevel: "medium",
    shelfLife: "6 months",
    serves: "30-40 pieces",
    ingredients: ["Mango", "Mustard seeds", "Red chili", "Turmeric", "Salt", "Oil"],
    nutrition: { calories: "40 kcal", protein: "0.5g", carbs: "10g", fat: "0g", fiber: "0g" },
    tags: ["vegetarian", "vegan", "spicy", "condiment"]
  },
  {
    id: "karjikayalu",
    name: "కార్జికాయలు",
    nameEnglish: "Karjikayalu",
    category: "sweet-items",
    description: "Crescent-shaped sweet pastries filled with coconut and jaggery — a beloved Telangana festival sweet",
    price: 350,
    priceUnit: "500g",
    image: "/products/Sweet_Items/Kaajikayalu.jpg",
    popular: true,
    badge: "Heritage Sweet",
    spiceLevel: "none",
    shelfLife: "15 days",
    serves: "8-10 pieces",
    ingredients: ["Maida", "Coconut", "Jaggery", "Cardamom", "Ghee", "Oil"],
    nutrition: { calories: "220 kcal", protein: "3g", carbs: "30g", fat: "10g", fiber: "1g" },
    tags: ["vegetarian", "jaggery-sweetened", "festive-special"],
  },

  {
    id: "pallee-laddu",
    name: "పల్లీ లడ్డు",
    nameEnglish: "Pallee Laddu",
    category: "sweet-items",
    description: "Crunchy peanut laddus bound with jaggery — protein-packed, natural, and utterly delicious",
    price: 300,
    priceUnit: "500g",
    image: "/products/Sweet_Items/Pallee_Laddu.jpg",
    popular: true,
    spiceLevel: "none",
    shelfLife: "20 days",
    serves: "8-10 laddus",
    ingredients: ["Peanuts", "Jaggery", "Cardamom", "Ghee"],
    nutrition: { calories: "210 kcal", protein: "8g", carbs: "22g", fat: "11g", fiber: "2g" },
    tags: ["vegetarian", "jaggery-sweetened", "protein-rich", "daily-essential"],
  },
  {
    id: "athrasalu",
    name: "అత్రసాలు/గసాలు",
    nameEnglish: "Athrasalu / Gasalu",
    category: "sweet-items",
    description: "Traditional jaggery & rice flour sweet, fried to golden discs — a Sankranti icon passed down through generations",
    price: 400,
    priceUnit: "500g",
    image: "/products/Sweet_Items/Athrasalu_Gasalu.jpg",
    popular: true,
    badge: "Heritage Sweet",
    spiceLevel: "none",
    shelfLife: "15 days",
    serves: "6-8 pieces",
    ingredients: ["Rice flour", "Jaggery", "Ghee", "Sesame seeds", "Cardamom", "Oil"],
    nutrition: { calories: "225 kcal", protein: "3g", carbs: "28g", fat: "11g", fiber: "0g" },
    tags: ["vegetarian", "jaggery-sweetened", "ghee-rich", "festive-special"],
  },
  {
    id: "navadhanyala-laddu",
    name: "నవధాన్యాల లడ్డు",
    nameEnglish: "Navadhanyala Laddu",
    category: "sweet-items",
    description: "Nutritious nine-grain laddu sweetened with jaggery — a wholesome treat packed with multigrain power",
    price: 350,
    priceUnit: "500g",
    image: "/products/Sweet_Items/Millet_Laddu.jpg",
    badge: "Healthy Choice",
    spiceLevel: "none",
    shelfLife: "15 days",
    serves: "8-10 laddus",
    ingredients: ["Nine grains mix", "Jaggery", "Ghee", "Cardamom", "Dry ginger"],
    nutrition: { calories: "190 kcal", protein: "7g", carbs: "25g", fat: "7g", fiber: "4g" },
    tags: ["vegetarian", "jaggery-sweetened", "multigrain", "healthy"],
  },
  {
    id: "protein-laddu",
    name: "ప్రోటీన్ లడ్డు",
    nameEnglish: "Protein Laddu",
    category: "sweet-items",
    description: "High-protein laddu made with nuts, seeds and natural ingredients — perfect for fitness-conscious snackers",
    price: 400,
    priceUnit: "500g",
    image: "/products/Sweet_Items/Protein_Laddu.jpg",
    badge: "Healthy Choice",
    spiceLevel: "none",
    shelfLife: "15 days",
    serves: "8-10 laddus",
    ingredients: ["Mixed nuts", "Seeds", "Dates", "Jaggery", "Ghee", "Protein powder"],
    nutrition: { calories: "200 kcal", protein: "12g", carbs: "18g", fat: "10g", fiber: "3g" },
    tags: ["vegetarian", "protein-rich", "healthy", "gym-friendly"],
  },
  {
    id: "millet-laddu",
    name: "మిల్లెట్ లడ్డు",
    nameEnglish: "Millet Laddu",
    category: "sweet-items",
    description: "Wholesome millet laddu with jaggery and ghee — a sugar-free, nutrient-dense traditional sweet",
    price: 350,
    priceUnit: "500g",
    image: "/products/Sweet_Items/Millet_Laddu.jpg",
    badge: "Healthy Choice",
    spiceLevel: "none",
    shelfLife: "15 days",
    serves: "8-10 laddus",
    ingredients: ["Ragi", "Jowar", "Foxtail millet", "Jaggery", "Ghee", "Cardamom"],
    nutrition: { calories: "185 kcal", protein: "6g", carbs: "24g", fat: "7g", fiber: "4g" },
    tags: ["vegetarian", "jaggery-sweetened", "millet", "healthy", "gluten-free"],
  },
  {
    id: "dry-fruits-laddu",
    name: "డ్రై ఫ్రూట్స్ లడ్డు",
    nameEnglish: "Dry Fruits Laddu",
    category: "sweet-items",
    description: "Premium laddu loaded with cashews, almonds, pistachios and dates — a luxurious gift-worthy sweet",
    price: 500,
    priceUnit: "500g",
    image: "/products/Sweet_Items/Dry_Fruits_Laddu.jpg",
    badge: "Premium",
    spiceLevel: "none",
    shelfLife: "10 days",
    serves: "8-10 laddus",
    ingredients: ["Cashew", "Almonds", "Pistachios", "Dates", "Ghee", "Cardamom", "Saffron"],
    nutrition: { calories: "240 kcal", protein: "8g", carbs: "20g", fat: "16g", fiber: "2g" },
    tags: ["vegetarian", "ghee-rich", "dry-fruits", "premium", "festive-special"],
  },
  {
    id: "oats-laddu",
    name: "ఓట్స్ లడ్డు",
    nameEnglish: "Oats Laddu",
    category: "sweet-items",
    description: "Crunchy oats laddu with jaggery and nuts — a modern healthy twist on the classic laddu",
    price: 320,
    priceUnit: "500g",
    image: "/products/Sweet_Items/Oats_Laddu.jpg",
    spiceLevel: "none",
    shelfLife: "15 days",
    serves: "8-10 laddus",
    ingredients: ["Oats", "Jaggery", "Ghee", "Peanuts", "Cardamom", "Dry ginger"],
    nutrition: { calories: "175 kcal", protein: "5g", carbs: "25g", fat: "6g", fiber: "3g" },
    tags: ["vegetarian", "jaggery-sweetened", "healthy"],
  },
  {
    id: "besan-laddu",
    name: "బేసన్ లడ్డు",
    nameEnglish: "Besan Laddu",
    category: "sweet-items",
    description: "Melt-in-mouth gram flour laddus with ghee and cardamom — a timeless Indian sweet enjoyed everywhere",
    price: 350,
    priceUnit: "500g",
    image: "/products/Sweet_Items/Besan_Laddu.jpg",
    popular: true,
    spiceLevel: "none",
    shelfLife: "15 days",
    serves: "8-10 laddus",
    ingredients: ["Besan flour", "Ghee", "Sugar", "Cardamom", "Cashew", "Raisins"],
    nutrition: { calories: "230 kcal", protein: "5g", carbs: "22g", fat: "14g", fiber: "1g" },
    tags: ["vegetarian", "ghee-rich", "festive-special"],
  },
  {
    id: "rava-laddu",
    name: "రవ్వ లడ్డు",
    nameEnglish: "Rava Laddu",
    category: "sweet-items",
    description: "Soft semolina laddus with roasted coconut and cashews — light, aromatic and utterly divine",
    price: 320,
    priceUnit: "500g",
    image: "/products/Sweet_Items/Rava_Laddu.jpg",
    spiceLevel: "none",
    shelfLife: "15 days",
    serves: "8-10 laddus",
    ingredients: ["Rava (Semolina)", "Coconut", "Sugar", "Ghee", "Cashew", "Cardamom"],
    nutrition: { calories: "210 kcal", protein: "4g", carbs: "26g", fat: "10g", fiber: "1g" },
    tags: ["vegetarian", "ghee-rich"],
  },
  {
    id: "sunnundalu",
    name: "సున్నుండాలు",
    nameEnglish: "Sunnundalu",
    category: "sweet-items",
    description: "Melt-in-mouth black gram laddu with ghee and cashew — a pure traditional Telangana treasure",
    price: 450,
    priceUnit: "500g",
    image: "/products/Sweet_Items/Sunnundalu.jpg",
    popular: true,
    spiceLevel: "none",
    shelfLife: "15 days",
    serves: "8-10 laddus",
    ingredients: ["Urad dal", "Ghee", "Jaggery", "Cashew", "Cardamom"],
    nutrition: { calories: "215 kcal", protein: "6g", carbs: "20g", fat: "13g", fiber: "2g" },
    tags: ["vegetarian", "jaggery-sweetened", "ghee-rich", "protein-rich", "festive-special"],
  },
  {
    id: "shankarapoli",
    name: "శంకరపాళీ",
    nameEnglish: "Shankarapoli",
    category: "sweet-items",
    description: "Diamond-shaped crispy sweet crackers with a hint of cardamom — a classic festive snack-sweet hybrid",
    price: 280,
    priceUnit: "500g",
    image: "/products/Sweet_Items/Shankarpaali.jpg",
    spiceLevel: "none",
    shelfLife: "20 days",
    serves: "8-10 pieces",
    ingredients: ["Maida", "Sugar", "Ghee", "Cardamom", "Oil"],
    nutrition: { calories: "200 kcal", protein: "3g", carbs: "28g", fat: "9g", fiber: "0g" },
    tags: ["vegetarian", "festive-special"],
  },


  // ─── MASALAS & POWDERS (మసాలాలు & పొడులు) ──────────────────────────────
  {
    id: "sambar-podi",
    name: "సాంబార్ పొడి",
    nameEnglish: "Sambar Podi",
    category: "podis-and-powders",
    description: "Aromatic sambar masala powder — the essential spice blend for perfect South Indian sambar every time",
    price: 180,
    priceUnit: "250g",
    image: "/products/Podis_Powders/Sambar_Powder.jpg",
    popular: true,
    spiceLevel: "medium",
    shelfLife: "6 months",
    serves: "25-30 servings",
    ingredients: ["Coriander", "Red chili", "Toor dal", "Fenugreek", "Cumin", "Black pepper", "Turmeric"],
    nutrition: { calories: "30 kcal", protein: "2g", carbs: "4g", fat: "1g", fiber: "2g" },
    tags: ["vegan", "gluten-free", "stone-ground", "daily-essential"],
  },
  {
    id: "rasam-podi",
    name: "రసం పొడి",
    nameEnglish: "Rasam Podi",
    category: "podis-and-powders",
    description: "Zesty rasam powder with black pepper and garlic — makes the most comforting bowl of rasam instantly",
    price: 160,
    priceUnit: "250g",
    image: "/products/Podis_Powders/Rasam_Powder.jpg",
    spiceLevel: "hot",
    shelfLife: "6 months",
    serves: "25-30 servings",
    ingredients: ["Black pepper", "Coriander", "Cumin", "Red chili", "Garlic", "Toor dal", "Curry leaves"],
    nutrition: { calories: "28 kcal", protein: "1g", carbs: "3g", fat: "1g", fiber: "1g" },
    tags: ["vegan", "gluten-free", "stone-ground", "daily-essential"],
  },
  {
    id: "idli-podi",
    name: "ఇడ్లీ పొడి",
    nameEnglish: "Idli Podi",
    category: "podis-and-powders",
    description: "Spicy chutney powder for idli and dosa — just mix with oil and enjoy the authentic South Indian flavour",
    price: 170,
    priceUnit: "250g",
    image: "/products/Podis_Powders/Idli_Podi.jpg",
    popular: true,
    spiceLevel: "medium",
    shelfLife: "6 months",
    serves: "20-25 servings",
    ingredients: ["Urad dal", "Red chili", "Sesame seeds", "Curry leaves", "Salt", "Asafoetida"],
    nutrition: { calories: "35 kcal", protein: "2g", carbs: "3g", fat: "2g", fiber: "1g" },
    tags: ["vegan", "gluten-free", "stone-ground", "daily-essential"],
  },
  {
    id: "kandi-podi",
    name: "కంది పొడి",
    nameEnglish: "Kandi Podi",
    category: "podis-and-powders",
    description: "Roasted toor dal spice powder — mix with hot rice and ghee for the simplest and most satisfying meal",
    price: 180,
    priceUnit: "250g",
    image: "/products/Podis_Powders/Kandi_Podi.jpg",
    spiceLevel: "medium",
    shelfLife: "3 months",
    serves: "15-20 servings",
    ingredients: ["Toor dal", "Red chili", "Cumin", "Garlic", "Salt"],
    nutrition: { calories: "40 kcal", protein: "3g", carbs: "4g", fat: "2g", fiber: "1g" },
    tags: ["vegan", "gluten-free", "stone-ground", "protein-rich", "daily-essential"],
  },
  {
    id: "palli-karam-podi",
    name: "పల్లి కారం పొడి",
    nameEnglish: "Palli Karam Podi",
    category: "podis-and-powders",
    description: "Roasted peanut spice powder — mix with rice and ghee for instant bliss, a Telangana household staple",
    price: 200,
    priceUnit: "250g",
    image: "/products/Podis_Powders/Peanut_Spice_Powder.jpg",
    popular: true,
    badge: "Fan Favourite",
    spiceLevel: "medium",
    shelfLife: "3 months",
    serves: "15-20 servings",
    ingredients: ["Peanuts", "Red chili", "Garlic", "Cumin", "Jaggery", "Salt"],
    nutrition: { calories: "55 kcal", protein: "3g", carbs: "4g", fat: "4g", fiber: "1g" },
    tags: ["vegetarian", "gluten-free", "protein-rich", "stone-ground", "daily-essential"],
  },
  {
    id: "karivepaku-podi",
    name: "కరివేపాకు పొడి",
    nameEnglish: "Karivepaku Podi",
    category: "podis-and-powders",
    description: "Aromatic curry leaf spice powder — packed with flavour and nutrition, a must-have in every kitchen",
    price: 200,
    priceUnit: "250g",
    image: "/products/Podis_Powders/Curry_Leaf_Powder.jpg",
    spiceLevel: "medium",
    shelfLife: "3 months",
    serves: "15-20 servings",
    ingredients: ["Curry leaves", "Red chili", "Coriander", "Cumin", "Garlic", "Salt"],
    nutrition: { calories: "32 kcal", protein: "2g", carbs: "3g", fat: "2g", fiber: "2g" },
    tags: ["vegan", "gluten-free", "stone-ground", "daily-essential"],
  },
  {
    id: "vangi-bath-podi",
    name: "వాంగీ బాత్ పొడి",
    nameEnglish: "Vangi Bath Podi",
    category: "podis-and-powders",
    description: "Karnataka-style brinjal rice masala — makes the most flavourful vangi bath with just a few spoons",
    price: 190,
    priceUnit: "250g",
    image: "/products/Podis_Powders/Vangi_Bath_Podi.jpg",
    spiceLevel: "medium",
    shelfLife: "6 months",
    serves: "15-20 servings",
    ingredients: ["Coriander", "Sesame seeds", "Peanuts", "Red chili", "Curry leaves", "Coconut", "Spices"],
    nutrition: { calories: "38 kcal", protein: "2g", carbs: "4g", fat: "2g", fiber: "1g" },
    tags: ["vegan", "gluten-free", "stone-ground"],
  },
  {
    id: "vellulli-karam-podi",
    name: "వెల్లుల్లి కారం పొడి",
    nameEnglish: "Vellulli Karam Podi",
    category: "podis-and-powders",
    description: "Fiery garlic chili powder — the bold garlic kick that elevates every rice meal to the next level",
    price: 200,
    priceUnit: "250g",
    image: "/products/Podis_Powders/Vellulli_Karam_Podi.jpg",
    spiceLevel: "extra-hot",
    shelfLife: "3 months",
    serves: "20-25 servings",
    ingredients: ["Garlic", "Red chili", "Coriander", "Cumin", "Salt"],
    nutrition: { calories: "30 kcal", protein: "1g", carbs: "3g", fat: "1g", fiber: "1g" },
    tags: ["vegan", "gluten-free", "spicy", "stone-ground", "daily-essential"],
  },
  {
    id: "pulihora-paste",
    name: "పులిహోర పేస్ట్",
    nameEnglish: "Pulihora Paste",
    category: "podis-and-powders",
    description: "Ready-to-use tamarind rice paste — just mix with hot rice for perfect pulihora in minutes",
    price: 180,
    priceUnit: "250g",
    image: "/products/Podis_Powders/Pulihora_Paste.jpg",
    spiceLevel: "medium",
    shelfLife: "3 months",
    serves: "10-12 servings",
    ingredients: ["Tamarind", "Red chili", "Peanuts", "Mustard", "Turmeric", "Curry leaves", "Sesame oil"],
    nutrition: { calories: "45 kcal", protein: "1g", carbs: "5g", fat: "3g", fiber: "1g" },
    tags: ["vegan", "gluten-free", "daily-essential"],
  },
  {
    id: "bisi-bele-bath-podi",
    name: "బిసి బేలె బాత్ పొడి",
    nameEnglish: "Bisi Bele Bath Podi",
    category: "podis-and-powders",
    description: "Karnataka-style hot lentil rice masala — makes the most comforting one-pot meal with rich aromatics",
    price: 190,
    priceUnit: "250g",
    image: "/products/Podis_Powders/Bisi_Bele_Bath_Podi.jpg",
    spiceLevel: "medium",
    shelfLife: "6 months",
    serves: "15-20 servings",
    ingredients: ["Coriander", "Red chili", "Cinnamon", "Cloves", "Coconut", "Poppy seeds", "Fenugreek"],
    nutrition: { calories: "35 kcal", protein: "2g", carbs: "4g", fat: "1g", fiber: "1g" },
    tags: ["vegan", "gluten-free", "stone-ground"],
  },
  {
    id: "majjiga-mirchi",
    name: "మజ్జిగ మిర్చి",
    nameEnglish: "Majjiga Mirchi",
    category: "hot-items",
          description: "Buttermilk-marinated green chilies, sun-dried to perfection — fry for a tangy, spicy side dish",
            price: 200,
              priceUnit: "250g",
                image: "/products/Vadiyalu_Papads/Majjiga_Mirchi.jpg",
                  spiceLevel: "hot",
                    shelfLife: "6 months",
                      serves: "10-12 pieces",
                        ingredients: ["Green chili", "Buttermilk", "Salt", "Turmeric"],
                          nutrition: { calories: "25 kcal", protein: "1g", carbs: "3g", fat: "1g", fiber: "1g" },
  tags: ["vegetarian", "gluten-free", "sun-dried", "spicy"],
  },
{
  id: "minapa-vadiyalu",
    name: "మినప వడియాలు",
      nameEnglish: "Minapa Vadiyalu",
        category: "hot-items",
          description: "Crispy sun-dried urad dal wafers — fry in oil for the perfect crunchy protein-rich side",
            price: 220,
              priceUnit: "250g",
                image: "/products/Vadiyalu_Papads/Minapa_Vadiyalu.jpg",
                  popular: true,
                    spiceLevel: "none",
                      shelfLife: "6 months",
                        serves: "8-10 pieces",
                          ingredients: ["Urad dal", "Green chili", "Cumin", "Salt"],
                            nutrition: { calories: "155 kcal", protein: "8g", carbs: "15g", fat: "6g", fiber: "2g" },
  tags: ["vegan", "gluten-free", "sun-dried", "protein-rich", "daily-essential"],
  },
];

// ─── GIFT WRAP OPTIONS ───────────────────────────────────────────────

export const GIFT_WRAP_OPTIONS: GiftWrapOption[] = [
  {
    id: "potli-bag",
    name: "Traditional Potli Bag",
    description: "Handwoven cloth potli bag with golden drawstring — perfect for small gifting",
    price: 49,
    image: "/gifts/potli-bag.png",
  },
  {
    id: "festive-box",
    name: "Festive Box",
    description: "Decorative rigid box with traditional motifs and ribbon — ideal for festival gifts",
    price: 99,
    image: "/gifts/festive-box.png",
  },
  {
    id: "premium-hamper",
    name: "Premium Hamper",
    description: "Luxury wooden hamper tray with partition inserts and satin lining — for grand gifting",
    price: 199,
    image: "/gifts/premium-hamper.png",
  },
  {
    id: "message-card",
    name: "Custom Message Card",
    description: "Personalized greeting card with your message printed on handmade paper",
    price: 29,
    image: "/gifts/message-card.png",
  },
];

// ─── RECIPE SUGGESTIONS ───────────────────────────────────────────────

export const RECIPES: RecipeSuggestion[] = [
  {
    id: "palli-podi-rice",
    name: "Palli Karam Rice",
    description: "Hot steaming rice mixed with Palli Karam Podi and ghee — the ultimate Telangana comfort meal",
    cookTime: "10 min",
    servings: "2",
    difficulty: "Easy",
    products: ["palli-karam-podi"],
    steps: [
      "Cook 1 cup of rice and let it cool slightly so grains stay separate.",
      "Add 2-3 tbsp Snakzee Palli Karam Podi directly onto the hot rice.",
      "Add 1 tbsp of ghee and mix gently until evenly coated.",
      "Garnish with roasted peanuts and curry leaves. Serve hot!",
    ],
  },
  {
    id: "idli-podi-dosa",
    name: "Spicy Podi Dosa",
    description: "Crispy dosa sprinkled generously with Idli Podi and ghee — a South Indian breakfast dream",
    cookTime: "15 min",
    servings: "2",
    difficulty: "Easy",
    products: ["idli-podi"],
    steps: [
      "Prepare dosa batter or use store-bought batter. Heat a flat tawa/griddle.",
      "Pour a ladle of batter and spread into a thin circular dosa.",
      "Drizzle ghee around the edges and over the dosa.",
      "Sprinkle 2 tbsp Snakzee Idli Podi evenly over the cooking dosa.",
      "Fold the dosa, serve hot with coconut chutney and sambar!",
    ],
  },
  {
    id: "pulihora",
    name: "Instant Pulihora",
    description: "Tangy tamarind rice made instantly with our Pulihora Paste — perfect for festivals and lunchboxes",
    cookTime: "15 min",
    servings: "4",
    difficulty: "Easy",
    products: ["pulihora-paste"],
    steps: [
      "Cook 2 cups of rice and cool it completely so grains are separate.",
      "Add 3-4 tbsp Snakzee Pulihora Paste to the cooled rice.",
      "Mix gently from bottom to top ensuring even coating.",
      "Heat 1 tbsp oil, splutter mustard seeds, add peanuts and curry leaves.",
      "Pour the tempering over the rice, mix well. Serve at room temperature!",
    ],
  },
  {
    id: "sambar",
    name: "Traditional Sambar",
    description: "Rich, aromatic sambar made with our stone-ground Sambar Podi — perfect with rice, idli or dosa",
    cookTime: "30 min",
    servings: "4",
    difficulty: "Medium",
    products: ["sambar-podi"],
    steps: [
      "Cook 1/2 cup toor dal in a pressure cooker until soft and mushy.",
      "In a pan, heat oil and add mustard seeds, curry leaves, dried red chili.",
      "Add chopped vegetables (drumstick, onion, tomato, brinjal) and sauté.",
      "Add 2 tbsp Snakzee Sambar Podi, tamarind extract, salt and cooked dal.",
      "Simmer for 10 minutes. Garnish with coriander. Serve hot with rice!",
    ],
  },
];

// ─── PRODUCT COMPARISON HELPER ────────────────────────────────────────

export function compareProducts(ids: string[]): Product[] {
  return products.filter(p => ids.includes(p.id));
}

// ─── FESTIVE CALENDAR ─────────────────────────────────────────────────

export const FESTIVALS: Festival[] = [
  {
    name: "Sankranti",
    nameTelugu: "సంక్రాంతి",
    date: "January",
    description: "The harvest festival celebrating the new crop — a time for Athrasalu, sweets and snacks. Families gather to share traditional treats and mark the sun's northward journey.",
    recommendedProducts: ["athrasalu", "karjikayalu", "chakkodilu", "shankarapoli"],
    emoji: "🪁",
  },
  {
    name: "Ugadi",
    nameTelugu: "ఉగాది",
    date: "March/April",
    description: "Telugu New Year! The day begins with Ugadi Pachadi tasting all six flavours of life. A time for new beginnings, feasts and sharing homemade sweets.",
    recommendedProducts: ["kaju-katli", "besan-laddu", "murukulu", "nippatlu"],
    emoji: "🥭",
  },
  {
    name: "Bonalu",
    nameTelugu: "బోనాలు",
    date: "July/August",
    description: "A unique Telangana festival honoring Goddess Mahankali with offerings. The streets come alive with processions and special homemade snacks.",
    recommendedProducts: ["sunnundalu", "pallee-laddu", "palli-karam-podi", "murukulu"],
    emoji: "🪔",
  },
  {
    name: "Bathukamma",
    nameTelugu: "బతుకమ్మ",
    date: "September/October",
    description: "Telangana's floral festival celebrating womanhood! Women create stunning flower stacks, sing folk songs, and offer traditional foods.",
    recommendedProducts: ["athrasalu", "kaju-katli", "karivepaku-podi", "karjikayalu"],
    emoji: "🌸",
  },
  {
    name: "Dasara",
    nameTelugu: "దసరా",
    date: "October",
    description: "The victory of good over evil! Families exchange sweets and gifts, decorate homes, and celebrate with grand feasts.",
    recommendedProducts: ["sunnundalu", "besan-laddu", "dry-fruits-laddu", "shankarapoli"],
    emoji: "🏹",
  },
  {
    name: "Diwali",
    nameTelugu: "దీపావళి",
    date: "October/November",
    description: "The festival of lights! Homes glow with diyas, fireworks fill the sky, and families share sweets and snacks. The perfect time for Snakzee hampers!",
    recommendedProducts: ["murukulu", "nippatlu", "chakkodilu", "jantikalu", "kaju-katli"],
    emoji: "🪔",
  },
  {
    name: "Ramzan",
    nameTelugu: "రంజాన్",
    date: "March/April",
    description: "The holy month of fasting and feasting! Iftar tables come alive with crispy snacks and rich sweets. Celebrate with traditional Telangana flavours.",
    recommendedProducts: ["murukulu", "nippatlu", "sunnundalu", "besan-laddu"],
    emoji: "🌙",
  },
];

// ─── VIDEO TESTIMONIALS ───────────────────────────────────────────────

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    name: "Divya Sri",
    location: "Warangal",
    product: "Athrasalu",
    quote: "My whole family loved the Athrasalu — it tasted exactly like what my grandmother used to make during Sankranti. Snakzee brought our tradition back to our table!",
    avatar: "DS",
  },
  {
    name: "Rajesh Naik",
    location: "Hyderabad",
    product: "Palli Karam Podi",
    quote: "Palli Karam Podi with hot rice and ghee is my daily comfort food! The peanut flavour is so fresh. Better than anything store-bought.",
    avatar: "RN",
  },
  {
    name: "Padma Latha",
    location: "Karimnagar",
    product: "Murukulu",
    quote: "The Butter Murukulu are absolutely addictive! We ordered the hot items combo and every single item was fresh and perfectly spiced. Will order again!",
    avatar: "PL",
  },
];

// ─── EXISTING EXPORTS (preserved) ─────────────────────────────────────

export const WHATSAPP_NUMBER = "919505550051";

export function getWhatsAppLink(product?: Product | string, quantity?: number): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (typeof product === "string") {
    return `${base}?text=${encodeURIComponent(product)}`;
  }
  if (product) {
    const qty = quantity || 1;
    const total = product.price * qty;
    const text = encodeURIComponent(
      `Hi! I want to order ${qty}x ${product.nameEnglish} (${product.name}) — ${product.priceUnit} @ ₹${product.price} each. Total: ₹${total}. Please confirm availability and delivery details.`
    );
    return `${base}?text=${text}`;
  }
  return `${base}?text=${encodeURIComponent("Hi! I'd like to place an order from Snakzee. Can you help me?")}`;
}

export function getShareLink(product: Product): string {
  const text = encodeURIComponent(
    `Check out ${product.nameEnglish} (${product.name}) from Snakzee — Authentic Telangana homemade ${product.category}! ₹${product.price}/${product.priceUnit}. Order via WhatsApp! 🍽️`
  );
  return `https://wa.me/?text=${text}`;
}

export function getBulkOrderLink(items: { name: string; qty: number }[]): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  const itemList = items.map(i => `${i.qty}x ${i.name}`).join(", ");
  const text = encodeURIComponent(
    `Hi! I'm interested in a bulk/catering order for: ${itemList}. Can you share pricing and availability for a large order?`
  );
  return `${base}?text=${text}`;
}

export const MARQUEE_ITEMS = [
  "మురుకులు • Murukulu", "నిప్పట్లు • Nippatlu", "జంతికాలు • Jantikalu", "బటర్ మురుకులు • Butter Murukulu",
  "కార్జికాయలు • Karjikayalu", "సున్నుండాలు • Sunnundalu", "కాజూ కట్లీ • Kaju Katli", "బేసన్ లడ్డు • Besan Laddu",
  "సాంబార్ పొడి • Sambar Podi", "పల్లి కారం పొడి • Palli Karam Podi", "ఇడ్లీ పొడి • Idli Podi",
  "కరివేపాకు పొడి • Karivepaku Podi", "మినప వడియాలు • Minapa Vadiyalu", "మజ్జిగ మిర్చి • Majjiga Mirchi",
  "పల్లీ లడ్డు • Pallee Laddu", "అత్రసాలు • Athrasalu", "శంకరపాళీ • Shankarapoli", "డ్రై ఫ్రూట్స్ లడ్డు • Dry Fruits Laddu",
  "రిబ్బన్ మురుకులు • Ribbon Murukulu", "చక్కోడీలు • Chakkodilu", "సన్నకరపూస • Sannakarapoosa",
];

export interface Combo {
  id: string;
  name: string;
  description: string;
  items: string[];
  originalPrice: number;
  comboPrice: number;
  image: string;
  badge: string;
}

export const COMBOS: Combo[] = [
  {
    id: "sankranti-box",
    name: "Sankranti Special Box",
    description: "Celebrate the harvest festival with our curated Sankranti collection — traditional sweets & snacks that bring the festival home",
    items: ["Athrasalu", "Karjikayalu", "Chakkodilu", "Shankarapoli"],
    originalPrice: 1310,
    comboPrice: 1049,
    image: "/products/Sweet_Items/Athrasalu_Gasalu.jpg",
    badge: "🏆 Best Value",
  },
  {
    id: "hot-snacks-pack",
    name: "Hot Snacks Family Pack",
    description: "An irresistible combo of our crunchiest hot snacks — perfect for tea-time, parties & family gatherings",
    items: ["Murukulu", "Nippatlu", "Ribbon Murukulu", "Jantikalu"],
    originalPrice: 960,
    comboPrice: 799,
    image: "/products/Hot_Items/Crispy_Murukulu.jpg",
    badge: "🍿 Most Popular",
  },
  {
    id: "sweet-tooth",
    name: "Sweet Tooth Collection",
    description: "The finest Telangana sweets — from melt-in-mouth Sunnundalu to premium Kaju Katli",
    items: ["Sunnundalu", "Besan Laddu", "Kaju Katli"],
    originalPrice: 1400,
    comboPrice: 1149,
    image: "/products/Sweet_Items/Kaju_Katli.jpg",
    badge: "🍬 Sweet Deal",
  },
  {
    id: "podi-essentials",
    name: "Kitchen Podi Essentials",
    description: "Every Telangana kitchen needs these daily podi essentials — Sambar, Rasam, Idli & Palli Karam",
    items: ["Sambar Podi", "Rasam Podi", "Idli Podi", "Palli Karam Podi"],
    originalPrice: 730,
    comboPrice: 599,
    image: "/products/Podis_Powders/Peanut_Spice_Powder.jpg",
    badge: "🏆 Best Value",
  },
];

export function getComboWhatsAppLink(combo: Combo): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  const text = encodeURIComponent(
    `Hi! I want to order the ${combo.name} combo — ₹${combo.comboPrice} (Items: ${combo.items.join(", ")}). Please confirm availability and delivery details.`
  );
  return `${base}?text=${text}`;
}

export const FAQS = [
  {
    question: "How do I place an order?",
    answer: "Simply click the WhatsApp order button on any product or combo. Your message will be pre-filled with the product details. Just hit send and we'll take care of the rest!",
  },
  {
    question: "What are the delivery charges?",
    answer: "Free delivery on all orders above ₹1,000 across Telangana! For orders below ₹1,000, a nominal delivery fee applies.",
  },
  {
    question: "How long does delivery take?",
    answer: "We deliver across Telangana within 2-3 business days. Since every item is made fresh after you order, please allow us time to prepare your order with love!",
  },
  {
    question: "Are the products fresh?",
    answer: "Absolutely! Every item is made fresh after you place your order. We use zero preservatives — just pure, traditional ingredients and time-honored recipes.",
  },
  {
    question: "Can I customize my order?",
    answer: "Yes! Just message us on WhatsApp with your requirements. We can adjust spice levels, quantities, or even create custom combo packs for gifting.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept UPI (Google Pay, PhonePe, Paytm), bank transfer, and cash on delivery within Telangana. Payment details will be shared via WhatsApp after order confirmation.",
  },
  {
    question: "Do you take bulk orders for events?",
    answer: "Yes! We handle bulk orders for weddings, housewarmings, festivals, and corporate events. Contact us on WhatsApp for special bulk pricing and custom packaging.",
  },
  {
    question: "What about packaging and shelf life?",
    answer: "All items are packed in food-grade, airtight containers to maintain freshness. Shelf life varies by product — podis last up to 6 months, snacks 15-30 days, and sweets 10-20 days. Check each product for details.",
  },
];

export const REVIEWS = [
  {
    name: "Priya Reddy",
    location: "Hyderabad",
    text: "The Palli Karam Podi is a game changer! I mix it with hot rice and ghee every day. Fresh, aromatic, and so flavorful. Better than anything store-bought.",
    rating: 5,
    avatar: "PR",
    product: "Palli Karam Podi",
  },
  {
    name: "Ravi Kumar",
    location: "Warangal",
    text: "Best homemade snacks I've found online. The Murukulu are perfectly crispy and the Butter Murukulu just melt in your mouth. Highly recommend!",
    rating: 5,
    avatar: "RK",
    product: "Murukulu",
  },
  {
    name: "Lakshmi Sharma",
    location: "Karimnagar",
    text: "Finally found authentic Telangana podis! The Sambar Podi and Idli Podi are outstanding. Ordering through WhatsApp was super easy.",
    rating: 5,
    avatar: "LS",
    product: "Sambar Podi",
  },
];

// ─── Ingredients Glossary ──────────────────────────────────────
export interface IngredientInfo {
  name: string;
  nameTelugu: string;
  description: string;
  benefits: string;
  icon: string;
}

export const INGREDIENTS_GLOSSARY: IngredientInfo[] = [
  { name: "Peanuts", nameTelugu: "పల్లీలు", description: "Roasted peanuts — the heart of our podis and laddus, adding protein and crunch", benefits: "High protein, healthy fats, vitamin E, minerals", icon: "🥜" },
  { name: "Ghee", nameTelugu: "నెయ్యి", description: "Clarified butter made from cow's milk — used in sweets and tempering", benefits: "Healthy fats, boosts immunity, enhances nutrient absorption", icon: "🧈" },
  { name: "Jaggery", nameTelugu: "బెల్లం", description: "Unrefined cane sugar — the traditional sweetener in all our Telangana sweets", benefits: "Iron rich, natural cleanser, mineral packed", icon: "🟤" },
  { name: "Red Chili", nameTelugu: "ఎర్రమిర్చి", description: "Sun-dried Guntur chilies — the fire behind every spicy podi and snack", benefits: "Capsaicin boosts metabolism, vitamin C, pain relief", icon: "🌶️" },
  { name: "Sesame Seeds", nameTelugu: "నువ్వులు", description: "Nutty seeds used in snacks and chutneys — a protein and calcium powerhouse", benefits: "Calcium rich, healthy fats, B-vitamins", icon: "⚪" },
  { name: "Rice Flour", nameTelugu: "బియ్యం పిండి", description: "Fine ground rice used in murukulu, nippatlu and other crispy snacks", benefits: "Gluten-free, easy to digest, energy boosting", icon: "🍚" },
  { name: "Urad Dal", nameTelugu: "మినప పప్పు", description: "Black gram lentil — key ingredient in vadiyalu and snack doughs", benefits: "Protein rich, iron, improves bone health", icon: "⚫" },
  { name: "Curry Leaves", nameTelugu: "కరివేపాకు", description: "Aromatic leaves for tempering — adds authentic South Indian flavour", benefits: "Anti-diabetic, promotes hair growth, rich in vitamin A", icon: "🍃" },
  { name: "Cashew", nameTelugu: "జీడిపప్పు", description: "Premium cashew nuts — used in Kaju Katli, laddus and as garnish", benefits: "Good fats, magnesium, copper, heart healthy", icon: "🌰" },
  { name: "Millets", nameTelugu: "చిరుధాన్యాలు", description: "Ancient grains like ragi, jowar and foxtail — the base of our healthy range", benefits: "High fiber, gluten-free, controls diabetes, iron rich", icon: "🌾" },
  { name: "Tamarind", nameTelugu: "చింతపండు", description: "Sour fruit pulp essential in pulihora paste and South Indian cooking", benefits: "Antioxidants, aids digestion, rich in magnesium", icon: "🫘" },
  { name: "Cold-Pressed Oil", nameTelugu: "నూనె", description: "Traditional wood-pressed groundnut/sesame oil for authentic flavour", benefits: "No trans fats, retains nutrients, heart-healthy", icon: "🫒" },
];

// ─── Gift Card Options ────────────────────────────────────────
export interface GiftCardOption {
  id: string;
  name: string;
  amount: number;
  description: string;
  color: string;
  icon: string;
}

export const GIFT_CARDS: GiftCardOption[] = [
  { id: "gc-500", name: "Taste of Telangana", amount: 500, description: "Perfect for trying 1-2 products — a sweet introduction to Snakzee", color: "from-terracotta to-terracotta-light", icon: "🎁" },
  { id: "gc-1000", name: "Family Feast", amount: 1000, description: "Great for families — covers 3-4 products with free delivery!", color: "from-gold to-gold-light", icon: "🎉" },
  { id: "gc-2000", name: "Grand Celebration", amount: 2000, description: "Ideal for festivals — a full hamper of Telangana flavours", color: "from-brown to-brown-light", icon: "🪔" },
  { id: "gc-5000", name: "Royal Spread", amount: 5000, description: "The ultimate gift — complete Snakzee experience with premium packaging", color: "from-terracotta-dark to-gold", icon: "👑" },
];

// ─── Chatbot Preset Q&As ──────────────────────────────────────
export const CHATBOT_QA = [
  { question: "How do I order?", answer: "Simply click any 'Order on WhatsApp' button! Your message will be pre-filled with product details. We'll confirm and deliver fresh to your doorstep. 🛒" },
  { question: "What's the delivery time?", answer: "We prepare your order fresh after you place it! Delivery takes 2-3 days across Telangana. Orders above ₹1,000 get free delivery! 🚚" },
  { question: "Are these really homemade?", answer: "100%! Every product is made in small batches using traditional Telangana recipes. No factories, no preservatives — just like grandmother made! 🏠" },
  { question: "Can I customize my order?", answer: "Absolutely! You can request custom spice levels, portion sizes, or gift wrapping. Just tell us on WhatsApp and we'll make it happen! ✨" },
  { question: "Do you have bulk options?", answer: "Yes! We offer special bulk pricing for events, weddings, and corporate gifts. Check our Bulk Order section or WhatsApp us for a custom quote! 📦" },
  { question: "What payment methods?", answer: "We accept UPI, Google Pay, PhonePe, bank transfer, and cash on delivery. Payment details are shared after order confirmation on WhatsApp! 💳" },
];

export const PROCESS_STEPS = [
  {
    step: 1,
    title: "Sourcing (Telangana and Andhra farms )",
    description: "Handpicked fresh ingredients directly from local Telangana farms — fresh chilies, peanuts, spices, and premium grains.",
    icon: "🌱",
  },
  {
    step: 2,
    title: "Preparation (stone grinding, hand rolling)",
    description: "Ingredients are ground slowly on traditional stone mortars to retain natural oils, and rolled by hand using heritage methods.",
    icon: "👩🍳",
  },
  {
    step: 3,
    title: "Cooking (small batch, cold pressed oil)",
    description: "Prepared meticulously in small, artisanal batches and slow-cooked using pure, heart-healthy cold-pressed oils.",
    icon: "🔥",
  },
  {
    step: 4,
    title: "Sun Drying (vadiyalu process)",
    description: "Naturally sun-dried under warm sunlight to produce perfectly crisp, light, and traditional vadiyalu and papads.",
    icon: "☀️",
  },
  {
    step: 5,
    title: "Packing & Hygiene",
    description: "Double-sanitized, packed with extreme care in airtight, food-grade containers to preserve authentic aroma and taste.",
    icon: "📦",
  },
  {
    step: 6,
    title: "Delivery process",
    description: "Dispatched within 24 hours of preparation, ensuring the product reaches your doorstep fresh and crisp in 2-3 days.",
    icon: "🚚",
  },
];
