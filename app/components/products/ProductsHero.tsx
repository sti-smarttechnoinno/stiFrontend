"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from '@/app/[locale]/use-translations';

export default function ProductsHero() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";
  const heroT = t.productsPage?.hero || {
    breadcrumb_home: "Home",
    breadcrumb_current: "Products",
    badge: "Official Ooredoo Products",
    title_line1: "Official Ooredoo",
    title_line2: "Products & Solutions",
    description: "Explore our complete range of genuine Ooredoo mobile recharge credit and prepaid SIM cards. STI provides reliable product availability, competitive wholesale pricing, and professional support for retailers, wholesalers, and business partners across Algeria.",
    cta_primary: "Browse Products",
    cta_secondary: "Request a Quote",
  };

  return (
    <section className="relative flex items-center bg-white pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #C8102E 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1320px] px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-label="Breadcrumb"
          className="mb-8"
        >
          <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <li>
              <Link href={`/${currentLocale}/ooredoo`} className="transition-colors hover:text-red-primary">
                {heroT.breadcrumb_home}
              </Link>
            </li>
            <li>
              <ChevronRight size={12} className="rtl:rotate-180" />
            </li>
            <li className="text-gray-700">{heroT.breadcrumb_current}</li>
          </ol>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
                {heroT.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 lg:text-5xl xl:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {heroT.title_line1} <span className="text-red-primary">{heroT.title_line2}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-xl text-lg leading-relaxed text-gray-500 mb-8"
            >
              {heroT.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <a
                href="#products-grid"
                className="group inline-flex items-center gap-2.5 rounded-full bg-red-primary px-8 py-3.5 text-sm font-semibold text-white transition-all duration-250 hover:shadow-xl hover:shadow-red-primary/25 hover:scale-[1.03]"
              >
                {heroT.cta_primary}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                />
              </a>
              <Link
                href={`/${currentLocale}/ooredoo/quote`}
                className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-250 hover:border-gray-300 hover:shadow-lg hover:scale-[1.03]"
              >
                {heroT.cta_secondary}
              </Link>
            </motion.div>
          </div>

          {/* Right — Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex items-center justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-[650px] aspect-square mx-auto lg:mx-0 lg:-ml-6">
              <Image
                src="/assets/mobile-recharge-credit.png"
                alt="Official Ooredoo Products"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}