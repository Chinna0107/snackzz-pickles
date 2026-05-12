"use client";

import { useEffect, useState } from "react";
import { Users, Mail, Calendar, Shield } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("snackzee_token");
    if (!token) return;
    fetch(`${BACKEND_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d.users) setUsers(d.users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleRole = async (userId: number, currentRole: string) => {
    const token = localStorage.getItem("snackzee_token");
    if (!token) return;
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const res = await fetch(`${BACKEND_URL}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      }
    } catch {}
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown">Customers</h1>
        <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-xl border border-terracotta/10">
          <Users className="w-4 h-4 text-terracotta" />
          <span className="font-serif font-bold text-brown text-sm sm:text-base">{users.length}</span>
          <span className="text-brown-light/50 text-xs sm:text-sm font-sans">Total</span>
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl border border-terracotta/10 overflow-hidden">
        {users.length === 0 ? (
          <p className="text-brown-light/50 font-sans text-sm text-center py-12">No customers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm font-sans">
              <thead className="bg-cream/50">
                <tr className="text-brown-light/50 text-[10px] sm:text-xs uppercase tracking-wider">
                  <th className="text-left py-3 sm:py-4 px-4 sm:px-6">Customer</th>
                  <th className="text-left py-3 sm:py-4 px-4 sm:px-6">Email</th>
                  <th className="text-left py-3 sm:py-4 px-4 sm:px-6">Role</th>
                  <th className="text-left py-3 sm:py-4 px-4 sm:px-6">Joined</th>
                  <th className="text-left py-3 sm:py-4 px-4 sm:px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-terracotta/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-cream/30 transition-colors">
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-serif font-bold text-terracotta text-xs sm:text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-semibold text-brown truncate max-w-[100px] sm:max-w-none">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-1 sm:gap-2 text-brown-light/70">
                        <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="truncate max-w-[120px] sm:max-w-none">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${
                        user.role === "admin" ? "bg-terracotta/10 text-terracotta" : "bg-blue-100 text-blue-700"
                      }`}>
                        <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-1 sm:gap-2 text-brown-light/70">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="whitespace-nowrap">{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <button
                        onClick={() => toggleRole(user.id, user.role)}
                        className="text-[10px] sm:text-xs bg-terracotta/10 hover:bg-terracotta hover:text-white text-terracotta px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap"
                      >
                        {user.role === "admin" ? "Remove" : "Make Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
