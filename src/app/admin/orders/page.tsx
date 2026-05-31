"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Printer, MessageCircle, ExternalLink, ChevronDown, Plus, Instagram, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const FROM_ADDRESS = {
  name: "Snakzee",
  line1: "House No 1/2/32, Taka Street, Near Main Road",
  city: "Jagtial",
  state: "Telangana",
  pincode: "505327",
  phone: "+91 8464919366",
};

const STATUSES = ["paid", "processing", "shipped", "delivered", "cancelled"];

interface Order {
  id: number;
  total: number;
  status: string;
  source?: string;
  notes?: string;
  created_at: string;
  payment_id?: string;
  coupon?: string;
  discount?: number;
  delivery_fee?: number;
  tracking_id?: string;
  tracking_link?: string;
  items: { name: string; qty: number; price: number }[];
  address: { name: string; phone?: string; line1: string; line2?: string; city: string; state: string; pincode: string };
}

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [tracking, setTracking] = useState<Record<number, { id: string; link: string }>>({});

  useEffect(() => {
    const token = localStorage.getItem("snackzee_token");
    if (!token) return;
    fetch(`${BACKEND_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d.orders) {
          setOrders(d.orders);
          const t: Record<number, { id: string; link: string }> = {};
          d.orders.forEach((o: Order) => { t[o.id] = { id: o.tracking_id || "", link: o.tracking_link || "" }; });
          setTracking(t);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: number, status: string) => {
    const token = localStorage.getItem("snackzee_token");
    await fetch(`${BACKEND_URL}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    toast({ title: "Status updated", description: `Order #${orderId} → ${status}` });
  };

  const [shipping, setShipping] = useState<Record<number, boolean>>({});

  const createShipment = async (orderId: number) => {
    const token = localStorage.getItem("snackzee_token");
    setShipping((p) => ({ ...p, [orderId]: true }));
    try {
      const res = await fetch(`${BACKEND_URL}/orders/${orderId}/ship`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        let errorMsg = data.error || "Failed";
        if (data.details) {
          const detailStr = typeof data.details === 'string' ? data.details : JSON.stringify(data.details);
          errorMsg += ` - ${detailStr}`;
        }
        throw new Error(errorMsg);
      }
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, tracking_id: data.awb, tracking_link: data.tracking_link, status: "shipped" } : o));
      setTracking((p) => ({ ...p, [orderId]: { id: data.awb, link: data.tracking_link } }));
      toast({ title: "Shipment created! 🚚", description: `AWB: ${data.awb}` });
    } catch (err: any) {
      toast({ title: "Shipment failed", description: err.message, variant: "destructive" });
    } finally {
      setShipping((p) => ({ ...p, [orderId]: false }));
    }
  };

  const notifyWhatsApp = (order: Order) => {
    const phone = (order.address?.phone || "").replace(/\D/g, "") || "918897586142";
    const t = tracking[order.id];
    const trackMsg = t?.id ? ` Your tracking ID is ${t.id}.${t.link ? ` Track here: ${t.link}` : ""}` : "";
    const msg = encodeURIComponent(`Hi ${order.address?.name}! 🙏 Your Snakzee order #${order.id} status: *${order.status}*.${trackMsg} Thank you! 🍿`);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  const escapeHtml = (value: unknown) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const invoiceHtml = (order: Order) => {
    const subtotal = (order.items || []).reduce((sum, item) => sum + item.price * item.qty, 0);
    const rows = (order.items || []).map((item, idx) => `
      <tr class="${idx % 2 === 0 ? '' : 'alt-row'}">
        <td class="item-desc">${escapeHtml(item.name)}</td>
        <td class="text-right">${item.qty}</td>
        <td class="text-right">₹${item.price.toFixed(2)}</td>
        <td class="text-right">₹${(item.price * item.qty).toFixed(2)}</td>
      </tr>
    `).join("");

    const statusBadge = order.status === 'delivered' 
      ? `<span style="background:#dcfce7;color:#166534;padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:4px;">✓ ${escapeHtml(order.status)}</span>`
      : order.status === 'cancelled'
      ? `<span style="background:#fee2e2;color:#991b1b;padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:600;">✕ ${escapeHtml(order.status)}</span>`
      : `<span style="background:#fef3c7;color:#92400e;padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:600;">${escapeHtml(order.status)}</span>`;

    return `<!doctype html>
      <html>
        <head>
          <title>Snakzee Invoice #${order.id}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            :root {
              --terracotta: #C8401A;
              --terracotta-dark: #A33215;
              --brown: #3D1A08;
              --cream: #FDF6EC;
              --cream-dark: #F5E6D3;
              --gold: #D4A017;
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
              color: var(--brown); 
              background: #FDF6EC;
              line-height: 1.6;
              -webkit-font-smoothing: antialiased;
            }
            .invoice-container {
              max-width: 800px;
              margin: 32px auto;
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            }
            .invoice-header {
              background: linear-gradient(135deg, var(--terracotta) 0%, var(--terracotta-dark) 100%);
              padding: 32px 40px;
              color: white;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 24px;
            }
            .invoice-header h1 {
              font-family: 'Playfair Display', serif;
              font-size: 32px;
              font-weight: 700;
              margin: 0 0 4px 0;
            }
            .invoice-header .tagline {
              font-size: 13px;
              opacity: 0.85;
            }
            .invoice-meta {
              text-align: right;
              min-width: 180px;
            }
            .invoice-meta .invoice-num {
              font-weight: 600;
              font-size: 15px;
              margin-bottom: 4px;
            }
            .invoice-meta .invoice-date {
              font-size: 13px;
              opacity: 0.85;
            }
            .invoice-body {
              padding: 32px 40px;
            }
            .addresses {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 24px;
              margin-bottom: 32px;
            }
            .address-card {
              background: var(--cream);
              border-radius: 12px;
              padding: 20px;
              border: 1px solid rgba(200,64,26,0.1);
            }
            .address-card h3 {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: var(--brown);
              opacity: 0.5;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .address-card p {
              font-size: 14px;
              margin: 3px 0;
              color: var(--brown);
            }
            .address-card p:first-of-type {
              font-weight: 600;
            }
            .company-banner {
              background: linear-gradient(135deg, var(--cream) 0%, rgba(245,230,211,0.5) 100%);
              border-radius: 12px;
              padding: 16px 20px;
              margin-bottom: 32px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
              border: 1px solid rgba(200,64,26,0.1);
            }
            .company-info {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .company-logo {
              width: 40px;
              height: 40px;
              background: var(--terracotta);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 700;
              font-size: 14px;
              flex-shrink: 0;
            }
            .company-details p {
              font-size: 13px;
              margin: 1px 0;
            }
            .company-details p:first-child {
              font-weight: 600;
            }
            .company-details p:last-child {
              opacity: 0.6;
              font-size: 12px;
            }
            .company-contact {
              display: flex;
              gap: 16px;
              font-size: 13px;
              opacity: 0.7;
            }
            .section-title {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: var(--brown);
              opacity: 0.5;
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid rgba(200,64,26,0.1);
              margin-bottom: 32px;
            }
            .items-table thead th {
              background: var(--terracotta);
              color: white;
              padding: 12px 16px;
              text-align: left;
              font-size: 13px;
              font-weight: 600;
            }
            .items-table thead th.text-right {
              text-align: right;
            }
            .items-table tbody td {
              padding: 12px 16px;
              font-size: 14px;
              border-bottom: 1px solid rgba(200,64,26,0.08);
            }
            .items-table tbody td.text-right {
              text-align: right;
            }
            .items-table tbody tr.alt-row {
              background: var(--cream);
            }
            .items-table tbody tr:last-child td {
              border-bottom: none;
            }
            .item-desc {
              font-weight: 500;
            }
            .summary-section {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 32px;
            }
            .summary-card {
              background: var(--cream);
              border-radius: 12px;
              padding: 20px 24px;
              min-width: 280px;
              border: 1px solid rgba(200,64,26,0.1);
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 6px 0;
              font-size: 14px;
            }
            .summary-row.total {
              border-top: 2px solid rgba(200,64,26,0.2);
              margin-top: 8px;
              padding-top: 12px;
              font-size: 18px;
              font-weight: 700;
            }
            .summary-row.total span:last-child {
              color: var(--terracotta);
              font-family: 'Playfair Display', serif;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              margin-bottom: 24px;
            }
            .info-card {
              background: rgba(253,246,236,0.5);
              border-radius: 12px;
              padding: 16px 20px;
              border: 1px solid rgba(200,64,26,0.1);
            }
            .info-card h3 {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: var(--brown);
              opacity: 0.5;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .info-card p {
              font-size: 13px;
              margin: 2px 0;
              opacity: 0.7;
            }
            .invoice-footer {
              background: var(--cream);
              border-top: 1px solid rgba(200,64,26,0.1);
              padding: 20px 40px;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              align-items: center;
              gap: 16px;
            }
            .footer-info {
              font-size: 12px;
              opacity: 0.6;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .footer-actions {
              display: flex;
              gap: 8px;
            }
            .btn {
              padding: 8px 20px;
              border-radius: 9999px;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              border: none;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              transition: all 0.2s;
            }
            .btn-primary {
              background: var(--terracotta);
              color: white;
            }
            .btn-primary:hover {
              background: var(--terracotta-dark);
            }
            .btn-secondary {
              background: white;
              color: var(--terracotta);
              border: 1px solid var(--terracotta);
            }
            .btn-secondary:hover {
              background: rgba(200,64,26,0.05);
            }
            @media print {
              body { background: white; }
              .invoice-container { margin: 0; border-radius: 0; box-shadow: none; }
              .print-btn, .invoice-footer { display: none !important; }
            }
            @media (max-width: 640px) {
              .invoice-container { margin: 0; border-radius: 0; }
              .invoice-header { padding: 24px; }
              .invoice-body { padding: 20px; }
              .addresses { grid-template-columns: 1fr; }
              .company-banner { flex-direction: column; align-items: flex-start; }
              .info-grid { grid-template-columns: 1fr; }
              .invoice-footer { flex-direction: column; align-items: flex-start; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header -->
            <div class="invoice-header">
              <div>
                <h1>Invoice</h1>
                <p class="tagline">Authentic Telangana Flavors</p>
              </div>
              <div class="invoice-meta">
                <p class="invoice-num">#${order.id}</p>
                <p class="invoice-date">${new Date(order.created_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <div class="invoice-body">
              <!-- Status Badge -->
              <div style="margin-bottom:24px;">${statusBadge}</div>

              <!-- Addresses -->
              <div class="addresses">
                <div class="address-card">
                  <h3>🏢 Ship From</h3>
                  <p>${escapeHtml(FROM_ADDRESS.name)}</p>
                  <p>${escapeHtml(FROM_ADDRESS.line1)}</p>
                  <p>${escapeHtml(FROM_ADDRESS.city)}, ${escapeHtml(FROM_ADDRESS.state)} — ${escapeHtml(FROM_ADDRESS.pincode)}</p>
                  <p>${escapeHtml(FROM_ADDRESS.phone)}</p>
                </div>
                <div class="address-card">
                  <h3>👤 Bill To</h3>
                  <p>${escapeHtml(order.address?.name)}</p>
                  <p>${escapeHtml(order.address?.line1)}${order.address?.line2 ? `, ${escapeHtml(order.address.line2)}` : ""}</p>
                  <p>${escapeHtml(order.address?.city)}, ${escapeHtml(order.address?.state)} — ${escapeHtml(order.address?.pincode)}</p>
                  ${order.address?.phone ? `<p>${escapeHtml(order.address.phone)}</p>` : ""}
                </div>
              </div>

              <!-- Company Banner -->
              <div class="company-banner">
                <div class="company-info">
                  <div class="company-logo">SZ</div>
                  <div class="company-details">
                    <p>Snakzee Foods India Pvt Ltd</p>
                    <p>FSSAI Lic. No.: 20126191000174</p>
                  </div>
                </div>
                <div class="company-contact">
                  <span>📧 support@snakzee.com</span>
                  <span>📞 +91 8464919366</span>
                </div>
              </div>

              <!-- Items Table -->
              <div class="section-title">📦 Order Items</div>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th class="text-right">Qty</th>
                    <th class="text-right">Rate (₹)</th>
                    <th class="text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>

              <!-- Summary -->
              <div class="summary-section">
                <div class="summary-card">
                  <div class="summary-row">
                    <span>Subtotal</span>
                    <span>₹${subtotal.toFixed(2)}</span>
                  </div>
                  ${order.discount ? `<div class="summary-row"><span>Discount ${order.coupon ? "(" + escapeHtml(order.coupon) + ")" : ""}</span><span style="color:#16a34a;">-₹${order.discount.toFixed(2)}</span></div>` : ""}
                  ${order.delivery_fee ? `<div class="summary-row"><span>Delivery</span><span>₹${order.delivery_fee.toFixed(2)}</span></div>` : ""}
                  <div class="summary-row"><span>Tax (10%)</span><span>₹${(subtotal * 0.1).toFixed(2)}</span></div>
                  <div class="summary-row total">
                    <span>Total</span>
                    <span>₹${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <!-- Info Cards -->
              <div class="info-grid">
                ${order.payment_id ? `
                <div class="info-card">
                  <h3>💳 Payment</h3>
                  <p>${escapeHtml(order.payment_id)}</p>
                </div>` : ""}
                <div class="info-card">
                  <h3>📝 Notes</h3>
                  <p>Thank you for shopping with Snakzee!</p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="invoice-footer">
              <div class="footer-info">
                🕐 Generated on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
              </div>
              <div class="footer-actions print-btn">
                <button class="btn btn-secondary" onclick="window.print()">
                  🖨️ Print
                </button>
                <button class="btn btn-primary" onclick="window.print()">
                  📥 Download PDF
                </button>
              </div>
            </div>
          </div>
        </body>
      </html>`;
  };

  const openInvoice = (order: Order) => {
    const invoiceWindow = window.open("", "_blank");
    if (invoiceWindow) {
      invoiceWindow.document.open();
      invoiceWindow.document.write(invoiceHtml(order));
      invoiceWindow.document.close();
    }
    toast({ title: "Invoice opened", description: `Invoice #${order.id} opened in a new tab — use browser Print to save as PDF.` });
  };

  const sendInvoiceWhatsApp = (order: Order) => {
    const phone = (order.address?.phone || "").replace(/\D/g, "") || "918897586142";
    const items = (order.items || []).map((i) => `• ${i.name} ×${i.qty} — ₹${i.price * i.qty}`).join("\n");
    const msg = encodeURIComponent(
      `Hi ${order.address?.name}! 🙏 Please find your *Snakzee Invoice* for Order *#${order.id}* below:\n\n` +
      `*Items:*\n${items}\n\n` +
      `${order.discount ? `*Discount (${order.coupon || ""})* : -₹${order.discount}\n` : ""}` +
      `${order.delivery_fee ? `*Delivery* : ₹${order.delivery_fee}\n` : ""}` +
      `*Total: ₹${order.total}*\n\n` +
      `Thank you for shopping with Snakzee! 🍿`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    toast({ title: "WhatsApp opened", description: "Invoice message pre-filled on WhatsApp." });
  };


  const printLabel = async (orderId: number, trackingId?: string) => {
    if (!trackingId || trackingId.trim() === "") {
      toast({ title: "No AWB", description: "Create a Delhivery shipment first.", variant: "destructive" });
      return;
    }
    // Open Delhivery tracking/label page directly
    window.open(`https://www.delhivery.com/track/package/${trackingId}`, "_blank");
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown">Orders</h1>
          <p className="text-brown-light/40 text-xs font-sans mt-0.5">{orders.length} total</p>
        </div>
        <Link href="/admin/orders/new"
          className="flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white px-5 py-2.5 rounded-xl font-bold font-sans text-sm transition-colors shadow-md shadow-terracotta/20">
          <Plus className="w-4 h-4" /> Record External Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-terracotta/10 p-12 text-center">
          <p className="text-brown-light/50 font-sans">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-terracotta/10 overflow-hidden">
              {/* Header Row */}
              <div className="flex items-center gap-2 sm:gap-4 p-4 sm:p-5 cursor-pointer hover:bg-cream/30 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="font-serif font-bold text-brown text-sm sm:text-base">#{order.id}</span>
                    <span className="text-brown-light/50 text-[10px] sm:text-xs font-sans">{new Date(order.created_at).toLocaleDateString("en-IN")}</span>
                    <span className={`text-[9px] sm:text-[10px] font-bold font-sans px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] || "bg-cream text-brown-light"}`}>{order.status}</span>
                    {order.source && order.source !== "website" && (
                      <span className={`text-[9px] font-bold font-sans px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        order.source === "whatsapp" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                      }`}>
                        {order.source === "whatsapp" ? <MessageCircle className="w-2.5 h-2.5" /> : <Instagram className="w-2.5 h-2.5" />}
                        {order.source}
                      </span>
                    )}
                  </div>
                  <p className="text-brown-light/60 text-[10px] sm:text-xs font-sans mt-0.5 truncate">{order.address?.name} · {order.address?.city}</p>
                </div>
                <span className="font-serif font-bold text-gold text-base sm:text-lg flex-shrink-0">₹{order.total}</span>
                <ChevronDown className={`w-4 h-4 text-brown-light/40 transition-transform flex-shrink-0 ${expanded === order.id ? "rotate-180" : ""}`} />
              </div>

              {/* Expanded Details */}
              {expanded === order.id && (
                <div className="border-t border-terracotta/5 p-5 space-y-5">
                  {/* Addresses */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-cream/50 rounded-xl p-4">
                      <p className="text-[10px] font-sans text-brown-light/40 uppercase tracking-wider mb-2">From (Seller)</p>
                      <p className="font-sans font-bold text-brown text-sm">{FROM_ADDRESS.name}</p>
                      <p className="text-brown-light/60 text-xs font-sans">{FROM_ADDRESS.line1}</p>
                      <p className="text-brown-light/60 text-xs font-sans">{FROM_ADDRESS.city}, {FROM_ADDRESS.state} — {FROM_ADDRESS.pincode}</p>
                      <p className="text-brown-light/60 text-xs font-sans">{FROM_ADDRESS.phone}</p>
                    </div>
                    <div className="bg-cream/50 rounded-xl p-4">
                      <p className="text-[10px] font-sans text-brown-light/40 uppercase tracking-wider mb-2">To (Customer)</p>
                      <p className="font-sans font-bold text-brown text-sm">{order.address?.name}</p>
                      <p className="text-brown-light/60 text-xs font-sans">{order.address?.line1}{order.address?.line2 ? `, ${order.address.line2}` : ""}</p>
                      <p className="text-brown-light/60 text-xs font-sans">{order.address?.city}, {order.address?.state} — {order.address?.pincode}</p>
                      {order.address?.phone && <p className="text-brown-light/60 text-xs font-sans">{order.address.phone}</p>}
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-[10px] font-sans text-brown-light/40 uppercase tracking-wider mb-2">Order Items</p>
                    <div className="space-y-1">
                      {(order.items || []).map((item, j) => (
                        <div key={j} className="flex justify-between text-sm font-sans text-brown-light/70">
                          <span>{item.name} × {item.qty}</span>
                          <span>₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                    {order.discount ? <p className="text-green-600 text-xs font-sans mt-1">Coupon ({order.coupon}): −₹{order.discount}</p> : null}
                    {order.delivery_fee ? <p className="text-brown-light/50 text-xs font-sans">Delivery: ₹{order.delivery_fee}</p> : null}
                    <p className="font-serif font-bold text-gold text-lg mt-2">Total: ₹{order.total}</p>
                  </div>

                  {/* Status + Tracking + Actions */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Status */}
                    <div>
                      <p className="text-[10px] font-sans text-brown-light/40 uppercase tracking-wider mb-2">Update Status</p>
                      <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream border border-terracotta/10 text-brown font-sans text-sm focus:outline-none">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    {/* Tracking */}
                    <div>
                      <p className="text-[10px] font-sans text-brown-light/40 uppercase tracking-wider mb-2">Delhivery Shipment</p>
                      {order.tracking_id && order.tracking_id.trim() !== "" ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                            <span className="text-green-700 font-bold font-sans text-xs">AWB: {order.tracking_id}</span>
                            {order.tracking_link && (
                              <a href={order.tracking_link} target="_blank" rel="noopener noreferrer"
                                className="ml-auto text-terracotta hover:text-terracotta-dark transition-colors">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                          <button onClick={() => createShipment(order.id)} disabled={shipping[order.id]}
                            className="text-xs font-sans text-brown-light/50 hover:text-terracotta transition-colors underline">
                            Re-create shipment
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => createShipment(order.id)} disabled={shipping[order.id]}
                          className="w-full flex items-center justify-center gap-2 bg-terracotta/10 hover:bg-terracotta/20 text-terracotta px-4 py-2.5 rounded-xl text-sm font-semibold font-sans transition-colors disabled:opacity-50">
                          {shipping[order.id] ? "Creating..." : "🚚 Create Delhivery Shipment"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 border-t border-terracotta/5">
                    <button onClick={() => printLabel(order.id, order.tracking_id)}
                      className="flex items-center justify-center gap-2 bg-brown text-cream px-4 py-2.5 rounded-xl text-sm font-semibold font-sans hover:bg-brown-light transition-colors">
                      <Printer className="w-4 h-4" /> Print Shipping Label
                    </button>
                    <button onClick={() => notifyWhatsApp(order)}
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold font-sans transition-colors">
                      <MessageCircle className="w-4 h-4" /> Notify on WhatsApp
                    </button>
                    <button onClick={() => openInvoice(order)}
                      className="flex items-center justify-center gap-2 bg-gold hover:bg-amber-500 text-brown px-4 py-2.5 rounded-xl text-sm font-semibold font-sans transition-colors">
                      <FileText className="w-4 h-4" /> Open Invoice
                    </button>
                    <button onClick={() => sendInvoiceWhatsApp(order)}
                      className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold font-sans transition-colors">
                      <MessageCircle className="w-4 h-4" /> Send Invoice via WhatsApp
                    </button>
                  </div>
                  {/* Notes */}
                  {order.notes && (
                    <div className="bg-gold/5 border border-gold/20 rounded-xl p-3">
                      <p className="text-[10px] font-sans text-brown-light/40 uppercase tracking-wider mb-1">Notes</p>
                      <p className="text-sm font-sans text-brown-light/70">{order.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
