"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight, PhoneCall } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/app/[locale]/use-translations";

interface Props {
  badge?: string;
  title: string;
  description: string[];
  highlights?: string[];
  illustration?: "recharge" | "sim" | "wholesale" | "retail" | "partnership" | "support";
}

export default function HeroSolution({ title, description, highlights }: Props) {
  const pathname = usePathname();
  const t = useTranslations();
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments.find((s) => ["en", "fr", "ar"].includes(s)) || "fr";

  const checklist =
    highlights && highlights.length > 0
      ? highlights
      : [
          "Distribution officielle certifiée Ooredoo Algérie",
          "Stock permanent & disponibilité garantie toute l'année",
          "Couverture logistique intégrale des 58 wilayas",
          "Accompagnement commercial et support B2B dédié",
        ];

  return (
    <section className="relative min-h-[calc(100vh-36px)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-40">
      {/* Background Subtle Tech Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D71920 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Subtle Ambient Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="relative mx-auto w-full max-w-[1000px] px-6 sm:px-8 text-center flex flex-col items-center justify-center">
        {/* Breadcrumb Navigation matching /ooredoo/solutions */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-label="Breadcrumb"
          className="mb-8 sm:mb-10"
        >
          <ol className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <li>
              <Link
                href={`/${currentLocale}/ooredoo`}
                className="transition-colors hover:text-red-primary"
              >
                {t.nav?.home || "Accueil"}
              </Link>
            </li>
            <li>
              <ChevronRight size={12} className="rtl:rotate-180 text-gray-400" />
            </li>
            <li>
              <Link
                href={`/${currentLocale}/ooredoo/solutions`}
                className="transition-colors hover:text-red-primary"
              >
                {t.nav?.solutions || "Solutions"}
              </Link>
            </li>
            <li>
              <ChevronRight size={12} className="rtl:rotate-180 text-gray-400" />
            </li>
            <li className="text-gray-700 truncate max-w-[260px] sm:max-w-none">
              {title}
            </li>
          </ol>
        </motion.nav>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-gray-900 max-w-4xl lg:max-w-5xl"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          {title}
        </motion.h1>

        {/* Description Paragraphs with generous width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 space-y-4 max-w-4xl lg:max-w-5xl mx-auto"
        >
          {description.map((paragraph, index) => (
            <p
              key={index}
              className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-600 font-normal"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>

        {/* Key Checklist Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 pt-6 border-t border-gray-200/80 w-full max-w-3xl"
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left sm:text-left">
            {checklist.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-sm font-medium text-gray-700"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Check size={13} className="stroke-[2.5]" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link
            href={`/${currentLocale}/ooredoo/quote`}
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-red-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-primary/20 transition-all duration-300 hover:bg-red-primary/90 hover:shadow-xl hover:shadow-red-primary/25 hover:scale-[1.02] w-full sm:w-auto"
          >
            <span>Demander un devis grossiste</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
          <Link
            href={`/${currentLocale}/ooredoo/contact`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 hover:scale-[1.02] w-full sm:w-auto"
          >
            <PhoneCall size={15} className="text-gray-400" />
            <span>Contacter un conseiller</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
