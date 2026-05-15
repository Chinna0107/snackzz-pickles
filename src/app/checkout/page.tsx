"use client";

import Footer from "@/components/Footer";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Tag, MapPin, CreditCard, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: { razorpay_payment_id: string }) => void;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
}

const COUPONS: Record<string, number> = {
  SNACKZEE10: 10,
  WELCOME15: 15,
  FESTIVE20: 20,
};

const STEPS = [
  { id: 1, label: "Review", icon: <Package className="w-4 h-4" /> },
  { id: 2, label: "Address & Coupon", icon: <MapPin className="w-4 h-4" /> },
  { id: 3, label: "Payment", icon: <CreditCard className="w-4 h-4" /> },
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  // Step 2 state
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; pct: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [address, setAddress] = useState({
    name: "", email: "", phone: "", line1: "", line2: "", city: "", state: "Telangana", customState: "", pincode: "",
  });

  const discount = appliedCoupon ? Math.round((total * appliedCoupon.pct) / 100) : 0;
  const afterDiscount = total - discount;
  const grandTotal = afterDiscount;

  const applyCoupon = () => {
    const pct = COUPONS[coupon.toUpperCase()];
    if (pct) { setAppliedCoupon({ code: coupon.toUpperCase(), pct }); setCouponError(""); }
    else { setCouponError("Invalid coupon code"); setAppliedCoupon(null); }
  };

  const isAddressValid = address.name && address.email && address.phone && address.line1 && address.city && address.pincode && (address.state !== "Other" || address.customState);

  const loadRazorpay = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast({ title: "Payment Error", description: "Could not load payment gateway.", variant: "destructive" });
      return;
    }

    const token = localStorage.getItem("snackzee_token");
    let orderId: string | undefined;

    try {
      const res = await fetch(`${BACKEND_URL}/orders/razorpay`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ amount: grandTotal }),
      });
      const data = await res.json();
      orderId = data.id;
    } catch {
      // Proceed without backend order_id (test mode)
    }

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_XXXXXXXXXXXXXXXX",
      amount: grandTotal * 100,
      currency: "INR",
      name: "Snakzee",
      description: "Authentic Telangana Snacks",
      order_id: orderId,
      handler: async (response) => {
        // Save order to backend
        try {
          await fetch(`${BACKEND_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify({
              items: items.map((i) => ({ productId: i.product.id, name: i.product.nameEnglish, qty: i.quantity, price: i.product.price })),
              address: { ...address, state: address.state === "Other" ? address.customState : address.state },
              coupon: appliedCoupon?.code,
              discount,
              deliveryFee: 0,
              total: grandTotal,
              paymentId: response.razorpay_payment_id,
              status: "paid",
            }),
          });
        } catch {}

        clearCart();
        toast({ title: "Order Placed! 🎉", description: `Payment ID: ${response.razorpay_payment_id}` });
        router.push("/dashboard/orders");
      },
      prefill: { name: address.name, email: address.email, contact: address.phone },
      theme: { color: "#C8401A" },
    };

    new window.Razorpay(options).open();
  };

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-serif text-3xl font-bold text-brown mb-8 text-center">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans font-semibold transition-all ${
                step === s.id ? "bg-terracotta text-white shadow-lg" :
                step > s.id ? "bg-green-100 text-green-700" : "bg-white text-brown-light/50 border border-terracotta/10"
              }`}>
                {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className={`w-5 h-5 mx-1 ${step > s.id ? "text-green-400" : "text-brown-light/20"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Step 1: Review Products ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="bg-white rounded-2xl border border-terracotta/10 p-6 mb-6">
                <h2 className="font-serif text-xl font-bold text-brown mb-4">Review Your Order</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 py-3 border-b border-terracotta/5 last:border-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative bg-cream-dark">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="flex-1">
                        <p className="font-serif font-bold text-brown">{item.product.name}</p>
                        <p className="text-brown-light/50 text-xs font-sans">{item.product.nameEnglish} · {item.product.priceUnit}</p>
                        <p className="text-brown-light/60 text-xs font-sans">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-serif font-bold text-gold text-lg">₹{item.product.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-terracotta/10 flex justify-between font-bold text-brown">
                  <span className="font-sans">Subtotal</span>
                  <span className="font-serif text-xl text-gold">₹{total}</span>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-terracotta hover:bg-terracotta-dark text-white py-4 rounded-full font-bold font-sans text-base transition-all hover:scale-[1.02] shadow-lg shadow-terracotta/20">
                Continue to Address →
              </button>
            </motion.div>
          )}

          {/* ── Step 2: Coupon + Address ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
              {/* Coupon */}
              <div className="bg-white rounded-2xl border border-terracotta/10 p-6">
                <h2 className="font-serif text-xl font-bold text-brown mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-terracotta" /> Coupon Code
                </h2>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <span className="text-green-700 font-bold font-sans">{appliedCoupon.code} — {appliedCoupon.pct}% OFF (−₹{discount})</span>
                    <button onClick={() => setAppliedCoupon(null)} className="text-green-500 hover:text-green-700 text-sm font-sans">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={coupon} onChange={(e) => { setCoupon(e.target.value); setCouponError(""); }}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown font-sans focus:outline-none focus:border-terracotta/30" />
                    <button onClick={applyCoupon} className="bg-terracotta text-white px-5 py-3 rounded-xl font-bold font-sans hover:bg-terracotta-dark transition-colors">Apply</button>
                  </div>
                )}
                {couponError && <p className="text-red-500 text-xs font-sans mt-1">{couponError}</p>}
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl border border-terracotta/10 p-6">
                <h2 className="font-serif text-xl font-bold text-brown mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-terracotta" /> Delivery Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Full Name", placeholder: "Your full name", col: 1 },
                    { key: "email", label: "Email Address", placeholder: "you@example.com", col: 1 },
                    { key: "phone", label: "Phone Number", placeholder: "+91 XXXXX XXXXX", col: 1 },
                    { key: "line1", label: "Address Line 1", placeholder: "House/Flat No, Street", col: 2 },
                    { key: "line2", label: "Address Line 2 (optional)", placeholder: "Landmark, Area", col: 2 },
                    { key: "city", label: "City", placeholder: "Hyderabad", col: 1 },
                    { key: "pincode", label: "Pincode", placeholder: "500001", col: 1 },
                  ].map((field) => (
                    <div key={field.key} className={field.col === 2 ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-semibold text-brown-light/60 font-sans mb-1">{field.label}</label>
                      <input
                        value={address[field.key as keyof typeof address]}
                        onChange={(e) => setAddress((p) => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-brown-light/60 font-sans mb-1">State</label>
                    <select value={address.state} onChange={(e) => setAddress((p) => ({ ...p, state: e.target.value, customState: "" }))}
                      className="w-full px-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none">
                      {["Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu", "Maharashtra", "Other"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {address.state === "Other" && (
                    <div>
                      <label className="block text-xs font-semibold text-brown-light/60 font-sans mb-1">Enter Your State</label>
                      <input
                        value={address.customState}
                        onChange={(e) => setAddress((p) => ({ ...p, customState: e.target.value }))}
                        placeholder="Your state"
                        className="w-full px-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-terracotta/20 text-terracotta py-4 rounded-full font-bold font-sans hover:bg-terracotta/5 transition-colors">
                  ← Back
                </button>
                <button onClick={() => setStep(3)} disabled={!isAddressValid}
                  className="flex-[2] bg-terracotta hover:bg-terracotta-dark disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-full font-bold font-sans transition-all hover:scale-[1.02] shadow-lg shadow-terracotta/20">
                  Continue to Payment →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Payment ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl border border-terracotta/10 p-6">
                <h2 className="font-serif text-xl font-bold text-brown mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm font-sans">
                  <div className="flex justify-between text-brown-light/70"><span>Subtotal</span><span>₹{total}</span></div>
                  {discount > 0 && <div className="flex justify-between text-green-600"><span>Coupon ({appliedCoupon?.code})</span><span>−₹{discount}</span></div>}
                  <div className="flex justify-between text-brown-light/70"><span>Delivery</span><span><span className="text-green-600">FREE</span></span></div>
                  <div className="border-t border-terracotta/10 pt-2 flex justify-between font-bold text-brown text-base">
                    <span>Grand Total</span><span className="text-gold font-serif text-2xl">₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address Summary */}
              <div className="bg-white rounded-2xl border border-terracotta/10 p-6">
                <h2 className="font-serif text-lg font-bold text-brown mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-terracotta" /> Delivering to
                </h2>
                <p className="font-sans text-brown font-semibold">{address.name} · {address.phone}</p>
                <p className="font-sans text-brown-light/40 text-xs">{address.email}</p>
                <p className="font-sans text-brown-light/60 text-sm">{address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state === "Other" ? address.customState : address.state} — {address.pincode}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-terracotta/20 text-terracotta py-4 rounded-full font-bold font-sans hover:bg-terracotta/5 transition-colors">
                  ← Back
                </button>
                <button onClick={handlePayment}
                  className="flex-[2] bg-terracotta hover:bg-terracotta-dark text-white py-4 rounded-full font-bold font-sans text-base transition-all hover:scale-[1.02] shadow-lg shadow-terracotta/20 flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" /> Pay ₹{grandTotal} via Razorpay
                </button>
              </div>
              <p className="text-center text-brown-light/40 text-xs font-sans">Secured by Razorpay · UPI · Cards · NetBanking</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
