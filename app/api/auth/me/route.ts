import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("sti_admin_token")?.value;

  if (!token) {
    return NextResponse.json(
      { authenticated: false, error: "Unauthenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: 1,
      username: "admin",
      name: "admin",
      email: "admin@sti-dz.com",
      role: "Administrator",
    },
  });
}
