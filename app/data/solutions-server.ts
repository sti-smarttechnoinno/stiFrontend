import { fetchFromBackend } from "../api/backend-helper";

export interface SolutionTranslation {
  name?: string;
  shortName?: string;
  badge?: string;
  tagline?: string;
  description?: string[];
  features?: { title: string; desc: string }[];
  targetAudience?: string[];
  faqs?: { q: string; a: string }[];
}

export interface ApiSolutionItem {
  id: number | string;
  slug: string;
  status?: string;
  image?: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
  translations?: {
    en?: SolutionTranslation;
    ar?: SolutionTranslation;
    fr?: SolutionTranslation;
  };
}

export async function getAllSolutionsServer(locale: string = "en"): Promise<ApiSolutionItem[]> {
  try {
    const res = await fetchFromBackend("/solutions", { cache: "no-store" }, 8000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data)) {
        return data.filter((s: ApiSolutionItem) => !s.status || s.status === "Published");
      }
    }
  } catch (err) {
    console.error("Backend fetch error in getAllSolutionsServer:", err);
  }

  return [];
}

export async function getSolutionBySlugServer(slug: string, locale: string = "en"): Promise<ApiSolutionItem | undefined> {
  const decodedSlug = decodeURIComponent(slug);

  try {
    const res = await fetchFromBackend(`/solutions/${encodeURIComponent(decodedSlug)}`, { cache: "no-store" }, 8000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && (data.id || data.slug)) {
        return data;
      }
    }
  } catch (err) {
    console.error("Backend fetch error in getSolutionBySlugServer:", err);
  }

  try {
    const all = await getAllSolutionsServer(locale);
    const found = all.find((s) => s.slug === decodedSlug || String(s.id) === decodedSlug || s.slug === slug);
    if (found) return found;
  } catch {}

  return undefined;
}
