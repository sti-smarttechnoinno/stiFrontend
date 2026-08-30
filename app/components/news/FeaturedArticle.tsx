"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowRight, BadgeCheck } from "lucide-react";
import { useTranslations } from '@/app/[locale]/use-translations';
import { useAppSelector } from "../../lib/store/hooks";
import { selectFeaturedArticle, selectNewsCategories, selectNewsLoading } from "../../lib/store/features/newsSlice";
import { localizeCategory } from '@/app/data/news-articles';

export default function FeaturedArticle() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const article = useAppSelector(selectFeaturedArticle);
  const categories = useAppSelector(selectNewsCategories);
  const loading = useAppSelector(selectNewsLoading);

  if (loading && !article) {
    return (
      <div className="py-24 text-center text-gray-400 flex flex-col items-center justify-center gap-2 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded-full mb-4" />
        <div className="h-48 w-full max-w-4xl bg-gray-100 rounded-3xl" />
      </div>
    );
  }

  if (!article) return null;

  const title = article.title || article.slug;
  const description = article.excerpt || "";
  const categoryLabel = localizeCategory(article.category, currentLocale, categories);

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-gray-50">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {t.newsPage?.featured?.badge || "Featured Article"}
          </span>
          <h2
            className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h2>
        </motion.div>

        {/* Featured Card */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden"
        >
          <div className="grid lg:grid-cols-[45%_55%]">
            {/* Image Container */}
            <div className="relative h-64 lg:h-auto bg-gradient-to-br from-gray-50 to-white flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100 overflow-hidden">
              {article.heroImage ? (
                <img
                  src={article.heroImage}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-48 h-32 bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-red-primary rounded-xl flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">STI</span>
                    </div>
                    <div>
                      <div className="h-2 bg-gray-200 rounded-full w-20 mb-1" />
                      <div className="h-1.5 bg-gray-100 rounded-full w-14" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 bg-gradient-to-r from-red-primary/10 to-red-primary/5 rounded-lg" />
                    <div className="h-2 bg-gray-100 rounded-full w-full" />
                    <div className="h-2 bg-gray-100 rounded-full w-3/4" />
                  </div>
                </div>
              )}
              {/* Floating element */}
              <div className="absolute top-8 right-8 rtl:right-auto rtl:left-8">
                <div className="w-12 h-12 bg-red-primary/10 rounded-xl flex items-center justify-center shadow-md backdrop-blur-sm">
                  <BadgeCheck size={20} className="text-red-primary" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-primary/10 mb-6 w-fit">
                <BadgeCheck size={14} className="text-red-primary" />
                <span className="text-xs font-bold text-red-primary">{categoryLabel}</span>
              </div>

              {/* Headline */}
              <h3
                className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-4 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 leading-relaxed mb-8">
                {description}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{article.publishedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{article.readingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{article.author}</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/${currentLocale}/ooredoo/news/${article.slug || article.id}`}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-red-primary transition-all duration-300 hover:gap-3"
              >
                {t.newsPage?.featured?.read_more || "Read Full Article"}
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}