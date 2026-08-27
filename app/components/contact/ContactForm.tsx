"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Send, CheckCircle } from "lucide-react";
import { useTranslations } from '@/app/[locale]/use-translations';
import { useScrollReveal } from "../../hooks";

export default function ContactForm() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";
  const { ref, visible } = useScrollReveal(0.1);

  const directInquiryBadge = currentLocale === "ar" ? "استفسار مباشر" : currentLocale === "fr" ? "Demande Directe" : "Direct Inquiry";

  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    phone: "",
    email: "",
    subject: directInquiryBadge,
    message: "",
  });

  const [hpWebsite, setHpWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        name: formData.fullName,
        company_name: formData.company,
        phone: formData.phone,
        email: formData.email,
        subject: formData.subject || directInquiryBadge,
        message: formData.message,
        hp_website: hpWebsite,
      };

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrorMessage(result.error || "Failed to send message. Please try again.");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl border border-gray-100 bg-white p-8 lg:p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
    >
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-manrope)" }}>
            {t.contact.form.success_title}
          </h3>
          <p className="text-sm text-gray-500 max-w-sm">{t.contact.form.success_desc}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Anti-Spam Honeypot (Hidden) */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="hp_website"
              tabIndex={-1}
              autoComplete="off"
              value={hpWebsite}
              onChange={(e) => setHpWebsite(e.target.value)}
            />
          </div>

          {/* Form Header */}
          <div className="border-b border-gray-100 pb-6">
            <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
              {directInquiryBadge}
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.contact.form.title || "Send Us a Message"}
            </h2>
            <p className="text-sm text-gray-500">
              {t.contact.form.subtitle || "Fill out the form below and our team will get back to you promptly."}
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t.contact.form.full_name}
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-red-primary focus:ring-2 focus:ring-red-primary/10"
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t.contact.form.company_name}
              </label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-red-primary focus:ring-2 focus:ring-red-primary/10"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t.contact.form.phone}
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-red-primary focus:ring-2 focus:ring-red-primary/10"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t.contact.form.email}
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-red-primary focus:ring-2 focus:ring-red-primary/10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t.contact.form.subject_label}
            </label>
            <input
              id="subject"
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder={directInquiryBadge}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-red-primary focus:ring-2 focus:ring-red-primary/10"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t.contact.form.message}
            </label>
            <textarea
              id="message"
              rows={5}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-red-primary py-3.5 text-[13px] font-semibold text-white transition-all duration-250 hover:shadow-lg hover:shadow-red-primary/20 hover:-translate-y-0.5 disabled:opacity-70 cursor-pointer"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                {t.contact.form.submit}
                <Send size={15} className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
}