"use client";

import { useEffect, useState } from "react";
import { Users, Mail, Calendar, Shield, Search, X, Pencil, Check, ShoppingBag, TrendingUp, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  created_at: string;
  total_orders: number;
  total_spent: number;
}

export default function CustomersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const token = localStorage.getItem("snackzee_token");
    if (!token) return;
    fetch(`${BACKEND_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.users) setUsers(d.users); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || (u.phone || "").includes(q) || u.email.toLowerCase().includes(q);
  });

  const startEdit = (user: User) => {
    setEditId(user.id);
    setEditForm({ name: user.name, phone: user.phone || "" });
  };

  const cancelEdit = () => { setEditId(null); setEditForm({ name: "", phone: "" }); };

  const saveEdit = async (userId: number) => {
    if (!editForm.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("snackzee_token");
      const res = await fetch(`${BACKEND_URL}/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editForm.name.trim(), phone: editForm.phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, name: data.user.name, phone: data.user.phone } : u));
      setEditId(null);
      toast({ title: "Customer updated ✅" });
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggleRole = async (userId: number, currentRole: string) => {
    const token = localStorage.getItem("snackzee_token");
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const res = await fetch(`${BACKEND_URL}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    } catch {}
  };

  const totalRevenue = users.reduce((s, u) => s + (u.total_spent || 0), 0);
  const totalOrders = users.reduce((s, u) => s + (u.total_orders || 0), 0);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown">Customers</h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-terracotta/10">
            <Users className="w-4 h-4 text-terracotta" />
            <span className="font-serif font-bold text-brown text-sm">{users.length}</span>
            <span className="text-brown-light/50 text-xs font-sans">Total</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-terracotta/10">
            <ShoppingBag className="w-4 h-4 text-blue-500" />
            <span className="font-serif font-bold text-brown text-sm">{totalOrders}</span>
            <span className="text-brown-light/50 text-xs font-sans">Orders</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-terracotta/10">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="font-serif font-bold text-brown text-sm">₹{totalRevenue.toLocaleString()}</span>
            <span className="text-brown-light/50 text-xs font-sans">Revenue</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
        <input
          type="text"
          placeholder="Search by name, phone or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white border border-terracotta/10 text-brown font-sans text-sm focus:outline-none focus:border-terracotta/30"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light/40 hover:text-brown-light">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-terracotta/10 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-brown-light/50 font-sans text-sm text-center py-12">
            {search ? `No customers found for "${search}"` : "No customers yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm font-sans min-w-[640px]">
              <thead className="bg-cream/50">
                <tr className="text-brown-light/50 text-[10px] uppercase tracking-wider">
                  <th className="text-left py-3 px-3 sm:px-4">Customer</th>
                  <th className="text-left py-3 px-3 sm:px-4">Contact</th>
                  <th className="text-left py-3 px-3 sm:px-4">Orders</th>
                  <th className="text-left py-3 px-3 sm:px-4">Spent</th>
                  <th className="text-left py-3 px-3 sm:px-4">Role</th>
                  <th className="text-left py-3 px-3 sm:px-4">Joined</th>
                  <th className="text-left py-3 px-3 sm:px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-terracotta/5">
                {filtered.map((user) => (
                  <motion.tr key={user.id} layout
                    className="hover:bg-cream/30 transition-colors align-top">

                    {/* Customer name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-serif font-bold text-terracotta text-sm">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        {editId === user.id ? (
                          <input
                            value={editForm.name}
                            onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                            className="w-28 px-2 py-1 rounded-lg bg-cream border border-terracotta/20 text-brown font-sans text-xs focus:outline-none focus:border-terracotta/40"
                            autoFocus
                          />
                        ) : (
                          <span className="font-semibold text-brown">{user.name}</span>
                        )}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-brown-light/60">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate max-w-[140px]">{user.email}</span>
                        </div>
                        {editId === user.id ? (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-brown-light/40 flex-shrink-0" />
                            <input
                              value={editForm.phone}
                              onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                              placeholder="Phone"
                              className="w-28 px-2 py-1 rounded-lg bg-cream border border-terracotta/20 text-brown font-sans text-xs focus:outline-none focus:border-terracotta/40"
                            />
                          </div>
                        ) : user.phone ? (
                          <div className="flex items-center gap-1 text-brown-light/60">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                        ) : (
                          <span className="text-brown-light/30 text-[10px]">No phone</span>
                        )}
                      </div>
                    </td>

                    {/* Orders */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
                        <span className="font-bold text-brown">{user.total_orders}</span>
                      </div>
                    </td>

                    {/* Spent */}
                    <td className="py-3 px-4">
                      <span className="font-serif font-bold text-gold">₹{(user.total_spent || 0).toLocaleString()}</span>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.role === "admin" ? "bg-terracotta/10 text-terracotta" : "bg-blue-100 text-blue-700"
                      }`}>
                        <Shield className="w-2.5 h-2.5" />{user.role}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-brown-light/60">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">{new Date(user.created_at).toLocaleDateString("en-IN")}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {editId === user.id ? (
                          <>
                            <button onClick={() => saveEdit(user.id)} disabled={saving}
                              className="flex items-center gap-1 text-[10px] font-semibold bg-green-500 hover:bg-green-600 text-white px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                              <Check className="w-3 h-3" /> Save
                            </button>
                            <button onClick={cancelEdit}
                              className="flex items-center gap-1 text-[10px] font-semibold bg-cream hover:bg-terracotta/10 text-brown-light px-2.5 py-1.5 rounded-lg transition-colors border border-terracotta/10">
                              <X className="w-3 h-3" /> Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(user)}
                              className="flex items-center gap-1 text-[10px] font-semibold text-brown-light border border-terracotta/20 hover:border-terracotta/40 hover:text-terracotta px-2.5 py-1.5 rounded-lg transition-colors">
                              <Pencil className="w-3 h-3" /> Edit
                            </button>
                            <button onClick={() => toggleRole(user.id, user.role)}
                              className="text-[10px] bg-terracotta/10 hover:bg-terracotta hover:text-white text-terracotta px-2.5 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap">
                              {user.role === "admin" ? "Remove" : "Make Admin"}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
