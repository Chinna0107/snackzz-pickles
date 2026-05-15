import Link from "next/link";
import Footer from "@/components/Footer";
import { Shield, Mail, Phone, Globe, MapPin, ArrowLeft } from "lucide-react";

export const metadata = { title: "Privacy Policy — Snakzee", description: "How Snakzee collects, uses, and protects your personal information." };

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

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-terracotta to-terracotta-dark text-cream py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-cream/70 hover:text-cream text-sm font-sans mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cream/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-cream/70 font-sans text-sm">Last Updated: January 2026 · Snakzee Foods India Pvt. Ltd.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-white rounded-2xl border border-terracotta/10 p-6 sm:p-10 shadow-sm">

          <p className="text-brown-light/70 font-sans text-sm sm:text-base leading-relaxed mb-8 pb-8 border-b border-terracotta/10">
            Snakzee ("Company", "we", "us", or "our") values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, place an order, or interact with our services. By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy.
          </p>

          <Section num="1" title="Interpretation and Definitions">
            <p className="font-semibold text-brown mb-2">Definitions</p>
            <ul className="space-y-1.5">
              <Bullet><strong>Company:</strong> Snakzee Foods India Pvt. Ltd.</Bullet>
              <Bullet><strong>Website:</strong> Snakzee's official website</Bullet>
              <Bullet><strong>Service:</strong> The website and related services provided by Snakzee</Bullet>
              <Bullet><strong>Personal Data:</strong> Any information that identifies or can be linked to an individual</Bullet>
              <Bullet><strong>Usage Data:</strong> Data collected automatically while using the Service</Bullet>
              <Bullet><strong>Cookies:</strong> Small files stored on your device to enhance website functionality</Bullet>
              <Bullet><strong>You:</strong> The individual accessing or using the Service</Bullet>
              <Bullet><strong>Country:</strong> India</Bullet>
            </ul>
          </Section>

          <Section num="2" title="Information We Collect">
            <p className="font-semibold text-brown mb-1">Personal Information</p>
            <ul className="space-y-1 mb-4"><Bullet>Name</Bullet><Bullet>Email address</Bullet><Bullet>Phone number</Bullet><Bullet>Shipping & billing address</Bullet><Bullet>Order and transaction details</Bullet></ul>
            <p className="font-semibold text-brown mb-1">Payment Information</p>
            <p className="mb-4">Payments are processed securely through third-party payment gateways. Snakzee does not store your card or banking details.</p>
            <p className="font-semibold text-brown mb-1">Usage Data</p>
            <ul className="space-y-1"><Bullet>IP address</Bullet><Bullet>Browser type & version</Bullet><Bullet>Pages visited</Bullet><Bullet>Time spent on pages</Bullet><Bullet>Device identifiers</Bullet></ul>
          </Section>

          <Section num="3" title="Cookies and Tracking Technologies">
            <p className="mb-2">We use cookies and similar technologies to:</p>
            <ul className="space-y-1 mb-3"><Bullet>Improve website performance</Bullet><Bullet>Remember user preferences</Bullet><Bullet>Analyze website traffic</Bullet></ul>
            <p>You may disable cookies in your browser, but some features may not function properly.</p>
          </Section>

          <Section num="4" title="How We Use Your Information">
            <ul className="space-y-1"><Bullet>Process and deliver orders</Bullet><Bullet>Provide customer support</Bullet><Bullet>Improve our products and website</Bullet><Bullet>Send order updates and service notifications</Bullet><Bullet>Send promotional emails (only with your consent)</Bullet><Bullet>Prevent fraud and ensure platform security</Bullet></ul>
          </Section>

          <Section num="5" title="Sharing of Information">
            <p className="mb-3">We do not sell or rent your personal data. We may share information with:</p>
            <ul className="space-y-1"><Bullet>Payment processors</Bullet><Bullet>Shipping and logistics partners</Bullet><Bullet>Website hosting and analytics providers</Bullet><Bullet>Legal authorities when required by law</Bullet></ul>
            <p className="mt-3">All partners are required to protect your data.</p>
          </Section>

          <Section num="6" title="Data Retention">
            <p className="mb-2">We retain personal information only as long as necessary to:</p>
            <ul className="space-y-1"><Bullet>Fulfill orders</Bullet><Bullet>Meet legal and regulatory requirements</Bullet><Bullet>Resolve disputes</Bullet><Bullet>Enforce agreements</Bullet></ul>
            <p className="mt-3">Usage data may be retained for analytics and security purposes.</p>
          </Section>

          <Section num="7" title="Data Security">
            <p>We use industry-standard security measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </Section>

          <Section num="8" title="Your Rights">
            <p className="mb-2">You have the right to:</p>
            <ul className="space-y-1"><Bullet>Access your personal information</Bullet><Bullet>Request correction or deletion</Bullet><Bullet>Withdraw consent for marketing communications</Bullet><Bullet>Request a copy of your stored data</Bullet></ul>
            <p className="mt-3">To exercise these rights, contact us using the details below.</p>
          </Section>

          <Section num="9" title="Children's Privacy">
            <p>Snakzee does not knowingly collect personal information from children under the age of 13. If such data is discovered, it will be deleted promptly.</p>
          </Section>

          <Section num="10" title="Third-Party Links">
            <p>Our website may contain links to third-party websites. We are not responsible for their privacy practices and encourage you to review their policies.</p>
          </Section>

          <Section num="11" title="International Data Transfers">
            <p>Your information may be processed outside your state or country. We ensure appropriate safeguards are in place for such transfers.</p>
          </Section>

          <Section num="12" title="Changes to This Privacy Policy">
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date.</p>
          </Section>

          <Section num="13" title="Contact Us">
            <div className="bg-cream rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-terracotta flex-shrink-0" /><a href="mailto:support@snakzee.com" className="hover:text-terracotta transition-colors">support@snakzee.com</a></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-terracotta flex-shrink-0" /><a href="tel:+919505550051" className="hover:text-terracotta transition-colors">+91 9505550051</a></div>
              <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-terracotta flex-shrink-0" /><a href="https://www.snakzee.com" target="_blank" rel="noopener noreferrer" className="hover:text-terracotta transition-colors">www.snakzee.com</a></div>
              <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" /><span>57/14-A, Sri Raghavendra Swamy Temple, Kurnool, 518001, A.P, India</span></div>
            </div>
          </Section>
        </div>

        {/* Policy Nav */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/terms", label: "Terms & Conditions" },
            { href: "/refund-policy", label: "Refund Policy" },
            { href: "/shipping-policy", label: "Shipping Policy" },
            { href: "/privacy-policy", label: "Privacy Policy", active: true },
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
