import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Snakzee Products | Authentic Homemade Snacks, Sweets & Podis",
  description: "Browse and buy authentic homemade Telangana & Andhra snacks, sweets, podis, vadiyalu & papads. 100% natural ingredients, no preservatives. Fast delivery across India.",
  keywords: [
    "snakzee products",
    "buy homemade snacks online",
    "Telangana snacks shop",
    "authentic podis",
    "vadiyalu online",
    "homemade sweets",
    "no preservatives snacks",
    "order snacks online",
  ],
  openGraph: {
    title: "Shop Snakzee | 100% Homemade Telangana Snacks",
    description: "Discover our authentic collection of handcrafted snacks, sweets, podis & vadiyalu made fresh with traditional recipes.",
    url: "https://snakzee.com/products",
    type: "website",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
