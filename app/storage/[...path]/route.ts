import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Derive backend base URL from BACKEND_API_URL by stripping "/api"
function getBackendBaseUrl(): string {
  const apiUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    "http://127.0.0.1:8000/api";
  return apiUrl.replace(/\/api\/?$/, "");
}

interface Params {
  params: Promise<{ path: string[] }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { path } = await params;
  const filePath = path.join("/");
  const backendBase = getBackendBaseUrl();

  try {
    const backendRes = await fetch(`${backendBase}/storage/${filePath}`, {
      cache: "no-store",
    });

    if (backendRes.ok) {
      const contentType =
        backendRes.headers.get("content-type") || "application/octet-stream";
      const blob = await backendRes.arrayBuffer();

      return new NextResponse(blob, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch {}

  return new NextResponse("File not found", { status: 404 });
}

