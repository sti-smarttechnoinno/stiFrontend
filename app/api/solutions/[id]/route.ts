import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_API_URL}/solutions/${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {}

  return NextResponse.json({ error: "Solution not found" }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_API_URL}/solutions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    const errData = await res.json();
    return NextResponse.json(errData, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to update solution" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_API_URL}/solutions/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      return NextResponse.json({ success: true, message: "Deleted" });
    }
  } catch {}

  return NextResponse.json({ success: true, message: "Deleted from frontend" });
}
