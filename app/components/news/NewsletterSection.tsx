"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CreditCard, Smartphone, Send } from "lucide-react";
import { useTranslations } from '@/app/[locale]/use-translations';

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const t = useTranslations();
  const newsT = t.newsPage?.newsletter || {
    badge: "Stay Updated",
    title: "Subscribe to STI News & Updates",
    subtitle: "Get the latest telecom news, wholesale promotions, and official announcements delivered directly to your inbox.",
    input_placeholder: "Enter your email address",
    button: "Subscribe Now",
    success_message: "Thank you for subscribing to STI News!",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("Newsletter signup:", email);
  };

  return (
    <section id="newsletter" className="py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden"
        >
          <div className="grid lg:grid-cols-[25%_75%]">
            {/* Left - Illustration */}
            <div className="relative bg-gradient-to-br from-red-primary/5 to-white p-8 flex items-center justify-center min-h-[280px] border-b lg:border-b-0 lg:border-r border-gray-100">
              {/* Envelope */}
              <div className="relative">
                <div className="w-32 h-24 bg-white rounded-xl shadow-lg border border-gray-100 p-3 transform -rotate-6">
                  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white rounded-lg flex items-center justify-center">
                    <Mail size={32} className="text-red-primary/40" />
                  </div>
                </div>
                {/* Recharge Cards */}
                <div className="absolute -bottom-4 -right-8 space-y-1 transform rotate-12 rtl:-right-auto rtl:-left-8">
                  <div className="w-16 h-10 bg-red-primary rounded-lg shadow-md shadow-red-primary/20 flex items-center justify-center">
                    <CreditCard size={12} className="text-white" />
                  </div>
                  <div className="w-16 h-10 bg-white rounded-lg shadow-md border border-gray-100 flex items-center justify-center">
                    <span className="text-red-primary text-[6px] font-bold">OOREDOO</span>
                  </div>
                </div>
                {/* SIM Card */}
                <div className="absolute -top-2 -left-6 transform -rotate-12 rtl:-left-auto rtl:-right-6">
                  <div className="w-12 h-8 bg-white rounded-md shadow-md border border-gray-100 flex items-center justify-center">
                    <Smartphone size={10} className="text-red-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
                {newsT.badge}
              </span>
              <h2
                className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {newsT.title}
              </h2>
              <p className="text-gray-500 mb-6 max-w-lg leading-relaxed">
                {newsT.subtitle}
              </p>

              {submitted ? (
                <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 font-medium text-sm">
                  {newsT.success_message}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={newsT.input_placeholder}
                    required
                    className="flex-1 px-5 py-3.5 rounded-full border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-red-primary text-white font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-red-primary/25 shrink-0"
                  >
                    <Send size={16} />
                    {newsT.button}
                  </motion.button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}