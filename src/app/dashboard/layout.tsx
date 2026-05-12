"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, ShoppingBag, User, LogOut, Menu, X, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/dashboard/orders", label: "My Orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { href: "/dashboard/products", label: "Products", icon: <Home className="w-4 h-4" /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("snackzee_token");
    if (!token) { router.push("/login"); return; }
    fetch(`${BACKEND_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) { router.push("/login"); return; }
        if (d.user.role === "admin") { router.push("/admin"); return; }
        setUser(d.user);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("snackzee_token");
    localStorage.removeItem("snackzee_user");
    router.push("/");
  };

  if (!user) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-terracotta/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 relative flex-shrink-0">
            <Image src="/snakzee-logo.png" alt="Snakzee" fill sizes="36px" className="object-contain" />
          </div>
          <p className="font-serif font-bold text-terracotta text-xl leading-none">Snakzee</p>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-9 h-9 flex items-center justify-center text-brown hover:bg-cream rounded-lg transition-colors">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}>
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              className="w-64 h-full bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-5 border-b border-terracotta/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-terracotta" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-sans font-semibold text-brown text-sm truncate">{user.name}</p>
                    <p className="text-brown-light/40 text-[10px] font-sans truncate">{user.email}</p>
                  </div>
                </div>
              </div>
              <nav className="p-4 space-y-1">
                {NAV.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-medium transition-colors ${
                      pathname === item.href ? "bg-terracotta/10 text-terracotta" : "text-brown-light/60 hover:text-brown hover:bg-cream"
                    }`}>
                    {item.icon} {item.label}
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-terracotta/10">
                <button onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-medium text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors w-full">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-terracotta/10 flex-col fixed h-full z-30 hidden md:flex">
        <div className="p-5 border-b border-terracotta/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 relative flex-shrink-0">
              <Image src="/snakzee-logo.png" alt="Snakzee" fill sizes="36px" className="object-contain" />
            </div>
            <div>
              <p className="font-serif font-bold text-brown text-sm">Snakzee</p>
              <p className="text-brown-light/40 text-[10px] font-sans">My Account</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-terracotta/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-terracotta" />
            </div>
            <div className="min-w-0">
              <p className="font-sans font-semibold text-brown text-sm truncate">{user.name}</p>
              <p className="text-brown-light/40 text-[10px] font-sans truncate">{user.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-medium transition-colors ${
                pathname === item.href ? "bg-terracotta/10 text-terracotta" : "text-brown-light/60 hover:text-brown hover:bg-cream"
              }`}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-terracotta/10">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-medium text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors w-full">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 sm:p-6 pt-20 md:pt-8 pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-terracotta/10 px-2 py-2 safe-area-bottom">
        <div className="flex items-center justify-around">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                pathname === item.href ? "text-terracotta" : "text-brown-light/50"
              }`}>
              {item.icon}
              <span className="text-[10px] font-sans font-medium">{item.label.split(" ")[0]}</span>
            </Link>
          ))}
          <button onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-[10px] font-sans font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
