import fs from "fs";
import path from "path";
import { fetchFromBackend } from "../api/backend-helper";
import type { ApiNewsItem } from "../api/news/route";
import { newsArticles, convertApiItemToNewsArticle, type NewsArticle } from "./news-articles";

export async function getArticleBySlugServer(slug: string, locale: string = "en"): Promise<NewsArticle | undefined> {
  const staticMatch = newsArticles.find((a) => a.slug === slug);
  if (staticMatch) return staticMatch;

  try {
    const cacheFile = path.join(process.cwd(), ".data", "news_cache.json");
    if (fs.existsSync(cacheFile)) {
      const raw = fs.readFileSync(cacheFile, "utf-8");
      const list: ApiNewsItem[] = JSON.parse(raw);
      const item = list.find((a) => a.slug === slug || String(a.id) === slug);
      if (item) {
        return convertApiItemToNewsArticle(item, locale);
      }
    }
  } catch {}

  try {
    const res = await fetchFromBackend(`/news/${slug}`, { cache: "no-store" }, 5000);
    if (res && res.ok) {
      const data = await res.json();
      if (data && (data.id || data.slug)) {
        return convertApiItemToNewsArticle(data, locale);
      }
    }
  } catch {}

  return undefined;
}
