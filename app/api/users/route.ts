import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchFromBackend } from "../backend-helper";
import {
  UserItem,
  getMemoryUsers,
  setMemoryUsers,
} from "./users-store";

export type { UserItem };

export async function GET() {
  let memoryUsers = getMemoryUsers();

  try {
    const backendRes = await fetchFromBackend("/users", { cache: "no-store" }, 3000);
    if (backendRes && backendRes.ok) {
      const backendData = await backendRes.json();
      if (Array.isArray(backendData)) {
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
                id: bUser.id || existing.id,
                name: bUser.name || existing.name,
                email: bUser.email || existing.email,
                username: (bUser.username || existing.username || "").toLowerCase().replace(/^@/, ""),
                roleId: bUser.role_id || bUser.roleId || existing.roleId || "viewer",
                roleName: bUser.role_name || bUser.roleName || existing.roleName || "Viewer",
                status: bUser.status || existing.status || "Active",
                password: existing.password || "password",
              });
            } else {
              localMap.set(key, {
                id: bUser.id || Date.now(),
                name: bUser.name || bUser.username || "Backend User",
                username: (bUser.username || bUser.name || (bUser.email ? bUser.email.split("@")[0] : `user_${bUser.id}`)).toLowerCase().replace(/^@/, ""),
                email: bUser.email || "",
                password: "password",
                roleId: bUser.role_id || bUser.roleId || "viewer",
                roleName: bUser.role_name || bUser.roleName || "Viewer",
                status: bUser.status || "Active",
                lastLogin: bUser.last_login || bUser.lastLogin || "Unknown",
                createdAt: bUser.created_at || bUser.createdAt || new Date().toISOString(),
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

    let memoryUsers = getMemoryUsers();

    // Refresh from backend if empty
    if (memoryUsers.length === 0) {
      try {
        const backendRes = await fetchFromBackend("/users", { cache: "no-store" }, 3000);
        if (backendRes && backendRes.ok) {
          const backendData = await backendRes.json();
          if (Array.isArray(backendData)) {
            memoryUsers = backendData.map((u: any) => ({
              id: u.id,
              name: u.name || u.username || "User",
              username: (u.username || u.name || "").toLowerCase().replace(/^@/, ""),
              email: u.email || "",
              password: "password",
              roleId: u.role_id || u.roleId || "viewer",
              roleName: u.role_name || u.roleName || "Viewer",
              status: u.status || "Active",
              lastLogin: u.last_login || u.lastLogin || "Never",
              createdAt: u.created_at || u.createdAt || new Date().toISOString(),
            }));
            setMemoryUsers(memoryUsers);
          }
        }
      } catch {}
    }

    const cleanUsername = username.trim().toLowerCase().replace(/^@/, "");

    const exists = memoryUsers.some(
      (u) => u.username && u.username.toLowerCase().replace(/^@/, "") === cleanUsername
    );

    if (exists) {
      return NextResponse.json({ error: `Username "@${cleanUsername}" is already taken.` }, { status: 400 });
    }

    // Attempt to save to backend DB
    const backendRes = await fetchFromBackend("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        username: cleanUsername,
        email: (email || "").trim(),
        password: password.trim(),
        roleId: roleId || "viewer",
        roleName: roleName || "Viewer",
        status: status || "Active",
      }),
    });

    let createdUser: UserItem;

    if (backendRes && backendRes.ok) {
      const dbUser = await backendRes.json().catch(() => null);
      if (dbUser) {
        createdUser = {
          id: dbUser.id || Date.now(),
          name: dbUser.name || name.trim(),
          username: (dbUser.username || cleanUsername).toLowerCase().replace(/^@/, ""),
          email: dbUser.email || (email || "").trim(),
          password: password.trim(),
          roleId: dbUser.role_id || dbUser.roleId || roleId || "viewer",
          roleName: dbUser.role_name || dbUser.roleName || roleName || "Viewer",
          status: dbUser.status || status || "Active",
          lastLogin: dbUser.last_login || "Never",
          createdAt: dbUser.created_at || new Date().toISOString(),
        };
      } else {
        createdUser = {
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
      }
    } else {
      createdUser = {
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
    }

    memoryUsers.push(createdUser);
    setMemoryUsers(memoryUsers);

    const { password: _, ...result } = createdUser;
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

    let memoryUsers = getMemoryUsers();

    // If memoryUsers does not contain the target user ID, refresh from backend DB
    let index = memoryUsers.findIndex((u) => String(u.id) === String(id));
    if (index === -1) {
      try {
        const backendRes = await fetchFromBackend("/users", { cache: "no-store" }, 3000);
        if (backendRes && backendRes.ok) {
          const backendData = await backendRes.json();
          if (Array.isArray(backendData) && backendData.length > 0) {
            const mapped = backendData.map((u: any) => ({
              id: u.id,
              name: u.name || u.username || "User",
              username: (u.username || u.name || "").toLowerCase().replace(/^@/, ""),
              email: u.email || "",
              password: "password",
              roleId: u.role_id || u.roleId || "viewer",
              roleName: u.role_name || u.roleName || "Viewer",
              status: u.status || "Active",
              lastLogin: u.last_login || u.lastLogin || "Never",
              createdAt: u.created_at || u.createdAt || new Date().toISOString(),
            }));
            
            // Merge existing local memoryUsers with newly fetched mapped users
            const combinedMap = new Map<string, UserItem>();
            for (const item of mapped) combinedMap.set(String(item.id), item);
            for (const item of memoryUsers) combinedMap.set(String(item.id), item);

            memoryUsers = Array.from(combinedMap.values());
            setMemoryUsers(memoryUsers);
            index = memoryUsers.findIndex((u) => String(u.id) === String(id));
          }
        }
      } catch {}
    }

    // Try updating backend DB directly
    const backendUpdateRes = await fetchFromBackend(`/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name ? name.trim() : undefined,
        username: username ? username.trim().toLowerCase().replace(/^@/, "") : undefined,
        email: email !== undefined ? email.trim() : undefined,
        password: password && password.trim() ? password.trim() : undefined,
        roleId: roleId !== undefined ? roleId : undefined,
        roleName: roleName !== undefined ? roleName : undefined,
        status: status !== undefined ? status : undefined,
      }),
    }).catch(() => null);

    if (index === -1 && backendUpdateRes && backendUpdateRes.ok) {
      const dbUser = await backendUpdateRes.json().catch(() => null);
      if (dbUser) {
        const updatedUser: UserItem = {
          id: dbUser.id || id,
          name: dbUser.name || name || "User",
          username: (dbUser.username || username || "").toLowerCase().replace(/^@/, ""),
          email: dbUser.email || email || "",
          password: password ? password.trim() : "password",
          roleId: dbUser.role_id || dbUser.roleId || roleId || "viewer",
          roleName: dbUser.role_name || dbUser.roleName || roleName || "Viewer",
          status: dbUser.status || status || "Active",
          lastLogin: dbUser.last_login || lastLogin || "Never",
          createdAt: dbUser.created_at || new Date().toISOString(),
        };
        memoryUsers.push(updatedUser);
        setMemoryUsers(memoryUsers);
        const { password: _, ...result } = updatedUser;
        return NextResponse.json(result);
      }
    }

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

    // Check backend sync if user not found in local memory
    let targetUser = memoryUsers.find((u) => String(u.id) === String(id));
    if (!targetUser) {
      try {
        const backendRes = await fetchFromBackend("/users", { cache: "no-store" }, 3000);
        if (backendRes && backendRes.ok) {
          const backendData = await backendRes.json();
          if (Array.isArray(backendData)) {
            const mapped = backendData.map((u: any) => ({
              id: u.id,
              name: u.name || u.username || "User",
              username: (u.username || u.name || "").toLowerCase().replace(/^@/, ""),
              email: u.email || "",
              password: "password",
              roleId: u.role_id || u.roleId || "viewer",
              roleName: u.role_name || u.roleName || "Viewer",
              status: u.status || "Active",
              lastLogin: u.last_login || u.lastLogin || "Never",
              createdAt: u.created_at || u.createdAt || new Date().toISOString(),
            }));
            setMemoryUsers(mapped);
            memoryUsers = mapped;
            targetUser = memoryUsers.find((u) => String(u.id) === String(id));
          }
        }
      } catch {}
    }

    if (targetUser && (targetUser.username === "admin" || String(targetUser.id) === "1")) {
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
