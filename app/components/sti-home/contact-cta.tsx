"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function ContactCta() {
  const pathname = usePathname();
  const currentLocale = pathname.split("/").filter(Boolean).find((s) => ["en", "fr", "ar"].includes(s)) || "fr";

  return (
    <section id="contact" aria-labelledby="cta-heading" className="py-28 lg:py-36 bg-red-primary relative overflow-hidden">
      {/* Background pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-80 h-80 bg-red-accent/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"
      />

      <div className="relative mx-auto max-w-[1320px] px-6 lg:px-8 text-center">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-white/80">
          Partenariat &amp; Contact
        </span>

        <h2
          id="cta-heading"
          className="mb-6 text-3xl font-extrabold text-white md:text-4xl lg:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Parlons de votre prochain projet
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-base sm:text-lg text-white/85 leading-relaxed">
          Notre équipe vous accompagne avec des solutions télécoms et mobiles fiables et performantes partout en Algérie.
        </p>

        <div className="flex items-center justify-center">
          <Link
            href={`/${currentLocale}/ooredoo/contact`}
            className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-red-primary shadow-lg transition-all duration-250 hover:shadow-xl hover:scale-[1.03]"
          >
            Contacter STI
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
