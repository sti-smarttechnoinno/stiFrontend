import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchFromBackend } from "../backend-helper";
import { ALL_PERMISSIONS, type RoleItem } from "../../types/roles";
import { DEFAULT_ROLES, getMemoryRoles, setMemoryRoles } from "./roles-store";

export { ALL_PERMISSIONS, type RoleItem };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  let memoryRoles = getMemoryRoles();

  try {
    const backendRes = await fetchFromBackend("/roles", { cache: "no-store" }, 10000);
    if (backendRes && backendRes.ok) {
      const backendData = await backendRes.json();
      if (Array.isArray(backendData) && backendData.length > 0) {
        const localMap = new Map<string, RoleItem>();
        for (const role of memoryRoles) {
          const key = String(role.id) || (role.name || "").toLowerCase();
          if (key) localMap.set(key, role);
        }

        for (const bRole of backendData) {
          const key = String(bRole.id) || (bRole.name || "").toLowerCase();
          if (key) {
            const existing = localMap.get(key);
            localMap.set(key, existing ? { ...bRole, ...existing } : bRole);
          }
        }

        memoryRoles = Array.from(localMap.values());
        setMemoryRoles(memoryRoles);
      }
    }
  } catch {}

  return NextResponse.json(memoryRoles);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, permissions } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Role name is required." }, { status: 400 });
    }

    const memoryRoles = getMemoryRoles();

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Date.now();
    const newRole: RoleItem = {
      id,
      name: name.trim(),
      description: (description || "").trim(),
      isSystem: false,
      permissions: Array.isArray(permissions) ? permissions : [],
      created_at: new Date().toISOString(),
    };

    memoryRoles.push(newRole);
    setMemoryRoles(memoryRoles);

    fetchFromBackend("/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRole),
    }).catch(() => null);

    return NextResponse.json(newRole, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create role." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, permissions } = body;

    if (!id) {
      return NextResponse.json({ error: "Role ID is required." }, { status: 400 });
    }

    const memoryRoles = getMemoryRoles();

    const index = memoryRoles.findIndex((r) => String(r.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: "Role not found." }, { status: 404 });
    }

    const existing = memoryRoles[index];
    const updatedRole: RoleItem = {
      ...existing,
      name: name !== undefined ? name.trim() : existing.name,
      description: description !== undefined ? description.trim() : existing.description,
      permissions: Array.isArray(permissions) ? permissions : existing.permissions,
    };

    memoryRoles[index] = updatedRole;
    setMemoryRoles(memoryRoles);

    fetchFromBackend(`/roles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRole),
    }).catch(() => null);

    return NextResponse.json(updatedRole);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update role." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Role ID is required." }, { status: 400 });
    }

    let memoryRoles = getMemoryRoles();

    const roleToDelete = memoryRoles.find((r) => String(r.id) === String(id));
    if (roleToDelete && roleToDelete.isSystem) {
      return NextResponse.json({ error: "System roles cannot be deleted." }, { status: 403 });
    }

    memoryRoles = memoryRoles.filter((r) => String(r.id) !== String(id));
    setMemoryRoles(memoryRoles);

    fetchFromBackend(`/roles/${id}`, {
      method: "DELETE",
    }).catch(() => null);

    return NextResponse.json({ success: true, id });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete role." }, { status: 500 });
  }
}
