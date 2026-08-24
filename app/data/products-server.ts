import { fetchFromBackend } from "../api/backend-helper";

export interface ProductTranslation {
  name: string;
  shortDescription?: string;
  description: string;
  features?: string[];
  specifications?: { key?: string; label?: string; value: string }[] | any;
  faqs?: { q: string; a: string }[];
}

export interface ApiProductItem {
  id: number | string;
  sku?: string;
  slug: string;
  category?: string;
  brand?: string;
  productType?: string;
  product_type?: string;
  value?: string;
  status?: string;
  image?: string;
  gallery?: string[];
  created_at?: string;
  updated_at?: string;
  translations: {
    en: ProductTranslation;
    ar: ProductTranslation;
    fr: ProductTranslation;
  };
}

export async function getAllProductsServer(locale: string = "en"): Promise<ApiProductItem[]> {
  try {
    const res = await fetchFromBackend("/products", { cache: "no-store" }, 8000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data)) {
        return data
          .filter((p: ApiProductItem) => !p.status || p.status === "Published")
          .map((p: any) => ({
            ...p,
            productType: p.productType || p.product_type || "SIM Card",
            product_type: p.product_type || p.productType || "SIM Card",
            image: p.image || "/assets/sim-card.png",
          }));
      }
    }
  } catch (err) {
    console.error("Backend fetch error in getAllProductsServer:", err);
  }

  return [];
}

export async function getProductBySlugServer(slug: string, locale: string = "en"): Promise<ApiProductItem | undefined> {
  const decodedSlug = decodeURIComponent(slug);

  try {
    const res = await fetchFromBackend(`/products/${encodeURIComponent(decodedSlug)}`, { cache: "no-store" }, 8000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && (data.id || data.slug)) {
        return {
          ...data,
          productType: data.productType || data.product_type || "SIM Card",
          product_type: data.product_type || data.productType || "SIM Card",
          image: data.image || "/assets/sim-card.png",
        };
      }
    }
  } catch (err) {
    console.error("Backend fetch error in getProductBySlugServer:", err);
  }

  try {
    const all = await getAllProductsServer(locale);
    const found = all.find((p) => p.slug === decodedSlug || String(p.id) === decodedSlug || p.slug === slug);
    if (found) return found;
  } catch {}

  return undefined;
}
