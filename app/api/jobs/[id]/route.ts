import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultJobsData } from "../route";

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface Params {
  params: Promise<{ id: string }>;
}

function validateJobBody(body: Record<string, unknown>): string[] {
  const errors: string[] = [];

  if (body.department !== undefined) {
    if (typeof body.department !== "string" || body.department.trim() === "") {
      errors.push("Department must be a non-empty string");
    }
  }

  if (body.location !== undefined) {
    if (typeof body.location !== "string" || body.location.trim() === "") {
      errors.push("Location must be a non-empty string");
    }
  }

  if (body.status !== undefined) {
    if (!["Published", "Draft"].includes(body.status as string)) {
      errors.push("Status must be 'Published' or 'Draft'");
    }
  }

  if (body.type !== undefined) {
    if (typeof body.type !== "string" || body.type.trim() === "") {
      errors.push("Type must be a non-empty string");
    }
  }

  return errors;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_API_URL}/jobs/${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {}

  const localMatch = defaultJobsData.find((j) => String(j.id) === String(id) || j.slug === id);
  if (localMatch) {
    return NextResponse.json(localMatch);
  }

  return NextResponse.json({ error: "Job not found" }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await request.json();

    const errors = validateJobBody(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_API_URL}/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);
    if (res.ok && data) {
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: data?.message || data?.error || "Failed to update job in backend" },
      { status: res.status || 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update job in backend", details: err?.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_API_URL}/jobs/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      return NextResponse.json({ success: true, message: "Deleted" });
    }
  } catch {}

  return NextResponse.json({ error: "Failed to delete job in backend" }, { status: 500 });
}
