"use client";

import Footer from "@/components/Footer";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getCartItemKey, useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronDown, ChevronRight, Mail, MapPin, Phone, CreditCard, Package, Gift, Zap, Star, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LOYALTY_TIERS, type LoyaltyTier, type LoyaltyTierName } from "@/lib/loyalty";

import OrderSuccessModal from "@/components/OrderSuccessModal";

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

type LoyaltyTierResponse = LoyaltyTier & {
  orderCount: number;
  nextTier: LoyaltyTier | null;
  ordersToNextTier: number;
  tiers?: LoyaltyTier[];
};

const TIER_COLORS: Record<LoyaltyTierName, { bg: string; text: string; border: string; badge: string; icon: ReactNode }> = {
  Bronze:   { bg: 'bg-orange-50',  text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', icon: <Star className="w-4 h-4" /> },
  Silver:   { bg: 'bg-slate-50',   text: 'text-slate-700',  border: 'border-slate-200',  badge: 'bg-slate-100 text-slate-700', icon: <Zap className="w-4 h-4" /> },
  Gold:     { bg: 'bg-yellow-50',  text: 'text-yellow-700', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', icon: <Gift className="w-4 h-4" /> },
  Platinum: { bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', icon: <Crown className="w-4 h-4" /> },
};

const STEPS = [
  { id: 1, label: "Review", icon: <Package className="w-4 h-4" /> },
  { id: 2, label: "Address & Rewards", icon: <MapPin className="w-4 h-4" /> },
  { id: 3, label: "Payment", icon: <CreditCard className="w-4 h-4" /> },
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  // Step 2 state
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; pct?: number; discountAmount?: number; type?: 'percentage' | 'fixed' } | null>(null);
  const [customCouponCode, setCustomCouponCode] = useState("");
  const [couponValidating, setCouponValidating] = useState(false);
  const [loyaltyTier, setLoyaltyTier] = useState<LoyaltyTierResponse | null>(null);
  const [loyaltyTiers, setLoyaltyTiers] = useState<LoyaltyTier[]>(LOYALTY_TIERS);
  const [loyaltyLoading, setLoyaltyLoading] = useState(false);
  const [couponsOpen, setCouponsOpen] = useState(false);
  const [address, setAddress] = useState({
    name: "", email: "", phone: "", line1: "", line2: "", city: "", state: "Telangana", customState: "", pincode: "",
  });

  // Load saved address from localStorage on mount, then try backend for logged-in users
  useEffect(() => {
    // 1. Pre-fill from localStorage user profile
    try {
      const stored = localStorage.getItem("snackzee_user");
      if (stored) {
        const user = JSON.parse(stored) as { name?: string; email?: string; phone?: string };
        setAddress((prev) => ({
          ...prev,
          name: prev.name || user.name || "",
          email: prev.email || user.email || "",
          phone: prev.phone || user.phone || "",
        }));
      }
    } catch {}

    // 2. Load saved delivery address from localStorage
    try {
      const savedAddr = localStorage.getItem("snackzee_address");
      if (savedAddr) {
        const addr = JSON.parse(savedAddr);
        setAddress((prev) => ({ ...prev, ...addr }));
      }
    } catch {}

    // 3. If logged in, fetch last order address from backend and override
    const token = localStorage.getItem("snackzee_token");
    if (!token) return;
    fetch(`${BACKEND_URL}/orders/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const orders = data.orders || [];
        if (orders.length === 0) return;
        const lastAddr = orders[0].address;
        if (!lastAddr) return;
        setAddress((prev) => ({
          name: lastAddr.name || prev.name || "",
          email: lastAddr.email || prev.email || "",
          phone: lastAddr.phone || prev.phone || "",
          line1: lastAddr.line1 || prev.line1 || "",
          line2: lastAddr.line2 || prev.line2 || "",
          city: lastAddr.city || prev.city || "",
          state: lastAddr.state || prev.state || "Telangana",
          customState: prev.customState || "",
          pincode: lastAddr.pincode || prev.pincode || "",
        }));
      })
      .catch(() => {});
  }, []);

  // Fetch loyalty tier when email or phone is filled
  useEffect(() => {
    const email = address.email.trim();
    const phone = address.phone;
    if (!email && phone.length < 10) {
      setLoyaltyTier(null);
      setAppliedCoupon(null);
      return;
    }
    const timer = setTimeout(async () => {
      setLoyaltyLoading(true);
      try {
        const loyaltyUrl = process.env.NEXT_PUBLIC_BACKEND_URL ? `${BACKEND_URL}/orders/loyalty-coupon` : "/api/orders/loyalty-coupon";
        const res = await fetch(loyaltyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email || undefined, phone: phone.length === 10 ? phone : undefined }),
        });
        const data = await res.json();
        if (data.tiers) {
          setLoyaltyTiers(data.tiers.map((tier: LoyaltyTier) => ({
            ...LOYALTY_TIERS.find((localTier) => localTier.tier === tier.tier),
            ...tier,
            perks: tier.perks || LOYALTY_TIERS.find((localTier) => localTier.tier === tier.tier)?.perks || [],
          })));
        }
        if (data.tier) {
          setLoyaltyTier(data);
          setCouponsOpen(true);
        }
      } catch {}
      finally { setLoyaltyLoading(false); }
    }, 800);
    return () => clearTimeout(timer);
  }, [address.email, address.phone]);

  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [isLoadingDeliveryFee, setIsLoadingDeliveryFee] = useState(false);

  const handleApplyCustomCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCouponCode.trim()) return;

    setCouponValidating(true);
    try {
      const res = await fetch(`${BACKEND_URL}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: customCouponCode.trim().toUpperCase(),
          items: items.map(i => ({
            id: i.product.id,
            productId: i.product.id,
            quantity: i.quantity,
            price: i.product.price,
            quantityPriceSelected: i.product.priceUnit
          }))
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: "Coupon Error", description: data.error || "Invalid coupon", variant: "destructive" });
        return;
      }

      setAppliedCoupon({
        code: data.code,
        discountAmount: data.discount,
        type: data.discount_type
      });

      toast({
        title: "Coupon Applied! 🎟️",
        description: `Successfully applied code ${data.code} for ₹${data.discount} discount.`
      });
    } catch {
      toast({ title: "Network error", description: "Failed to validate coupon.", variant: "destructive" });
    } finally {
      setCouponValidating(false);
    }
  };

  const discount = appliedCoupon
    ? (appliedCoupon.discountAmount !== undefined
        ? appliedCoupon.discountAmount
        : Math.round((total * (appliedCoupon.pct || 0)) / 100)
      )
    : 0;
  const afterDiscount = total - discount;
  const grandTotal = afterDiscount + (deliveryFee || 0);
  const activeTierDetails = loyaltyTier
    ? {
        ...loyaltyTiers.find((tier) => tier.tier === loyaltyTier.tier),
        ...loyaltyTier,
        perks: loyaltyTier.perks || loyaltyTiers.find((tier) => tier.tier === loyaltyTier.tier)?.perks || [],
        range: loyaltyTier.range || loyaltyTiers.find((tier) => tier.tier === loyaltyTier.tier)?.range || "",
        code: loyaltyTier.code || loyaltyTiers.find((tier) => tier.tier === loyaltyTier.tier)?.code || "",
        pct: loyaltyTier.pct || loyaltyTiers.find((tier) => tier.tier === loyaltyTier.tier)?.pct || 0,
      }
    : null;

  useEffect(() => {
    if (address.pincode.length === 6) {
      setIsLoadingDeliveryFee(true);
      fetch(`${BACKEND_URL}/orders/shipping-fee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode: address.pincode, weight: 500, orderTotal: afterDiscount }),
      })
        .then((r) => r.json())
        .then((data) => setDeliveryFee(data.fee !== undefined ? data.fee : 60))
        .catch(() => setDeliveryFee(60))
        .finally(() => setIsLoadingDeliveryFee(false));
    } else {
      setDeliveryFee(null);
    }
  }, [address.pincode, afterDiscount]);

  const isAddressValid = 
    address.name.trim().length >= 2 &&
    address.email.trim().includes('@') &&
    address.phone.length === 10 &&
    address.line1.trim().length >= 3 &&
    address.city.trim().length >= 2 &&
    address.pincode.replace(/\D/g, '').length === 6 &&
    (address.state !== "Other" || address.customState.trim().length >= 2);

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
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_SpgbM9FMP5O1mK",
      amount: grandTotal * 100,
      currency: "INR",
      name: "Snakzee",
      description: "Authentic Telangana Snacks",
      order_id: orderId,
      handler: async (response) => {
        // Save order to backend
        let savedOrderId: number | undefined;
        try {
          const orderRes = await fetch(`${BACKEND_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify({
              items: items.map((i) => ({ productId: i.product.id, name: i.product.nameEnglish, qty: i.quantity, price: i.product.price, unit: i.product.priceUnit })),
              address: { ...address, state: address.state === "Other" ? address.customState : address.state },
              coupon: appliedCoupon?.code,
              discount,
              deliveryFee: deliveryFee || 0,
              total: grandTotal,
              paymentId: response.razorpay_payment_id,
              status: "paid",
            }),
          });
          const orderData = await orderRes.json();
          savedOrderId = orderData?.order?.id;

          // Send email confirmation
          try {
            await fetch(`${BACKEND_URL}/orders/confirm-email`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: savedOrderId,
                email: address.email,
                name: address.name,
                items: items.map((i) => ({ name: i.product.nameEnglish, qty: i.quantity, price: i.product.price, unit: i.product.priceUnit })),
                total: grandTotal,
                address: { ...address, state: address.state === "Other" ? address.customState : address.state },
                paymentId: response.razorpay_payment_id,
              }),
            });
          } catch {}
        } catch {}

        // Save address for future use
        try {
          const addrToSave = {
            name: address.name,
            email: address.email,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            customState: address.customState,
            pincode: address.pincode,
          };
          localStorage.setItem("snackzee_address", JSON.stringify(addrToSave));
        } catch {}

        clearCart();
        const confirmationData = {
          orderId: savedOrderId,
          paymentId: response.razorpay_payment_id,
          total: grandTotal,
          items: items.map((i) => ({ name: i.product.nameEnglish, image: i.product.image, qty: i.quantity, price: i.product.price, unit: i.product.priceUnit })),
          address: {
            name: address.name,
            email: address.email,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state === "Other" ? address.customState : address.state,
            pincode: address.pincode,
          },
        };
        try { sessionStorage.setItem("snackzee_order_confirmation", JSON.stringify(confirmationData)); } catch {}
        router.push("/order-confirmation");
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
    <div className="min-h-screen bg-cream pt-16 sm:pt-20">
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown mb-6 sm:mb-8 text-center">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8 sm:mb-10 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-shrink-0">
              <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-sans font-semibold transition-all ${
                step === s.id ? "bg-terracotta text-white shadow-lg" :
                step > s.id ? "bg-green-100 text-green-700" : "bg-white text-brown-light/50 border border-terracotta/10"
              }`}>
                {step > s.id ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : s.icon}
                <span className="hidden xs:inline sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className={`w-4 h-4 mx-0.5 sm:mx-1 flex-shrink-0 ${step > s.id ? "text-green-400" : "text-brown-light/20"}`} />
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
                    <div key={getCartItemKey(item)} className="flex items-center gap-4 py-3 border-b border-terracotta/5 last:border-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative bg-cream-dark">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="flex-1">
                        <p className="font-serif font-bold text-brown">{item.product.name}</p>
                        <p className="text-brown-light/50 text-xs font-sans">{item.product.nameEnglish} · {item.product.priceUnit}</p>
                        <p className="text-brown-light/60 text-xs font-sans">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-sans font-bold text-gold text-lg">₹{item.product.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-terracotta/10 flex justify-between font-bold text-brown">
                  <span className="font-sans">Subtotal</span>
                  <span className="font-sans text-xl text-gold">₹{total}</span>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-terracotta hover:bg-terracotta-dark text-white py-4 rounded-full font-bold font-sans text-base transition-all hover:scale-[1.02] shadow-lg shadow-terracotta/20">
                Continue to Address →
              </button>
            </motion.div>
          )}

          {/* ── Step 2: Rewards + Address ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
              {/* Enhanced Loyalty Rewards Section */}
              <div className="bg-white rounded-2xl border border-terracotta/10 p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-brown flex items-center gap-2">
                      <Gift className="w-5 h-5 text-terracotta" /> Loyalty Rewards
                    </h2>
                    <p className="text-sm text-brown-light/60 font-sans mt-1">
                      We will check your saved customer details and show the coupon you can apply.
                    </p>
                  </div>
                  <div className="hidden sm:flex w-11 h-11 rounded-xl bg-terracotta/10 text-terracotta items-center justify-center">
                    <Crown className="w-5 h-5" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-brown-light/60 font-sans mb-1">Email for rewards</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-brown-light/35 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={address.email}
                        onChange={(e) => setAddress((p) => ({ ...p, email: e.target.value }))}
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brown-light/60 font-sans mb-1">Phone for rewards</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-brown-light/35 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        value={address.phone}
                        onChange={(e) => setAddress((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30"
                      />
                    </div>
                  </div>
                </div>

                {loyaltyLoading && (
                  <div className="flex items-center gap-2 text-brown-light/50 font-sans text-sm mb-4 animate-pulse">
                    <div className="w-4 h-4 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
                    Checking your order history...
                  </div>
                )}

                {activeTierDetails && !loyaltyLoading && (() => {
                  const c = TIER_COLORS[activeTierDetails.tier];
                  const progressMax = activeTierDetails.nextTier ? activeTierDetails.nextTier.minOrders : Math.max(activeTierDetails.orderCount, 1);
                  const progressPct = activeTierDetails.nextTier ? Math.min((activeTierDetails.orderCount / progressMax) * 100, 100) : 100;
                  return (
                    <div className={`rounded-xl border-2 ${c.border} ${c.bg} p-5 mb-5 shadow-sm`}>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${c.badge}`}>
                              {c.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`font-bold font-serif text-xl ${c.text}`}>{activeTierDetails.tier}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.badge}`}>{activeTierDetails.pct}% OFF</span>
                              </div>
                              <p className="text-xs text-brown-light/60 font-sans">
                                {activeTierDetails.orderCount} orders • {activeTierDetails.range}
                              </p>
                            </div>
                          </div>
                        </div>
                        {appliedCoupon?.code === activeTierDetails.code ? (
                          <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-300 rounded-lg px-4 py-2.5">
                            <span className="text-green-700 font-bold font-sans text-sm flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" /> Save ₹{discount}
                            </span>
                            <button onClick={() => setAppliedCoupon(null)} className="text-green-600 hover:text-green-800 text-xs font-sans font-semibold">Remove</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAppliedCoupon({ code: activeTierDetails.code, pct: activeTierDetails.pct })}
                            className="sm:w-auto bg-terracotta text-white px-5 py-3 rounded-lg font-bold font-sans text-sm hover:bg-terracotta-dark transition-colors shadow-sm"
                          >
                            Apply {activeTierDetails.pct}% Discount
                          </button>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="h-2 rounded-full bg-white/80 overflow-hidden">
                          <div className="h-full rounded-full bg-terracotta transition-all" style={{ width: `${progressPct}%` }} />
                        </div>
                        <p className="text-xs text-brown-light/60 font-sans mt-2">
                          {activeTierDetails.nextTier
                            ? `${activeTierDetails.ordersToNextTier} more orders to reach ${activeTierDetails.nextTier.tier}`
                            : "You are on the highest loyalty tier."}
                        </p>
                      </div>

                      <ul className="grid sm:grid-cols-2 gap-2">
                        {activeTierDetails.perks.map((p) => (
                          <li key={p} className={`text-xs font-sans flex items-start gap-2 ${c.text}`}>
                            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })()}

                {!loyaltyTier && !loyaltyLoading && (
                  <div className="mb-5 rounded-xl bg-cream border border-terracotta/10 p-4">
                    <p className="text-sm text-brown-light/70 font-sans">
                      Enter your email or 10-digit phone number above to check coupon availability.
                    </p>
                  </div>
                )}

                <div className="rounded-xl border border-terracotta/10 bg-cream/60 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setCouponsOpen((open) => !open)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-white/60 transition-colors"
                  >
                    <div>
                      <p className="font-serif text-lg font-bold text-brown">Available Coupons</p>
                      <p className="text-xs text-brown-light/50 font-sans">
                        {loyaltyTier ? `${loyaltyTier.tier} coupon ready. View all loyalty coupons.` : "Enter email or phone above to unlock your coupon."}
                      </p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-terracotta transition-transform ${couponsOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {couponsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid lg:grid-cols-2 gap-3 p-3 pt-0">
                          {loyaltyTiers.map((tier) => {
                            const tc = TIER_COLORS[tier.tier];
                            const isCurrent = loyaltyTier?.tier === tier.tier;
                            const isApplied = appliedCoupon?.code === tier.code;
                            const canApply = Boolean(isCurrent);
                            const lockedText = loyaltyTier
                              ? `Reach ${tier.minOrders} orders to unlock`
                              : "Enter email or phone to check";

                            return (
                              <div
                                key={tier.tier}
                                className={`rounded-xl border p-4 ${tc.border} ${tc.bg} ${isCurrent ? "ring-2 ring-terracotta/30" : "opacity-75"}`}
                              >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className={`p-1.5 rounded-lg ${tc.badge}`}>{tc.icon}</div>
                                    <div className="min-w-0">
                                      <p className={`font-serif font-bold ${tc.text}`}>{tier.tier}</p>
                                      <p className="text-xs text-brown-light/50 font-sans">{tier.range}</p>
                                    </div>
                                  </div>
                                  <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${tc.badge}`}>{tier.pct}% OFF</span>
                                </div>

                                <ul className="space-y-1 mb-3">
                                  {tier.perks.map((perk) => (
                                    <li key={perk} className={`text-xs font-sans flex items-start gap-1.5 ${tc.text}`}>
                                      <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                      <span>{perk}</span>
                                    </li>
                                  ))}
                                </ul>

                                {canApply ? (
                                  isApplied ? (
                                    <button
                                      type="button"
                                      onClick={() => setAppliedCoupon(null)}
                                      className="w-full rounded-lg border border-green-200 bg-green-50 text-green-700 px-4 py-2 text-xs font-bold font-sans hover:bg-green-100 transition-colors"
                                    >
                                      Applied · Remove
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setAppliedCoupon({ code: tier.code, pct: tier.pct })}
                                      className="w-full rounded-lg bg-terracotta text-white px-4 py-2 text-xs font-bold font-sans hover:bg-terracotta-dark transition-colors"
                                    >
                                      Apply Coupon
                                    </button>
                                  )
                                ) : (
                                  <div className="w-full rounded-lg border border-brown-light/10 bg-white/60 px-4 py-2 text-xs font-semibold font-sans text-brown-light/45 text-center">
                                    {lockedText}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Custom Coupon Input */}
                  <div className="mt-5 pt-5 border-t border-terracotta/10">
                    <label className="block text-xs font-semibold text-brown-light/60 font-sans mb-1.5">Have a Coupon Code?</label>
                    <form onSubmit={handleApplyCustomCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={customCouponCode}
                        onChange={(e) => setCustomCouponCode(e.target.value.toUpperCase())}
                        placeholder="e.g. SNACKTIME20"
                        disabled={couponValidating}
                        className="flex-1 px-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown font-bold tracking-wider placeholder:font-normal font-sans text-sm focus:outline-none focus:border-terracotta/30"
                      />
                      <button
                        type="submit"
                        disabled={couponValidating || !customCouponCode.trim()}
                        className="bg-terracotta hover:bg-terracotta-dark disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-bold font-sans text-sm transition-colors flex items-center justify-center shrink-0"
                      >
                        {couponValidating ? "Checking..." : "Apply"}
                      </button>
                    </form>

                    {appliedCoupon && appliedCoupon.type && (
                      <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200 text-xs font-sans text-green-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                          <div>
                            <p className="font-bold font-serif text-sm">Coupon {appliedCoupon.code} Applied!</p>
                            <p className="text-[10px] text-green-600/80 font-sans mt-0.5">
                              Saved ₹{discount} on coupon-eligible items.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setAppliedCoupon(null); setCustomCouponCode(""); }}
                          className="text-green-700 hover:text-green-955 font-bold font-sans text-xs font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl border border-terracotta/10 p-6">
                <h2 className="font-serif text-xl font-bold text-brown mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-terracotta" /> Delivery Address
                </h2>
                {/* Show saved address info if phone/email already filled */}
                {(address.phone || address.email) && (
                  <div className="mb-4 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs font-sans text-green-700">
                      <p className="font-bold">Saved details loaded</p>
                      {address.email && <p className="mt-0.5">{address.email}</p>}
                      {address.phone && <p>{address.phone}</p>}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Full Name", placeholder: "Your full name", col: 1, type: "text" },
                    { key: "email", label: "Email Address", placeholder: "you@example.com", col: 1, type: "email" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold text-brown-light/60 font-sans mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        value={address[field.key as keyof typeof address]}
                        onChange={(e) => setAddress((p) => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30"
                      />
                    </div>
                  ))}
                  {/* Phone with 10-digit validation */}
                  <div>
                    <label className="block text-xs font-semibold text-brown-light/60 font-sans mb-1">Phone Number</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={address.phone}
                      onChange={(e) => setAddress((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={`w-full px-4 py-3 rounded-xl bg-cream border text-brown font-sans text-sm focus:outline-none ${
                        address.phone && address.phone.length !== 10
                          ? "border-red-300 focus:border-red-400"
                          : "border-terracotta/10 focus:border-terracotta/30"
                      }`}
                    />
                    {address.phone && address.phone.length !== 10 && (
                      <p className="text-red-500 text-[11px] font-sans mt-1">Must be exactly 10 digits</p>
                    )}
                  </div>
                  {/* Address lines */}
                  {[
                    { key: "line1", label: "Address Line 1", placeholder: "House/Flat No, Street", col: 2 },
                    { key: "line2", label: "Address Line 2 (optional)", placeholder: "Landmark, Area", col: 2 },
                    { key: "city", label: "City", placeholder: "Hyderabad", col: 1 },
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
                    <label className="block text-xs font-semibold text-brown-light/60 font-sans mb-1">Pincode</label>
                    <input
                      inputMode="numeric"
                      value={address.pincode}
                      onChange={(e) => setAddress((p) => ({ ...p, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className={`w-full px-4 py-3 rounded-xl bg-cream border text-brown font-sans text-sm focus:outline-none ${
                        address.pincode && address.pincode.length !== 6
                          ? "border-red-300 focus:border-red-400"
                          : "border-terracotta/10 focus:border-terracotta/30"
                      }`}
                    />
                    {address.pincode.length === 6 && (
                      <p className="text-xs font-sans mt-1 font-semibold">
                        {isLoadingDeliveryFee ? (
                          <span className="text-brown-light/40 animate-pulse">Calculating delivery fee...</span>
                        ) : deliveryFee === 0 ? (
                          <span className="text-green-600">🎉 FREE Delivery on this order!</span>
                        ) : deliveryFee !== null ? (
                          <span className="text-terracotta">Delivery fee: ₹{deliveryFee}</span>
                        ) : null}
                      </p>
                    )}
                  </div>
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
                   {discount > 0 && appliedCoupon && (() => {
                    const tierMatch = loyaltyTier && appliedCoupon.code === loyaltyTier.code;
                    const isCustom = appliedCoupon.type !== undefined;
                    return (
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          {tierMatch && (() => {
                            const c = TIER_COLORS[loyaltyTier.tier];
                            return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.badge}`}>{loyaltyTier.tier}</span>;
                          })()}
                          {isCustom && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Coupon Code</span>
                          )}
                          <span className="text-green-600">{isCustom ? `Coupon Discount (${appliedCoupon.code})` : `Loyalty Discount (${appliedCoupon.code})`}</span>
                        </span>
                        <span className="text-green-600 font-semibold">−₹{discount}</span>
                      </div>
                    );
                  })()}
                  <div className="flex justify-between text-brown-light/70">
                    <span>Delivery</span>
                    <span>
                      {isLoadingDeliveryFee ? (
                        <span className="text-brown-light/40 animate-pulse">Calculating...</span>
                      ) : deliveryFee !== null ? (
                        deliveryFee > 0 ? (
                          <span className="text-gold font-sans">₹{deliveryFee}</span>
                        ) : (
                          <span className="text-green-600 font-semibold">FREE</span>
                        )
                      ) : (
                        <span className="text-brown-light/40">Enter pincode</span>
                      )}
                    </span>
                  </div>
                  <div className="border-t border-terracotta/10 pt-2 flex justify-between font-bold text-brown text-base">
                    <span>Grand Total</span><span className="text-gold font-sans text-2xl">₹{grandTotal}</span>
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
