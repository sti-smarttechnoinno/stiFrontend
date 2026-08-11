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

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_API_URL}/news`, {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {}

  return NextResponse.json(defaultNewsData);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, article: body }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create article" }, { status: 400 });
  }
}
