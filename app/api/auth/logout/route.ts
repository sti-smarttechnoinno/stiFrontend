import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  
  response.cookies.set({
    name: "sti_admin_token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}

export async function GET() {
  const response = NextResponse.redirect(new URL("/gate/login", "http://localhost:3000"));
  
  response.cookies.set({
    name: "sti_admin_token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
