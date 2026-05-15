import Link from "next/link";
import { RefreshCw, ArrowLeft, AlertCircle, CheckCircle2, XCircle, Clock } from "lucide-react";

export const metadata = { title: "Return & Refund Policy — Snakzee", description: "Snakzee's return, refund, and cancellation policy for food orders." };

const Section = ({ num, title, icon, children }: { num: string; title: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="font-serif text-lg sm:text-xl font-bold text-brown mb-3 flex items-center gap-2">
      <span className="w-7 h-7 rounded-full bg-terracotta/10 text-terracotta text-xs font-bold flex items-center justify-center flex-shrink-0">{num}</span>
      {title}
      {icon && <span className="ml-1">{icon}</span>}
    </h2>
    <div className="pl-9 space-y-2 text-brown-light/70 font-sans text-sm sm:text-base leading-relaxed">{children}</div>
  </div>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-terracotta/50 mt-2 flex-shrink-0" /><span>{children}</span></li>
);

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-gradient-to-r from-terracotta to-terracotta-dark text-cream py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-cream/70 hover:text-cream text-sm font-sans mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cream/20 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold">Return & Refund Policy</h1>
          </div>
          <p className="text-cream/70 font-sans text-sm">Last Updated: January 2026 · Snakzee Foods India Pvt. Ltd.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-white rounded-2xl border border-terracotta/10 p-6 sm:p-10 shadow-sm">

          <p className="text-brown-light/70 font-sans text-sm sm:text-base leading-relaxed mb-8 pb-8 border-b border-terracotta/10">
            At Snakzee, we take pride in delivering fresh, high-quality snacks. Please read this policy carefully before placing an order.
          </p>

          {/* Quick summary cards */}
          <div className="grid sm:grid-cols-3 gap-3 mb-10">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="font-serif font-bold text-brown text-sm">Cancel within</p>
              <p className="text-blue-600 font-bold text-xl font-serif">4 hrs</p>
              <p className="text-brown-light/50 text-xs font-sans">of placing order</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="font-serif font-bold text-brown text-sm">Report issues</p>
              <p className="text-green-600 font-bold text-xl font-serif">24 hrs</p>
              <p className="text-brown-light/50 text-xs font-sans">after delivery</p>
            </div>
            <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 text-center">
              <RefreshCw className="w-6 h-6 text-gold mx-auto mb-2" />
              <p className="font-serif font-bold text-brown text-sm">Refund in</p>
              <p className="text-gold font-bold text-xl font-serif">5–7 days</p>
              <p className="text-brown-light/50 text-xs font-sans">business days</p>
            </div>
          </div>

          <Section num="1" title="Order Cancellations">
            <ul className="space-y-2">
              <Bullet>Orders can be cancelled within <strong>4 hours</strong> of placing the order, provided the order has not been processed or shipped.</Bullet>
              <Bullet>Once an order is processed or dispatched, it cannot be cancelled.</Bullet>
            </ul>
            <p className="mt-3 text-terracotta font-semibold">To cancel an order, please contact us immediately.</p>
          </Section>

          <Section num="2" title="Returns & Exchanges">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p>Due to the perishable and food nature of our products, <strong>returns or exchanges are not accepted</strong> once the product is delivered.</p>
            </div>
          </Section>

          <Section num="3" title="Refund Eligibility">
            <p className="mb-2">Refunds are provided only in the following cases:</p>
            <ul className="space-y-1">
              <Bullet>You received a wrong product</Bullet>
              <Bullet>The product was damaged, leaked, or expired on delivery</Bullet>
              <Bullet>Items are missing from your order</Bullet>
            </ul>
          </Section>

          <Section num="4" title="Conditions for Refund">
            <p className="mb-2">To request a refund:</p>
            <ul className="space-y-1.5">
              <Bullet>Contact us <strong>within 24 hours</strong> of delivery</Bullet>
              <Bullet>Share clear photos/videos of the product, outer packaging, and invoice/order details</Bullet>
              <Bullet>Unboxing video is <strong>mandatory</strong> for claims related to missing or wrong products</Bullet>
            </ul>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700 text-sm font-sans">Complaints raised after 24 hours of delivery will not be accepted.</p>
            </div>
          </Section>

          <Section num="5" title="Non-Refundable Cases">
            <p className="mb-2">No refund or exchange will be provided if:</p>
            <ul className="space-y-1">
              <Bullet>Complaint is based on taste or personal preference</Bullet>
              <Bullet>Product is damaged due to improper storage</Bullet>
              <Bullet>Complaint is raised after the allowed time window</Bullet>
              <Bullet>Product has been opened or consumed (except verified issues)</Bullet>
            </ul>
          </Section>

          <Section num="6" title="Refund Processing">
            <ul className="space-y-1.5">
              <Bullet>Once approved, refunds will be credited to the original payment method</Bullet>
              <Bullet>Refunds are processed within <strong>5–7 business days</strong>, depending on your bank or payment provider</Bullet>
              <Bullet>Cash on Delivery (COD) is not available</Bullet>
            </ul>
          </Section>

          <div className="mt-8 pt-6 border-t border-terracotta/10">
            <p className="text-brown-light/60 font-sans text-sm">For questions, visit our <Link href="/contact" className="text-terracotta hover:underline font-semibold">Contact page</Link> or email <a href="mailto:support@snakzee.com" className="text-terracotta hover:underline">support@snakzee.com</a></p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/privacy-policy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms & Conditions" },
            { href: "/shipping-policy", label: "Shipping Policy" },
            { href: "/refund-policy", label: "Refund Policy", active: true },
          ].map((p) => (
            <Link key={p.href} href={p.href}
              className={`text-center py-2.5 px-3 rounded-xl text-xs font-sans font-semibold transition-colors border ${p.active ? "bg-terracotta text-white border-terracotta" : "bg-white text-brown-light border-terracotta/10 hover:border-terracotta/30 hover:text-terracotta"}`}>
              {p.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
