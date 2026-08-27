"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import NewsCard from "./NewsCard";
import { useTranslations } from '@/app/[locale]/use-translations';
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import {
  selectAllNews,
  selectNewsLoading,
  selectFeaturedArticleId,
  selectNewsCategories,
  setNews,
  setFeaturedArticleId,
  setNewsCategories,
  setNewsLoading,
} from "../../lib/store/features/newsSlice";
import { convertApiItemToNewsArticle } from '@/app/data/news-articles';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function NewsGrid() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const dispatch = useAppDispatch();
  const articles = useAppSelector(selectAllNews);
  const categories = useAppSelector(selectNewsCategories);
  const featuredId = useAppSelector(selectFeaturedArticleId);

  const [activeCategory, setActiveCategory] = useState("All");

  const gridT = t.newsPage?.grid || {
    badge: "Recent News",
    title: "Latest News & Announcements",
    subtitle: "Explore company news, telecom insights, and distribution updates across Algeria.",
  };

  useEffect(() => {
    if (articles.length === 0) {
      async function loadData() {
        try {
          dispatch(setNewsLoading(true));
          const [newsRes, catRes, featRes] = await Promise.all([
            fetch("/api/news", { cache: "no-store" }),
            fetch("/api/news/categories", { cache: "no-store" }),
            fetch("/api/news/featured", { cache: "no-store" }),
          ]);

          if (newsRes.ok) {
            const newsList = await newsRes.json();
            if (Array.isArray(newsList)) {
              dispatch(setNews(newsList.map((item: any) => convertApiItemToNewsArticle(item, currentLocale))));
            }
          }
          if (catRes.ok) {
            const catList = await catRes.json();
            if (Array.isArray(catList)) {
              dispatch(setNewsCategories(catList));
            }
          }
          if (featRes.ok) {
            const featData = await featRes.json();
            dispatch(setFeaturedArticleId(featData.featuredId));
          }
        } catch (err) {
          console.error("Failed to load news page components data", err);
        } finally {
          dispatch(setNewsLoading(false));
        }
      }
      loadData();
    }
  }, [articles.length, currentLocale, dispatch]);

  const loading = useAppSelector(selectNewsLoading);

  const isCategoryMatch = (articleCat: string, targetCatId: string) => {
    if (targetCatId === "All") return true;
    const cat = categories.find(
      (c) =>
        c.id === targetCatId ||
        c.translations?.en === targetCatId ||
        c.id.replace(/-/g, "_") === targetCatId.replace(/-/g, "_")
    );
    const cleanArt = (articleCat || "").toLowerCase().trim();

    if (!cat) {
      const cleanTarget = (targetCatId || "").toLowerCase().trim();
      return cleanArt === cleanTarget || cleanArt.replace(/[^a-z0-9]+/g, "-") === cleanTarget.replace(/[^a-z0-9]+/g, "-");
    }

    return (
      cleanArt === cat.id.toLowerCase() ||
      cleanArt === cat.translations?.en?.toLowerCase() ||
      cleanArt === cat.translations?.fr?.toLowerCase() ||
      cleanArt === cat.translations?.ar?.toLowerCase() ||
      cleanArt.replace(/[^a-z0-9]+/g, "-") === cat.id.toLowerCase()
    );
  };

  // Filter categories to only those containing at least one article
  const activeCategories = categories.filter((cat) =>
    articles.some((a) => isCategoryMatch(a.category, cat.id))
  );

  const isTopFeatured = (a: any) =>
    (featuredId !== null && featuredId !== undefined && (String(a.id) === String(featuredId) || a.slug === String(featuredId))) ||
    (featuredId === null && (a.featured || articles[0]?.id === a.id));

  const candidateArticles =
    activeCategory === "All"
      ? articles.filter((a) => !isTopFeatured(a))
      : articles;

  const filteredArticles = candidateArticles.filter((a) => isCategoryMatch(a.category, activeCategory));

  // Map to local format for card
  const displayCards = filteredArticles.map((art) => {
    const categoryItem = categories.find((c) => isCategoryMatch(art.category, c.id));
    const categoryLabel = categoryItem?.translations?.[currentLocale] || categoryItem?.translations?.en || art.category;

    return {
      id: art.id,
      slug: art.slug,
      title: art.title || art.slug,
      description: art.excerpt || "",
      category: categoryLabel,
      date: art.publishedAt,
      image: art.heroImage,
    };
  });

  return (
    <section id="articles" className="py-20 sm:py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {gridT.badge}
          </span>
          <h2
            className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {gridT.title}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-500">
            {gridT.subtitle}
          </p>
        </motion.div>

        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12 animate-once"
        >
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
              activeCategory === "All"
                ? "bg-red-primary text-white shadow-lg shadow-red-primary/25"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
          >
            {currentLocale === "ar" ? "الكل" : currentLocale === "fr" ? "Tout" : "All"}
          </button>

          {activeCategories.map((category) => {
            const label = category.translations?.[currentLocale] || category.translations?.en || category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-red-primary text-white shadow-lg shadow-red-primary/25"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                {label}
              </button>
            );
          })}
        </motion.div>

        {/* Articles Grid */}
        {displayCards.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            key={activeCategory}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayCards.map((article) => (
              <motion.div key={article.id} variants={itemVariants}>
                <NewsCard article={article} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-gray-400 text-xs font-semibold">
            No news articles published under this category yet.
          </div>
        )}
      </div>
    </section>
  );
}