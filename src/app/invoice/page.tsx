"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Download, Printer } from "lucide-react";

export default function InvoicePage() {
  const invoice = {
    number: "SZ-98742",
    date: "2026-05-31",
    paymentMode: "UPI",
    status: "shipped",
    billing: {
      name: "Kancharla Hemanth",
      addressLine1: "Banglore, Karnataka",
      addressLine2: "",
      cityStatePin: "Karnataka — 560068",
      phone: "8179860935",
    },
    shipping: {
      name: "Snakzee Foods India Pvt Ltd",
      addressLine1: "57/14-A Sri Raghavendra Swamy Temple,",
      addressLine2: "Kurnool, Andhra Pradesh – 518001, India",
      phone: "+91 95055 50051",
    },
    items: [
      { sNo: 1, itemName: "Test", packSize: "100g", quantity: 3, price: 1.00 },
    ],
    subtotal: 3.00,
    deliveryCharges: "FREE",
    total: 3.00,
    amountInWords: "Three Rupees Only",
    notes: "Thank you for shopping with Snakzee!",
    terms: [
      "Once we receive the order, we will start preparing it.",
      "It will take 3-4 days to prepare the order based on the order size.",
      "Your order will be dispatched the next day once it is packed safely.",
      "We will share the tracking details through WhatsApp once we ship the order.",
      "Estimated delivery time will depend on your shipping location and courier availability.",
    ],
    company: {
      name: "Snakzee Foods India Pvt Ltd",
      fssai: "FSSAI Lic. No.: 20126191000174",
      email: "support@snakzee.com",
      phone: "+91 95055 50051",
      website: "www.snakzee.com",
    },
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <section className="border border-[#E63A12]/20 rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Invoice Header - Matching PDF Layout */}
          <div className="border-b-[3px] border-[#E63A12] p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              {/* Left Side - Brand & Company Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {/* Logo SVG matching PDF */}
                  <svg width="60" height="45" viewBox="0 0 100 75" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <path d="M85,30 C95,20 98,5 85,2 C72,-1 65,15 62,25 C55,20 45,22 40,28 C32,25 20,30 18,38 C15,45 22,55 35,58 C45,60 55,55 60,48 C65,58 78,60 85,52 C95,42 90,35 85,30 Z" fill="#E63A12"/>
                    <circle cx="48" cy="32" r="3" fill="#ffffff"/>
                    <circle cx="72" cy="35" r="4" fill="#E63A12"/>
                    <circle cx="78" cy="28" r="3" fill="#E63A12"/>
                  </svg>
                  <div>
                    <h1 className="font-serif text-4xl font-bold text-[#E63A12] leading-tight">Snakzee</h1>
                    <p className="text-xs font-bold text-[#4A1204] uppercase tracking-wider mt-1">Art of Authentic Snacking</p>
                  </div>
                </div>
                <div className="text-sm text-[#555] mt-3 leading-relaxed">
                  <strong className="text-[#333]">{invoice.company.name}</strong><br/>
                  {invoice.company.fssai}<br/>
                  Phone: {invoice.company.phone} | Email: {invoice.company.email}<br/>
                  Website: {invoice.company.website}
                </div>
              </div>

              {/* Right Side - Invoice Title & Meta */}
              <div className="text-right flex-shrink-0">
                <h2 className="text-3xl font-bold text-[#E63A12] uppercase tracking-wide mb-3">Order Invoice</h2>
                <div className="text-sm text-[#444] leading-relaxed">
                  <p><strong>Invoice No:</strong> #{invoice.number}</p>
                  <p><strong>Date:</strong> {invoice.date}</p>
                  <p><strong>Payment Mode:</strong> {invoice.paymentMode}</p>
                </div>
                {invoice.status && (
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold mt-3 ${
                    invoice.status === "shipped" 
                      ? "bg-green-500/20 text-green-700 border border-green-400/30" 
                      : "bg-yellow-500/20 text-yellow-700 border border-yellow-400/30"
                  }`}>
                    ✓ {invoice.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Body */}
          <div className="p-6 sm:p-8">
            {/* Addresses - Side by Side matching PDF */}
            <table className="w-full mb-6">
              <tbody>
                <tr>
                  <td className="w-1/2 align-top p-3 bg-[#FFFDFD] border border-[#FFE4DE] rounded-l">
                    <h3 className="text-sm font-bold text-[#E63A12] uppercase tracking-wide mb-2 border-b border-[#FFE4DE] pb-1">From Address</h3>
                    <div className="text-sm text-[#555] leading-relaxed">
                      <strong className="text-[#333]">Snakzee Foods India Pvt Ltd</strong><br/>
                      57/14-A Sri Raghavendra Swamy Temple,<br/>
                      Kurnool, Andhra Pradesh – 518001, India<br/>
                      <strong className="text-[#333]">Phone:</strong> +91 95055 50051
                    </div>
                  </td>
                  <td className="w-1/2 align-top p-3 bg-[#FFFAF9] border border-[#FFE4DE] rounded-r">
                    <h3 className="text-sm font-bold text-[#E63A12] uppercase tracking-wide mb-2 border-b border-[#FFE4DE] pb-1">Shipping Address</h3>
                    <div className="text-sm text-[#555] leading-relaxed">
                      <strong className="text-[#333]">{invoice.billing.name}</strong><br/>
                      {invoice.billing.addressLine1},<br/>
                      {invoice.billing.addressLine2}<br/>
                      {invoice.billing.cityStatePin}, India<br/>
                      <strong className="text-[#333]">Mobile:</strong> {invoice.billing.phone}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Items Table - Matching PDF */}
            <div className="mb-6">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#E63A12] text-white">
                    <th className="px-4 py-3 text-center font-semibold text-sm" style={{width: '8%'}}>S.No.</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm" style={{width: '44%'}}>Item Name</th>
                    <th className="px-4 py-3 text-center font-semibold text-sm" style={{width: '18%'}}>Pack Size</th>
                    <th className="px-4 py-3 text-center font-semibold text-sm" style={{width: '12%'}}>Quantity</th>
                    <th className="px-4 py-3 text-right font-semibold text-sm" style={{width: '18%'}}>Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, idx) => (
                    <tr key={idx} className={`border-b border-[#F6EFEF] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FFFAF9]'}`}>
                      <td className="px-4 py-3 text-center text-[#555]">{item.sNo}</td>
                      <td className="px-4 py-3 text-[#222] font-medium">{item.itemName}</td>
                      <td className="px-4 py-3 text-center text-[#555]">{item.packSize}</td>
                      <td className="px-4 py-3 text-center text-[#555]">{item.quantity} Packs</td>
                      <td className="px-4 py-3 text-right font-semibold text-[#333]">₹{item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Terms & Summary - Side by Side matching PDF */}
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="align-top pr-6" style={{width: '55%'}}>
                    <h3 className="text-sm font-bold text-[#4A1204] uppercase tracking-wide mb-2">Terms & Conditions</h3>
                    <ul className="text-xs text-[#555] leading-relaxed pl-5 space-y-1">
                      {invoice.terms.map((term, idx) => (
                        <li key={idx}>{term}</li>
                      ))}
                    </ul>
                    <div className="mt-3 text-xs italic text-[#444] bg-[#FFFAF9] p-2 border-l-[3px] border-[#E63A12] rounded">
                      <strong>Total Amount in Words:</strong> {invoice.amountInWords}
                    </div>
                  </td>
                  <td className="align-top" style={{width: '45%'}}>
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="py-2 text-right text-[#555]">Subtotal</td>
                          <td className="py-2 text-right font-bold text-[#333]">₹{invoice.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-right text-[#555]">Delivery Charges</td>
                          <td className="py-2 text-right font-bold text-green-600">{invoice.deliveryCharges}</td>
                        </tr>
                        <tr className="bg-[#FFEBE7] border-t-2 border-b-2 border-[#E63A12]">
                          <td className="py-3 text-right font-bold text-[#E63A12] text-lg">TOTAL PAYABLE:</td>
                          <td className="py-3 text-right font-bold text-[#E63A12] text-lg">₹{invoice.total.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer - Matching PDF */}
          <div className="bg-[#FDF6EC] border-t border-[#F6EFEF] p-6 sm:p-8">
            <div className="text-center text-sm text-[#777]">
              This is an electronically generated invoice and requires no physical signature.
              <div className="font-serif text-lg text-[#E63A12] italic font-bold mt-1">Thank you!!</div>
            </div>
            <div className="flex justify-center gap-3 mt-6 no-print">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E63A12] text-[#E63A12] rounded-full font-semibold hover:bg-[#E63A12]/5 transition-colors"
              >
                <Printer className="w-4 h-4" /> 🖨️ Print
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#E63A12] text-white rounded-full font-semibold hover:bg-[#A33215] transition-colors"
              >
                <Download className="w-4 h-4" /> 📥 Download PDF
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        @media print {
          body { background: white; }
          header, footer, .no-print { display: none !important; }
          .invoice-container { box-shadow: none; border: none; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
}