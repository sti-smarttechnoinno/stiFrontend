import { NextResponse } from "next/server";

// Simple in-memory storage of featured news article ID
let featuredArticleId: string | number = 1;

export async function GET() {
  return NextResponse.json({ featuredId: featuredArticleId });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.id !== undefined) {
      featuredArticleId = body.id;
    }
    return NextResponse.json({ featuredId: featuredArticleId });
  } catch {
    return NextResponse.json({ error: "Failed to update featured article" }, { status: 400 });
  }
}
