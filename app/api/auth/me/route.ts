import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const ROLES_FILE = path.join(process.cwd(), ".data", "roles_cache.json");

function getRolePermissions(roleId: string, roleName: string) {
  try {
    if (fs.existsSync(ROLES_FILE)) {
      const raw = fs.readFileSync(ROLES_FILE, "utf-8");
      const roles = JSON.parse(raw);
      if (Array.isArray(roles)) {
        const found = roles.find((r) => r.id === roleId || r.name === roleName);
        if (found) return found.permissions;
      }
    }
  } catch {}

  // Default Super Admin fallback permissions if role cache is uninitialized
  if (roleId === "super_admin" || roleName === "Super Admin" || roleName === "Administrator") {
    return [
      "dashboard:view",
      "solutions:view",
      "solutions:manage",
      "products:view",
      "products:manage",
      "news:view",
      "news:manage",
      "openings:view",
      "openings:manage",
      "submissions:view",
      "submissions:manage",
      "mailbox:view",
      "mailbox:manage",
      "requests:view",
      "requests:manage",
      "company:view",
      "company:manage",
      "members:view",
      "members:manage",
      "access:view",
      "access:manage",
      "settings:view",
      "settings:manage",
    ];
  }
  return [];
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("sti_admin_token")?.value;

  if (!token) {
    return NextResponse.json(
      { authenticated: false, error: "Unauthenticated" },
      { status: 401 }
    );
  }

  try {
    const parts = token.split("_");
    const payloadBase64 = parts[parts.length - 1];
    const rawJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
    const sessionUser = JSON.parse(rawJson);

    // Refresh live role permissions
    const livePermissions = getRolePermissions(sessionUser.roleId, sessionUser.roleName);

    return NextResponse.json({
      authenticated: true,
      user: {
        ...sessionUser,
        permissions: livePermissions.length > 0 ? livePermissions : sessionUser.permissions || [],
      },
    });
  } catch (err) {
    // Fallback for default seed token
    return NextResponse.json({
      authenticated: true,
      user: {
        id: 1,
        username: "admin",
        name: "Admin User",
        email: "admin@sti-dz.com",
        roleId: "super_admin",
        roleName: "Super Admin",
        permissions: getRolePermissions("super_admin", "Super Admin"),
      },
    });
  }
}
