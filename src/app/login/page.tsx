"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, Phone, ShieldCheck, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  // 2-step OTP registration states
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleGoogleLoginSuccess = async (response: any) => {
    const idToken = response.credential;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Google Sign-In Error", description: data.error, variant: "destructive" });
        return;
      }
      localStorage.setItem("snackzee_token", data.token);
      localStorage.setItem("snackzee_user", JSON.stringify(data.user));
      toast({ title: "Welcome back! 🎉", description: `Logged in via Google as ${data.user.email}` });
      router.push(data.user.role === "admin" ? "/admin" : "/");
    } catch {
      toast({ title: "Network error", description: "Google Sign-In failed.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initGoogle = () => {
      if (typeof window !== "undefined" && (window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "your-google-client-id.apps.googleusercontent.com",
          callback: handleGoogleLoginSuccess,
        });
        const btnContainer = document.getElementById("google-signin-btn");
        if (btnContainer) {
          (window as any).google.accounts.id.renderButton(
            btnContainer,
            { theme: "outline", size: "large", width: "100%" }
          );
        }
      }
    };

    if (document.getElementById("google-gsi-client")) {
      initGoogle();
    } else {
      const script = document.createElement("script");
      script.id = "google-gsi-client";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    }
  }, [mode]);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.phone) {
      toast({ title: "Fields required", description: "Please enter your email and phone to receive an OTP.", variant: "destructive" });
      return;
    }

    setOtpSending(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, phone: form.phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: "Verification Error", description: data.error, variant: "destructive" });
        return;
      }

      toast({
        title: "OTP Sent! 📧",
        description: "Please check your inbox (and spam folder) for the 6-digit OTP code.",
      });

      // Local development ease helper
      if (data.otp) {
        console.log("Dev Mode OTP:", data.otp);
        toast({
          title: "Development Helper",
          description: `Your dev OTP is ${data.otp} (also logged to console)`,
        });
      }

      setRegisterStep(2);
      setCountdown(60);
    } catch {
      toast({ title: "Network error", description: "Could not send OTP to the server.", variant: "destructive" });
    } finally {
      setOtpSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
    const body =
      mode === "login"
        ? { email: form.email, password: form.password }
        : { 
            name: form.name, 
            email: form.email, 
            phone: form.phone, 
            password: form.password,
            otp: otp 
          };

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

      router.push(data.user.role === "admin" ? "/admin" : "/");
    } catch {
      toast({ title: "Network error", description: "Could not reach the server.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-terracotta/10 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-terracotta to-terracotta-dark px-8 py-8 text-center">
          <div className="relative h-14 w-[180px] mx-auto mb-2">
            <Image src="/logo-removebg-preview.png" alt="Snakzee" fill className="object-contain" sizes="180px" priority />
          </div>
          <p className="text-cream/70 text-xs font-sans mt-2 tracking-wider uppercase">
            Art of Authentic Snacking
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-terracotta/10">
          {(["login", "register"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setMode(tab);
                setRegisterStep(1);
                setOtp("");
              }}
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

        {/* Form Container */}
        <div className="px-8 py-7">
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              // ─── LOGIN FORM ──────────────────────────────────────────
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
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
                    placeholder="Password"
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
                  {loading ? "Please wait..." : "Sign In"}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-terracotta/10" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-brown-light/40 font-sans">Or continue with</span></div>
                </div>
                <div id="google-signin-btn" className="w-full min-h-[40px] flex justify-center" />

                <p className="text-center text-brown-light/50 text-xs font-sans mt-4">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setRegisterStep(1);
                    }}
                    className="text-terracotta font-semibold hover:underline"
                  >
                    Register
                  </button>
                </p>
              </motion.form>
            ) : (
              // ─── REGISTER FORM (2-STEP) ────────────────────────────────
              <motion.div
                key="register-flow"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {registerStep === 1 ? (
                  // ─── STEP 1: REQUEST OTP ───
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <p className="text-xs text-brown-light/70 font-sans text-center mb-2">
                      Enter your email and phone number to receive a 6-digit OTP code to verify your identity.
                    </p>
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
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
                      <input
                        name="phone"
                        type="tel"
                        required
                        placeholder="Phone number (e.g. 9876543210)"
                        value={form.phone}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        title="Enter a valid 10-digit phone number"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-sans placeholder:text-brown-light/40 focus:outline-none focus:border-terracotta/40"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={otpSending}
                      className="w-full bg-terracotta hover:bg-terracotta-dark text-white py-3 rounded-xl font-bold font-sans text-sm transition-all hover:scale-[1.02] shadow-lg shadow-terracotta/20 flex items-center justify-center gap-2"
                    >
                      {otpSending ? (
                        "Sending OTP..."
                      ) : (
                        <>
                          <Mail className="w-4 h-4" /> Send OTP Code
                        </>
                      )}
                    </Button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-terracotta/10" /></div>
                      <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-brown-light/40 font-sans">Or continue with</span></div>
                    </div>
                    <div id="google-signin-btn" className="w-full min-h-[40px] flex justify-center" />
                  </form>
                ) : (
                  // ─── STEP 2: VERIFY OTP + REMAINING DETAILS ───
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Display active email with edit/back option */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-cream border border-terracotta/10 text-xs font-sans text-brown">
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-terracotta flex-shrink-0" />
                        <span className="font-medium truncate">{form.email}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setRegisterStep(1);
                          setOtp("");
                        }}
                        className="flex items-center gap-1 text-terracotta hover:text-terracotta-dark hover:underline font-semibold flex-shrink-0 ml-2"
                      >
                        <Edit2 className="w-3 h-3" /> Change
                      </button>
                    </div>

                    {/* Display active phone with edit/back option */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-cream border border-terracotta/10 text-xs font-sans text-brown">
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="w-3.5 h-3.5 text-terracotta flex-shrink-0" />
                        <span className="font-medium truncate">{form.phone}</span>
                      </div>
                    </div>

                    {/* OTP input */}
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
                      <input
                        name="otp"
                        type="text"
                        required
                        maxLength={6}
                        placeholder="6-Digit OTP Code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream border border-terracotta/20 text-brown text-sm font-sans placeholder:text-brown-light/40 focus:outline-none focus:border-terracotta/40 tracking-wider font-semibold"
                      />
                    </div>

                    {/* Full Name */}
                    <div className="relative">
                      <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
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

                    {/* Password */}
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
                      {loading ? "Please wait..." : "Verify & Create Account"}
                    </Button>

                    {/* Resend OTP button or timer */}
                    <div className="text-center mt-3">
                      {countdown > 0 ? (
                        <p className="text-xs font-sans text-brown-light/50">
                          Resend OTP in <span className="font-semibold text-terracotta">{countdown}s</span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpSending}
                          className="text-xs font-sans text-terracotta font-semibold hover:underline hover:text-terracotta-dark transition-colors"
                        >
                          Resend OTP Code
                        </button>
                      )}
                    </div>
                  </form>
                )}

                <p className="text-center text-brown-light/50 text-xs font-sans mt-4">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setRegisterStep(1);
                    }}
                    className="text-terracotta font-semibold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
