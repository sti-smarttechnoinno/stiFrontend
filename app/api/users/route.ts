import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { fetchFromBackend } from "../backend-helper";

export interface UserItem {
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

const DEFAULT_USERS: UserItem[] = [
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

let memoryUsers: UserItem[] | null = null;
const CACHE_FILE = path.join(process.cwd(), ".data", "users_cache.json");
const OLD_MEMBERS_CACHE = path.join(process.cwd(), ".data", "members_cache.json");

function readDiskCache(): UserItem[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Migrate old members cache if exists
    if (fs.existsSync(OLD_MEMBERS_CACHE)) {
      const raw = fs.readFileSync(OLD_MEMBERS_CACHE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_USERS;
}

function writeDiskCache(data: UserItem[]): void {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write users disk cache:", err);
  }
}

export async function GET() {
  try {
    const backendRes = await fetchFromBackend("/users", {}, 3000);
    if (backendRes && backendRes.ok) {
      const backendData = await backendRes.json();
      if (Array.isArray(backendData) && backendData.length > 0) {
        memoryUsers = backendData;
        writeDiskCache(memoryUsers);
      }
    }
  } catch {}

  if (!memoryUsers) {
    memoryUsers = readDiskCache();
  }
  const sanitized = memoryUsers.map(({ password, ...rest }) => rest);
  return NextResponse.json(sanitized);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, email, password, roleId, roleName, status } = body;

    if (!name || !username || !password) {
      return NextResponse.json({ error: "Name, username, and password are required." }, { status: 400 });
    }

    if (!memoryUsers) {
      memoryUsers = readDiskCache();
    }

    const cleanUsername = username.trim().toLowerCase();

    const exists = memoryUsers.some(
      (u) => u.username && u.username.toLowerCase() === cleanUsername
    );

    if (exists) {
      return NextResponse.json({ error: `Username "@${cleanUsername}" is already taken.` }, { status: 400 });
    }

    const newUser: UserItem = {
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

    memoryUsers.push(newUser);
    writeDiskCache(memoryUsers);

    // Sync to Laravel Backend if online
    fetchFromBackend("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    }).catch(() => null);

    const { password: _, ...result } = newUser;
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

    if (!memoryUsers) {
      memoryUsers = readDiskCache();
    }

    const index = memoryUsers.findIndex((u) => String(u.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const existing = memoryUsers[index];

    if (username && username.trim().toLowerCase() !== existing.username.toLowerCase()) {
      const cleanU = username.trim().toLowerCase();
      const conflict = memoryUsers.some((u) => String(u.id) !== String(id) && u.username.toLowerCase() === cleanU);
      if (conflict) {
        return NextResponse.json({ error: `Username "@${cleanU}" is already taken.` }, { status: 400 });
      }
    }

    const updatedUser: UserItem = {
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
      updatedUser.password = password.trim();
    }

    memoryUsers[index] = updatedUser;
    writeDiskCache(memoryUsers);

    // Sync to Laravel Backend if online
    fetchFromBackend(`/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    }).catch(() => null);

    const { password: _, ...result } = updatedUser;
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

    if (!memoryUsers) {
      memoryUsers = readDiskCache();
    }

    const targetUser = memoryUsers.find((u) => String(u.id) === String(id));
    if (targetUser && targetUser.username === "admin") {
      return NextResponse.json({ error: "The default Super Admin account cannot be deleted." }, { status: 403 });
    }

    memoryUsers = memoryUsers.filter((u) => String(u.id) !== String(id));
    writeDiskCache(memoryUsers);

    // Sync deletion to Laravel Backend if online
    fetchFromBackend(`/users/${id}`, {
      method: "DELETE",
    }).catch(() => null);

    return NextResponse.json({ success: true, id });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}
