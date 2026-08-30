"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from '@/app/[locale]/use-translations';

export default function Hero() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #C8102E 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Soft gradient circles */}
      <div className="absolute top-20 left-10 rtl:left-auto rtl:right-10 w-96 h-96 bg-red-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 rtl:right-auto rtl:left-10 w-80 h-80 bg-red-accent/3 rounded-full blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1320px] px-6 lg:px-8 pt-36 pb-20 lg:pt-36 lg:pb-16">
        <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-180px)]">
          {/* Text Content */}
          <header className="max-w-[600px] relative z-10">
            {/* Badge */}
            <div
              className="animate-fade-in-up inline-flex items-center mb-4"
              style={{ animationDelay: "0.1s", animationFillMode: "both" }}
            >
              <span className="text-[11px] font-extrabold text-red-primary tracking-widest uppercase">
                {t.hero.badge}
              </span>
            </div>

            {/* Heading */}
            <h1
              className="animate-fade-in-up text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.15] tracking-tight text-gray-900 mb-6"
              style={{
                fontFamily: "var(--font-display)",
                animationDelay: "0.2s",
                animationFillMode: "both",
              }}
            >
              {t.hero.title_line1}
              {t.hero.title_line2 && (
                <>
                  <br />
                  <span className="text-red-primary">{t.hero.title_line2}</span>
                </>
              )}
              {t.hero.title_line3 && (
                <>
                  <br />
                  {t.hero.title_line3}
                </>
              )}
              {t.hero.title_line4 && (
                <>
                  <br />
                  {t.hero.title_line4}
                </>
              )}
            </h1>

            {/* Description */}
            <p
              className="animate-fade-in-up text-base leading-relaxed text-gray-500 max-w-[540px] mb-10"
              style={{ animationDelay: "0.35s", animationFillMode: "both" }}
            >
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div
              className="animate-fade-in-up flex flex-wrap items-center gap-4 mb-12"
              style={{ animationDelay: "0.45s", animationFillMode: "both" }}
            >
              <Link
                href={`/${currentLocale}/ooredoo/solutions`}
                className="group inline-flex items-center gap-2.5 rounded-full bg-red-primary px-6 py-3 text-[13px] font-semibold text-white transition-all duration-250 hover:shadow-xl hover:shadow-red-primary/25 hover:scale-[1.03]"
              >
                {t.hero.cta_primary}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-250 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                />
              </Link>
              <Link
                href={`/${currentLocale}/ooredoo/contact`}
                className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-6 py-3 text-[13px] font-semibold text-gray-700 transition-all duration-250 hover:border-gray-300 hover:shadow-lg hover:scale-[1.03]"
              >
                {t.hero.cta_secondary}
              </Link>
            </div>

          </header>

          {/* Background Image */}
          <div className="absolute right-0 rtl:right-auto rtl:left-0 top-0 bottom-0 w-[65%] hidden lg:block">
            <img
              src="/assets/hero.webp"
              alt="STI Telecom Solutions"
              className="w-full h-full object-contain object-right rtl:object-left"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
