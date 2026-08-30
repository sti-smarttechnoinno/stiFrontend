"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Smartphone, CreditCard, Ticket, ArrowRight } from "lucide-react";
import { useTranslations } from "@/app/[locale]/use-translations";

const CARD_ICONS = [Smartphone, CreditCard, Ticket];

export function OoredooSection() {
  const params = useParams();
  const currentLocale = (params?.locale as string) || "fr";
  const t = useTranslations() as any;
  const ooredooT = t?.stiHome?.ooredooSection || {
    badge: "Distribution Agréée",
    title: "Produits Ooredoo disponibles",
    description: "Retrouvez les essentiels Ooredoo auprès de STI : crédit de communication, cartes SIM et tickets de recharge.",
    cta: "Voir les produits Ooredoo",
    cards: [
      { title: "Recharge crédit", text: "Recharge rapide et pratique pour vos forfaits." },
      { title: "Carte SIM", text: "Activation immédiate d'une nouvelle ligne mobile." },
      { title: "Ticket de recharge", text: "Recharge disponible partout en point de vente." },
    ],
  };

  const cards = (ooredooT.cards || []).map((card: { title: string; text: string }, i: number) => ({
    icon: CARD_ICONS[i % CARD_ICONS.length],
    title: card.title,
    text: card.text,
  }));

  return (
    <section id="produits-ooredoo" aria-labelledby="ooredoo-heading" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-6 lg:px-8 lg:grid-cols-2 lg:gap-16">
        {/* Text + cards */}
        <div>
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {ooredooT.badge}
          </span>
          <h2
            id="ooredoo-heading"
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {ooredooT.title}
          </h2>
          <p className="mt-4 max-w-md text-base text-gray-500 leading-relaxed">
            {ooredooT.description}
          </p>

          <ul className="mt-8 space-y-3.5">
            {cards.map(({ icon: Icon, title, text }: { icon: any; title: string; text: string }) => (
              <li
                key={title}
                className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4.5 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-red-primary/30 hover:shadow-[0_8px_32px_rgba(200,16,46,0.08)] hover:-translate-y-0.5"
              >
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-primary/8 text-red-primary transition-colors group-hover:bg-red-primary group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3
                    className="text-base font-bold text-gray-900 transition-colors group-hover:text-red-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href={`/${currentLocale}/ooredoo`}
            className="group mt-9 inline-flex items-center gap-2 rounded-full bg-red-primary px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-red-accent hover:shadow-[0_8px_24px_rgba(200,16,46,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-primary"
          >
            {ooredooT.cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>

        {/* Visual */}
        <div className="relative overflow-hidden rounded-[24px] border border-gray-100 bg-gray-950 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
          <Image
            src="/assets/ooredoo-recharge.webp"
            alt="Smartphone affichant une recharge de crédit Ooredoo réussie, carte SIM et ticket de recharge"
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>
      </div>
    </section>
  );
}
