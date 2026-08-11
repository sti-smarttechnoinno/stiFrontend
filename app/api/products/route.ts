import { NextResponse } from "next/server";

// Vercel serverless config: allow 30s execution and 10MB body for image uploads
export const maxDuration = 30;
export const dynamic = "force-dynamic";

export interface ApiProductItem {
  id: number | string;
  sku: string;
  slug: string;
  category: string;
  brand: string;
  productType: string;
  product_type?: string;
  value: string;
  status: string;
  image?: string;
  updated_at?: string;
  translations: {
    en: {
      name: string;
      shortDescription: string;
      description: string;
      features: string[];
      specifications: { label: string; value: string }[];
      faqs: { question: string; answer: string }[];
    };
    ar: {
      name: string;
      shortDescription: string;
      description: string;
      features: string[];
      specifications: { label: string; value: string }[];
      faqs: { question: string; answer: string }[];
    };
    fr: {
      name: string;
      shortDescription: string;
      description: string;
      features: string[];
      specifications: { label: string; value: string }[];
      faqs: { question: string; answer: string }[];
    };
  };
}

export const defaultProductsData: ApiProductItem[] = [];

let memoryProducts: ApiProductItem[] | null = null;

export function getMemoryProducts(): ApiProductItem[] {
  if (!memoryProducts) {
    memoryProducts = [...defaultProductsData];
  }
  return memoryProducts;
}

export function updateMemoryProduct(id: string | number, fields: any): ApiProductItem | null {
  const list = getMemoryProducts();
  const index = list.findIndex((p) => String(p.id) === String(id) || p.slug === id);
  if (index !== -1) {
    list[index] = {
      ...list[index],
      ...fields,
      productType: fields.productType || fields.product_type || list[index].productType || "SIM Card",
      image: fields.image !== undefined ? fields.image : list[index].image,
    };
    return list[index];
  }
  return null;
}

export function deleteMemoryProduct(id: string | number): boolean {
  const list = getMemoryProducts();
  const index = list.findIndex((p) => String(p.id) === String(id) || p.slug === id);
  if (index !== -1) {
    list.splice(index, 1);
    return true;
  }
  return false;
}

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://127.0.0.1:8000/api";

export async function GET() {
  const currentMemory = getMemoryProducts();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${BACKEND_API_URL}/products`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((p: any) => ({
          ...p,
          productType: p.productType || p.product_type || "SIM Card",
          product_type: p.product_type || p.productType || "SIM Card",
          image: p.image || "/assets/sim-card.png",
        }));
        memoryProducts = mapped;
        return NextResponse.json(mapped);
      }
    }
  } catch {}

  return NextResponse.json(memoryProducts || defaultProductsData);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!memoryProducts) {
      memoryProducts = [...defaultProductsData];
    }

    const newId = memoryProducts.length > 0 ? Math.max(...memoryProducts.map((p) => Number(p.id) || 0)) + 1 : 1;

    try {
      const controller = new AbortController();
      // Longer timeout for image uploads (base64 images can be large)
      const timer = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${BACKEND_API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.id) {
          const mapped = {
            ...data,
            productType: data.productType || data.product_type || "SIM Card",
            product_type: data.product_type || data.productType || "SIM Card",
            image: data.image || "/assets/sim-card.png",
          };
          memoryProducts.push(mapped);
          return NextResponse.json(mapped);
        }
      }
    } catch {}

    // Fallback: save to memory but strip base64 from image to avoid memory bloat
    const newProduct: any = {
      id: newId,
      sku: body.sku || `PROD-${newId}`,
      slug: body.slug || `product-${newId}`,
      category: body.category || "SIM Cards",
      brand: body.brand || "Ooredoo",
      productType: body.productType || body.product_type || "SIM Card",
      product_type: body.product_type || body.productType || "SIM Card",
      value: body.value || "Available",
      status: body.status || "Published",
      image: body.image && body.image.startsWith("data:") ? "/assets/sim-card.png" : (body.image || "/assets/sim-card.png"),
      translations: body.translations || { en: { name: body.slug, shortDescription: "", description: "", features: [], specifications: [], faqs: [] }, ar: { name: body.slug, shortDescription: "", description: "", features: [], specifications: [], faqs: [] }, fr: { name: body.slug, shortDescription: "", description: "", features: [], specifications: [], faqs: [] } },
    };

    memoryProducts.push(newProduct);
    return NextResponse.json(newProduct);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}
