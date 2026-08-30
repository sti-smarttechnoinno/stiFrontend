"use client";

import Image from "next/image";
import { MapPin, ShieldCheck, HeartHandshake } from "lucide-react";
import { useTranslations } from "@/app/[locale]/use-translations";

const PROOF_ICONS = [MapPin, ShieldCheck, HeartHandshake];

export function WhySti() {
  const t = useTranslations() as any;
  const whyT = t?.stiHome?.whySti || {
    badge: "Engagement & Proximité",
    title: "Pourquoi choisir STI ?",
    subtitle: "Plus de 15 ans d'expertise et de partenariats solides au service de l'écosystème technologique algérien.",
    items: [
      { title: "Une présence nationale", text: "Un réseau de distribution étendu, réactif et proche de vos besoins partout en Algérie." },
      { title: "Des marques de référence", text: "Partenaire officiel et distributeur agréé des leaders mondiaux Ooredoo et VIVO." },
      { title: "Un accompagnement durable", text: "Une relation de confiance, un support technique dédié et un engagement qualité continu." },
    ],
  };

  const items = (whyT.items || []).map((item: { title: string; text: string }, i: number) => ({
    icon: PROOF_ICONS[i % PROOF_ICONS.length],
    title: item.title,
    text: item.text,
  }));

  return (
    <section id="a-propos" aria-labelledby="why-heading" className="py-20 sm:py-28 bg-gray-50/60">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-6 lg:px-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {whyT.badge}
          </span>
          <h2
            id="why-heading"
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {whyT.title}
          </h2>
          <p className="mt-4 max-w-md text-base text-gray-500 leading-relaxed">
            {whyT.subtitle}
          </p>

          <ul className="mt-8 space-y-4">
            {items.map(({ icon: Icon, title, text }: { icon: any; title: string; text: string }) => (
              <li
                key={title}
                className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4.5 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-red-primary/30 hover:shadow-[0_8px_32px_rgba(200,16,46,0.08)] hover:-translate-y-0.5"
              >
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-primary/8 text-red-primary transition-colors group-hover:bg-red-primary group-hover:text-white">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div>
                  <h3
                    className="text-base font-bold text-gray-900 transition-colors group-hover:text-red-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-gray-500">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:h-[450px] w-full overflow-hidden rounded-[24px] border border-gray-200/80 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
          <Image
            src="/assets/algeria-distribution.png"
            alt="Carte conceptuelle de l'Algérie illustrant le réseau de distribution STI"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
        </div>
      </div>
    </section>
  );
}
