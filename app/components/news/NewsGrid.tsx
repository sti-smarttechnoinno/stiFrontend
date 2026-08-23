"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import NewsCard from "./NewsCard";
import { useTranslations } from "../../[locale]/use-translations";
import { Loader2 } from "lucide-react";
import type { ApiNewsItem } from "../../api/news/route";
import type { ApiCategoryItem } from "../../api/news/categories/route";

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

  const [articles, setArticles] = useState<ApiNewsItem[]>([]);
  const [categories, setCategories] = useState<ApiCategoryItem[]>([]);
  const [featuredId, setFeaturedId] = useState<string | number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const gridT = t.newsPage?.grid || {
    badge: "Recent News",
    title: "Latest News & Announcements",
    subtitle: "Explore company news, telecom insights, and distribution updates across Algeria.",
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [newsRes, catRes, featRes] = await Promise.all([
          fetch("/api/news"),
          fetch("/api/news/categories"),
          fetch("/api/news/featured"),
        ]);

        if (newsRes.ok) {
          const newsList = await newsRes.json();
          setArticles(newsList);
        }
        if (catRes.ok) {
          const catList = await catRes.json();
          setCategories(catList);
        }
        if (featRes.ok) {
          const featData = await featRes.json();
          setFeaturedId(featData.featuredId);
        }
      } catch (err) {
        console.error("Failed to load news page components data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
        <Loader2 size={24} className="animate-spin text-red-primary" />
      </div>
    );
  }

  // Filter 1: Must be Published
  const publishedArticles = articles.filter((a) => a.status === "Published");

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

  // Filter categories to only those containing at least one published article
  const activeCategories = categories.filter((cat) =>
    publishedArticles.some((a) => isCategoryMatch(a.category, cat.id))
  );

  // Category Filter Match: If "All" is active, exclude top featured article to avoid duplication.
  // If a specific category pill is selected, include all articles matching that category.
  const candidateArticles =
    activeCategory === "All"
      ? publishedArticles.filter((a) => String(a.id) !== String(featuredId))
      : publishedArticles;

  const filteredArticles = candidateArticles.filter((a) => isCategoryMatch(a.category, activeCategory));

  // Map to local format for card
  const displayCards = filteredArticles.map((art) => {
    const translation = art.translations?.[currentLocale] || art.translations?.en || {};
    const categoryItem = categories.find((c) => isCategoryMatch(art.category, c.id));
    const categoryLabel = categoryItem?.translations?.[currentLocale] || categoryItem?.translations?.en || art.category;

    return {
      id: art.id,
      slug: art.slug,
      title: translation.title || art.slug,
      description: translation.excerpt || "",
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