import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultProductsData } from "../route";

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_API_URL}/products/${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        ...data,
        productType: data.productType || data.product_type || "SIM Card",
      });
    }
  } catch {}

  const localMatch = defaultProductsData.find((p) => String(p.id) === String(id));
  if (localMatch) {
    return NextResponse.json(localMatch);
  }

  return NextResponse.json({ error: "Product not found" }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_API_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        ...data,
        productType: data.productType || data.product_type || "SIM Card",
      });
    }
  } catch {}

  return NextResponse.json({ error: "Failed to update product in backend" }, { status: 500 });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_API_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      return NextResponse.json({ success: true, message: "Deleted" });
    }
  } catch {}

  return NextResponse.json({ error: "Failed to delete product in backend" }, { status: 500 });
}
