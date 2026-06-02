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
        <td style="text-align: center;">${idx + 1}</td>
        <td><span style="font-weight: bold; color: #222222;">${escapeHtml(item.name)}</span></td>
        <td style="text-align: center;">-</td>
        <td style="text-align: center;">${item.qty} Packs</td>
        <td style="text-align: right;">₹${item.price.toFixed(2)}</td>
      </tr>
    `).join("");

    return `<!doctype html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Snakzee Invoice #${order.id}</title>
          <style>
              *, *::before, *::after { box-sizing: border-box; }
              @page {
                  size: A4;
                  margin: 15mm 12mm 20mm 12mm;
                  @bottom-right {
                      content: "Page 1 of 1";
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      font-size: 8.5pt;
                      color: #777777;
                  }
              }
              body {
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  color: #333333;
                  margin: 0; padding: 0;
                  font-size: 10pt; line-height: 1.4;
                  background-color: #ffffff;
              }
              .invoice-container { width: 100%; max-width: 100%; }
              .invoice-header { border-bottom: 3px solid #E63A12; padding-bottom: 18px; margin-bottom: 20px; }
              .header-table { width: 100%; border-collapse: collapse; }
              .header-table td { vertical-align: top; padding: 0; }
              .brand-title { font-size: 28pt; font-weight: bold; color: #E63A12; margin: 0; line-height: 0.95; }
              .brand-tagline { font-size: 8.5pt; font-weight: bold; color: #4A1204; margin-top: 4px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
              .invoice-title-block { text-align: right; }
              .invoice-title { font-size: 22pt; font-weight: bold; color: #E63A12; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
              .invoice-meta { margin-top: 8px; font-size: 9.5pt; color: #444444; line-height: 1.5; }
              .addresses-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
              .addresses-table td { width: 50%; vertical-align: top; padding: 12px; border: 1px solid #FFE4DE; }
              .addresses-table td.from-box { background-color: #FFFDFD; border-right: none; }
              .addresses-table td.ship-box { background-color: #FFFAF9; }
              .section-heading { font-size: 9.5pt; font-weight: bold; color: #E63A12; text-transform: uppercase; border-bottom: 1px solid #FFE4DE; padding-bottom: 5px; margin-bottom: 8px; letter-spacing: 0.5px; }
              .address-box { font-size: 9.5pt; color: #555555; line-height: 1.5; }
              .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; margin-top: 10px; }
              .items-table th { background-color: #E63A12; color: #ffffff; font-weight: bold; font-size: 9.5pt; text-align: left; padding: 10px 12px; text-transform: uppercase; }
              .items-table td { padding: 11px 12px; border-bottom: 1px solid #F6EFEF; font-size: 9.5pt; vertical-align: middle; }
              .items-table tr:nth-child(even) td { background-color: #FFFAF9; }
              .totals-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              .totals-table td { padding: 0; vertical-align: top; }
              .terms-cell { width: 55%; padding-right: 25px; }
              .summary-cell { width: 45%; }
              .inner-summary-table { width: 100%; border-collapse: collapse; }
              .inner-summary-table td { padding: 8px 12px; font-size: 10pt; border-bottom: 1px solid #F6EFEF; }
              .inner-summary-table td.label { text-align: right; color: #555555; }
              .inner-summary-table td.value { text-align: right; font-weight: bold; width: 120px; }
              .inner-summary-table tr.grand-total td { background-color: #FFEBE7; border-top: 2px solid #E63A12; border-bottom: 2px double #E63A12; font-weight: bold; color: #E63A12; font-size: 12pt; }
              .terms-title { font-size: 9pt; font-weight: bold; color: #4A1204; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.3px; }
              .terms-list { margin: 0; padding-left: 14px; font-size: 8pt; color: #555555; line-height: 1.5; }
              .terms-list li { margin-bottom: 4px; }
              .amount-words { margin-top: 12px; font-size: 8.5pt; font-style: italic; color: #444444; background-color: #FFFAF9; padding: 7px 11px; border-left: 3px solid #E63A12; border-radius: 2px; }
              .footer-note { margin-top: 45px; text-align: center; font-size: 9pt; color: #777777; border-top: 1px solid #F6EFEF; padding-top: 15px; }
              .thank-you { font-family: Georgia, serif; font-size: 15pt; color: #E63A12; font-style: italic; margin-top: 4px; font-weight: bold; }
              .logo-img-container { display: inline-block; margin-right: 12px; vertical-align: top; }
              .logo-img-container img { display: block; }
              .status-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 15px; }
              .status-badge.delivered { background: #dcfce7; color: #166534; }
              .status-badge.cancelled { background: #fee2e2; color: #991b1b; }
              .status-badge.other { background: #fef3c7; color: #92400e; }
              .print-btn { margin-top: 20px; text-align: center; }
              .print-btn button { padding: 8px 24px; margin: 0 8px; border-radius: 9999px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; }
              .btn-primary { background: #E63A12; color: white; }
              .btn-secondary { background: white; color: #E63A12; border: 1px solid #E63A12; }
              @media print {
                  body { background: white; }
                  .invoice-container { margin: 0; box-shadow: none; }
                  .print-btn { display: none !important; }
                  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              }
          </style>
      </head>
      <body>
      <div class="invoice-container">
          <div class="invoice-header">
              <table class="header-table">
                  <tr>
                      <td>
                          <div class="logo-img-container">
                              <img src="/snakzee-logo.jpg" alt="Snakzee Logo" width="140" height="45" style="object-fit: contain;">
                          </div>
                          <div class="logo-text-group">
                              
                              <div class="brand-tagline">Art of Authentic Snacking</div>
                          </div>
                          <div style="font-size: 9pt; color: #555555; margin-top: 8px; line-height: 1.5;">
                              <strong>Snakzee Foods India Pvt Ltd</strong><br>
                              FSSAI Lic. No.: 20126191000174<br>
                              Phone: +91 95055 50051 | Email: support@snakzee.com<br>
                              Website: www.snakzee.com
                          </div>
                      </td>
                      <td class="invoice-title-block">
                          <div class="invoice-title">Order Invoice</div>
                          <div class="invoice-meta">
                              <strong>Invoice No:</strong> #${order.id}<br>
                              <strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}<br>
                              <strong>Status:</strong> ${escapeHtml(order.status)}
                          </div>
                      </td>
                  </tr>
              </table>
          </div>

          <table class="addresses-table">
              <tr>
                  <td class="from-box">
                      <div class="section-heading">From Address</div>
                      <div class="address-box">
                          <strong>Snakzee Foods India Pvt Ltd</strong><br>
                          57/14-A Sri Raghavendra Swamy Temple,<br>
                          Kurnool, Andhra Pradesh – 518001, India<br>
                          <strong>Phone:</strong> +91 95055 50051
                      </div>
                  </td>
                  <td class="ship-box">
                      <div class="section-heading">Shipping Address</div>
                      <div class="address-box">
                          <strong>${escapeHtml(order.address?.name || "")}</strong><br>
                          ${escapeHtml(order.address?.line1 || "")}${order.address?.line2 ? `, ${escapeHtml(order.address.line2)}` : ""}<br>
                          ${escapeHtml(order.address?.city || "")}, ${escapeHtml(order.address?.state || "")} — ${escapeHtml(order.address?.pincode || "")}, India<br>
                          ${order.address?.phone ? `<strong>Mobile:</strong> ${escapeHtml(order.address.phone)}` : ""}
                      </div>
                  </td>
              </tr>
          </table>

          <table class="items-table">
              <thead>
                  <tr>
                      <th style="width: 8%; text-align: center;">S.No.</th>
                      <th style="width: 44%;">Item Name</th>
                      <th style="width: 18%; text-align: center;">Pack Size</th>
                      <th style="width: 12%; text-align: center;">Quantity</th>
                      <th style="width: 18%; text-align: right;">Price (₹)</th>
                  </tr>
              </thead>
              <tbody>
                  ${rows}
              </tbody>
          </table>

          <table class="totals-table">
              <tr>
                  <td class="terms-cell">
                      <div class="terms-title">Terms & Conditions</div>
                      <ul class="terms-list">
                          <li>Once we receive the order, we will start preparing it.</li>
                          <li>It will take 3-4 days to prepare the order based on the order size.</li>
                          <li>Your order will be dispatched the next day once it is packed safely.</li>
                          <li>We will share the tracking details through WhatsApp once we ship the order.</li>
                          <li>Estimated delivery time will depend on your shipping location and courier availability.</li>
                      </ul>
                      <div class="amount-words">
                          <strong>Total Amount:</strong> ₹${order.total.toFixed(2)}
                      </div>
                  </td>
                  <td class="summary-cell">
                      <table class="inner-summary-table">
                          <tr><td class="label">Subtotal</td><td class="value">₹${subtotal.toFixed(2)}</td></tr>
                          ${order.discount ? `<tr><td class="label">Discount ${order.coupon ? "(" + escapeHtml(order.coupon) + ")" : ""}</td><td class="value" style="color: green;">-₹${order.discount.toFixed(2)}</td></tr>` : ""}
                          ${order.delivery_fee ? `<tr><td class="label">Delivery Charges</td><td class="value">₹${order.delivery_fee.toFixed(2)}</td></tr>` : '<tr><td class="label">Delivery Charges</td><td class="value" style="color: green;">FREE</td></tr>'}
                          <tr class="grand-total"><td class="label">TOTAL PAYABLE:</td><td class="value">₹${order.total.toFixed(2)}</td></tr>
                      </table>
                  </td>
              </tr>
          </table>

          <div class="footer-note">
              This is an electronically generated invoice and requires no physical signature.<br>
              <div class="thank-you">Thank you!!</div>
          </div>

          <div class="print-btn">
              <button class="btn-secondary" onclick="window.print()">🖨️ Print</button>
              <button class="btn-primary" onclick="window.print()">📥 Download PDF</button>
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
