import { NextResponse } from "next/server";
import {
  ApiProductItem,
  defaultProductsData,
  getMemoryProducts,
  setMemoryProducts,
} from "./products-store";
import { fetchFromBackend } from "../backend-helper";

// Vercel serverless config: allow 30s execution and 10MB body for image uploads
export const maxDuration = 30;
export const dynamic = "force-dynamic";

export type { ApiProductItem };

export async function GET() {
  try {
    const res = await fetchFromBackend("/products", { cache: "no-store" }, 10000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((p: any) => ({
          ...p,
          productType: p.productType || p.product_type || "SIM Card",
          product_type: p.product_type || p.productType || "SIM Card",
          image: p.image || "/assets/sim-card.png",
        }));
        setMemoryProducts(mapped);
        return NextResponse.json(mapped);
      }
    }
  } catch {}

  const currentMemory = getMemoryProducts();
  return NextResponse.json(currentMemory.length > 0 ? currentMemory : defaultProductsData);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const memoryProducts = getMemoryProducts();

    const newId = memoryProducts.length > 0 ? Math.max(...memoryProducts.map((p) => Number(p.id) || 0)) + 1 : 1;

    try {
      const res = await fetchFromBackend("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }, 15000);

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.id) {
          const mapped = {
            ...data,
            productType: data.productType || data.product_type || "SIM Card",
            product_type: data.product_type || data.productType || "SIM Card",
            image: data.image || "/assets/sim-card.png",
          };
          memoryProducts.push(mapped);
          setMemoryProducts(memoryProducts);
          return NextResponse.json(mapped);
        }
      }
    } catch {}

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
    setMemoryProducts(memoryProducts);
    return NextResponse.json(newProduct);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}
