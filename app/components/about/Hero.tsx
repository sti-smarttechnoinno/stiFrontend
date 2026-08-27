"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from '@/app/[locale]/use-translations';

export default function Hero() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";
  const heroT = t.aboutPage.hero;

  return (
    <section className="relative flex items-center bg-white pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, #C8102E 1px, transparent 0)",
        backgroundSize: "48px 48px",
      }} />

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
            <li><Link href={`/${currentLocale}`} className="transition-colors hover:text-red-primary">{heroT.breadcrumb_home}</Link></li>
            <li><ChevronRight size={12} className="rtl:rotate-180" /></li>
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
              className="max-w-xl text-lg leading-relaxed text-gray-500"
            >
              {heroT.description}
            </motion.p>
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
                src="/assets/about.png"
                alt="About STI"
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
