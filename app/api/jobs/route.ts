import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;

export interface ApiJobItem {
  id: number | string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  salary: string;
  status: string;
  translations?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export const defaultJobsData: ApiJobItem[] = [
  {
    id: 1,
    title: "Sales Representative",
    slug: "sales-representative",
    department: "Sales",
    location: "Algiers",
    type: "Full-time",
    experience: "2-4 years",
    description: "Drive sales growth by building relationships with retailers and business partners across your assigned territory.",
    salary: "Competitive",
    status: "Published",
  },
  {
    id: 2,
    title: "Distribution Coordinator",
    slug: "distribution-coordinator",
    department: "Distribution",
    location: "Oran",
    type: "Full-time",
    experience: "3-5 years",
    description: "Coordinate product distribution operations ensuring timely delivery to partners across multiple provinces.",
    salary: "Competitive",
    status: "Published",
  },
  {
    id: 3,
    title: "Warehouse Assistant",
    slug: "warehouse-assistant",
    department: "Warehouse",
    location: "Algiers",
    type: "Full-time",
    experience: "1-2 years",
    description: "Support warehouse operations including inventory management, order processing, and product organization.",
    salary: "Competitive",
    status: "Published",
  },
  {
    id: 4,
    title: "Customer Support Agent",
    slug: "customer-support-agent",
    department: "Customer Support",
    location: "Constantine",
    type: "Full-time",
    experience: "1-3 years",
    description: "Provide excellent support to retail partners, handling inquiries and resolving issues professionally.",
    salary: "Competitive",
    status: "Published",
  },
  {
    id: 5,
    title: "Marketing Executive",
    slug: "marketing-executive",
    department: "Marketing",
    location: "Algiers",
    type: "Full-time",
    experience: "2-4 years",
    description: "Develop and execute marketing strategies to promote Ooredoo products and strengthen brand presence.",
    salary: "Competitive",
    status: "Published",
  },
  {
    id: 6,
    title: "Administrative Assistant",
    slug: "administrative-assistant",
    department: "Administration",
    location: "Blida",
    type: "Full-time",
    experience: "1-2 years",
    description: "Provide administrative support including document management, scheduling, and office coordination.",
    salary: "Competitive",
    status: "Published",
  },
];

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

let memoryJobs: ApiJobItem[] | null = null;

export function getMemoryJobs(): ApiJobItem[] {
  if (!memoryJobs) {
    memoryJobs = [...defaultJobsData];
  }
  return memoryJobs;
}

export function updateMemoryJob(id: string | number, fields: Partial<ApiJobItem>): ApiJobItem | null {
  const list = getMemoryJobs();
  const index = list.findIndex((j) => String(j.id) === String(id) || j.slug === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...fields };
    return list[index];
  }
  return null;
}

export function deleteMemoryJob(id: string | number): boolean {
  const list = getMemoryJobs();
  const index = list.findIndex((j) => String(j.id) === String(id) || j.slug === id);
  if (index !== -1) {
    list.splice(index, 1);
    return true;
  }
  return false;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  const currentMemory = getMemoryJobs();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const queryString = searchParams.toString();
    const url = queryString ? `${BACKEND_API_URL}/jobs?${queryString}` : `${BACKEND_API_URL}/jobs`;

    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        memoryJobs = data;
        return NextResponse.json(data);
      }
    }
  } catch {}

  const currentData = memoryJobs || defaultJobsData;
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

    if (!memoryJobs) {
      memoryJobs = [...defaultJobsData];
    }

    const newId = memoryJobs.length > 0 ? Math.max(...memoryJobs.map((j) => Number(j.id) || 0)) + 1 : 1;
    const slug = body.slug || (body.title ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `job-${newId}`);

    const newJob: ApiJobItem = {
      id: newId,
      title: body.title || "Open Position",
      slug,
      department: body.department || "General",
      location: body.location || "Algiers",
      type: body.type || "Full-time",
      experience: body.experience || "1-3 years",
      description: body.description || "",
      salary: body.salary || "Competitive",
      status: body.status || "Published",
      translations: body.translations,
    };

    memoryJobs.push(newJob);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${BACKEND_API_URL}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.id) {
          memoryJobs[memoryJobs.length - 1] = data;
          return NextResponse.json(data, { status: 201 });
        }
      }
    } catch {}

    return NextResponse.json(newJob, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
