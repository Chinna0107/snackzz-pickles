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
  title: "Snakzee — Authentic Homemade Telangana Snacks, Sweets & Podis",
  description: "Experience the true taste of tradition! Order 100% natural, freshly-made Telangana snacks, sun-dried vadiyalu, masalas, and sweets. Free delivery above ₹1000.",
  keywords: ["Snakzee", "Telangana snacks", "homemade pickles", "authentic masalas", "sun-dried vadiyalu", "Desi sweets", "Hyderabad dry snacks", "order snacks online", "WhatsApp order snacks", "regional snacks"],
  authors: [{ name: "Snakzee Authentic Sweets & Snacks" }],
  icons: {
    icon: "/snakzee-logo.png",
    apple: "/snakzee-logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Snakzee — Art of Authentic Snacking",
    description: "Authentic homemade Telangana snacks, pickles, masalas & sweets. Order via WhatsApp!",
    siteName: "Snakzee",
    type: "website",
    images: [{ url: "/snakzee-logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snakzee — Art of Authentic Snacking",
    description: "Authentic homemade Telangana snacks, pickles, masalas & sweets. Order via WhatsApp!",
    images: ["/snakzee-logo.png"],
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
    "@type": "Organization",
    "name": "Snakzee",
    "url": "https://snakzee.com",
    "logo": "https://snakzee.com/snakzee-logo.png",
    "description": "Authentic homemade Telangana snacks, pickles, masalas and sweets.",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Telangana",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-88975-86142",
      "contactType": "customer service"
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
