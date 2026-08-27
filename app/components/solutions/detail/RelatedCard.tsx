"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Smartphone, CardSim, Building2, Zap, Package } from "lucide-react";
import { useTranslations } from '@/app/[locale]/use-translations';

interface Props {
  slug: string;
  title: string;
  description: string;
}

function getSolutionIcon(slug: string) {
  switch (slug) {
    case "mobile-recharge-credit":
      return <Smartphone size={24} />;
    case "prepaid-sim-cards":
      return <CardSim size={24} />;
    case "wholesale-recharge":
      return <Building2 size={24} />;
    case "partner-services":
      return <Zap size={24} />;
    default:
      return <Package size={24} />;
  }
}

export default function RelatedCard({ slug, title, description }: Props) {
  const pathname = usePathname();
  const t = useTranslations();
  const currentLocale = pathname.split("/")[1] || "en";

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(200,16,46,0.08)] flex flex-col h-full"
    >
      {/* Red accent line */}
      <div className="absolute left-0 top-0 h-[3px] w-0 bg-red-primary transition-all duration-500 group-hover:w-full" />

      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-primary/8 text-red-primary transition-colors group-hover:bg-red-primary group-hover:text-white">
        {getSolutionIcon(slug)}
      </div>

      <Link href={`/${currentLocale}/ooredoo/solutions/${slug}`} className="hover:text-red-primary transition-colors">
        <h3 className="mb-3 text-lg font-bold text-gray-900 transition-colors group-hover:text-red-primary" style={{ fontFamily: "var(--font-manrope)" }}>
          {title}
        </h3>
      </Link>
      <p
        className="mb-6 text-sm leading-relaxed text-gray-500 line-clamp-3 overflow-hidden"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {description}
      </p>
      <Link
        href={`/${currentLocale}/ooredoo/solutions/${slug}`}
        className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-red-primary transition-colors hover:text-red-accent"
      >
        {(t as any).solutionDetail?.learn_more || t.services?.cta || "Learn More"}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
      </Link>
    </motion.article>
  );
}
