import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchFromBackend } from "../backend-helper";
import {
  UserItem,
  getMemoryUsers,
  setMemoryUsers,
  readUsersDiskCache,
  writeUsersDiskCache,
} from "./users-store";

export type { UserItem };

export async function GET() {
  let memoryUsers = getMemoryUsers();

  try {
    const backendRes = await fetchFromBackend("/users", {}, 3000);
    if (backendRes && backendRes.ok) {
      const backendData = await backendRes.json();
      if (Array.isArray(backendData) && backendData.length > 0) {
        const localMap = new Map<string, UserItem>();
        for (const user of memoryUsers) {
          const key = String(user.id) || (user.username || "").toLowerCase() || (user.email || "").toLowerCase();
          if (key) localMap.set(key, user);
        }

        for (const bUser of backendData) {
          const key = String(bUser.id) || (bUser.username || "").toLowerCase() || (bUser.email || "").toLowerCase();
          if (key) {
            const existing = localMap.get(key);
            if (existing) {
              localMap.set(key, {
                ...bUser,
                ...existing,
                name: bUser.name || existing.name,
                email: bUser.email || existing.email,
                password: existing.password || "password",
              });
            } else {
              localMap.set(key, {
                id: bUser.id || Date.now(),
                name: bUser.name || "Backend User",
                username: bUser.username || (bUser.email ? bUser.email.split("@")[0] : `user_${bUser.id}`),
                email: bUser.email || "",
                password: "password",
                roleId: bUser.roleId || "viewer",
                roleName: bUser.roleName || "Viewer",
                status: bUser.status || "Active",
                lastLogin: bUser.lastLogin || "Unknown",
                createdAt: bUser.createdAt || new Date().toISOString(),
              });
            }
          }
        }

        memoryUsers = Array.from(localMap.values());
        setMemoryUsers(memoryUsers);
      }
    }
  } catch {}

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

    const memoryUsers = getMemoryUsers();
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, "");

    const exists = memoryUsers.some(
      (u) => u.username && u.username.toLowerCase().replace(/^@/, "") === cleanUsername
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
    setMemoryUsers(memoryUsers);

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

    const memoryUsers = getMemoryUsers();

    const index = memoryUsers.findIndex((u) => String(u.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const existing = memoryUsers[index];

    if (username && username.trim().toLowerCase().replace(/^@/, "") !== existing.username.toLowerCase().replace(/^@/, "")) {
      const cleanU = username.trim().toLowerCase().replace(/^@/, "");
      const conflict = memoryUsers.some((u) => String(u.id) !== String(id) && u.username.toLowerCase().replace(/^@/, "") === cleanU);
      if (conflict) {
        return NextResponse.json({ error: `Username "@${cleanU}" is already taken.` }, { status: 400 });
      }
    }

    const updatedUser: UserItem = {
      ...existing,
      name: name !== undefined ? name.trim() : existing.name,
      username: username !== undefined ? username.trim().toLowerCase().replace(/^@/, "") : existing.username,
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
    setMemoryUsers(memoryUsers);

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

    let memoryUsers = getMemoryUsers();

    const targetUser = memoryUsers.find((u) => String(u.id) === String(id));
    if (targetUser && targetUser.username === "admin") {
      return NextResponse.json({ error: "The default Super Admin account cannot be deleted." }, { status: 403 });
    }

    memoryUsers = memoryUsers.filter((u) => String(u.id) !== String(id));
    setMemoryUsers(memoryUsers);

    // Sync deletion to Laravel Backend if online
    fetchFromBackend(`/users/${id}`, {
      method: "DELETE",
    }).catch(() => null);

    return NextResponse.json({ success: true, id });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}
