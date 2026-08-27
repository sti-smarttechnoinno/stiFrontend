"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Smartphone, CreditCard, Building2, Zap, ArrowRight } from "lucide-react";

const SERVICES = [
  {
    icon: Smartphone,
    title: "Recharge Crédit Mobile",
    text: "Distribution nationale de crédits de recharge mobile Ooredoo pour les détaillants, grossistes et revendeurs agréés.",
    slug: "mobile-recharge-credit",
  },
  {
    icon: CreditCard,
    title: "Distribution Cartes SIM",
    text: "Distribution de cartes SIM prépayées et postpayées Ooredoo avec activation rapide et disponibilité garantie pour vos points de vente.",
    slug: "prepaid-sim-cards",
  },
  {
    icon: Building2,
    title: "Solutions Grossiste",
    text: "Approvisionnement en gros de crédits et produits télécoms pour les grossistes et grands réseaux à tarifs compétitifs.",
    slug: "wholesale-recharge",
  },
  {
    icon: Zap,
    title: "Services Partenaires",
    text: "Support opérationnel dédié, gestion des commandes, traçabilité et assistance continue à travers toute l'Algérie.",
    slug: "partner-services",
  },
];

export function ServicesSection() {
  const params = useParams();
  const currentLocale = (params?.locale as string) || "fr";

  return (
    <section id="services" aria-labelledby="services-heading" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            Solutions &amp; Services Ooredoo
          </span>
          <h2
            id="services-heading"
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Nos services de distribution et solutions
          </h2>
          <p className="mt-4 text-base text-gray-500 leading-relaxed">
            De la distribution mobile à la gestion de réseau pour professionnels, STI fournit des solutions télécoms complètes adaptées au marché algérien.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, title, text, slug }) => (
            <Link
              key={slug}
              href={`/${currentLocale}/ooredoo/solutions/${slug}`}
              className="group relative flex flex-col h-full rounded-2xl border border-gray-100 bg-white p-7 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(200,16,46,0.08)] hover:-translate-y-1"
            >
              {/* Top red accent line on hover */}
              <div className="absolute left-0 top-0 h-[3px] w-0 bg-red-primary transition-all duration-500 group-hover:w-full rounded-t-2xl" />

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-primary/8 text-red-primary transition-colors group-hover:bg-red-primary group-hover:text-white shrink-0">
                <Icon size={24} aria-hidden="true" />
              </div>

              <h3
                className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-red-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title}
              </h3>

              <p className="text-xs sm:text-sm leading-relaxed text-gray-500 mb-6 flex-1">
                {text}
              </p>

              <div className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-red-primary transition-colors group-hover:text-red-accent">
                <span>En savoir plus</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
