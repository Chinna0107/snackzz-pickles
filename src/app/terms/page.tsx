import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata = { title: "Terms & Conditions — Snakzee", description: "Terms and conditions governing your use of Snakzee website and services." };

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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-gradient-to-r from-terracotta to-terracotta-dark text-cream py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-cream/70 hover:text-cream text-sm font-sans mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cream/20 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold">Terms & Conditions</h1>
          </div>
          <p className="text-cream/70 font-sans text-sm">Last Updated: January 2026 · Snakzee Foods India Pvt. Ltd.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-white rounded-2xl border border-terracotta/10 p-6 sm:p-10 shadow-sm">

          <p className="text-brown-light/70 font-sans text-sm sm:text-base leading-relaxed mb-8 pb-8 border-b border-terracotta/10">
            These Terms & Conditions ("Terms") govern your access to and use of the Snakzee website and services. By accessing or using our Website, you agree to be bound by these Terms. If you do not agree, please do not use the Website.
          </p>

          <Section num="1" title="Use of Website">
            <p className="mb-2">You agree to use this Website only for lawful purposes and must not:</p>
            <ul className="space-y-1"><Bullet>Violate any applicable laws or regulations</Bullet><Bullet>Interfere with the operation or security of the Website</Bullet><Bullet>Engage in fraudulent, abusive, or harmful activities</Bullet></ul>
          </Section>

          <Section num="2" title="User Accounts">
            <p>To place orders, you may be required to create an account. You are responsible for maintaining the confidentiality of your account details and all activities under your account. You agree to provide accurate and up-to-date information.</p>
          </Section>

          <Section num="3" title="Products, Pricing & Availability">
            <p>We strive to display accurate product descriptions, pricing, and availability. However, errors may occur, and Snakzee reserves the right to correct any errors, change prices, or update product information at any time without prior notice.</p>
          </Section>

          <Section num="4" title="Orders & Payments">
            <ul className="space-y-2">
              <Bullet>By placing an order, you agree to pay the total amount including applicable taxes and shipping charges.</Bullet>
              <Bullet>Payments are processed securely through third-party payment gateways.</Bullet>
              <Bullet>Snakzee does not store or process card or banking details.</Bullet>
              <Bullet>We reserve the right to cancel or refuse any order at our discretion. If payment has been made, it will be refunded as per our policy.</Bullet>
            </ul>
          </Section>

          <Section num="5" title="Delivery">
            <p>We will make reasonable efforts to deliver orders within the estimated timeframe. Delivery times may vary due to location, logistics, or factors beyond our control. Snakzee is not responsible for delays caused by third-party delivery partners.</p>
          </Section>

          <Section num="6" title="Returns, Refunds & Cancellations">
            <p>Returns, refunds, and cancellations are subject to our <Link href="/refund-policy" className="text-terracotta hover:underline font-semibold">Refund & Cancellation Policy</Link>, available on the Website. Please review it before placing an order.</p>
          </Section>

          <Section num="7" title="Intellectual Property">
            <p>All content on this Website, including text, images, logos, graphics, and software, is the property of Snakzee and is protected by applicable intellectual property laws. Unauthorized use is prohibited.</p>
          </Section>

          <Section num="8" title="Privacy">
            <p>Your use of the Website is also governed by our <Link href="/privacy-policy" className="text-terracotta hover:underline font-semibold">Privacy Policy</Link>. By using our Services, you consent to the collection and use of information as described in the Privacy Policy.</p>
          </Section>

          <Section num="9" title="Limitation of Liability">
            <p>To the fullest extent permitted by law, Snakzee shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of or inability to use the Website, products, or Services.</p>
          </Section>

          <Section num="10" title="Changes to Terms">
            <p>We may update these Terms at any time. Updated Terms will be posted on this page and will be effective immediately upon posting.</p>
          </Section>

          <Section num="11" title="Governing Law & Jurisdiction">
            <p>These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of <strong>Kurnool District, Andhra Pradesh, India</strong>.</p>
          </Section>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/privacy-policy", label: "Privacy Policy" },
            { href: "/refund-policy", label: "Refund Policy" },
            { href: "/shipping-policy", label: "Shipping Policy" },
            { href: "/terms", label: "Terms & Conditions", active: true },
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
