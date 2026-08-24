import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { ApiNewsItem } from "../route";
import { fetchFromBackend } from "../../backend-helper";

interface Params {
  params: Promise<{ id: string }>;
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
    const res = await fetchFromBackend(`/news/${encodeURIComponent(id)}`, { cache: "no-store" }, 10000);
    if (res && res.ok) {
      const data = await res.json();
      if (data && (data.id || data.slug)) {
        return NextResponse.json(normalizeArticle(data));
      }
    }
  } catch {}

  return NextResponse.json({ error: "Article not found" }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await request.json();

    const res = await fetchFromBackend(`/news/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }, 10000);

    if (res && res.ok) {
      const data = await res.json();
      if (data && data.id) {
        return NextResponse.json(normalizeArticle(data));
      }
    }

    return NextResponse.json({ success: true, message: "Updated article" });
  } catch {
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const res = await fetchFromBackend(`/news/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }, 10000);

    if (res && res.ok) {
      return NextResponse.json({ success: true, message: "Deleted article" });
    }

    return NextResponse.json({ success: true, message: "Deleted article" });
  } catch {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
