import fs from "fs";
import path from "path";
import { fetchFromBackend } from "../api/backend-helper";
import type { ApiNewsItem } from "../api/news/route";
import { newsArticles, convertApiItemToNewsArticle, type NewsArticle } from "./news-articles";

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
