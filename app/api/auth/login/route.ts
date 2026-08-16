import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), ".data", "users_cache.json");
const MEMBERS_FILE = path.join(process.cwd(), ".data", "members_cache.json");
const ROLES_FILE = path.join(process.cwd(), ".data", "roles_cache.json");

function getUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    if (fs.existsSync(MEMBERS_FILE)) {
      const raw = fs.readFileSync(MEMBERS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [
    {
      id: 1,
      name: "Admin User",
      username: "admin",
      email: "admin@sti-dz.com",
      password: "password",
      roleId: "super_admin",
      roleName: "Super Admin",
      status: "Active",
    },
  ];
}

function getRoles() {
  try {
    if (fs.existsSync(ROLES_FILE)) {
      const raw = fs.readFileSync(ROLES_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, rememberMe } = body;

    const cleanUsername = (username || "").toLowerCase().trim();

    if (!cleanUsername || !password) {
      return NextResponse.json({ error: "Username and Password are required." }, { status: 400 });
    }

    const users = getUsers();
    const user = users.find(
      (u: any) =>
        (u.username && u.username.toLowerCase() === cleanUsername) ||
        (u.email && u.email.toLowerCase() === cleanUsername)
    );

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    if (user.status === "Inactive") {
      return NextResponse.json(
        { error: "Your account is currently inactive. Please contact an Administrator." },
        { status: 403 }
      );
    }

    // Attach role permissions
    const roles = getRoles();
    const matchedRole = roles.find((r: any) => r.id === user.roleId || r.name === user.roleName);
    const permissions = matchedRole ? matchedRole.permissions : [];

    const sessionUser = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email || "",
      roleId: user.roleId || "super_admin",
      roleName: user.roleName || "Super Admin",
      permissions: permissions,
    };

    const tokenPayload = Buffer.from(JSON.stringify(sessionUser)).toString("base64");
    const token = `sti_sess_${Date.now()}_${tokenPayload}`;
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
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
  } catch (err) {
    return NextResponse.json({ error: "Invalid login request." }, { status: 400 });
  }
}
