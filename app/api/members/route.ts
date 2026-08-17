import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { fetchFromBackend } from "../backend-helper";

export interface MemberItem {
  id: string | number;
  name: string;
  username: string;
  email?: string;
  password?: string;
  roleId: string;
  roleName: string;
  status: "Active" | "Inactive";
  lastLogin?: string;
  createdAt?: string;
}

const DEFAULT_MEMBERS: MemberItem[] = [
  {
    id: 1,
    name: "Admin User",
    username: "admin",
    email: "admin@sti-dz.com",
    password: "password",
    roleId: "super_admin",
    roleName: "Super Admin",
    status: "Active",
    lastLogin: "Just now",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Content Manager",
    username: "content",
    email: "content@sti-dz.com",
    password: "password",
    roleId: "content_manager",
    roleName: "Content Manager",
    status: "Active",
    lastLogin: "May 19, 2026",
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: 3,
    name: "HR Manager",
    username: "hr",
    email: "hr@sti-dz.com",
    password: "password",
    roleId: "recruitment_manager",
    roleName: "Recruitment Manager",
    status: "Active",
    lastLogin: "May 18, 2026",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: 4,
    name: "Sales Manager",
    username: "sales",
    email: "sales@sti-dz.com",
    password: "password",
    roleId: "sales_manager",
    roleName: "Sales Manager",
    status: "Active",
    lastLogin: "May 17, 2026",
    createdAt: "2026-02-10T00:00:00.000Z",
  },
  {
    id: 5,
    name: "Viewer Account",
    username: "viewer",
    email: "viewer@sti-dz.com",
    password: "password",
    roleId: "viewer",
    roleName: "Viewer",
    status: "Inactive",
    lastLogin: "May 10, 2026",
    createdAt: "2026-03-01T00:00:00.000Z",
  },
];

let memoryMembers: MemberItem[] | null = null;
const CACHE_FILE = path.join(process.cwd(), ".data", "members_cache.json");

function readDiskCache(): MemberItem[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_MEMBERS;
}

function writeDiskCache(data: MemberItem[]): void {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write members disk cache:", err);
  }
}

export async function GET() {
  if (!memoryMembers) {
    memoryMembers = readDiskCache();
  }

  try {
    const backendRes = await fetchFromBackend("/members", {}, 3000);
    if (backendRes && backendRes.ok) {
      const backendData = await backendRes.json();
      if (Array.isArray(backendData) && backendData.length > 0) {
        const localMap = new Map<string, MemberItem>();
        for (const member of memoryMembers) {
          const key = String(member.id) || (member.username || "").toLowerCase() || (member.email || "").toLowerCase();
          if (key) localMap.set(key, member);
        }

        for (const bMember of backendData) {
          const key = String(bMember.id) || (bMember.username || "").toLowerCase() || (bMember.email || "").toLowerCase();
          if (key) {
            const existing = localMap.get(key);
            if (existing) {
              localMap.set(key, {
                ...bMember,
                ...existing,
                name: bMember.name || existing.name,
                email: bMember.email || existing.email,
              });
            } else {
              localMap.set(key, {
                id: bMember.id || Date.now(),
                name: bMember.name || "Backend Member",
                username: bMember.username || (bMember.email ? bMember.email.split("@")[0] : `member_${bMember.id}`),
                email: bMember.email || "",
                roleId: bMember.roleId || "viewer",
                roleName: bMember.roleName || "Viewer",
                status: bMember.status || "Active",
                lastLogin: bMember.lastLogin || "Unknown",
                createdAt: bMember.createdAt || new Date().toISOString(),
              });
            }
          }
        }

        memoryMembers = Array.from(localMap.values());
        writeDiskCache(memoryMembers);
      }
    }
  } catch {}

  const sanitized = memoryMembers.map(({ password, ...rest }) => rest);
  return NextResponse.json(sanitized);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, email, password, roleId, roleName, status } = body;

    if (!name || !username || !password) {
      return NextResponse.json({ error: "Name, username, and password are required." }, { status: 400 });
    }

    if (!memoryMembers) {
      memoryMembers = readDiskCache();
    }

    const cleanUsername = username.trim().toLowerCase();

    const exists = memoryMembers.some(
      (m) => m.username && m.username.toLowerCase() === cleanUsername
    );

    if (exists) {
      return NextResponse.json({ error: `Username "@${cleanUsername}" is already taken.` }, { status: 400 });
    }

    const newMember: MemberItem = {
      id: Date.now(),
      name: name.trim(),
      username: cleanUsername,
      email: (email || "").trim(),
      password: password.trim(),
      roleId: roleId || "viewer",
      roleName: roleName || "Viewer",
      status: status || "Active",
      lastLogin: "Never",
      createdAt: new Date().toISOString(),
    };

    memoryMembers.push(newMember);
    writeDiskCache(memoryMembers);

    // Sync to Laravel Backend if online
    fetchFromBackend("/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMember),
    }).catch(() => null);

    const { password: _, ...result } = newMember;
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, username, email, password, roleId, roleName, status, lastLogin } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    if (!memoryMembers) {
      memoryMembers = readDiskCache();
    }

    const index = memoryMembers.findIndex((m) => String(m.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const existing = memoryMembers[index];

    if (username && username.trim().toLowerCase() !== existing.username.toLowerCase()) {
      const cleanU = username.trim().toLowerCase();
      const conflict = memoryMembers.some((m) => String(m.id) !== String(id) && m.username.toLowerCase() === cleanU);
      if (conflict) {
        return NextResponse.json({ error: `Username "@${cleanU}" is already taken.` }, { status: 400 });
      }
    }

    const updatedMember: MemberItem = {
      ...existing,
      name: name !== undefined ? name.trim() : existing.name,
      username: username !== undefined ? username.trim().toLowerCase() : existing.username,
      email: email !== undefined ? email.trim() : existing.email,
      roleId: roleId !== undefined ? roleId : existing.roleId,
      roleName: roleName !== undefined ? roleName : existing.roleName,
      status: status !== undefined ? status : existing.status,
      lastLogin: lastLogin !== undefined ? lastLogin : existing.lastLogin,
    };

    if (password && password.trim()) {
      updatedMember.password = password.trim();
    }

    memoryMembers[index] = updatedMember;
    writeDiskCache(memoryMembers);

    // Sync to Laravel Backend if online
    fetchFromBackend(`/members/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMember),
    }).catch(() => null);

    const { password: _, ...result } = updatedMember;
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    if (!memoryMembers) {
      memoryMembers = readDiskCache();
    }

    const targetUser = memoryMembers.find((m) => String(m.id) === String(id));
    if (targetUser && targetUser.username === "admin") {
      return NextResponse.json({ error: "The default Super Admin account cannot be deleted." }, { status: 403 });
    }

    memoryMembers = memoryMembers.filter((m) => String(m.id) !== String(id));
    writeDiskCache(memoryMembers);

    // Sync deletion to Laravel Backend if online
    fetchFromBackend(`/members/${id}`, {
      method: "DELETE",
    }).catch(() => null);

    return NextResponse.json({ success: true, id });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}
