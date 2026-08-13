import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import type { ApiNewsItem } from "../route";
import { fetchFromBackend } from "../../backend-helper";
import { newsArticles } from "../../../data/news-articles";

interface Params {
  params: Promise<{ id: string }>;
}

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

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const res = await fetchFromBackend(`/news/${id}`, { cache: "no-store" }, 10000);
    if (res && res.ok) {
      const data = await res.json();
      if (data && data.id) {
        return NextResponse.json(normalizeArticle(data));
      }
    }
  } catch {}

  const disk = readDiskCache();
  const match = disk.find((a) => String(a.id) === String(id) || a.slug === id);

  if (match) {
    return NextResponse.json(normalizeArticle(match));
  }

  const staticMatch = newsArticles.find((a) => String(a.id) === String(id) || a.slug === id);
  if (staticMatch) {
    return NextResponse.json(normalizeArticle(staticMatch));
  }

  return NextResponse.json({ error: "Article not found" }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await request.json();

    const disk = readDiskCache();
    const index = disk.findIndex((a) => String(a.id) === String(id) || a.slug === id);

    let updatedItem: ApiNewsItem | null = null;
    if (index !== -1) {
      disk[index] = normalizeArticle({ ...disk[index], ...body });
      updatedItem = disk[index];
      writeDiskCache(disk);
    }

    try {
      const res = await fetchFromBackend(`/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }, 10000);

      if (res && res.ok) {
        const data = await res.json();
        if (data && data.id) {
          const normalized = normalizeArticle(data);
          if (index !== -1) {
            disk[index] = normalized;
            writeDiskCache(disk);
          }
          return NextResponse.json(normalized);
        }
      }
    } catch (err) {
      console.error("Backend PUT error for news:", err);
    }

    if (updatedItem) {
      return NextResponse.json(updatedItem);
    }

    return NextResponse.json({ success: true, message: "Updated article" });
  } catch {
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const disk = readDiskCache();
    const filtered = disk.filter((a) => String(a.id) !== String(id) && a.slug !== id);
    writeDiskCache(filtered);

    try {
      await fetchFromBackend(`/news/${id}`, {
        method: "DELETE",
      }, 10000);
    } catch (err) {
      console.error("Backend DELETE error for news:", err);
    }

    return NextResponse.json({ success: true, message: "Deleted article" });
  } catch {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
