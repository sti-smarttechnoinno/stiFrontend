import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { getMemoryUsers } from "../../users/users-store";

const ROLES_FILE = path.join(process.cwd(), ".data", "roles_cache.json");

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

    const rawInput = (username || "").toLowerCase().trim();
    const cleanUsername = rawInput.replace(/^@/, "");

    if (!cleanUsername || !password) {
      return NextResponse.json({ error: "Username and Password are required." }, { status: 400 });
    }

    const users = getMemoryUsers();
    const user = users.find(
      (u: any) => {
        const uName = (u.username || "").toLowerCase().trim().replace(/^@/, "");
        const uEmail = (u.email || "").toLowerCase().trim();
        return (uName && uName === cleanUsername) || (uEmail && uEmail === cleanUsername);
      }
    );

    const userPassword = user?.password || "password";

    if (!user || userPassword !== password) {
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
