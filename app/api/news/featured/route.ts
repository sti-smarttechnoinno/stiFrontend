import { NextResponse } from "next/server";
import { fetchFromBackend } from "../../backend-helper";

let memoryFeaturedId: string | number | null = null;

export async function GET() {
  if (memoryFeaturedId !== null) {
    return NextResponse.json(
      { featuredId: memoryFeaturedId },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }

  // Fetch news from backend to find featured or first published
  try {
    const res = await fetchFromBackend("/news", { cache: "no-store" }, 8000);
    if (res && res.ok) {
      const list = await res.json().catch(() => null);
      if (Array.isArray(list) && list.length > 0) {
        const featuredItem = list.find((item: any) => item.featured === true);
        if (featuredItem) {
          memoryFeaturedId = featuredItem.id;
          return NextResponse.json(
            { featuredId: featuredItem.id },
            { headers: { "Cache-Control": "no-store, max-age=0" } }
          );
        }
        const firstPublished = list.find((item: any) => !item.status || item.status === "Published");
        if (firstPublished) {
          memoryFeaturedId = firstPublished.id;
          return NextResponse.json(
            { featuredId: firstPublished.id },
            { headers: { "Cache-Control": "no-store, max-age=0" } }
          );
        }
        memoryFeaturedId = list[0].id;
        return NextResponse.json(
          { featuredId: list[0].id },
          { headers: { "Cache-Control": "no-store, max-age=0" } }
        );
      }
    }
  } catch {}

  return NextResponse.json(
    { featuredId: 1 },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const targetId = body.id !== undefined ? body.id : body.featuredId;

    if (targetId !== undefined && targetId !== null) {
      memoryFeaturedId = targetId;

      // Update backend if supported
      fetchFromBackend(`/news/featured`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredId: targetId }),
      }).catch(() => null);

      return NextResponse.json(
        { featuredId: memoryFeaturedId, success: true },
        {
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    }

    return NextResponse.json({ error: "No article id provided" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to update featured article" }, { status: 400 });
  }
}
