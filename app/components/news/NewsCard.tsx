"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from '@/app/[locale]/use-translations';
import { localizeCategory } from '@/app/data/news-articles';

interface Article {
  id: number | string;
  title: string;
  description: string;
  category: string;
  date: string;
  image?: string;
  slug?: string;
}

export default function NewsCard({ article }: { article: Article }) {
  const pathname = usePathname();
  const t = useTranslations();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";
  const readMoreText = (t as any).newsPage?.featured?.read_more || (t as any).newsPage?.grid?.read_more || "Read More";
  const categoryLabel = localizeCategory(article.category, currentLocale);

  return (
    <motion.article
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="group flex flex-col h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)] hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={article.image || "/assets/hero.png"}
          alt={article.title}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-red-primary backdrop-blur-sm shadow-sm">
          {categoryLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3 text-[11px] font-bold text-gray-400">{article.date}</div>
        <h3
          className="mb-3 text-base font-extrabold text-gray-900 line-clamp-2 leading-snug"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {article.title}
        </h3>
        <p className="mb-5 text-xs leading-relaxed text-gray-500 line-clamp-3">
          {article.description}
        </p>
        <Link
          href={`/${currentLocale}/ooredoo/news/${article.slug || article.id}`}
          className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-red-primary transition-colors hover:text-red-accent"
        >
          {readMoreText}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}