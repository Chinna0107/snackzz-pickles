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
    default: "Snakzee Foods — Authentic Homemade Telangana Snacks, Sweets & Podis",
    template: "%s | Snakzee Foods",
  },
  description: "Snakzee Foods brings you 100% homemade Telangana snacks, sweets, podis, vadiyalu & papads. No preservatives. Made fresh after every order. Free delivery above ₹1000 across Telangana.",
  keywords: [
    "Snakzee", "Snakzee Foods", "Snackzee", "Snackzee Foods",
    "snakzee.com", "snackzee foods online", "buy snackzee",
    "Telangana snacks", "homemade snacks online", "authentic Telangana food",
    "murukulu online", "chakodilu", "kaju katli homemade",
    "palli podi", "flower vadiyalu", "rice papads", "avakaya pickle",
    "homemade sweets Hyderabad", "podis powders online", "sun-dried vadiyalu",
    "Hyderabad snacks online", "WhatsApp order snacks", "no preservatives snacks",
    "traditional Telangana recipes", "order snacks online India",
    "Telangana food delivery", "homemade food Jagtial", "Telangana pickles online",
  ],
  authors: [{ name: "Snakzee Foods", url: "https://snakzee.com" }],
  creator: "Snakzee Foods",
  publisher: "Snakzee Foods",
  category: "Food & Beverage",
  icons: {
    icon: "/snakzee-logo.png",
    apple: "/snakzee-logo.png",
    shortcut: "/snakzee-logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Snakzee Foods — Art of Authentic Snacking",
    description: "100% homemade Telangana snacks, sweets, podis & vadiyalu. No preservatives. Order via WhatsApp!",
    siteName: "Snakzee Foods",
    url: "https://snakzee.com",
    type: "website",
    locale: "en_IN",
    images: [{
      url: "https://snakzee.com/snakzee-logo.png",
      width: 1200,
      height: 630,
      alt: "Snakzee Foods — Authentic Homemade Telangana Snacks",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snakzee Foods — Art of Authentic Snacking",
    description: "100% homemade Telangana snacks, sweets, podis & vadiyalu. No preservatives. Order via WhatsApp!",
    images: ["https://snakzee.com/snakzee-logo.png"],
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
    "logo": "https://snakzee.com/snakzee-logo.png",
    "image": "https://snakzee.com/snakzee-logo.png",
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
        "telephone": "+91-88975-86142",
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
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Hot Items & Snacks" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Sweet Items" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Podis & Powders" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Vadiyalu & Papads" } }
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
          {children}
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
