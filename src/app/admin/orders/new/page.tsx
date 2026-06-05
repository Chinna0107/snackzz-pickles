"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, MessageCircle, Instagram, ArrowLeft, Package, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Product { id: string; name: string; price: number; price_unit: string; category: string; image: string; }
interface OrderItem { productId: string; name: string; qty: number; price: number; }

const INDIAN_STATES = ["Telangana","Andhra Pradesh","Karnataka","Tamil Nadu","Maharashtra","Delhi","Gujarat","Rajasthan","Uttar Pradesh","West Bengal","Madhya Pradesh","Bihar","Punjab","Haryana","Kerala","Odisha","Jharkhand","Assam","Chhattisgarh","Uttarakhand","Himachal Pradesh","Goa","Jammu & Kashmir","Ladakh"];

export default function NewManualOrderPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [source, setSource] = useState<"whatsapp" | "instagram">("whatsapp");

  const [address, setAddress] = useState({ name: "", phone: "", email: "", line1: "", line2: "", city: "", state: "Telangana", pincode: "" });
  const [items, setItems] = useState<OrderItem[]>([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [paymentId, setPaymentId] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/products`)
      .then((r) => r.json())
      .then((d) => { if (d.products) setProducts(d.products); })
      .catch(() => {});
  }, []);

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const getItem = (productId: string) => items.find((i) => i.productId === productId);

  const addProduct = (p: Product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.productId === p.id);
      if (exists) return prev.map((i) => i.productId === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { productId: p.id, name: p.name, qty: 1, price: p.price }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setItems((prev) => prev
      .map((i) => i.productId === productId ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
      .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (productId: string) => setItems((prev) => prev.filter((i) => i.productId !== productId));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.line1 || !address.pincode) {
      toast({ title: "Missing fields", description: "Fill in customer name, phone, address and pincode.", variant: "destructive" });
      return;
    }
    if (address.phone.replace(/\D/g, "").length !== 10) {
      toast({ title: "Invalid phone", description: "Phone number must be exactly 10 digits.", variant: "destructive" });
      return;
    }
    if (address.pincode.replace(/\D/g, "").length !== 6) {
      toast({ title: "Invalid pincode", description: "Pincode must be exactly 6 digits.", variant: "destructive" });
      return;
    }
    if (items.length === 0) {
      toast({ title: "No items", description: "Add at least one product.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("snackzee_token");
      const res = await fetch(`${BACKEND_URL}/orders/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items, address, total, deliveryFee, discount, notes, source, paymentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: "Order created! ✅", description: `Order #${data.order.id} recorded from ${source}.` });
      router.push("/admin/orders");
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-terracotta/10 text-brown-light transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-serif text-2xl font-bold text-brown">Record External Order</h1>
          <p className="text-brown-light/50 font-sans text-sm">Manually enter WhatsApp or Instagram orders</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Source */}
        <div className="bg-white rounded-2xl border border-terracotta/10 p-5">
          <p className="font-sans font-semibold text-brown text-sm mb-3">Order Source</p>
          <div className="flex gap-3">
            {(["whatsapp", "instagram"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setSource(s)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans font-semibold text-sm border-2 transition-all ${
                  source === s
                    ? s === "whatsapp" ? "bg-green-500 text-white border-green-500" : "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500"
                    : "bg-cream text-brown-light border-terracotta/10 hover:border-terracotta/30"
                }`}>
                {s === "whatsapp" ? <MessageCircle className="w-4 h-4" /> : <Instagram className="w-4 h-4" />}
                {s === "whatsapp" ? "WhatsApp" : "Instagram"}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-2xl border border-terracotta/10 p-5">
          <p className="font-sans font-semibold text-brown text-sm mb-4">Customer Details</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { key: "name", label: "Full Name *", type: "text", placeholder: "Customer name" },
              { key: "phone", label: "Phone *", type: "tel", placeholder: "10-digit mobile", inputMode: "numeric", maxLength: 10 },
              { key: "email", label: "Email", type: "email", placeholder: "optional" },
              { key: "line1", label: "Address Line 1 *", type: "text", placeholder: "House/Street" },
              { key: "line2", label: "Address Line 2", type: "text", placeholder: "Landmark (optional)" },
              { key: "city", label: "City *", type: "text", placeholder: "City" },
              { key: "pincode", label: "Pincode *", type: "text", placeholder: "6-digit pincode", inputMode: "numeric", maxLength: 6 },
            ].map(({ key, label, type, placeholder, inputMode, maxLength }: any) => (
              <div key={key} className={key === "line1" || key === "line2" ? "sm:col-span-2" : ""}>
                <label className="text-[11px] font-sans text-brown-light/50 uppercase tracking-wider mb-1 block">{label}</label>
                <input type={type} placeholder={placeholder} value={(address as any)[key]}
                  inputMode={inputMode}
                  maxLength={maxLength}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (key === 'phone') val = val.replace(/\D/g, '').slice(0, 10);
                    if (key === 'pincode') val = val.replace(/\D/g, '').slice(0, 6);
                    setAddress((p) => ({ ...p, [key]: val }));
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30" />
              </div>
            ))}
            <div>
              <label className="text-[11px] font-sans text-brown-light/50 uppercase tracking-wider mb-1 block">State *</label>
              <select value={address.state} onChange={(e) => setAddress((p) => ({ ...p, state: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none">
                {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Product Picker */}
        <div className="bg-white rounded-2xl border border-terracotta/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-sans font-semibold text-brown text-sm">
              Select Products
              {items.length > 0 && <span className="ml-2 bg-terracotta text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{items.length} added</span>}
            </p>
            <span className="text-brown-light/40 text-xs font-sans">{products.length} products</span>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light/40 hover:text-brown-light">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <p className="col-span-3 text-center text-brown-light/40 font-sans text-sm py-8">No products found</p>
            ) : filtered.map((p, i) => {
              const item = getItem(p.id);
              return (
                <motion.div key={`${p.id}:${p.name}:${i}`} layout
                  className={`relative rounded-xl border-2 p-3 transition-all cursor-pointer ${
                    item ? "border-terracotta bg-terracotta/5" : "border-terracotta/10 hover:border-terracotta/30 bg-cream/30"
                  }`}
                  onClick={() => !item && addProduct(p)}
                >
                  <p className="font-sans font-semibold text-brown text-xs leading-tight mb-1 line-clamp-2">{p.name}</p>
                  <p className="font-serif font-bold text-terracotta text-sm">₹{p.price}</p>
                  <p className="text-brown-light/40 text-[10px] font-sans">{p.price_unit}</p>

                  {item ? (
                    <div className="flex items-center justify-between mt-2" onClick={(e) => e.stopPropagation()}>
                      <button type="button" onClick={() => updateQty(p.id, -1)}
                        className="w-6 h-6 rounded-full bg-terracotta/20 hover:bg-terracotta/30 flex items-center justify-center transition-colors">
                        <Minus className="w-3 h-3 text-terracotta" />
                      </button>
                      <span className="font-bold text-brown font-sans text-sm">{item.qty}</span>
                      <button type="button" onClick={() => updateQty(p.id, 1)}
                        className="w-6 h-6 rounded-full bg-terracotta hover:bg-terracotta-dark flex items-center justify-center transition-colors">
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center justify-center gap-1 text-terracotta/60 text-[10px] font-sans">
                      <Plus className="w-3 h-3" /> Add
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        {items.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-terracotta/10 p-5">
            <p className="font-sans font-semibold text-brown text-sm mb-4">Order Summary</p>

            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 bg-cream/50 rounded-xl px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-semibold text-brown truncate">{item.name}</p>
                    <p className="text-brown-light/50 text-xs font-sans">₹{item.price} × {item.qty}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => updateQty(item.productId, -1)}
                      className="w-6 h-6 rounded-full border border-terracotta/20 flex items-center justify-center hover:bg-terracotta/10 transition-colors">
                      <Minus className="w-3 h-3 text-brown-light" />
                    </button>
                    <span className="w-6 text-center font-bold text-brown font-sans text-sm">{item.qty}</span>
                    <button type="button" onClick={() => updateQty(item.productId, 1)}
                      className="w-6 h-6 rounded-full border border-terracotta/20 flex items-center justify-center hover:bg-terracotta/10 transition-colors">
                      <Plus className="w-3 h-3 text-brown-light" />
                    </button>
                  </div>
                  <p className="font-serif font-bold text-gold text-sm w-16 text-right">₹{item.price * item.qty}</p>
                  <button type="button" onClick={() => removeItem(item.productId)}
                    className="w-6 h-6 flex items-center justify-center text-red-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-3 border-t border-terracotta/5">
              <div className="flex items-center justify-between text-sm font-sans text-brown-light/60">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-sans text-brown-light/60">Delivery Fee (₹)</span>
                <input type="number" min={0} value={deliveryFee} onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm text-right focus:outline-none" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-sans text-brown-light/60">Discount (₹)</span>
                <input type="number" min={0} value={discount} onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 rounded-lg bg-cream border border-terracotta/10 text-brown font-sans text-sm text-right focus:outline-none" />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-terracotta/5">
                <span className="font-serif font-bold text-brown text-base">Total</span>
                <span className="font-serif font-bold text-gold text-2xl">₹{total}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment & Notes */}
        <div className="bg-white rounded-2xl border border-terracotta/10 p-5 space-y-3">
          <p className="font-sans font-semibold text-brown text-sm">Payment & Notes</p>
          <div>
            <label className="text-[11px] font-sans text-brown-light/50 uppercase tracking-wider mb-1 block">Payment Reference (UPI / Cash)</label>
            <input value={paymentId} onChange={(e) => setPaymentId(e.target.value)}
              placeholder="e.g. UPI ref no. or 'Cash'"
              className="w-full px-3 py-2.5 rounded-xl bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30" />
          </div>
          <div>
            <label className="text-[11px] font-sans text-brown-light/50 uppercase tracking-wider mb-1 block">Internal Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              placeholder="e.g. Customer asked for extra spicy, gift wrap needed..."
              className="w-full px-3 py-2.5 rounded-xl bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30 resize-none" />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={saving || items.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark disabled:opacity-40 text-white py-4 rounded-2xl font-bold font-sans text-base transition-all hover:scale-[1.01] shadow-lg shadow-terracotta/20">
          <Package className="w-5 h-5" />
          {saving ? "Saving Order..." : `Record ${source === "whatsapp" ? "WhatsApp" : "Instagram"} Order — ₹${total}`}
        </button>
      </form>
    </div>
  );
}
