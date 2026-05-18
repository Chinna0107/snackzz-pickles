"use client";

import { usePathname } from "next/navigation";
import { MARQUEE_ITEMS } from "@/lib/products";

export default function TopAnnouncementBar({ hidden }: { hidden?: boolean }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Repeat the items to guarantee a continuous, infinite marquee
  const scrollItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className={`bg-terracotta text-white overflow-hidden whitespace-nowrap relative flex items-center z-50 font-sans transition-all duration-300 ${hidden ? "h-0 opacity-0" : "h-10 opacity-100"}`}>
      <div className="animate-marquee flex items-center h-full">
        {scrollItems.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center text-cream font-serif text-xs sm:text-sm font-semibold mx-4 sm:mx-6 shrink-0"
          >
            <span>{item}</span>
            <span className="ml-4 sm:ml-6 text-gold-light">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
