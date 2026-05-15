import Link from "next/link";
import Footer from "@/components/Footer";
import { Truck, ArrowLeft, Clock, Package, MapPin, AlertCircle } from "lucide-react";

export const metadata = { title: "Shipping & Delivery Policy — Snakzee", description: "Snakzee's shipping timelines, charges, and delivery information." };

const Section = ({ num, title, children }: { num: string; title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="font-serif text-lg sm:text-xl font-bold text-brown mb-3 flex items-center gap-2">
      <span className="w-7 h-7 rounded-full bg-terracotta/10 text-terracotta text-xs font-bold flex items-center justify-center flex-shrink-0">{num}</span>
      {title}
    </h2>
    <div className="pl-9 space-y-2 text-brown-light/70 font-sans text-sm sm:text-base leading-relaxed">{children}</div>
  </div>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-terracotta/50 mt-2 flex-shrink-0" /><span>{children}</span></li>
);

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-gradient-to-r from-terracotta to-terracotta-dark text-cream py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-cream/70 hover:text-cream text-sm font-sans mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cream/20 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold">Shipping & Delivery Policy</h1>
          </div>
          <p className="text-cream/70 font-sans text-sm">Last Updated: January 2026 · Snakzee Foods India Pvt. Ltd.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-white rounded-2xl border border-terracotta/10 p-6 sm:p-10 shadow-sm">

          <p className="text-brown-light/70 font-sans text-sm sm:text-base leading-relaxed mb-8 pb-8 border-b border-terracotta/10">
            At Snakzee, we strive to deliver your snacks safely and on time. Please read the details below regarding our shipping process.
          </p>

          {/* Timeline cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {[
              { icon: <Package className="w-5 h-5" />, label: "Processing", value: "2–3 days", color: "bg-blue-50 border-blue-100 text-blue-600" },
              { icon: <Truck className="w-5 h-5" />, label: "Dispatch", value: "3 days", color: "bg-purple-50 border-purple-100 text-purple-600" },
              { icon: <MapPin className="w-5 h-5" />, label: "Delivery (India)", value: "2–7 days", color: "bg-green-50 border-green-100 text-green-600" },
              { icon: <Clock className="w-5 h-5" />, label: "Max Delivery", value: "15 days", color: "bg-gold/10 border-gold/20 text-gold" },
            ].map((c) => (
              <div key={c.label} className={`border rounded-xl p-3 text-center ${c.color}`}>
                <div className="flex justify-center mb-1">{c.icon}</div>
                <p className="font-bold text-lg font-serif">{c.value}</p>
                <p className="text-[11px] font-sans opacity-80">{c.label}</p>
              </div>
            ))}
          </div>

          <Section num="1" title="Order Processing Time">
            <ul className="space-y-1">
              <Bullet>Orders are processed within <strong>2–3 business days</strong>, excluding weekends and public holidays.</Bullet>
              <Bullet>Orders placed on weekends or holidays will be processed on the next business day.</Bullet>
            </ul>
          </Section>

          <Section num="2" title="Shipping & Delivery Timeline">
            <p className="font-semibold text-brown mb-2">Domestic Shipping (India)</p>
            <ul className="space-y-1 mb-5">
              <Bullet>Orders are shipped within <strong>3 business days</strong> after processing.</Bullet>
              <Bullet>Estimated delivery time: <strong>2–7 business days</strong></Bullet>
              <Bullet>In some cases, delivery may take up to <strong>15 days</strong>, depending on location and courier availability.</Bullet>
            </ul>
            <p className="font-semibold text-brown mb-2">International Shipping</p>
            <ul className="space-y-1">
              <Bullet>International orders are dispatched within <strong>5 days</strong>.</Bullet>
              <Bullet>Estimated delivery time: <strong>7–25 days</strong>, depending on destination and customs clearance.</Bullet>
              <Bullet>Customs duties, taxes, or additional charges (if any) are the customer's responsibility.</Bullet>
            </ul>
          </Section>

          <Section num="3" title="Delivery Factors">
            <p className="mb-2">Delivery timelines may vary based on:</p>
            <ul className="space-y-1">
              <Bullet>Product availability</Bullet>
              <Bullet>Delivery pin code</Bullet>
              <Bullet>Courier partner operations</Bullet>
              <Bullet>Weather, holidays, or customs delays</Bullet>
            </ul>
            <p className="mt-3">Some courier partners do not operate on Sundays or public holidays.</p>
          </Section>

          <Section num="4" title="Shipping Charges">
            <ul className="space-y-1">
              <Bullet>Shipping charges are calculated based on order weight and delivery location.</Bullet>
              <Bullet>Free shipping is available on orders above <strong>₹1,000</strong> (if applicable).</Bullet>
            </ul>
          </Section>

          <Section num="5" title="Delivery Attempts">
            <ul className="space-y-1">
              <Bullet>Orders are delivered to the address provided at checkout.</Bullet>
              <Bullet>If the customer is unavailable, the courier partner may attempt delivery up to two additional times.</Bullet>
              <Bullet>Delivery usually occurs between <strong>9:00 AM and 6:00 PM</strong>.</Bullet>
            </ul>
          </Section>

          <Section num="6" title="Order Tracking">
            <ul className="space-y-1">
              <Bullet>Once shipped, you will receive tracking details via SMS or email.</Bullet>
              <Bullet>Orders can be tracked through the "Track Order" section on our website.</Bullet>
              <Bullet>Tracking information may take up to <strong>24 hours</strong> to update.</Bullet>
            </ul>
          </Section>

          <Section num="7" title="Delivered but Not Received">
            <p className="mb-3">If tracking shows "Delivered" but you haven't received the order:</p>
            <ol className="space-y-2 list-none">
              {["Check with family members, neighbours, or security", "Wait until the end of the day", "Contact us within 3 business days of delivery status"].map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-terracotta/10 text-terracotta text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700 text-sm font-sans">Claims raised after this period may not be eligible for support.</p>
            </div>
          </Section>

          <Section num="8" title="Incorrect Address">
            <ul className="space-y-1">
              <Bullet>Customers are responsible for providing accurate shipping details.</Bullet>
              <Bullet>Additional shipping charges may apply for re-delivery due to incorrect address information.</Bullet>
            </ul>
          </Section>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/privacy-policy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms & Conditions" },
            { href: "/refund-policy", label: "Refund Policy" },
            { href: "/shipping-policy", label: "Shipping Policy", active: true },
          ].map((p) => (
            <Link key={p.href} href={p.href}
              className={`text-center py-2.5 px-3 rounded-xl text-xs font-sans font-semibold transition-colors border ${p.active ? "bg-terracotta text-white border-terracotta" : "bg-white text-brown-light border-terracotta/10 hover:border-terracotta/30 hover:text-terracotta"}`}>
              {p.label}
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
