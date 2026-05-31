"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Tag, Edit3, Trash2, X, Percent, CheckCircle2, AlertCircle, Sparkles, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Coupon {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_value: number;
  max_discount: number | null;
  active: boolean;
  created_at: string;
}

const emptyCoupon = {
  code: "",
  discount_type: "percentage" as const,
  discount_value: 0,
  min_order_value: 0,
  max_discount: "" as any,
  active: true,
};

export default function AdminCouponsPage() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState(emptyCoupon);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const token = localStorage.getItem("snackzee_token");
    if (!token) return;

    try {
      const res = await fetch(`${BACKEND_URL}/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch {
      toast({ title: "Error", description: "Failed to load coupons", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditCoupon({} as Coupon);
    setFormData(emptyCoupon);
    setIsNew(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_value: coupon.min_order_value,
      max_discount: coupon.max_discount ?? "",
      active: coupon.active,
    });
    setIsNew(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || formData.discount_value <= 0) {
      toast({ title: "Validation Error", description: "Please enter code and valid discount value", variant: "destructive" });
      return;
    }

    const token = localStorage.getItem("snackzee_token");
    if (!token) return;

    setSaving(true);
    try {
      const url = isNew ? `${BACKEND_URL}/coupons` : `${BACKEND_URL}/coupons/${(editCoupon as Coupon).id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          code: formData.code.toUpperCase(),
          max_discount: formData.max_discount === "" ? null : Number(formData.max_discount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Save failed");
      }

      toast({
        title: "Success! 🎉",
        description: `Coupon successfully ${isNew ? "created" : "updated"}.`,
      });

      setEditCoupon(null);
      fetchCoupons();
    } catch (err: any) {
      toast({ title: "Failed to save", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this coupon code?")) return;

    const token = localStorage.getItem("snackzee_token");
    if (!token) return;

    try {
      const res = await fetch(`${BACKEND_URL}/coupons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");

      toast({ title: "Deleted", description: "Coupon deleted successfully" });
      fetchCoupons();
    } catch {
      toast({ title: "Error", description: "Failed to delete coupon", variant: "destructive" });
    }
  };

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = coupons.filter((c) => c.active).length;
  const pctCount = coupons.filter((c) => c.discount_type === "percentage").length;
  const fixedCount = coupons.filter((c) => c.discount_type === "fixed").length;

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown flex items-center gap-2">
            <Tag className="w-6 h-6 text-terracotta" /> Coupons & Discounts
          </h1>
          <p className="text-sm font-sans text-brown-light/60 mt-1">
            Manage store discount codes, validation constraints, and price deductions.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white px-5 py-3 rounded-xl font-semibold font-sans text-sm transition-all hover:scale-[1.02] shadow-lg shadow-terracotta/10"
        >
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Codes", value: coupons.length, icon: <Tag className="w-5 h-5" />, color: "bg-terracotta/10 text-terracotta" },
          { label: "Active", value: activeCount, icon: <CheckCircle2 className="w-5 h-5" />, color: "bg-green-100 text-green-700" },
          { label: "Percentage %", value: pctCount, icon: <Percent className="w-5 h-5" />, color: "bg-gold/10 text-gold" },
          { label: "Fixed ₹", value: fixedCount, icon: <DollarSign className="w-5 h-5" />, color: "bg-blue-100 text-blue-600" },
        ].map((stat, i) => (
          <div key={stat.label} className="bg-white border border-terracotta/10 rounded-2xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xl font-serif font-bold text-brown leading-none">{stat.value}</p>
              <p className="text-[11px] font-sans text-brown-light/45 mt-1.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-terracotta/10 p-4 flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
          <input
            type="text"
            placeholder="Search coupon codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/35"
          />
        </div>
      </div>

      {/* Grid of Coupons */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-terracotta/10 rounded-2xl text-center py-16 px-4">
          <div className="w-14 h-14 bg-cream text-terracotta rounded-full flex items-center justify-center mx-auto mb-4 border border-terracotta/10">
            <Tag className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-brown mb-1">No Coupons Found</h3>
          <p className="text-sm font-sans text-brown-light/50 max-w-xs mx-auto">
            {search ? "No codes match your active search terms." : "Create your first store coupon discount code now!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((coupon, i) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`bg-white rounded-2xl border ${
                coupon.active ? "border-terracotta/10" : "border-brown-light/10 opacity-70"
              } shadow-sm overflow-hidden flex flex-col justify-between`}
            >
              {/* Card Header (styled like ticket) */}
              <div className="bg-cream/45 p-5 border-b border-terracotta/5 flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif font-black tracking-wider text-lg text-brown border-2 border-dashed border-terracotta/20 bg-white px-2.5 py-1 rounded-md shadow-sm select-all">
                      {coupon.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      coupon.active ? "bg-green-100 text-green-700" : "bg-brown-light/10 text-brown-light/60"
                    }`}>
                      {coupon.active ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-[10px] text-brown-light/45 font-sans">
                    Created {new Date(coupon.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="p-2 rounded-lg bg-white border border-terracotta/10 hover:bg-cream text-terracotta hover:scale-105 transition-all shadow-sm"
                    title="Edit Coupon"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="p-2 rounded-lg bg-white border border-red-100 hover:bg-red-50 text-red-500 hover:scale-105 transition-all shadow-sm"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3.5 font-sans text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-terracotta/5">
                  <span className="text-brown-light/50 font-medium">Discount Value</span>
                  <span className="text-gold font-bold text-base flex items-center gap-1">
                    {coupon.discount_type === "percentage" ? (
                      <><Sparkles className="w-4 h-4 text-gold fill-current" /> {coupon.discount_value}% OFF</>
                    ) : (
                      <>₹{coupon.discount_value} OFF</>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-terracotta/5">
                  <span className="text-brown-light/50 font-medium">Min Order Value</span>
                  <span className="text-brown font-semibold text-sm">₹{coupon.min_order_value}</span>
                </div>

                {coupon.discount_type === "percentage" && (
                  <div className="flex justify-between items-center py-1.5 border-b border-dashed border-terracotta/5">
                    <span className="text-brown-light/50 font-medium">Max Discount Cap</span>
                    <span className="text-brown font-semibold text-sm">
                      {coupon.max_discount ? `₹${coupon.max_discount}` : "Unlimited"}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit/Add Dialog Modal */}
      <AnimatePresence>
        {editCoupon && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-terracotta/10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-terracotta/10 px-6 py-4 flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-brown flex items-center gap-2">
                  <Tag className="w-5 h-5 text-terracotta" /> {isNew ? "Create" : "Edit"} Discount Coupon
                </h2>
                <button
                  type="button"
                  onClick={() => setEditCoupon(null)}
                  className="text-brown-light/45 hover:text-brown transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSave} className="p-6 space-y-5 font-sans">
                {/* Coupon Code */}
                <div>
                  <label className="text-xs font-semibold text-brown-light/65 mb-1.5 block">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SNACKTIME20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2.5 rounded-xl bg-cream border border-terracotta/10 text-brown font-bold tracking-wider placeholder:font-normal font-sans text-sm focus:outline-none focus:border-terracotta/35"
                  />
                  <p className="text-[10px] text-brown-light/45 mt-1 font-medium">Codes will automatically convert to uppercase.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Discount Type */}
                  <div>
                    <label className="text-xs font-semibold text-brown-light/65 mb-1.5 block">Discount Type</label>
                    <select
                      value={formData.discount_type}
                      onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-semibold focus:outline-none"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  {/* Discount Value */}
                  <div>
                    <label className="text-xs font-semibold text-brown-light/65 mb-1.5 block">
                      Value {formData.discount_type === "percentage" ? "(%)" : "(₹)"}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={formData.discount_type === "percentage" ? 100 : 10000}
                      placeholder={formData.discount_type === "percentage" ? "e.g. 20" : "e.g. 150"}
                      value={formData.discount_value || ""}
                      onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-semibold focus:outline-none focus:border-terracotta/35"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Min Order Value */}
                  <div>
                    <label className="text-xs font-semibold text-brown-light/65 mb-1.5 block">Min Order Value (₹)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 500"
                      value={formData.min_order_value || ""}
                      onChange={(e) => setFormData({ ...formData, min_order_value: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-semibold focus:outline-none focus:border-terracotta/35"
                    />
                  </div>

                  {/* Max Discount Amount */}
                  {formData.discount_type === "percentage" ? (
                    <div>
                      <label className="text-xs font-semibold text-brown-light/65 mb-1.5 block">Max Discount (₹, optional)</label>
                      <input
                        type="number"
                        min={1}
                        placeholder="e.g. 250 (Leave blank for unlimited)"
                        value={formData.max_discount}
                        onChange={(e) => setFormData({ ...formData, max_discount: e.target.value === "" ? "" : Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-semibold focus:outline-none focus:border-terracotta/35"
                      />
                    </div>
                  ) : (
                    <div className="flex items-end justify-center pb-2.5">
                      <div className="text-[10px] text-brown-light/45 bg-cream border border-terracotta/5 rounded-xl p-2 font-medium flex items-start gap-1.5 leading-relaxed">
                        <AlertCircle className="w-3.5 h-3.5 text-terracotta shrink-0 mt-0.5" />
                        Fixed discount values are capped to the total price of eligible items in cart.
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Toggle Status */}
                <div className="flex items-center gap-2 bg-cream p-3.5 rounded-xl border border-terracotta/10 cursor-pointer select-none" onClick={() => setFormData({ ...formData, active: !formData.active })}>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={() => {}} // handled by div click
                    className="w-4 h-4 text-terracotta border-terracotta/20 rounded focus:ring-terracotta cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-brown leading-none">Enable Coupon for Customer Use</span>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 pt-3 border-t border-terracotta/10">
                  <button
                    type="button"
                    onClick={() => setEditCoupon(null)}
                    className="flex-1 px-4 py-3 rounded-xl bg-cream text-brown font-semibold hover:bg-cream-dark transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-terracotta hover:bg-terracotta-dark text-white py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-terracotta/15"
                  >
                    {saving ? "Saving..." : <><CheckCircle2 className="w-4 h-4" /> Save Coupon</>}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
