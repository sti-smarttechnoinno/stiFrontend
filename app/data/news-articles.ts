export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  heroImage: string;
  gallery?: { src: string; caption: string }[];
  author: string;
  authorRole: string;
  authorBio: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  tags: string[];
  featured?: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const newsArticles: NewsArticle[] = [];

export function convertApiItemToNewsArticle(item: any, locale: string = "en"): NewsArticle {
  const loc = (locale as "en" | "ar" | "fr") || "en";
  const tr = item?.translations?.[loc] || item?.translations?.en || item?.translations?.fr || item?.translations?.ar || {};
  const title = tr.title || item?.title || item?.slug || "Untitled Article";
  const excerpt = tr.excerpt || item?.excerpt || "";
  const content = tr.content || item?.content || "";
  const tags = Array.isArray(tr.tags) && tr.tags.length > 0 ? tr.tags : Array.isArray(item?.tags) ? item.tags : ["STI", "News"];
  const heroImageRaw = item?.hero_image || item?.heroImage;
  const heroImage = heroImageRaw && typeof heroImageRaw === "string" && heroImageRaw.trim() !== "" ? heroImageRaw : "/assets/hero.png";

  return {
    id: String(item.id || "1"),
    title,
    slug: item.slug || "article",
    category: item.category || "Company News",
    excerpt,
    content,
    heroImage,
    author: item.author || "STI Team",
    authorRole: item.author_role || item.authorRole || "Smart Technologie Innovation",
    authorBio: item.author_bio || item.authorBio || "Official communications team at SARL Smart Technologie Innovation.",
    publishedAt: item.published_at || item.publishedAt || "May 20, 2026",
    readingTime: item.reading_time || item.readingTime || "3 min read",
    tags,
    featured: item.featured || false,
    seo: {
      title: `${title} | STI News`,
      description: excerpt || title,
      keywords: tags,
    },
  };
}

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.slug === slug);
}

export function getRelatedArticles(currentSlug: string, count = 3): NewsArticle[] {
  return newsArticles
    .filter((a) => a.slug !== currentSlug)
    .slice(0, count);
}

export function getAdjacentArticles(slug: string) {
  const index = newsArticles.findIndex((a) => a.slug === slug);
  const prev = index > 0 ? newsArticles[index - 1] : null;
  const next = index < newsArticles.length - 1 ? newsArticles[index + 1] : null;
  return { prev, next };
}
