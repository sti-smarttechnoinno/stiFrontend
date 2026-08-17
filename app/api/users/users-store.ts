import fs from "fs";
import path from "path";

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

export const DEFAULT_USERS: UserItem[] = [];

let memoryUsers: UserItem[] | null = null;
const CACHE_FILE = path.join(process.cwd(), ".data", "users_cache.json");
const OLD_MEMBERS_CACHE = path.join(process.cwd(), ".data", "members_cache.json");

export function readUsersDiskCache(): UserItem[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((u) => ({ ...u, password: u.password || "password" }));
      }
    }
    if (fs.existsSync(OLD_MEMBERS_CACHE)) {
      const raw = fs.readFileSync(OLD_MEMBERS_CACHE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((u) => ({ ...u, password: u.password || "password" }));
      }
    }
  } catch {}
  return [];
}

export function writeUsersDiskCache(data: UserItem[]): void {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const withPasswords = data.map((u) => ({ ...u, password: u.password || "password" }));
    fs.writeFileSync(CACHE_FILE, JSON.stringify(withPasswords, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write users disk cache:", err);
  }
}

export function getMemoryUsers(): UserItem[] {
  if (!memoryUsers) {
    memoryUsers = readUsersDiskCache();
  }
  return memoryUsers;
}

export function setMemoryUsers(users: UserItem[]): void {
  memoryUsers = users.map((u) => ({ ...u, password: u.password || "password" }));
  writeUsersDiskCache(memoryUsers);
}
