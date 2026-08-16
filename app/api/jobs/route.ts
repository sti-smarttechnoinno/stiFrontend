import { NextRequest, NextResponse } from "next/server";
import {
  ApiJobItem,
  defaultJobsData,
  getMemoryJobs,
  setMemoryJobs,
} from "./jobs-store";
import { fetchFromBackend } from "../backend-helper";

export type { ApiJobItem };

function validateJobBody(body: Record<string, unknown>, isEdit = false): string[] {
  const errors: string[] = [];

  if (!isEdit) {
    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      errors.push("Title is required");
    }
  }

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  try {
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/jobs?${queryString}` : "/jobs";

    const res = await fetchFromBackend(endpoint, { cache: "no-store" }, 10000);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        setMemoryJobs(data);
        return NextResponse.json(data);
      }
    }
  } catch {}

  const currentData = getMemoryJobs();
  if (statusFilter) {
    return NextResponse.json(currentData.filter((j) => j.status === statusFilter));
  }
  return NextResponse.json(currentData);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const errors = validateJobBody(body, false);
    if (errors.length > 0) {
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
    }

    const memoryJobs = getMemoryJobs();
    const newId = memoryJobs.length > 0 ? Math.max(...memoryJobs.map((j) => Number(j.id) || 0)) + 1 : 1;
    const slug = body.slug || (body.title ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `job-${newId}`);

    const newJob: ApiJobItem = {
      id: newId,
      title: body.title || "Open Position",
      slug,
      department: body.department || "General",
      location: body.location || "Algiers",
      street_address: (body.street_address || body.streetAddress || "") as string,
      streetAddress: (body.streetAddress || body.street_address || "") as string,
      address_region: (body.address_region || body.addressRegion || "") as string,
      addressRegion: (body.addressRegion || body.address_region || "") as string,
      postal_code: (body.postal_code || body.postalCode || "") as string,
      postalCode: (body.postalCode || body.postal_code || "") as string,
      type: body.type || "Full-time",
      experience: body.experience || "1-3 years",
      description: body.description || "",
      salary: body.salary || "Competitive",
      status: body.status || "Published",
      translations: body.translations,
    };

    memoryJobs.push(newJob);
    setMemoryJobs(memoryJobs);

    try {
      const res = await fetchFromBackend("/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }, 10000);

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.id) {
          memoryJobs[memoryJobs.length - 1] = data;
          setMemoryJobs(memoryJobs);
          return NextResponse.json(data, { status: 201 });
        }
      }
    } catch {}

    return NextResponse.json(newJob, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
