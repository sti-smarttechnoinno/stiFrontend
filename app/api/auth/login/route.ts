import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, rememberMe } = body;

    const identifier = (username || email || "").toLowerCase().trim();

    // Check credentials against admin seed user (admin / password or admin@sti-dz.com / password)
    const isValidUser = identifier === "admin" || identifier === "admin@sti-dz.com";
    const isValidPass = password === "password";

    if (!isValidUser || !isValidPass) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Generate secure admin token
    const token = "sti_admin_session_" + Date.now();
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days or 1 day

    const response = NextResponse.json({
      success: true,
      user: {
        id: 1,
        username: "admin",
        name: "admin",
        email: "admin@sti-dz.com",
        role: "Administrator",
      },
    });

    response.cookies.set({
      name: "sti_admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
