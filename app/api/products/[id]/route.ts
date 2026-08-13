import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMemoryProducts, updateMemoryProduct, deleteMemoryProduct } from "../products-store";
import { fetchFromBackend } from "../../backend-helper";

// Vercel serverless config: allow 30s execution and 10MB body for image uploads
export const maxDuration = 30;
export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const res = await fetchFromBackend(`/products/${id}`, { cache: "no-store" }, 10000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && (data.id || data.slug)) {
        updateMemoryProduct(id, data);
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
  const localMatch: any = products.find((p) => String(p.id) === String(id) || p.slug === id);
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

    try {
      const res = await fetchFromBackend(`/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }, 15000);

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data) {
          const result = {
            ...data,
            productType: data.productType || data.product_type || "SIM Card",
            product_type: data.product_type || data.productType || "SIM Card",
            image: data.image || "/assets/sim-card.png",
          };
          updateMemoryProduct(id, result);
          return NextResponse.json(result);
        }
      }
    } catch {}

    const localBody = {
      ...body,
      image: body.image && body.image.startsWith("data:") ? "/assets/sim-card.png" : body.image,
    };
    const updatedLocal: any = updateMemoryProduct(id, localBody);
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
      await fetchFromBackend(`/products/${id}`, {
        method: "DELETE",
      }, 10000);
    } catch {}

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
