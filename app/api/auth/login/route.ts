import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchFromBackend } from "../../backend-helper";
import { getPermissionsForRole } from "../../roles/roles-store";
import { getMemoryUsers, UserItem } from "../../users/users-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Username and Password are required." }, { status: 400 });
    }

    const { username, password, rememberMe } = body;

    const rawInput = (username || body.email || "").toString().trim();
    const cleanUsername = rawInput.toLowerCase().replace(/^@/, "");
    const inputPassword = String(password || "").trim();

    if (!cleanUsername || !inputPassword) {
      return NextResponse.json({ error: "Username and Password are required." }, { status: 400 });
    }

    let dbUser: any = null;
    let backendToken: string | undefined = undefined;

    // 1. Authenticate user against Backend DB API if reachable and healthy
    try {
      const backendRes = await fetchFromBackend("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanUsername,
          email: rawInput,
          password: inputPassword,
        }),
      }, 2500).catch(() => null);

      if (backendRes && backendRes.ok) {
        const backendData = await backendRes.json().catch(() => null);
        if (backendData?.user) {
          dbUser = backendData.user;
          backendToken = backendData.token;
        }
      }
    } catch {
      // Backend error, ignore and fallback to local user store
    }

    // 2. If backend service is down/unreachable or user not authenticated on backend, query local user records
    if (!dbUser) {
      const users = getMemoryUsers();
      const inputLower = cleanUsername.toLowerCase();
      const rawLower = rawInput.toLowerCase();

      const localUser = users.find((u: UserItem) => {
        const uName = (u?.username || "").toLowerCase().trim().replace(/^@/, "");
        const uEmail = (u?.email || "").toLowerCase().trim();
        const uDisplayName = (u?.name || "").toLowerCase().trim();
        return (
          (uName && (uName === inputLower || uName === rawLower)) ||
          (uEmail && (uEmail === inputLower || uEmail === rawLower)) ||
          (uDisplayName && (uDisplayName === inputLower || uDisplayName === rawLower))
        );
      });

      if (!localUser || localUser.password !== inputPassword) {
        return NextResponse.json(
          { error: "Invalid login credentials." },
          { status: 401 }
        );
      }

      dbUser = localUser;
    }

    if (dbUser.status === "Inactive") {
      return NextResponse.json(
        { error: "Your account is currently inactive. Please contact an Administrator." },
        { status: 403 }
      );
    }

    const roleId = dbUser.role_id || dbUser.roleId || "viewer";
    const roleName = dbUser.role_name || dbUser.roleName || "Viewer";
    const permissions = getPermissionsForRole(roleId, roleName);

    const sessionUser = {
      id: dbUser.id,
      name: dbUser.name,
      username: (dbUser.username || cleanUsername).toLowerCase().replace(/^@/, ""),
      email: dbUser.email || "",
      roleId,
      roleName,
      permissions,
      backendToken,
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
  } catch (err: any) {
    console.error("Login Route Error:", err);
    return NextResponse.json(
      { error: "Invalid login credentials." },
      { status: 401 }
    );
  }
}
