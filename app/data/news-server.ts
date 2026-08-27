import { fetchFromBackend } from '@/app/api/backend-helper';
import type { ApiNewsItem } from '@/app/api/news/route';
import { convertApiItemToNewsArticle, type NewsArticle } from "./news-articles";

export async function getAllPublishedArticlesServer(locale: string = "en"): Promise<NewsArticle[]> {
  try {
    const res = await fetchFromBackend("/news", { cache: "no-store" }, 8000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data)) {
        return data
          .filter((item: ApiNewsItem) => !item.status || item.status === "Published")
          .map((item: ApiNewsItem) => convertApiItemToNewsArticle(item, locale));
      }
    }
  } catch (err) {
    console.error("Backend fetch error in getAllPublishedArticlesServer:", err);
  }

  return [];
}

export async function getArticleBySlugServer(slug: string, locale: string = "en"): Promise<NewsArticle | undefined> {
  const decodedSlug = decodeURIComponent(slug);

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

  // Fallback to searching all published articles if single lookup returned 404 or failed
  try {
    const all = await getAllPublishedArticlesServer(locale);
    const found = all.find((a) => a.slug === decodedSlug || String(a.id) === decodedSlug || a.slug === slug || String(a.id) === slug);
    if (found) return found;
  } catch {}

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

export async function getFeaturedArticleServer(locale: string = "en"): Promise<NewsArticle | null> {
  let featId: string | number | null = null;
  try {
    const res = await fetchFromBackend("/news/featured", { cache: "no-store" }, 5000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.featuredId !== undefined) {
        featId = data.featuredId;
      }
    }
  } catch {}

  const all = await getAllPublishedArticlesServer(locale);
  if (all.length === 0) return null;

  if (featId !== null) {
    const matched = all.find((a) => String(a.id) === String(featId) || a.slug === String(featId));
    if (matched) return matched;
  }

  const flagged = all.find((a) => a.featured === true);
  if (flagged) return flagged;

  return all[0];
}
