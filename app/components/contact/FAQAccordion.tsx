"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from '@/app/[locale]/use-translations';
import { useScrollReveal } from "../../hooks";

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-100 py-5 transition-colors">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <span
          className="text-base sm:text-lg font-bold text-gray-900 pr-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 text-red-primary"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pt-3">
              <p className="text-sm sm:text-base leading-relaxed text-gray-500">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { usePathname } from "next/navigation";

export default function FAQAccordion() {
  const { ref, visible } = useScrollReveal();
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqBadge = currentLocale === "ar" ? "الدعم والأسئلة الشائعة" : currentLocale === "fr" ? "Support & FAQ" : "Support & FAQ";
  const faqSubtitle = currentLocale === "ar"
    ? "إليك إجابات على الأسئلة الأكثر شيوعاً حول خدمات توزيع منتجات أوريدو والدعم الفني."
    : currentLocale === "fr"
    ? "Trouvez des réponses aux questions fréquentes sur nos services de distribution Ooredoo."
    : "Find answers to common questions about our Ooredoo product distribution and business support.";

  const faqs = t.contact.faq.items;

  return (
    <section className="py-28 lg:py-36 bg-gray-50">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          className={`mb-16 text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {faqBadge}
          </span>
          <h2
            className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.contact.faq.title || "Frequently Asked Questions"}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-500">
            {faqSubtitle}
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="mx-auto max-w-3xl">
          {faqs.map((faq: { q: string; a: string }, i: number) => (
            <FaqItem
              key={faq.q}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}