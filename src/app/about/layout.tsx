import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Snackzee Foods",
  description: "Learn the story behind Snackzee Foods — authentic homemade Telangana snacks made with traditional recipes passed down through three generations. No preservatives, made with love.",
  openGraph: {
    title: "About Snackzee Foods — From Grandmother's Kitchen to Your Doorstep",
    description: "The story of Snackzee Foods — authentic homemade Telangana snacks, sweets & podis made with love and tradition.",
    images: [{ url: "/logo-removebg-preview.png", alt: "Snackzee Foods" }],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
