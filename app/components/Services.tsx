"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Smartphone, CreditCard, Truck, Coins, Handshake, Building2 } from "lucide-react";
import { useScrollReveal } from "../hooks";
import { useTranslations } from "../[locale]/use-translations";

// Map of icons for fallback/dynamic selection
const iconsMap = [
  <Smartphone size={24} key="smart" />,
  <CreditCard size={24} key="sim" />,
  <Truck size={24} key="truck" />,
  <Coins size={24} key="coins" />,
  <Handshake size={24} key="hand" />,
  <Building2 size={24} key="build" />,
];

interface DynamicSolutionItem {
  id: string | number;
  slug: string;
  status: string;
  translations: {
    [key: string]: {
      name: string;
      description: string[];
      badge?: string;
    };
  };
}

function ServiceCard({
  icon,
  title,
  description,
  index,
  ctaText,
  currentLocale,
  slug,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  ctaText: string;
  currentLocale: string;
  slug: string;
}) {
  const { ref, visible } = useScrollReveal(0.2);

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(200,16,46,0.08)] hover:-translate-y-1 flex flex-col h-full ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Red accent line */}
      <div className="absolute left-0 top-0 h-[3px] w-0 bg-red-primary transition-all duration-500 group-hover:w-full" />

      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-primary/8 text-red-primary transition-colors group-hover:bg-red-primary group-hover:text-white shrink-0">
        {icon}
      </div>
      <h3 className="mb-3 text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </h3>
      <p className="mb-8 text-sm leading-relaxed text-gray-500 line-clamp-4">
        {description}
      </p>
      <Link
        href={`/${currentLocale}/solutions/${slug}`}
        className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-red-primary transition-colors hover:text-red-accent"
      >
        {ctaText}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
      </Link>
    </div>
  );
}

export default function Services() {
  const { ref, visible } = useScrollReveal();
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";

  const [solutions, setSolutions] = useState<DynamicSolutionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSolutions() {
      try {
        const res = await fetch("/api/solutions");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // Keep only published solutions
            const published = data.filter((s) => !s.status || s.status === "Published");
            setSolutions(published);
          }
        }
      } catch (err) {
        console.error("Failed to load home page solutions dynamically", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSolutions();
  }, []);

  const displaySolutions = solutions.length > 0 ? solutions : [];

  return (
    <section id="solutions" className="py-20 sm:py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div
          ref={ref}
          className={`mb-16 text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {t.services.badge}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            {t.services.title}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-500">
            {t.services.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-xs text-gray-400 font-semibold">Loading solutions...</span>
          </div>
        ) : displaySolutions.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displaySolutions.map((s, i) => {
              const lang = s.translations?.[currentLocale] || s.translations?.en || {};
              const title = lang.name || s.slug;
              const description = Array.isArray(lang.description) ? lang.description[0] : (lang.description || "");
              const icon = iconsMap[i % iconsMap.length];

              return (
                <ServiceCard
                  key={s.slug}
                  icon={icon}
                  title={title}
                  description={description}
                  index={i}
                  ctaText={t.services.cta || "Learn More"}
                  currentLocale={currentLocale}
                  slug={s.slug}
                />
              );
            })}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.services.items.map((s, i) => (
              <ServiceCard
                key={s.title}
                icon={iconsMap[i % iconsMap.length]}
                title={s.title}
                description={s.description}
                index={i}
                ctaText={t.services.cta || "Learn More"}
                currentLocale={currentLocale}
                slug={i === 0 ? "mobile-recharge-credit" : i === 1 ? "prepaid-sim-cards" : "wholesale-recharge"}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
