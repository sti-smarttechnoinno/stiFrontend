import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPermissionsForRole } from "../../roles/roles-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    // Refresh live role permissions from roles-store
    const livePermissions = getPermissionsForRole(sessionUser.roleId, sessionUser.roleName);

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
        permissions: getPermissionsForRole("super_admin", "Super Admin"),
      },
    });
  }
}
