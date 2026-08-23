import fs from "fs";
import path from "path";
import { fetchFromBackend } from "../api/backend-helper";
import type { ApiNewsItem } from "../api/news/route";
import { newsArticles, convertApiItemToNewsArticle, type NewsArticle } from "./news-articles";

export async function getAllPublishedArticlesServer(locale: string = "en"): Promise<NewsArticle[]> {
  const articlesMap = new Map<string, ApiNewsItem>();

  // 1. Read disk cache
  try {
    const cacheFile = path.join(process.cwd(), ".data", "news_cache.json");
    if (fs.existsSync(cacheFile)) {
      const raw = fs.readFileSync(cacheFile, "utf-8");
      const list: ApiNewsItem[] = JSON.parse(raw);
      if (Array.isArray(list)) {
        list.forEach((item) => {
          const key = String(item.slug || item.id);
          articlesMap.set(key, item);
        });
      }
    }
  } catch (err) {
    console.error("Disk cache read error in getAllPublishedArticlesServer:", err);
  }

  // 2. Fetch from backend if available
  try {
    const res = await fetchFromBackend("/news", { cache: "no-store" }, 8000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data)) {
        data.forEach((item: ApiNewsItem) => {
          const key = String(item.slug || item.id);
          articlesMap.set(key, item);
        });
      }
    }
  } catch (err) {
    console.error("Backend fetch error in getAllPublishedArticlesServer:", err);
  }

  const items = Array.from(articlesMap.values());
  if (items.length > 0) {
    return items
      .filter((item) => !item.status || item.status === "Published")
      .map((item) => convertApiItemToNewsArticle(item, locale));
  }

  // Fallback to static articles
  return newsArticles;
}

export async function getArticleBySlugServer(slug: string, locale: string = "en"): Promise<NewsArticle | undefined> {
  const decodedSlug = decodeURIComponent(slug);
  const staticMatch = newsArticles.find((a) => a.slug === decodedSlug || a.id === decodedSlug);
  if (staticMatch) return staticMatch;

  try {
    const cacheFile = path.join(process.cwd(), ".data", "news_cache.json");
    if (fs.existsSync(cacheFile)) {
      const raw = fs.readFileSync(cacheFile, "utf-8");
      const list: ApiNewsItem[] = JSON.parse(raw);
      const item = list.find((a) => a.slug === decodedSlug || String(a.id) === decodedSlug || a.slug === slug || String(a.id) === slug);
      if (item) {
        return convertApiItemToNewsArticle(item, locale);
      }
    }
  } catch (err) {
    console.error("Disk cache read error:", err);
  }

  try {
    const res = await fetchFromBackend(`/news/${encodeURIComponent(decodedSlug)}`, { cache: "no-store" }, 8000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && (data.id || data.slug)) {
        return convertApiItemToNewsArticle(data, locale);
      }
    }
  } catch (err) {
    console.error("Backend fetch error in getArticleBySlugServer:", err);
  }

  return undefined;
}

export async function getArticlePageDataServer(slug: string, locale: string = "en"): Promise<{
  article: NewsArticle | undefined;
  relatedArticles: NewsArticle[];
  prev: NewsArticle | null;
  next: NewsArticle | null;
}> {
  const [allArticles, singleArticle] = await Promise.all([
    getAllPublishedArticlesServer(locale),
    getArticleBySlugServer(slug, locale),
  ]);

  const decodedSlug = decodeURIComponent(slug);
  const article = singleArticle || allArticles.find((a) => a.slug === decodedSlug || String(a.id) === decodedSlug);

  if (!article) {
    return {
      article: undefined,
      relatedArticles: [],
      prev: null,
      next: null,
    };
  }

  // Filter out current article
  const otherArticles = allArticles.filter(
    (a) => a.slug !== article.slug && String(a.id) !== String(article.id)
  );

  // Match same category first, then others
  const sameCategory = otherArticles.filter(
    (a) => a.category && article.category && a.category.toLowerCase().trim() === article.category.toLowerCase().trim()
  );
  const differentCategory = otherArticles.filter(
    (a) => !a.category || !article.category || a.category.toLowerCase().trim() !== article.category.toLowerCase().trim()
  );

  const relatedArticles = [...sameCategory, ...differentCategory].slice(0, 3);

  // Determine prev and next in the full list
  const currentIndex = allArticles.findIndex(
    (a) => a.slug === article.slug || String(a.id) === String(article.id)
  );
  const prev = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  return {
    article,
    relatedArticles,
    prev,
    next,
  };
}
