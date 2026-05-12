"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
    const body =
      mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
        return;
      }

      localStorage.setItem("snackzee_token", data.token);
      localStorage.setItem("snackzee_user", JSON.stringify(data.user));

      toast({
        title: mode === "login" ? "Welcome back! 🎉" : "Account created! 🎉",
        description: `Logged in as ${data.user.email}`,
      });

      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      toast({ title: "Network error", description: "Could not reach the server.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-terracotta/10 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-terracotta to-terracotta-dark px-8 py-8 text-center">
          <div className="w-14 h-14 mx-auto mb-3 relative">
            <Image src="/snakzee-logo.png" alt="Snakzee" fill sizes="56px" className="object-contain" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-cream">Snakzee</h1>
          <p className="text-cream/70 text-xs font-sans mt-1 tracking-wider uppercase">
            Art of Authentic Snacking
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-terracotta/10">
          {(["login", "register"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMode(tab)}
              className={`flex-1 py-3 text-sm font-semibold font-sans capitalize transition-colors ${
                mode === tab
                  ? "text-terracotta border-b-2 border-terracotta"
                  : "text-brown-light/50 hover:text-brown"
              }`}
            >
              {tab === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">
          {mode === "register" && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-light/40">
                <LogIn className="w-4 h-4" />
              </span>
              <input
                name="name"
                type="text"
                required
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-sans placeholder:text-brown-light/40 focus:outline-none focus:border-terracotta/40"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-sans placeholder:text-brown-light/40 focus:outline-none focus:border-terracotta/40"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-sans placeholder:text-brown-light/40 focus:outline-none focus:border-terracotta/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light/40 hover:text-brown-light transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-terracotta hover:bg-terracotta-dark text-white py-3 rounded-xl font-bold font-sans text-sm transition-all hover:scale-[1.02] shadow-lg shadow-terracotta/20"
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </Button>

          <p className="text-center text-brown-light/50 text-xs font-sans">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-terracotta font-semibold hover:underline"
            >
              {mode === "login" ? "Register" : "Sign In"}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
