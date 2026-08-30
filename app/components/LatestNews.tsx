"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "../hooks";
import { useTranslations } from '@/app/[locale]/use-translations';
import type { ApiNewsItem } from '@/app/api/news/route';

function ArticleCard({
  image,
  category,
  title,
  excerpt,
  date,
  slug,
  index,
  ctaText,
  currentLocale,
}: {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  slug?: string;
  index: number;
  ctaText: string;
  currentLocale: string;
}) {
  const { ref, visible } = useScrollReveal(0.2);
  const href = slug ? `/${currentLocale}/ooredoo/news/${slug}` : `/${currentLocale}/ooredoo/news`;

  return (
    <article
      ref={ref}
      className={`group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)] hover:-translate-y-1 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative overflow-hidden">
        <img
          src={image || "/assets/hero.webp"}
          alt={title}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-red-primary backdrop-blur-sm">
          {category}
        </span>
      </div>
      <div className="p-6">
        <div className="mb-3 text-xs text-gray-400">{date}</div>
        <h3 className="mb-3 text-lg font-bold text-gray-900 line-clamp-2" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-gray-500 line-clamp-2">
          {excerpt}
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-primary transition-colors hover:text-red-accent"
        >
          {ctaText}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

export default function LatestNews() {
  const { ref, visible } = useScrollReveal();
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const [articles, setArticles] = useState<ApiNewsItem[]>([]);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // Sort by publishedAt or ID descending to get the 3 latest articles
            const sorted = [...data].sort((a, b) => {
              const dateA = new Date(a.publishedAt || a.updated_at || 0).getTime();
              const dateB = new Date(b.publishedAt || b.updated_at || 0).getTime();
              return dateB - dateA;
            });
            setArticles(sorted.slice(0, 3));
          }
        }
      } catch {}
    }
    loadNews();
  }, []);

  const fallbackArticles = t.latestNews?.items?.slice(0, 3) || [];

  return (
    <section id="news" className="py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div
          ref={ref}
          className={`mb-16 text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {t.latestNews?.badge || "News & Insights"}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            {t.latestNews?.title || "Latest News & Updates"}
          </h2>
          <p className="mx-auto max-w-xl text-gray-500">
            {t.latestNews?.subtitle || "Stay informed with the latest news, announcements, and telecom market insights from STI."}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {articles.length > 0
            ? articles.map((art, i) => {
                const trans = art.translations?.[currentLocale] || art.translations?.en || {};
                return (
                  <ArticleCard
                    key={art.id || art.slug || i}
                    image={art.heroImage || "/assets/hero.webp"}
                    category={art.category}
                    title={trans.title || art.slug}
                    excerpt={trans.excerpt || ""}
                    date={art.publishedAt}
                    slug={art.slug}
                    index={i}
                    ctaText={t.latestNews?.cta || "Read More"}
                    currentLocale={currentLocale}
                  />
                );
              })
            : fallbackArticles.map((a, i) => (
                <ArticleCard
                  key={a.title}
                  image="/assets/hero.webp"
                  {...a}
                  index={i}
                  ctaText={t.latestNews?.cta || "Read More"}
                  currentLocale={currentLocale}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
