import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchFromBackend } from "../backend-helper";

export async function GET() {
  try {
    const res = await fetchFromBackend("/solutions", { cache: "no-store" }, 10000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data)) {
        return NextResponse.json(data);
      }
    }
  } catch (err) {
    console.error("Failed to fetch solutions from backend:", err);
  }

  return NextResponse.json([]);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetchFromBackend("/solutions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }, 10000);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data) {
        return NextResponse.json(data, { status: 201 });
      }
    }

    return NextResponse.json(body, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to save solution" }, { status: 500 });
  }
}
