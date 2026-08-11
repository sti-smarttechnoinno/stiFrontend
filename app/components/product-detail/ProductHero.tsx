"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight, Phone, CreditCard, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "../../[locale]/use-translations";
import type { Product } from "../../data/products";

export default function ProductHero({ product }: { product: Product }) {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const langTrans = product.translations?.[currentLocale] || product.translations?.en;
  const name = langTrans?.name || product.name;
  const description = langTrans?.description || product.description;
  const features = langTrans?.features?.length ? langTrans.features : product.features;

  const staticT = {
    en: {
      badge: "Official Ooredoo Product",
      quote: "Request Quote",
      contact: "Contact Sales",
    },
    ar: {
      badge: "منتج أوريدو الرسمي",
      quote: "طلب عرض سعر",
      contact: "الاتصال بالمبيعات",
    },
    fr: {
      badge: "Produit Officiel Ooredoo",
      quote: "Demander un Devis",
      contact: "Contacter l'Équipe Commerciale",
    },
  }[currentLocale] || {
    badge: "Official Ooredoo Product",
    quote: "Request Quote",
    contact: "Contact Sales",
  };

  return (
    <section className="relative min-h-[calc(100vh-88px)] lg:min-h-screen flex items-center bg-white pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #C8102E 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-label="Breadcrumb"
          className="mb-6 sm:mb-8"
        >
          <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <li>
              <Link href={`/${currentLocale}`} className="transition-colors hover:text-red-primary">
                {t.nav?.home || "Home"}
              </Link>
            </li>
            <li>
              <ChevronRight size={12} className="rtl:rotate-180" />
            </li>
            <li>
              <Link href={`/${currentLocale}/products`} className="transition-colors hover:text-red-primary">
                {t.nav?.products || "Products"}
              </Link>
            </li>
            <li>
              <ChevronRight size={12} className="rtl:rotate-180" />
            </li>
            <li className="text-gray-700 truncate max-w-[200px] sm:max-w-none">{name}</li>
          </ol>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="max-w-[600px] mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="mb-3 sm:mb-4 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
                {staticT.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-5 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.15] tracking-tight text-gray-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-500 leading-relaxed mb-6 text-base sm:text-lg"
            >
              {description}
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mb-8 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 sm:gap-x-8"
            >
              {features.map((feature: string) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                  <Check size={16} className="shrink-0 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4"
            >
              <Link
                href={`/${currentLocale}/quote`}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-red-primary px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-red-primary/20 transition-all duration-300 hover:bg-red-primary/90 hover:shadow-xl hover:shadow-red-primary/25"
              >
                {staticT.quote}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Link>
              <Link
                href={`/${currentLocale}/contact`}
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-gray-200 bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md"
              >
                <Phone size={16} />
                {staticT.contact}
              </Link>
            </motion.div>
          </div>

          {/* Right Column — Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto max-h-[480px] sm:max-h-[540px] object-contain drop-shadow-xl"
              />
            ) : (
              <div className="w-56 h-80 bg-red-primary rounded-3xl shadow-2xl shadow-red-primary/30 flex flex-col items-center justify-center p-6 text-center">
                <CreditCard size={56} className="text-white mb-4" />
                <span className="text-white text-4xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {product.value}
                </span>
                <span className="text-white/80 text-xs font-bold tracking-widest uppercase mt-2">OOREDOO</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}