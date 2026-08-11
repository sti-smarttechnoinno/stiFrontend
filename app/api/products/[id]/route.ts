import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMemoryProducts, updateMemoryProduct, deleteMemoryProduct } from "../route";

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://127.0.0.1:8000/api";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${BACKEND_API_URL}/products/${id}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data && (data.id || data.slug)) {
        return NextResponse.json({
          ...data,
          productType: data.productType || data.product_type || "SIM Card",
          product_type: data.product_type || data.productType || "SIM Card",
          image: data.image || "/assets/sim-card.png",
        });
      }
    }
  } catch {}

  const products = getMemoryProducts();
  const localMatch = products.find((p) => String(p.id) === String(id) || p.slug === id);
  if (localMatch) {
    return NextResponse.json({
      ...localMatch,
      productType: localMatch.productType || localMatch.product_type || "SIM Card",
      product_type: localMatch.product_type || localMatch.productType || "SIM Card",
      image: localMatch.image || "/assets/sim-card.png",
    });
  }

  return NextResponse.json({ error: "Product not found" }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updatedLocal = updateMemoryProduct(id, body);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${BACKEND_API_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data) {
          if (updatedLocal) {
            updateMemoryProduct(id, data);
          }
          return NextResponse.json({
            ...data,
            productType: data.productType || data.product_type || "SIM Card",
            product_type: data.product_type || data.productType || "SIM Card",
            image: data.image || body.image || "/assets/sim-card.png",
          });
        }
      }
    } catch {}

    if (updatedLocal) {
      return NextResponse.json({
        ...updatedLocal,
        productType: updatedLocal.productType || updatedLocal.product_type || "SIM Card",
        product_type: updatedLocal.product_type || updatedLocal.productType || "SIM Card",
        image: updatedLocal.image || "/assets/sim-card.png",
      });
    }

    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    deleteMemoryProduct(id);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${BACKEND_API_URL}/products/${id}`, {
        method: "DELETE",
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        return NextResponse.json({ success: true, message: "Deleted" });
      }
    } catch {}

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
