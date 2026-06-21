import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/CartContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://snakzee.com"),
  title: {
    default: "Snakzee Foods | Homemade Telangana Snacks, Sweets & Podis — Order Online via WhatsApp",
    template: "%s | Snakzee Foods",
  },
  description: "Buy authentic homemade Telangana snacks online — murukulu, nippatlu, sunnundalu, kaju katli, palli karam podi, sambar podi & more. No preservatives. Made fresh after order. Free delivery above ₹1000 across Telangana & Andhra Pradesh. Order on WhatsApp!",
  keywords: [
    "Snakzee", "Snakzee Foods", "Snackzee", "snakzee.com",
    "buy Telangana snacks online", "homemade snacks order online India",
    "murukulu online order", "butter murukulu", "ribbon murukulu",
    "nippatlu", "jantikalu", "chakodilu", "gavvalu", "sannakarapoosa",
    "sunnundalu laddu", "besan laddu", "pallee laddu",
    "athrasalu", "karjikayalu", "shankarapoli", "kaju katli homemade",
    "dry fruits laddu", "millet laddu", "oats laddu", "protein laddu",
    "palli karam podi", "idli podi", "sambar podi", "kandi podi",
    "karivepaku podi", "rasam podi", "pulihora paste", "vellulli karam podi",
    "sun-dried vadiyalu", "minapa vadiyalu", "majjiga mirchi",
    "mango pickle Telangana", "homemade snacks Hyderabad",
    "authentic Telangana food online", "no preservatives snacks India",
    "traditional Telugu snacks", "Telangana sweets online order",
    "order snacks WhatsApp India", "free delivery snacks Telangana",
    "Andhra Pradesh snacks online", "homemade food Jagtial",
    "Sankranti sweets online", "Diwali snacks homemade",
    "Ugadi snacks", "Bathukamma special sweets", "festival snacks India",
    "multigrain healthy snacks India", "stone ground masala powders",
    "podis online order", "WhatsApp food order Telangana",
  ],
  authors: [{ name: "Snakzee Foods", url: "https://snakzee.com" }],
  creator: "Snakzee Foods",
  publisher: "Snakzee Foods",
  category: "Food & Beverage",
  icons: {
    icon: "/logo-removebg-preview.png",
    apple: "/logo-removebg-preview.png",
    shortcut: "/logo-removebg-preview.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Snakzee Foods | Buy Homemade Telangana Snacks, Sweets & Podis Online",
    description: "Buy authentic homemade Telangana snacks online — murukulu, sunnundalu, palli karam podi & more. No preservatives. Free delivery ₹1000+. Order on WhatsApp!",
    siteName: "Snakzee Foods",
    url: "https://snakzee.com",
    type: "website",
    locale: "en_IN",
    images: [{
      url: "https://snakzee.com/logo-removebg-preview.png",
      width: 1200,
      height: 630,
      alt: "Snakzee Foods — Authentic Homemade Telangana Snacks",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snakzee Foods | Homemade Telangana Snacks Online — Order via WhatsApp",
    description: "Buy authentic homemade Telangana snacks online. No preservatives. Made fresh. Free delivery ₹1000+.",
    images: ["https://snakzee.com/logo-removebg-preview.png"],
    creator: "@snakzeefoods",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://snakzee.com",
  },
  verification: {
    google: "-_TathQN_9RE9b6qKYjx70TeZCfIrGGIBQwEzM344Yw",
  },
};

export const viewport: Viewport = {
  themeColor: "#C8401A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "name": "Snakzee Foods",
    "alternateName": ["Snackzee", "Snackzee Foods", "Snakzee"],
    "url": "https://snakzee.com",
    "logo": "https://snakzee.com/logo-removebg-preview.png",
    "image": "https://snakzee.com/logo-removebg-preview.png",
    "description": "Snakzee Foods — 100% homemade Telangana snacks, sweets, podis, vadiyalu & papads. No preservatives. Made fresh after every order.",
    "servesCuisine": "Telangana",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "House No 1/2/32, Taka Street, Near Main Road",
      "addressLocality": "Jagtial",
      "postalCode": "505327",
      "addressRegion": "Telangana",
      "addressCountry": "IN"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-93055-50051",
        "contactType": "customer service",
        "availableLanguage": ["English", "Telugu"]
      }
    ],
    "sameAs": [
      "https://www.instagram.com/snak_zee",
      "https://snakzee.com"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Snakzee Foods Menu",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Hot Items & Snacks",
          "description": "Authentic homemade hot snacks and crispy items",
          "url": "https://snakzee.com/products?category=hot-items"
        },
        {
          "@type": "OfferCatalog",
          "name": "Sweet Items",
          "description": "Traditional homemade sweets and desserts from Telangana",
          "url": "https://snakzee.com/products?category=sweet-items"
        },
        {
          "@type": "OfferCatalog",
          "name": "Podis & Powders",
          "description": "Authentic spice powders and flavor enhancers made fresh",
          "url": "https://snakzee.com/products?category=podis-powders"
        },
        {
          "@type": "OfferCatalog",
          "name": "Vadiyalu & Papads",
          "description": "Sun-dried traditional vadiyalu and crispy papads",
          "url": "https://snakzee.com/products?category=vadiyalu-papads"
        }
      ]
    }
  };

  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${dmSans.variable} antialiased bg-cream text-foreground`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>
          {/* Add Button removed for cleaner UI */}
          {/* <button
            onClick={(e) => handleAdd(e, product)}
            className={`flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold font-sans transition-all ${addedId === product.id
                ? "bg-green-500 text-white"
                : "bg-terracotta hover:bg-terracotta-dark text-white active:scale-95"
              }`}
          >
            {addedId === product.id ? <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <ShoppingCart className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
            {addedId === product.id ? "Added" : "Add"}
          </button> */}
          <div className="pt-8">
            {children}
          </div>
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
