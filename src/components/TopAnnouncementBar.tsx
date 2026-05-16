"use client";

import { usePathname } from "next/navigation";
import { Truck } from "lucide-react";

export default function TopAnnouncementBar({ hidden }: { hidden?: boolean }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className={`bg-terracotta text-white overflow-hidden whitespace-nowrap relative flex items-center z-50 font-sans transition-all duration-300 ${hidden ? "h-0 opacity-0" : "h-10 opacity-100"}`}>
      <div className="animate-marquee flex items-center h-full">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 px-8 font-semibold text-sm tracking-wide shrink-0">
            <Truck className="w-4 h-4 text-gold-light" />
            <span>For Telangana and Andhra Pradesh free delivery on order above ₹999</span>
            <span className="mx-8 text-white/30">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
