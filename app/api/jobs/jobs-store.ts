export interface ApiJobItem {
  id: number | string;
  title: string;
  slug: string;
  department: string;
  location: string;
  street_address?: string;
  streetAddress?: string;
  address_region?: string;
  addressRegion?: string;
  postal_code?: string;
  postalCode?: string;
  type: string;
  experience: string;
  description: string;
  salary: string;
  status: string;
  translations?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export const defaultJobsData: ApiJobItem[] = [];

let memoryJobs: ApiJobItem[] | null = null;

export function getMemoryJobs(): ApiJobItem[] {
  if (!memoryJobs) {
    memoryJobs = [];
  }
  return memoryJobs;
}

export function setMemoryJobs(jobs: ApiJobItem[]): void {
  memoryJobs = jobs;
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
