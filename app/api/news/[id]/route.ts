import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { defaultNewsData } from "../route";
import type { ApiNewsItem } from "../route";
import { fetchFromBackend } from "../../backend-helper";

interface Params {
  params: Promise<{ id: string }>;
}

const CACHE_FILE = path.join(process.cwd(), ".data", "news_cache.json");

function readDiskCache(): ApiNewsItem[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const res = await fetchFromBackend(`/news/${id}`, { cache: "no-store" }, 10000);
    if (res && res.ok) {
      const data = await res.json();
      if (data && data.id) {
        return NextResponse.json({
          ...data,
          publishedAt: data.published_at || data.publishedAt,
          readingTime: data.reading_time || data.readingTime,
          heroImage: data.hero_image || data.heroImage,
        });
      }
    }
  } catch {}

  const disk = readDiskCache();
  const list = disk.length > 0 ? disk : defaultNewsData;
  const match = list.find((a) => String(a.id) === String(id) || a.slug === id);

  if (match) {
    return NextResponse.json(match);
  }

  return NextResponse.json(list[0]);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await request.json();

    const disk = readDiskCache();
    const list = disk.length > 0 ? disk : [...defaultNewsData];
    const index = list.findIndex((a) => String(a.id) === String(id) || a.slug === id);

    if (index !== -1) {
      list[index] = { ...list[index], ...body };
      writeDiskCache(list);
    }

    try {
      const res = await fetchFromBackend(`/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }, 10000);

      if (res && res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {}

    return NextResponse.json(list[index] || { success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const disk = readDiskCache();
    if (disk.length > 0) {
      const filtered = disk.filter((a) => String(a.id) !== String(id) && a.slug !== id);
      writeDiskCache(filtered);
    }

    try {
      await fetchFromBackend(`/news/${id}`, {
        method: "DELETE",
      }, 10000);
    } catch {}

    return NextResponse.json({ success: true, message: "Deleted article" });
  } catch {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
