"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "../../data/products";

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-gray-100"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left rtl:text-right"
        aria-expanded={open}
      >
        <span className="pr-4 rtl:pr-0 rtl:pl-4 text-base font-semibold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          {question}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm leading-relaxed text-gray-500">
          {answer}
        </p>
      </div>
    </motion.div>
  );
}

import { usePathname } from "next/navigation";

export default function ProductFAQ({ product }: { product: Product }) {
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const langTrans = product.translations?.[currentLocale] || product.translations?.en;
  const name = langTrans?.name || product.name;
  const faqs = langTrans?.faqs?.length ? langTrans.faqs : (product.faqs ?? []);

  const staticT = {
    en: {
      badge: "FAQ",
      title: "Frequently Asked Questions",
      subtitle: `Find answers to common questions about ${name}`,
    },
    ar: {
      badge: "الأسئلة الشائعة",
      title: "الأسئلة الشائعة حول المنتج",
      subtitle: `إليك إجابات على الأسئلة الشائعة حول ${name}`,
    },
    fr: {
      badge: "FAQ",
      title: "Foire Aux Questions",
      subtitle: `Trouvez les réponses aux questions fréquentes sur ${name}`,
    },
  }[currentLocale] || {
    badge: "FAQ",
    title: "Frequently Asked Questions",
    subtitle: `Find answers to common questions about ${name}`,
  };

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {staticT.badge}
          </span>
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            {staticT.title}
          </h2>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-gray-500">
            {staticT.subtitle}
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          {faqs.map((faq: { question: string; answer: string }, i: number) => (
            <FaqItem key={i} question={faq.question} answer={faq.answer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}