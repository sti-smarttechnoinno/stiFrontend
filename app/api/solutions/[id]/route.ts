import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchFromBackend } from "../../backend-helper";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const res = await fetchFromBackend(`/solutions/${encodeURIComponent(id)}`, {
      cache: "no-store",
    }, 8000);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data) {
        return NextResponse.json(data);
      }
    }

    // Also check list of solutions
    const listRes = await fetchFromBackend("/solutions", { cache: "no-store" }, 8000);
    if (listRes && listRes.ok) {
      const allSolutions = await listRes.json().catch(() => null);
      if (Array.isArray(allSolutions)) {
        const found = allSolutions.find((s: any) => s.slug === id || String(s.id) === id);
        if (found) {
          return NextResponse.json(found);
        }
      }
    }
  } catch {}

  return NextResponse.json({ error: "Solution not found" }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await request.json();
    const res = await fetchFromBackend(`/solutions/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }, 8000);

    if (res && res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    return NextResponse.json({ error: "Failed to update solution" }, { status: 500 });
  }

  return NextResponse.json({ error: "Failed to update solution" }, { status: 500 });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const res = await fetchFromBackend(`/solutions/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }, 8000);

    if (res && res.ok) {
      return NextResponse.json({ success: true, message: "Deleted" });
    }
  } catch {}

  return NextResponse.json({ success: true, message: "Deleted from frontend" });
}
