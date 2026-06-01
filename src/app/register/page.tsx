"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, Phone, ShieldCheck, Edit2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  // OTP states
  const [otp, setOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const loginBtnRef = useRef<HTMLDivElement>(null);
  const googleInitialized = useRef(false);

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
      toast({ title: "Welcome! 🎉", description: `Signed up via Google as ${data.user.email || data.user.phone}` });
      router.push(data.user.role === "admin" ? "/admin" : "/");
    } catch {
      toast({ title: "Network error", description: "Google Sign-In failed.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const renderGoogleButton = useCallback((container: HTMLDivElement | null) => {
    if (!container || !googleInitialized.current) return;
    container.innerHTML = '';
    if (typeof window !== "undefined" && (window as any).google) {
      (window as any).google.accounts.id.renderButton(
        container,
        { theme: "outline", size: "large", width: "100%", text: "signup_with" }
      );
    }
  }, []);

  // Initialize Google Sign-In
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initGoogle = () => {
      if ((window as any).google && !googleInitialized.current) {
        (window as any).google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "your-google-client-id.apps.googleusercontent.com",
          callback: handleGoogleLoginSuccess,
        });
        googleInitialized.current = true;
        renderGoogleButton(loginBtnRef.current);
      }
    };

    if ((window as any).google) {
      initGoogle();
    } else {
      const existingScript = document.getElementById("google-gsi-client");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-gsi-client";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initGoogle;
        document.body.appendChild(script);
      }
    }
  }, [renderGoogleButton]);

  // Re-render buttons when step changes
  useEffect(() => {
    if (googleInitialized.current) {
      setTimeout(() => {
        renderGoogleButton(loginBtnRef.current);
      }, 100);
    }
  }, [registerStep, renderGoogleButton]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSendOtp = async () => {
    if (!form.phone) {
      toast({ title: "Phone required", description: "Please enter your phone number to receive an OTP.", variant: "destructive" });
      return;
    }

    setOtpSending(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: form.email || undefined, 
          phone: form.phone,
          type: "register"
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: "Verification Error", description: data.error, variant: "destructive" });
        return;
      }

      toast({
        title: "OTP Sent! 📧",
        description: "Please check your phone for the 6-digit OTP code.",
      });

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

    const body = { 
      name: form.name, 
      email: form.email || undefined, 
      phone: form.phone, 
      password: form.password,
      otp 
    };

    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
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
        title: "Account created! 🎉",
        description: `Logged in as ${data.user.email || data.user.phone}`,
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
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-terracotta/10 overflow-hidden animate-fade-in"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-terracotta to-terracotta-dark px-8 py-8 text-center">
          <div className="relative h-14 w-[180px] mx-auto mb-2 cursor-pointer" onClick={() => router.push("/")}>
            <Image src="/logo-removebg-preview.png" alt="Snakzee" fill className="object-contain" sizes="180px" priority />
          </div>
          <p className="text-cream/70 text-xs font-sans mt-2 tracking-wider uppercase">
            Art of Authentic Snacking
          </p>
        </div>

        {/* Back to Sign In Link */}
        <div className="px-8 py-4 bg-cream/50 border-b border-terracotta/10">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 text-sm text-terracotta font-semibold hover:text-terracotta-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Already have an account? Sign In
          </button>
        </div>

        {/* Form Container */}
        <div className="px-8 py-7">
          <AnimatePresence mode="wait">
            {registerStep === 1 ? (
              // ─── STEP 1: PHONE & EMAIL ───
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <h2 className="font-serif text-2xl font-bold text-brown mb-2">Create Account</h2>
                  <p className="text-xs text-brown-light/70 font-sans leading-relaxed">
                    Enter your phone number to receive a 6-digit OTP verification code. Email is optional.
                  </p>
                </div>
                
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="Phone number (10 digits)"
                    value={form.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    title="Enter a valid 10-digit phone number"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-sans placeholder:text-brown-light/40 focus:outline-none focus:border-terracotta/40"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email address (optional)"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-sans placeholder:text-brown-light/40 focus:outline-none focus:border-terracotta/40"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={otpSending}
                  className="w-full bg-terracotta hover:bg-terracotta-dark text-white py-3 rounded-xl font-bold font-sans text-sm transition-all hover:scale-[1.02] shadow-lg shadow-terracotta/20 flex items-center justify-center gap-2"
                >
                  {otpSending ? "Sending OTP..." : <><Mail className="w-4 h-4" /> Send OTP Code</>}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-terracotta/10" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-brown-light/40 font-sans">Or continue with</span></div>
                </div>
                <div ref={loginBtnRef} className="w-full min-h-[40px] flex justify-center" />
              </motion.form>
            ) : (
              // ─── STEP 2: VERIFY OTP + FULL DETAILS ───
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <h2 className="font-serif text-2xl font-bold text-brown mb-2">Complete Registration</h2>
                </div>

                {/* Display active phone with back/edit option */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-cream border border-terracotta/10 text-xs font-sans text-brown">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 truncate">
                      <Phone className="w-3.5 h-3.5 text-terracotta flex-shrink-0" />
                      <span className="font-semibold">{form.phone}</span>
                    </div>
                    {form.email && (
                      <div className="flex items-center gap-2 truncate text-brown-light/60">
                        <Mail className="w-3 h-3 text-terracotta/60 flex-shrink-0" />
                        <span>{form.email}</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setRegisterStep(1); setOtp(""); }}
                    className="flex items-center gap-1 text-terracotta hover:text-terracotta-dark hover:underline font-semibold flex-shrink-0 ml-2"
                  >
                    <Edit2 className="w-3 h-3" /> Change
                  </button>
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
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}