import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchFromBackend } from "../backend-helper";

export interface TeamMemberTranslation {
  name: string;
  position: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  initials?: string;
  image?: string;
  linkedin?: string;
  translations?: {
    en?: TeamMemberTranslation;
    ar?: TeamMemberTranslation;
    fr?: TeamMemberTranslation;
  };
}

export async function GET() {
  try {
    const res = await fetchFromBackend("/team", { cache: "no-store" }, 10000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data)) {
        return NextResponse.json(data);
      }
      if (data && Array.isArray(data.members)) {
        return NextResponse.json(data.members);
      }
    }
  } catch (err) {
    console.error("Backend fetch error for team:", err);
  }

  return NextResponse.json([]);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetchFromBackend("/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }, 10000);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data) {
        return NextResponse.json(data);
      }
    }

    return NextResponse.json(body);
  } catch (err) {
    return NextResponse.json({ error: "Failed to save team" }, { status: 500 });
  }
}
