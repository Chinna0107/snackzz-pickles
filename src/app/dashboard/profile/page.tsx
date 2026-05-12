"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    const stored = localStorage.getItem("snackzee_user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setForm({ name: u.name, email: u.email });
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...user, ...form };
    localStorage.setItem("snackzee_user", JSON.stringify(updated));
    setUser(updated as typeof user);
    toast({ title: "Profile updated!" });
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-brown mb-8">My Profile</h1>
      <div className="bg-white rounded-2xl border border-terracotta/10 p-6 max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-terracotta" />
          </div>
          <div>
            <p className="font-serif font-bold text-brown text-lg">{user?.name}</p>
            <p className="text-brown-light/50 text-sm font-sans">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-brown text-sm font-sans font-medium block mb-1">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-sans focus:outline-none focus:border-terracotta/40"
            />
          </div>
          <div>
            <label className="text-brown text-sm font-sans font-medium block mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-sans focus:outline-none focus:border-terracotta/40"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-terracotta hover:bg-terracotta-dark text-white py-3 rounded-xl font-bold font-sans text-sm transition-all"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
