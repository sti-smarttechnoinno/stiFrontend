"use client";

import Image from "next/image";
import { useScrollReveal } from "../hooks";
import { useTranslations } from '@/app/[locale]/use-translations';

export default function TrustedPartners() {
  const { ref, visible } = useScrollReveal();
  const t = useTranslations();

  return (
    <section className="py-28 lg:py-36 bg-gray-50 overflow-hidden">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div
          ref={ref}
          className={`mb-16 text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {t.trustedPartners.badge}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-manrope)" }}>
            {t.trustedPartners.title}
          </h2>
        </div>

        <div className="flex items-center justify-center">
          <Image
            src="/assets/ooredoo-logo.svg"
            alt="Ooredoo logo"
            width={200}
            height={70}
            className="h-16 w-auto grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
          />
        </div>
      </div>
    </section>
  );
}
