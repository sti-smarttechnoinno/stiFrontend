import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { fetchFromBackend } from "../backend-helper";

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

let memoryNews: ApiNewsItem[] | null = null;
const CACHE_FILE = path.join(process.cwd(), ".data", "news_cache.json");

function readDiskCache(): ApiNewsItem[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function writeDiskCache(data: ApiNewsItem[]): void {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {}
}

function normalizeArticle(item: any): ApiNewsItem {
  return {
    ...item,
    publishedAt: item.published_at || item.publishedAt || new Date().toISOString().split("T")[0],
    readingTime: item.reading_time || item.readingTime || "3 min read",
    heroImage: item.hero_image || item.heroImage || "/assets/hero.png",
  };
}

export async function GET() {
  try {
    const res = await fetchFromBackend("/news", { cache: "no-store" }, 10000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data)) {
        const mapped = data.map(normalizeArticle);
        memoryNews = mapped;
        writeDiskCache(mapped);
        return NextResponse.json(mapped);
      }
    }
  } catch (err) {
    console.error("Backend fetch error for news:", err);
  }

  if (memoryNews === null) {
    memoryNews = readDiskCache();
  }

  return NextResponse.json(memoryNews);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (memoryNews === null) {
      memoryNews = readDiskCache();
    }

    const newId = memoryNews.length > 0 ? Math.max(...memoryNews.map((n) => Number(n.id) || 0)) + 1 : 1;
    const slug = body.slug || (body.title ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `article-${newId}`);

    const newArticle: ApiNewsItem = normalizeArticle({
      id: newId,
      slug,
      category: body.category || "Company News",
      author: body.author || "STI Editorial Team",
      publishedAt: body.publishedAt || body.published_at || new Date().toISOString().split("T")[0],
      readingTime: body.readingTime || body.reading_time || "3 min read",
      status: body.status || "Published",
      heroImage: body.heroImage || body.hero_image || "/assets/hero.png",
      translations: body.translations || {
        en: { title: body.title || slug, excerpt: body.excerpt || "", content: body.content || "", tags: [] },
        ar: { title: body.title || slug, excerpt: body.excerpt || "", content: body.content || "", tags: [] },
        fr: { title: body.title || slug, excerpt: body.excerpt || "", content: body.content || "", tags: [] },
      },
    });

    memoryNews.unshift(newArticle);
    writeDiskCache(memoryNews);

    try {
      const res = await fetchFromBackend("/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArticle),
      }, 10000);

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.id) {
          memoryNews[0] = normalizeArticle(data);
          writeDiskCache(memoryNews);
          return NextResponse.json(memoryNews[0], { status: 201 });
        }
      }
    } catch (err) {
      console.error("Backend POST error for news:", err);
    }

    return NextResponse.json(newArticle, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to create article" }, { status: 400 });
  }
}
