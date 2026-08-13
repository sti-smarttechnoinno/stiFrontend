import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMemoryJobs, updateMemoryJob, deleteMemoryJob } from "../jobs-store";
import { fetchFromBackend } from "../../backend-helper";

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
    const res = await fetchFromBackend(`/jobs/${id}`, { cache: "no-store" }, 10000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && (data.id || data.slug)) {
        return NextResponse.json(data);
      }
    }
  } catch {}

  const jobs = getMemoryJobs();
  const localMatch = jobs.find((j) => String(j.id) === String(id) || j.slug === id);
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

    const updatedLocal = updateMemoryJob(id, body);

    try {
      const res = await fetchFromBackend(`/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }, 10000);

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.id) {
          updateMemoryJob(id, data);
          return NextResponse.json(data);
        }
      }
    } catch {}

    if (updatedLocal) {
      return NextResponse.json(updatedLocal);
    }

    return NextResponse.json({ error: "Failed to update job" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update job", details: err?.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    deleteMemoryJob(id);

    try {
      await fetchFromBackend(`/jobs/${id}`, {
        method: "DELETE",
      }, 10000);
    } catch {}

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
