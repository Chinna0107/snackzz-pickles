"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, LayoutDashboard, Mail, Phone, Save, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CustomerUser = {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
};

export default function CustomerProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const token = localStorage.getItem("snackzee_token");
    const stored = localStorage.getItem("snackzee_user");

    if (!token || !stored) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored) as CustomerUser;
      setUser(parsed);
      setForm({
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
      });
    } catch {
      router.push("/login");
    }
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...user, ...form };
    localStorage.setItem("snackzee_user", JSON.stringify(updated));
    setUser(updated);
    window.dispatchEvent(new Event("storage"));
    toast({ title: "Profile updated" });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
      </div>
    );
  }

  const initials = (form.name || form.email || "S").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-terracotta text-xs font-sans font-bold uppercase tracking-widest mb-2">Customer Account</p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brown">My Profile</h1>
              <p className="text-brown-light/60 font-sans text-sm mt-1">Manage your personal details and jump back to your dashboard.</p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white px-5 py-3 rounded-full font-bold font-sans text-sm transition-all hover:scale-[1.02] shadow-lg shadow-terracotta/20"
            >
              <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
            </Link>
          </div>

          <div className="grid lg:grid-cols-[320px_1fr] gap-5">
            <aside className="bg-white rounded-2xl border border-terracotta/10 p-6 h-fit">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-terracotta text-white flex items-center justify-center text-4xl font-serif font-bold shadow-lg shadow-terracotta/20">
                  {initials}
                </div>
                <h2 className="font-serif text-2xl font-bold text-brown mt-4">{form.name || "Snakzee Customer"}</h2>
                <p className="text-brown-light/50 text-sm font-sans break-all">{form.email}</p>
              </div>

              <div className="mt-6 space-y-3">
                <Link href="/orders" className="flex items-center justify-between rounded-xl bg-cream px-4 py-3 text-brown font-sans text-sm font-semibold hover:bg-terracotta/5 transition-colors">
                  <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-terracotta" /> My Orders</span>
                  <ArrowRight className="w-4 h-4 text-brown-light/40" />
                </Link>
                <Link href="/dashboard" className="flex items-center justify-between rounded-xl bg-cream px-4 py-3 text-brown font-sans text-sm font-semibold hover:bg-terracotta/5 transition-colors">
                  <span className="flex items-center gap-2"><LayoutDashboard className="w-4 h-4 text-terracotta" /> Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-brown-light/40" />
                </Link>
              </div>
            </aside>

            <section className="bg-white rounded-2xl border border-terracotta/10 p-5 sm:p-6">
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold text-brown">Account Details</h2>
                <p className="text-brown-light/50 text-sm font-sans mt-1">These details are used for checkout and order updates.</p>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-brown text-sm font-sans font-medium block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-brown-light/35 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-sans focus:outline-none focus:border-terracotta/40"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-brown text-sm font-sans font-medium block mb-1">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-brown-light/35 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-sans focus:outline-none focus:border-terracotta/40"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-brown text-sm font-sans font-medium block mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-brown-light/35 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        value={form.phone}
                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-sans focus:outline-none focus:border-terracotta/40"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white px-6 py-3 rounded-full font-bold font-sans text-sm transition-all"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 border border-terracotta/20 text-terracotta hover:bg-terracotta/5 px-6 py-3 rounded-full font-bold font-sans text-sm transition-colors"
                  >
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
