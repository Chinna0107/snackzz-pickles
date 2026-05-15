"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, ShoppingBag, Package, BarChart3, LogOut, Shield, Users, Menu, X, ImageIcon } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/admin/orders", label: "Orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { href: "/admin/customers", label: "Customers", icon: <Users className="w-4 h-4" /> },
  { href: "/admin/products", label: "Products", icon: <Package className="w-4 h-4" /> },
  { href: "/admin/banners", label: "Banners", icon: <ImageIcon className="w-4 h-4" /> },
  { href: "/admin/reports", label: "Reports", icon: <BarChart3 className="w-4 h-4" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("snackzee_token");
    if (!token) { router.push("/login"); return; }
    fetch(`${BACKEND_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (!d.user || d.user.role !== "admin") { router.push("/"); return; }
        setAdmin(d.user);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("snackzee_token");
    localStorage.removeItem("snackzee_user");
    router.push("/login");
  };

  if (!admin) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-terracotta/10 px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 relative">
            <Image src="/snakzee-logo.png" alt="Snakzee" fill sizes="32px" className="object-contain" />
          </div>
          <span className="font-serif font-bold text-brown">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-brown">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-terracotta/10 flex flex-col fixed h-full z-50 transition-transform ${
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="p-5 border-b border-terracotta/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 relative flex-shrink-0">
              <Image src="/snakzee-logo.png" alt="Snakzee" fill sizes="36px" className="object-contain" />
            </div>
            <div>
              <p className="font-serif font-bold text-brown text-sm">Snakzee Admin</p>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-terracotta" />
                <p className="text-terracotta text-[10px] font-sans font-semibold">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-terracotta/10">
          <p className="font-sans font-semibold text-brown text-sm truncate">{admin.name}</p>
          <p className="text-brown-light/40 text-[10px] font-sans truncate">{admin.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
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

      <main className="flex-1 md:ml-64 p-6 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  );
}
