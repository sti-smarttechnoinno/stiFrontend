import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { fetchFromBackend } from "../backend-helper";
import { ALL_PERMISSIONS, type RoleItem } from "../../types/roles";

export { ALL_PERMISSIONS, type RoleItem };

const DEFAULT_ROLES: RoleItem[] = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Full access to all console features, security settings, and user management",
    isSystem: true,
    permissions: ALL_PERMISSIONS.map((p) => p.id),
  },
  {
    id: "content_manager",
    name: "Content Manager",
    description: "Manage solutions, product catalog, news articles, and company information",
    isSystem: false,
    permissions: [
      "dashboard:view",
      "solutions:view",
      "solutions:manage",
      "products:view",
      "products:manage",
      "news:view",
      "news:manage",
      "company:view",
      "company:manage",
    ],
  },
  {
    id: "recruitment_manager",
    name: "Recruitment Manager",
    description: "Manage career job openings and candidate application submissions",
    isSystem: false,
    permissions: [
      "dashboard:view",
      "openings:view",
      "openings:manage",
      "submissions:view",
      "submissions:manage",
    ],
  },
  {
    id: "sales_manager",
    name: "Sales Manager",
    description: "Manage client messages and wholesale quotation requests",
    isSystem: false,
    permissions: [
      "dashboard:view",
      "mailbox:view",
      "mailbox:manage",
      "requests:view",
      "requests:manage",
    ],
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only view access across dashboard and non-sensitive management reports",
    isSystem: false,
    permissions: [
      "dashboard:view",
      "solutions:view",
      "products:view",
      "news:view",
      "openings:view",
      "submissions:view",
      "mailbox:view",
      "requests:view",
      "company:view",
    ],
  },
];

let memoryRoles: RoleItem[] | null = null;
const CACHE_FILE = path.join(process.cwd(), ".data", "roles_cache.json");

function readDiskCache(): RoleItem[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_ROLES;
}

function writeDiskCache(data: RoleItem[]): void {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write roles disk cache:", err);
  }
}

export async function GET() {
  if (!memoryRoles) {
    memoryRoles = readDiskCache();
  }

  try {
    const backendRes = await fetchFromBackend("/roles", {}, 3000);
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
        writeDiskCache(memoryRoles);
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

    if (!memoryRoles) {
      memoryRoles = readDiskCache();
    }

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
    writeDiskCache(memoryRoles);

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

    if (!memoryRoles) {
      memoryRoles = readDiskCache();
    }

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
    writeDiskCache(memoryRoles);

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

    if (!memoryRoles) {
      memoryRoles = readDiskCache();
    }

    const roleToDelete = memoryRoles.find((r) => String(r.id) === String(id));
    if (roleToDelete && roleToDelete.isSystem) {
      return NextResponse.json({ error: "System roles cannot be deleted." }, { status: 403 });
    }

    memoryRoles = memoryRoles.filter((r) => String(r.id) !== String(id));
    writeDiskCache(memoryRoles);

    fetchFromBackend(`/roles/${id}`, {
      method: "DELETE",
    }).catch(() => null);

    return NextResponse.json({ success: true, id });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete role." }, { status: 500 });
  }
}
