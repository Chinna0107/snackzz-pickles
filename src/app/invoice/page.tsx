"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Download, Printer, Mail, Phone, MapPin, Building2, Package, CreditCard, CheckCircle2, Clock, FileText, Truck } from "lucide-react";

export default function InvoicePage() {
  // Placeholder invoice data; replace with real data fetching as needed
  const invoice = {
    number: "SZ-98742",
    date: "2026-05-31",
    due: "2026-06-15",
    status: "Paid",
    billing: {
      name: "Kancharla Hemanth",
      address: "Bangalore, Karnataka",
      email: "",
      phone: "+91 8179860935",
    },
    shipping: {
      name: "Snakzee Foods India Pvt Ltd",
      address: "House No 1/2/32, Taka Street, Near Main Road, Jagtial, Telangana - 505327",
      phone: "+91 8464919366",
    },
    items: [
      { description: "Snakzee Pack - 500g", qty: 2, rate: 199, amount: 398 },
      { description: "Gongura Pickles - 250g", qty: 1, rate: 149, amount: 149 },
    ],
    subTotal: 547,
    tax: 54.7,
    shippingCharge: 0,
    discount: 0,
    total: 601.7,
    notes: "Thank you for your purchase!",
    terms: "All sales are final. Delivery within 3-5 business days. Please retain this invoice for warranty purposes.",
    company: {
      name: "Snakzee Foods India Pvt Ltd",
      fssai: "FSSAI Lic. No.: 20126191000174",
      phone: "+91 8464919366",
      email: "support@snakzee.com",
      website: "www.snakzee.com",
    },
  };

  return (
    <div className="min-h-screen bg-cream selection:bg-terracotta/20 font-sans flex flex-col">
      {/* Header */}
      <Header />

      {/* Invoice Content */}
      <main className="flex-1 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <section className="border border-terracotta/20 rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Invoice Header with Brand Colors */}
          <div className="bg-gradient-to-r from-terracotta to-terracotta-dark p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-1">Invoice</h1>
                <p className="text-white/80 text-sm">Authentic Telangana Flavors</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap sm:justify-end">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${
                  invoice.status === "Paid" 
                    ? "bg-green-500/20 text-green-100 border border-green-400/30" 
                    : "bg-yellow-500/20 text-yellow-100 border border-yellow-400/30"
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                  {invoice.status}
                </span>
                <div className="text-right text-white/90">
                  <p className="font-semibold">#{invoice.number}</p>
                  <p className="text-sm text-white/70">Date: {invoice.date}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Body */}
          <div className="p-6 sm:p-8">
            {/* Company Info & Addresses */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Bill To */}
              <div className="bg-cream-dark/30 rounded-xl p-5 border border-terracotta/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-terracotta" />
                  </div>
                  <h2 className="font-sans font-semibold text-brown">Bill To</h2>
                </div>
                <p className="text-brown font-semibold">{invoice.billing.name}</p>
                <p className="text-brown-light/70 text-sm mt-1">{invoice.billing.address}</p>
                {invoice.billing.phone && (
                  <p className="text-brown-light/70 text-sm flex items-center gap-1.5 mt-1">
                    <Phone className="w-3.5 h-3.5" /> {invoice.billing.phone}
                  </p>
                )}
              </div>

              {/* Ship To */}
              <div className="bg-cream-dark/30 rounded-xl p-5 border border-terracotta/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-terracotta" />
                  </div>
                  <h2 className="font-sans font-semibold text-brown">Ship From</h2>
                </div>
                <p className="text-brown font-semibold text-sm">{invoice.shipping.name}</p>
                <p className="text-brown-light/70 text-sm mt-1">{invoice.shipping.address}</p>
                <p className="text-brown-light/70 text-sm flex items-center gap-1.5 mt-1">
                  <Phone className="w-3.5 h-3.5" /> {invoice.shipping.phone}
                </p>
              </div>
            </div>

            {/* Company Details Banner */}
            <div className="bg-gradient-to-r from-cream to-cream-dark/50 rounded-xl p-4 mb-8 border border-terracotta/10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-terracotta flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SZ</span>
                  </div>
                  <div>
                    <p className="font-semibold text-brown text-sm">{invoice.company.name}</p>
                    <p className="text-brown-light/60 text-xs">{invoice.company.fssai}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-brown-light/70">
                  <a href={`mailto:${invoice.company.email}`} className="flex items-center gap-1.5 hover:text-terracotta transition-colors">
                    <Mail className="w-3.5 h-3.5" /> {invoice.company.email}
                  </a>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> {invoice.company.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-terracotta" />
                </div>
                <h2 className="font-sans font-semibold text-brown">Order Items</h2>
              </div>
              <div className="overflow-x-auto rounded-xl border border-terracotta/10">
                <table className="w-full">
                  <thead>
                    <tr className="bg-terracotta text-white">
                      <th className="px-4 py-3 text-left font-sans font-semibold text-sm">Item Description</th>
                      <th className="px-4 py-3 text-right font-sans font-semibold text-sm">Qty</th>
                      <th className="px-4 py-3 text-right font-sans font-semibold text-sm">Rate (₹)</th>
                      <th className="px-4 py-3 text-right font-sans font-semibold text-sm">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, idx) => (
                      <tr key={idx} className={`border-b border-terracotta/10 hover:bg-cream transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-cream/30'}`}>
                        <td className="px-4 py-3 text-brown font-medium">{item.description}</td>
                        <td className="px-4 py-3 text-right text-brown-light/80">{item.qty}</td>
                        <td className="px-4 py-3 text-right text-brown-light/80">₹{item.rate.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-brown">₹{item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Section */}
            <div className="flex flex-col sm:flex-row justify-end gap-6 mb-8">
              <div className="w-full sm:w-80 bg-cream-dark/30 rounded-xl p-5 border border-terracotta/10">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-brown-light/70 font-sans">Subtotal</span>
                    <span className="font-semibold text-brown">₹{invoice.subTotal.toFixed(2)}</span>
                  </div>
                  {invoice.shippingCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-brown-light/70 font-sans">Shipping</span>
                      <span className="font-semibold text-brown">₹{invoice.shippingCharge.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-brown-light/70 font-sans">Discount</span>
                      <span className="font-semibold text-green-600">-₹{invoice.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-brown-light/70 font-sans">Tax (10%)</span>
                    <span className="font-semibold text-brown">₹{invoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-terracotta/20 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-brown font-semibold">Total</span>
                      <span className="font-serif text-2xl font-bold text-terracotta">₹{invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Notes */}
              {invoice.notes && (
                <div className="bg-cream/50 rounded-xl p-5 border border-terracotta/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-terracotta" />
                    </div>
                    <h2 className="font-sans font-semibold text-brown">Notes</h2>
                  </div>
                  <p className="text-brown-light/70 text-sm italic">{invoice.notes}</p>
                </div>
              )}

              {/* Terms */}
              {invoice.terms && (
                <div className="bg-cream/50 rounded-xl p-5 border border-terracotta/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-terracotta" />
                    </div>
                    <h2 className="font-sans font-semibold text-brown">Terms & Conditions</h2>
                  </div>
                  <p className="text-brown-light/70 text-sm">{invoice.terms}</p>
                </div>
              )}
            </div>
          </div>

          {/* Invoice Footer with Actions */}
          <div className="bg-cream border-t border-terracotta/10 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-brown-light/60 text-sm">
                <Clock className="w-4 h-4" />
                <span>Generated on {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-terracotta text-terracotta rounded-full font-sans font-semibold hover:bg-terracotta/5 transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-terracotta text-white rounded-full font-sans font-semibold hover:bg-terracotta-dark transition-colors"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body { background: white; }
          header, footer, .no-print { display: none !important; }
          .invoice-container { box-shadow: none; border: none; }
        }
      `}</style>
    </div>
  );
}