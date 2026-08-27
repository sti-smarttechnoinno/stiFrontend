"use client";

import { Award, Truck, Headset, ShieldCheck } from "lucide-react";
import { useTranslations } from "@/app/[locale]/use-translations";

const ICONS = [Award, Truck, Headset, ShieldCheck];

export function TrustStrip() {
  const t = useTranslations();
  const trustT = (t as any).stiHome?.trust || {
    badge: "Réseau & Engagements",
    title: "L'expertise STI au service de deux univers",
    subtitle: "Une infrastructure robuste et un accompagnement certifié pour les univers Ooredoo et VIVO en Algérie.",
    items: [
      { title: "Partenaire officiel", text: "Relations directes avec les leaders mondiaux." },
      { title: "Distribution nationale", text: "Réseau étendu pour couvrir le territoire algérien." },
      { title: "Service après-vente", text: "Assistance réactive et engagement qualité." },
      { title: "Expertise reconnue", text: "Une équipe engagée pour des solutions performantes." },
    ],
  };

  return (
    <section id="a-propos" aria-labelledby="trust-heading" className="py-20 sm:py-28 bg-white border-b border-gray-100">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {trustT.badge}
          </span>
          <h2
            id="trust-heading"
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {trustT.title}
          </h2>
          <p className="mt-4 text-base text-gray-500 leading-relaxed">
            {trustT.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustT.items.map((item: { title: string; text: string }, i: number) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={item.title}
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
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-500">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
