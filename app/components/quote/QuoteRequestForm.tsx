"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  DollarSign,
  ShieldCheck,
  HeadphonesIcon,
  Package,
  UserCheck,
  Send,
  Loader2,
} from "lucide-react";
import { useTranslations } from '@/app/[locale]/use-translations';

const benefitIcons = [Clock, DollarSign, ShieldCheck, HeadphonesIcon, Package, UserCheck];

export default function QuoteRequestForm() {
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const t = useTranslations();
  const formT = t.quote.form;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hpWebsite, setHpWebsite] = useState("");

  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    email: "",
    businessType: "",
    products: [] as string[],
    volume: "",
    contactMethod: "",
    message: "",
  });

  const [provinces, setProvinces] = useState("58");
  const [official, setOfficial] = useState("100%");
  const [partners, setPartners] = useState("1000+");
  const [response, setResponse] = useState("24h");
  const [dbProducts, setDbProducts] = useState<string[]>([]);

  useEffect(() => {
    async function loadStatsAndProducts() {
      try {
        const res = await fetch("/api/preferences");
        if (res.ok) {
          const data = await res.json();
          if (data.statistics) {
            setProvinces(data.statistics.provincesServed || "58");
            setOfficial(data.statistics.officialProducts || "100%");
            setPartners(data.statistics.businessPartners || "1000+");
            setResponse(data.statistics.averageResponse || "24h");
          }
        }
      } catch {}

      try {
        const prodRes = await fetch("/api/products");
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (Array.isArray(prodData)) {
            const publishedNames = prodData
              .filter((p) => !p.status || p.status === "Published")
              .map((p) => {
                const lang = p.translations?.[currentLocale] || p.translations?.en || {};
                return lang.name || p.slug;
              });
            if (publishedNames.length > 0) {
              setDbProducts(publishedNames);
            }
          }
        }
      } catch {}
    }
    loadStatsAndProducts();
  }, [currentLocale]);

  const handleProductChange = (product: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter((p) => p !== product)
        : [...prev.products, product],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          hp_website: hpWebsite,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit quote request.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const stats = [
    { value: provinces, label: formT.stats.provinces },
    { value: official, label: formT.stats.official },
    { value: partners, label: formT.stats.partners },
    { value: response, label: formT.stats.response },
  ];

  return (
    <section
      id="quote-form"
      className="py-24 lg:py-32 bg-[#F8FAFC]"
    >
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">
          {/* Left - Quote Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 p-8 lg:p-12">
              {/* Form Header */}
              <div className="mb-10">
                <h2
                  className="text-2xl font-extrabold text-gray-900 mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formT.title}
                </h2>
                <p className="text-gray-500">
                  {formT.subtitle}
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-center font-medium">
                  {formT.success_message}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field for anti-spam */}
                  <input
                    type="text"
                    name="hp_website"
                    value={hpWebsite}
                    onChange={(e) => setHpWebsite(e.target.value)}
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                      {errorMsg}
                    </div>
                  )}
                  {/* Business Name */}
                  <div>
                    <label
                      htmlFor="businessName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      {formT.business_name}
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      required
                      value={formData.businessName}
                      onChange={(e) =>
                        setFormData({ ...formData, businessName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                      placeholder={formT.business_name_placeholder}
                    />
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label
                      htmlFor="contactPerson"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      {formT.contact_person}
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={(e) =>
                        setFormData({ ...formData, contactPerson: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                      placeholder={formT.contact_person_placeholder}
                    />
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        {formT.phone}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        dir="ltr"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                        placeholder={formT.phone_placeholder}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        {formT.email}
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                        placeholder={formT.email_placeholder}
                      />
                    </div>
                  </div>

                  {/* Business Type */}
                  <div>
                    <label
                      htmlFor="businessType"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      {formT.business_type}
                    </label>
                    <select
                      id="businessType"
                      required
                      value={formData.businessType}
                      onChange={(e) =>
                        setFormData({ ...formData, businessType: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                    >
                      <option value="">{formT.business_type_select}</option>
                      {formT.business_types.map((type: string) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Products Needed */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {formT.products_needed}
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {(dbProducts.length > 0 ? dbProducts : formT.product_options).map((product: string) => (
                        <label
                          key={product}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                            formData.products.includes(product)
                              ? "border-red-primary bg-red-primary/5 text-red-primary font-medium"
                              : "border-gray-200 hover:border-gray-300 text-gray-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.products.includes(product)}
                            onChange={() => handleProductChange(product)}
                            className="w-4 h-4 text-red-primary rounded border-gray-300 focus:ring-red-primary"
                          />
                          <span className="text-sm">{product}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Volume */}
                  <div>
                    <label
                      htmlFor="volume"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      {formT.estimated_volume}
                    </label>
                    <select
                      id="volume"
                      required
                      value={formData.volume}
                      onChange={(e) =>
                        setFormData({ ...formData, volume: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                    >
                      <option value="">{formT.volume_select}</option>
                      {formT.volume_ranges.map((range: string) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {formT.preferred_contact}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {formT.contact_methods.map((method: string) => (
                        <label
                          key={method}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm transition-all duration-200 cursor-pointer ${
                            formData.contactMethod === method
                              ? "border-red-primary bg-red-primary text-white font-medium shadow-md shadow-red-primary/20"
                              : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="contactMethod"
                            value={method}
                            checked={formData.contactMethod === method}
                            onChange={(e) =>
                              setFormData({ ...formData, contactMethod: e.target.value })
                            }
                            className="sr-only"
                          />
                          <span>{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      {formT.notes}
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary resize-none"
                      placeholder={formT.notes_placeholder}
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-red-primary text-white font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-red-primary/25 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        {formT.submit_button}
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right - Benefits & Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Benefits Card */}
            <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 p-8">
              <h3
                className="text-xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {formT.benefits_title}
              </h3>

              <div className="space-y-5">
                {formT.benefits.map((benefit: { title: string; description: string }, idx: number) => {
                  const IconComponent = benefitIcons[idx] || Clock;
                  return (
                    <div key={benefit.title} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-primary/10 flex items-center justify-center shrink-0">
                        <IconComponent size={18} className="text-red-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          {benefit.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {benefit.description.replace("58", provinces)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-5 text-center shadow-lg shadow-gray-200/50 border border-gray-100"
                >
                  <div
                    className="text-2xl font-extrabold text-red-primary mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}