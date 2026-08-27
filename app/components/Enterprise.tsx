"use client";

import { usePathname } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { useScrollReveal } from "../hooks";
import { useTranslations } from '@/app/[locale]/use-translations';

export default function Enterprise() {
  const { ref, visible } = useScrollReveal();
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";

  return (
    <section id="enterprise" className="py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div
          ref={ref}
          className={`overflow-hidden rounded-[22px] border border-gray-100 bg-gray-50 shadow-[0_4px_40px_rgba(0,0,0,0.04)] transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left — Illustration */}
            <div className="relative flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-8 sm:p-12 lg:p-16 min-h-[280px] sm:min-h-[400px]">
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #C8102E 1px, transparent 0)`,
                backgroundSize: "32px 32px",
              }} />
              <div className="relative text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-primary/20">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C8102E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                    <path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-extrabold text-white" style={{ fontFamily: "var(--font-display)" }}>
                  {t.enterprise.title}
                </h3>
                <p className="mt-2 text-sm text-gray-400">{t.enterprise.subtitle}</p>
              </div>
            </div>

            {/* Right — Content */}
            <div className="flex flex-col justify-center p-10 lg:p-14">
              <span className="mb-3 text-xs font-bold uppercase tracking-widest text-red-primary">
                {t.enterprise.badge}
              </span>
              <h2 className="mb-6 text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                {t.enterprise.title}
              </h2>

              <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {t.enterprise.checklist.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-primary/10 text-red-primary">
                      <Check size={14} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <a
                href={`/${currentLocale}/quote`}
                className="group inline-flex w-fit items-center gap-2 rounded-full bg-red-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-250 hover:shadow-lg hover:shadow-red-primary/25 hover:scale-[1.03]"
              >
                {t.enterprise.cta}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
