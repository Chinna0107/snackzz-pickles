import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Snackzee Foods",
  description: "Get in touch with Snackzee Foods. Order via WhatsApp, call us, or send a message. We deliver authentic homemade Telangana snacks across India.",
  openGraph: {
    title: "Contact Snackzee Foods",
    description: "Reach Snackzee Foods via WhatsApp, phone or email. Fast response guaranteed!",
    images: [{ url: "/snakzee-logo.png", alt: "Snackzee Foods" }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
