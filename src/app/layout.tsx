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
  metadataBase: new URL("https://snackzz-pickles.vercel.app"),
  title: {
    default: "Snackzee Foods — Authentic Homemade Telangana Snacks, Sweets & Podis",
    template: "%s | Snackzee Foods",
  },
  description: "Snackzee Foods brings you 100% homemade Telangana snacks, sweets, podis, vadiyalu & papads. No preservatives. Made fresh after every order. Free delivery above ₹1000 across Telangana.",
  keywords: [
    "Snackzee Foods", "Snackzee", "Telangana snacks", "homemade snacks",
    "authentic Telangana food", "murukulu", "chakli", "kaju katli",
    "palli podi", "flower vadiyalu", "rice papads", "avakaya pickle",
    "homemade sweets", "podis powders", "sun-dried vadiyalu",
    "Hyderabad snacks online", "WhatsApp order snacks", "no preservatives snacks",
    "traditional Telangana recipes", "order snacks online India",
  ],
  authors: [{ name: "Snackzee Foods", url: "https://snackzz-pickles.vercel.app" }],
  creator: "Snackzee Foods",
  publisher: "Snackzee Foods",
  category: "Food & Beverage",
  icons: {
    icon: "/snakzee-logo.png",
    apple: "/snakzee-logo.png",
    shortcut: "/snakzee-logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Snackzee Foods — Art of Authentic Snacking",
    description: "100% homemade Telangana snacks, sweets, podis & vadiyalu. No preservatives. Order via WhatsApp!",
    siteName: "Snackzee Foods",
    url: "https://snackzz-pickles.vercel.app",
    type: "website",
    locale: "en_IN",
    images: [{
      url: "/snakzee-logo.png",
      width: 1200,
      height: 630,
      alt: "Snackzee Foods — Authentic Homemade Telangana Snacks",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snackzee Foods — Art of Authentic Snacking",
    description: "100% homemade Telangana snacks, sweets, podis & vadiyalu. No preservatives. Order via WhatsApp!",
    images: ["/snakzee-logo.png"],
    creator: "@snackzeefoods",
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
    canonical: "https://snackzz-pickles.vercel.app",
  },
  verification: {
    google: "",
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
    "name": "Snackzee Foods",
    "url": "https://snackzz-pickles.vercel.app",
    "logo": "https://snackzz-pickles.vercel.app/snakzee-logo.png",
    "image": "https://snackzz-pickles.vercel.app/snakzee-logo.png",
    "description": "Snackzee Foods — 100% homemade Telangana snacks, sweets, podis, vadiyalu & papads. No preservatives. Made fresh after every order.",
    "servesCuisine": "Telangana",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "57/14-A, Sri Raghavendra Swamy Temple",
      "addressLocality": "Kurnool",
      "postalCode": "518001",
      "addressRegion": "Andhra Pradesh",
      "addressCountry": "IN"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-95055-50051",
        "contactType": "customer service",
        "availableLanguage": ["English", "Telugu"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+91-88975-86142",
        "contactType": "sales"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/snak_zee"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Snackzee Foods Menu",
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
