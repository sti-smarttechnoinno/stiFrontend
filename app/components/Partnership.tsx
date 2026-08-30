"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ShieldCheck, Users, Globe, Award } from "lucide-react";
import { useScrollReveal } from "../hooks";
import { useTranslations } from '@/app/[locale]/use-translations';

export default function Partnership() {
  const { ref, visible } = useScrollReveal();
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";

  const features = [
    { icon: <ShieldCheck size={20} />, text: t.partnership.certification },
    { icon: <Users size={20} />, text: t.partnership.partnership_feat },
    { icon: <Globe size={20} />, text: t.partnership.nationwide },
    { icon: <Award size={20} />, text: t.partnership.enterprise_feat },
  ];

  return (
    <section id="about" className="py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div
          ref={ref}
          className={`relative overflow-hidden rounded-[22px] border border-gray-100 bg-white shadow-[0_4px_40px_rgba(0,0,0,0.06)] transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Subtle red gradient border top */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-primary to-transparent" />

          <div className="flex flex-col lg:flex-row items-stretch gap-0">
            {/* Left — Logo */}
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white p-8 sm:p-10 lg:p-12 lg:min-w-[280px]">
              <span className="mb-4 text-xs font-bold uppercase tracking-widest text-red-primary">
                {t.partnership.badge}
              </span>
              <div className="relative">
                <div className="absolute -inset-8 rounded-full bg-red-primary/5 blur-2xl" />
                <Image
                  src="/assets/ooredoo-logo.svg"
                  alt="Ooredoo Logo"
                  width={160}
                  height={60}
                  className="relative h-14 w-auto"
                />
              </div>
            </div>

            {/* Middle — Heading & Description */}
            <div className="flex flex-col justify-center border-l-0 border-t lg:border-t-0 lg:border-l border-gray-100 p-8 sm:p-10 lg:max-w-[480px]">
              <h2 className="mb-4 text-2xl font-extrabold text-gray-900 lg:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                {t.partnership.title}
              </h2>
              <p className="text-base leading-relaxed text-gray-500">
                {t.partnership.description}
              </p>
            </div>

            {/* Right — Features & CTA */}
            <div className="flex flex-col justify-center border-l-0 border-t lg:border-t-0 lg:border-l border-gray-100 p-8 sm:p-10 flex-1">
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {features.map((f) => (
                  <div key={f.text} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-primary/8 text-red-primary">
                      {f.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{f.text}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/${currentLocale}/ooredoo/about`}
                className="group inline-flex w-fit items-center gap-2 rounded-full bg-red-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-250 hover:shadow-lg hover:shadow-red-primary/25 hover:scale-[1.03]"
              >
                {t.partnership.cta}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
