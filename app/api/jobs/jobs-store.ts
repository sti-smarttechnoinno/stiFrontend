import fs from "fs";
import path from "path";

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

let memoryJobs: ApiJobItem[] | null = null;
const CACHE_FILE = path.join(process.cwd(), ".data", "jobs_cache.json");

export function readJobsDiskCache(): ApiJobItem[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [];
}

export function writeJobsDiskCache(data: ApiJobItem[]): void {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {}
}

export function getMemoryJobs(): ApiJobItem[] {
  if (!memoryJobs) {
    memoryJobs = readJobsDiskCache();
    if (memoryJobs.length === 0) {
      memoryJobs = [...defaultJobsData];
    }
  }
  return memoryJobs;
}

export function setMemoryJobs(jobs: ApiJobItem[]): void {
  memoryJobs = jobs;
  writeJobsDiskCache(jobs);
}

export function updateMemoryJob(id: string | number, fields: Partial<ApiJobItem>): ApiJobItem | null {
  const list = getMemoryJobs();
  const index = list.findIndex((j) => String(j.id) === String(id) || j.slug === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...fields };
    writeJobsDiskCache(list);
    return list[index];
  }
  return null;
}

export function deleteMemoryJob(id: string | number): boolean {
  const list = getMemoryJobs();
  const index = list.findIndex((j) => String(j.id) === String(id) || j.slug === id);
  if (index !== -1) {
    list.splice(index, 1);
    writeJobsDiskCache(list);
    return true;
  }
  return false;
}
