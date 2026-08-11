import { NextResponse } from "next/server";
import { newsArticles } from "../../data/news-articles";

export interface ApiNewsItem {
  id: number | string;
  slug: string;
  category: string;
  author: string;
  authorRole?: string;
  authorBio?: string;
  publishedAt: string;
  readingTime: string;
  status: string;
  heroImage: string;
  updated_at?: string;
  translations: {
    en: {
      title: string;
      excerpt: string;
      content: string;
      tags: string[];
    };
    ar: {
      title: string;
      excerpt: string;
      content: string;
      tags: string[];
    };
    fr: {
      title: string;
      excerpt: string;
      content: string;
      tags: string[];
    };
  };
}

export const defaultNewsData: ApiNewsItem[] = newsArticles.map((art, idx) => ({
  id: idx + 1,
  slug: art.slug,
  category: art.category,
  author: art.author,
  authorRole: art.authorRole,
  authorBio: art.authorBio,
  publishedAt: art.publishedAt,
  readingTime: art.readingTime,
  status: "Published",
  heroImage: art.heroImage,
  updated_at: art.updatedAt || art.publishedAt,
  translations: {
    en: {
      title: art.title,
      excerpt: art.excerpt,
      content: art.content,
      tags: art.tags,
    },
    ar: {
      title: art.title,
      excerpt: art.excerpt,
      content: art.content,
      tags: art.tags,
    },
    fr: {
      title: art.title,
      excerpt: art.excerpt,
      content: art.content,
      tags: art.tags,
    },
  },
}));

let memoryNews: ApiNewsItem[] | null = null;

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://127.0.0.1:8000/api";

export async function GET() {
  if (memoryNews && memoryNews.length > 0) {
    return NextResponse.json(memoryNews);
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${BACKEND_API_URL}/news`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        memoryNews = data;
        return NextResponse.json(data);
      }
    }
  } catch {}

  return NextResponse.json(memoryNews || defaultNewsData);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!memoryNews) {
      memoryNews = [...defaultNewsData];
    }

    const newId = memoryNews.length > 0 ? Math.max(...memoryNews.map((n) => Number(n.id) || 0)) + 1 : 1;
    const slug = body.slug || (body.title ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `article-${newId}`);

    const newArticle: ApiNewsItem = {
      id: newId,
      slug,
      category: body.category || "Company News",
      author: body.author || "STI Editorial Team",
      publishedAt: new Date().toISOString().split("T")[0],
      readingTime: body.readingTime || "3 min read",
      status: body.status || "Published",
      heroImage: body.heroImage || "/assets/hero.png",
      translations: body.translations || {
        en: { title: body.title || slug, excerpt: "", content: "", tags: [] },
        ar: { title: body.title || slug, excerpt: "", content: "", tags: [] },
        fr: { title: body.title || slug, excerpt: "", content: "", tags: [] },
      },
    };

    memoryNews.push(newArticle);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${BACKEND_API_URL}/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.id) {
          memoryNews[memoryNews.length - 1] = data;
          return NextResponse.json(data, { status: 201 });
        }
      }
    } catch {}

    return NextResponse.json(newArticle, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create article" }, { status: 400 });
  }
}
