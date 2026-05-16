import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products — Snackzee Foods",
  description: "Browse all Snackzee Foods products — hot items, sweet items, podis & powders, vadiyalu & papads. 100% homemade, no preservatives, fresh Telangana snacks.",
  openGraph: {
    title: "Shop Snackzee Foods — Authentic Telangana Snacks",
    description: "Hot items, sweets, podis, vadiyalu & papads — all homemade with traditional Telangana recipes.",
    images: [{ url: "/logo-removebg-preview.png", alt: "Snackzee Foods Products" }],
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
