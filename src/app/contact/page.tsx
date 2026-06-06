"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail, MapPin, Clock, Send, Instagram, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getWhatsAppLink } from "@/lib/products";

const CONTACT_METHODS = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "WhatsApp",
    value: "+91 93055 50051",
    desc: "Fastest response — we reply within minutes!",
    href: getWhatsAppLink(),
    color: "bg-green-50 text-green-700 border-green-200",
    btnColor: "bg-[#25D366] hover:bg-[#1ebe5d] text-white",
    btnLabel: "Chat on WhatsApp",
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Phone",
    value: "+91 93055 50051",
    desc: "Call us Mon–Sat, 9 AM – 7 PM",
    href: "tel:+919305550051",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    btnColor: "bg-blue-600 hover:bg-blue-700 text-white",
    btnLabel: "Call Now",
  },
  {
    icon: <Instagram className="w-6 h-6" />,
    title: "Instagram",
    value: "@snak_zee",
    desc: "Follow us for new products & behind-the-scenes",
    href: "https://www.instagram.com/snak_zee",
    color: "bg-pink-50 text-pink-700 border-pink-200",
    btnColor: "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white",
    btnLabel: "Follow Us",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Location",
    value: "Kurnool, Andhra Pradesh, India",
    desc: "We deliver across the world.",
    href: undefined,
    color: "bg-terracotta/10 text-terracotta border-terracotta/20",
    btnColor: "",
    btnLabel: "",
  },
];

const FAQS_QUICK = [
  { q: "How do I place an order?", a: "Click any WhatsApp button — your message is pre-filled. Just hit send!" },
  { q: "What are delivery charges?", a: "Free delivery on orders above ₹1,000 across Telangana and Andhra Pradesh." },
  { q: "How long does delivery take?", a: "2-3 business days. Every item is made fresh after you order." },
  { q: "Do you take bulk orders?", a: "Yes! WhatsApp us for custom bulk pricing for events & weddings." },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", message: "" });
        toast({ title: "Message sent! 🎉", description: "We'll get back to you within 24 hours." });
      } else {
        throw new Error();
      }
    } catch {
      toast({ title: "Something went wrong", description: "Please try WhatsApp for faster support.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="pt-20 sm:pt-24">

        {/* Hero */}
        <section className="bg-gradient-to-br from-brown via-brown-light to-terracotta-dark py-14 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }} />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-white/10 text-cream border-white/20 mb-4 font-sans">📞 Get in Touch</Badge>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream mb-4">Contact Us</h1>
              <p className="text-cream/70 text-lg font-sans">
                Have a question, custom order request, or just want to say hi? We&apos;d love to hear from you!
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Left: Contact Methods + Hours */}
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brown mb-6">Reach Us Directly</h2>
                <div className="space-y-4">
                  {CONTACT_METHODS.map((method, i) => (
                    <div key={i} className={`flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-4 rounded-2xl border ${method.color} bg-white`}>
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${method.color}`}>
                        {method.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-bold text-brown text-base sm:text-lg">{method.title}</p>
                        <p className="font-sans font-semibold text-brown-light text-sm">{method.value}</p>
                        <p className="text-brown-light/50 text-xs font-sans mt-0.5">{method.desc}</p>
                        {method.href && method.btnLabel && (
                          <a href={method.href} target="_blank" rel="noopener noreferrer"
                            className={`inline-flex items-center mt-2 px-4 py-1.5 rounded-full font-semibold text-xs font-sans transition-all hover:scale-105 ${method.btnColor}`}>
                            {method.btnLabel}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Business Hours */}
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-terracotta/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-terracotta" />
                  <h3 className="font-serif text-xl font-bold text-brown">Business Hours</h3>
                </div>
                <div className="space-y-2 font-sans text-sm">
                  {[
                    { day: "Monday – Friday", time: "9:00 AM – 7:00 PM" },
                    { day: "Saturday", time: "9:00 AM – 5:00 PM" },
                    { day: "Sunday", time: "10:00 AM – 2:00 PM" },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-terracotta/5 last:border-0">
                      <span className="text-brown-light/70">{row.day}</span>
                      <span className="font-semibold text-brown">{row.time}</span>
                    </div>
                  ))}
                </div>
                <p className="text-brown-light/40 text-xs font-sans mt-3">WhatsApp orders accepted 24/7 — we process during business hours.</p>
              </motion.div>

              {/* Quick FAQs */}
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-terracotta/10 p-6">
                <h3 className="font-serif text-xl font-bold text-brown mb-4">Quick Answers</h3>
                <div className="space-y-3">
                  {FAQS_QUICK.map((faq, i) => (
                    <div key={i} className="border-b border-terracotta/5 pb-3 last:border-0 last:pb-0">
                      <p className="font-sans font-semibold text-brown text-sm mb-1">{faq.q}</p>
                      <p className="text-brown-light/60 text-xs font-sans">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-white rounded-2xl border border-terracotta/10 p-6 sm:p-8 shadow-sm">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brown mb-2">Send Us a Message</h2>
                <p className="text-brown-light/60 text-sm font-sans mb-6">We&apos;ll get back to you within 24 hours.</p>

                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="font-serif text-2xl font-bold text-brown mb-2">Message Sent! 🎉</h3>
                    <p className="text-brown-light/60 font-sans mb-6">We&apos;ll get back to you within 24 hours. For faster support, WhatsApp us!</p>
                    <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3 rounded-full font-bold font-sans text-sm transition-all hover:scale-105">
                      <MessageCircle className="w-4 h-4" />Chat on WhatsApp
                    </a>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-brown font-sans font-semibold text-sm mb-1.5">Name *</label>
                        <input
                          required
                          type="text"
                          placeholder="Your name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-sans placeholder:text-brown-light/40 focus:outline-none focus:border-terracotta/30"
                        />
                      </div>
                      <div>
                        <label className="block text-brown font-sans font-semibold text-sm mb-1.5">Phone</label>
                        <input
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-sans placeholder:text-brown-light/40 focus:outline-none focus:border-terracotta/30"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-brown font-sans font-semibold text-sm mb-1.5">Email *</label>
                      <input
                        required
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-sans placeholder:text-brown-light/40 focus:outline-none focus:border-terracotta/30"
                      />
                    </div>
                    <div>
                      <label className="block text-brown font-sans font-semibold text-sm mb-1.5">Message *</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us about your order, question, or feedback..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-cream border border-terracotta/10 text-brown text-sm font-sans placeholder:text-brown-light/40 focus:outline-none focus:border-terracotta/30 resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-terracotta hover:bg-terracotta-dark text-white py-3.5 rounded-xl font-bold font-sans text-sm transition-all hover:scale-[1.02] shadow-lg shadow-terracotta/20 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                    <p className="text-center text-brown-light/40 text-xs font-sans">
                      Or for instant support —{" "}
                      <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:underline">
                        WhatsApp us directly
                      </a>
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
