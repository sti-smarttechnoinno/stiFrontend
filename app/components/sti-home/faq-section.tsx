"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight, Headset } from "lucide-react";
import { usePreferences } from "@/app/[locale]/preferences-context";
import { useTranslations } from "@/app/[locale]/use-translations";

export function FaqSection() {
  const [open, setOpen] = useState<number[]>([0, 1]);
  const { email } = usePreferences();
  const contactEmail = email || "contact@sti-dz.com";
  const t = useTranslations() as any;
  const faqT = t?.stiHome?.faq || {
    badge: "FAQ & Assistance",
    title: "Questions fréquentes",
    subtitle: "Trouvez des réponses claires sur la distribution, les produits et l'accompagnement STI.",
    supportTitle: "Besoin d'une autre information ?",
    supportDesc: "Notre équipe commerciale et technique est à votre écoute pour vous orienter.",
    supportCta: "Nous contacter",
    items: [
      {
        q: "Quels produits Ooredoo distribue STI ?",
        a: "STI distribue les essentiels mobiles Ooredoo : le crédit de communication, les cartes SIM et les tickets de recharge sur tout le territoire.",
      },
      {
        q: "Comment acheter une carte SIM Ooredoo ?",
        a: "Les cartes SIM Ooredoo sont disponibles auprès de STI et de son réseau partenaire pour activer rapidement une nouvelle ligne mobile.",
      },
      {
        q: "Où trouver les tickets de recharge Ooredoo ?",
        a: "Les tickets de recharge Ooredoo sont disponibles en point de vente agréé auprès du réseau national de distribution STI.",
      },
      {
        q: "Comment effectuer une recharge de crédit ?",
        a: "La recharge de crédit Ooredoo est simple, immédiate et sécurisée grâce aux plateformes et solutions fournies par STI.",
      },
      {
        q: "Quels smartphones VIVO sont disponibles ?",
        a: "STI distribue officiellement les smartphones VIVO (Série V et Série Y), leurs accessoires d'origine et assure la garantie constructeur en Algérie.",
      },
      {
        q: "Où intervient STI en Algérie ?",
        a: "STI s'appuie sur une présence à Sétif, Alger et un réseau étendu de revendeurs couvrant l'ensemble des 58 wilayas d'Algérie.",
      },
    ],
  };

  const faqItems = faqT.items || [];

  const toggle = (i: number) =>
    setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  return (
    <section aria-labelledby="faq-heading" className="py-20 sm:py-28 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {faqT.badge}
          </span>
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {faqT.title}
          </h2>
          <p className="mt-3 text-base text-gray-500 leading-relaxed">
            {faqT.subtitle}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14 items-start">
          {/* Accordion List */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
            <div className="divide-y divide-gray-100">
              {faqItems.map((item: { q: string; a: string }, i: number) => {
                const isOpen = open.includes(i);
                return (
                  <div key={item.q} className="py-4.5 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 text-start group"
                    >
                      <span
                        className="text-base sm:text-lg font-bold text-gray-900 transition-colors group-hover:text-red-primary"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-gray-400 transition-transform duration-300 group-hover:text-red-primary ${
                          isOpen ? "rotate-180 text-red-primary" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Support Aside Card */}
          <aside className="sticky top-24">
            <div className="relative overflow-hidden rounded-[24px] border border-gray-100 bg-[#102039] p-8 sm:p-9 text-white shadow-[0_8px_32px_rgba(16,32,57,0.12)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-primary text-white shadow-md">
                <Headset size={26} aria-hidden="true" />
              </div>
              <h3
                className="text-xl sm:text-2xl font-extrabold text-white leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {faqT.supportTitle}
              </h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                {faqT.supportDesc}
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-red-primary px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-red-accent hover:shadow-[0_8px_24px_rgba(200,16,46,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-primary"
              >
                {faqT.supportCta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" aria-hidden="true" />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
