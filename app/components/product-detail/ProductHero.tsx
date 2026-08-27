"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight, Phone, CreditCard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from '@/app/[locale]/use-translations';
import type { Product } from '@/app/data/products';

export default function ProductHero({ product }: { product: Product }) {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const langTrans = product.translations?.[currentLocale] || product.translations?.en;
  const name = langTrans?.name || product.name;
  const description = langTrans?.description || product.description;
  const features = langTrans?.features?.length ? langTrans.features : (product.features ?? []);

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
    <section className="relative min-h-screen flex items-center overflow-hidden pt-36 pb-16 sm:pt-40 sm:pb-20 bg-gradient-to-b from-gray-50 via-white to-white">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-primary/3 rounded-full blur-2xl pointer-events-none" />

      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-xs text-gray-400 mb-8"
          aria-label="Breadcrumb"
        >
          <Link href={`/${currentLocale}`} className="hover:text-red-primary transition-colors">
            {t.nav?.home || "Home"}
          </Link>
          <ChevronRight size={12} />
          <Link href={`/${currentLocale}/products`} className="hover:text-red-primary transition-colors">
            {t.nav?.products || "Products"}
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-medium truncate max-w-[200px]">{name}</span>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column — Text Content */}
          <div>
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {name}
            </motion.h1>

            {/* Value / Denomination highlight if applicable */}
            {product.value && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-lg font-bold text-red-primary mb-4"
              >
                {product.value}
              </motion.div>
            )}

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8"
            >
              {description}
            </motion.p>

            {/* Key Feature Bullets */}
            {features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
              >
                {features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-primary/10 text-red-primary flex items-center justify-center">
                      <Check size={12} />
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href={`/${currentLocale}/quote?product=${encodeURIComponent(product.slug)}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-red-primary text-white font-semibold text-sm shadow-lg shadow-red-primary/25 hover:bg-red-accent hover:shadow-xl hover:shadow-red-primary/30 transition-all hover:-translate-y-0.5"
              >
                {staticT.quote}
                <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${currentLocale}/contact`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
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
                onError={(e) => {
                  const target = e.currentTarget;
                  const str = `${product.productType || ""} ${product.category || ""} ${product.slug || ""}`.toLowerCase();
                  if (str.includes("sim")) {
                    target.src = "/assets/mobile-recharge-credit.png";
                  } else if (str.includes("recharge") || str.includes("credit")) {
                    target.src = "/assets/wholesale-recharge.png";
                  } else {
                    target.src = "/assets/partner-services.png";
                  }
                }}
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