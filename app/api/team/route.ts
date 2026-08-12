import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export interface TeamMemberTranslation {
  name: string;
  position: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  initials?: string;
  image?: string;
  linkedin?: string;
  translations?: {
    en?: TeamMemberTranslation;
    ar?: TeamMemberTranslation;
    fr?: TeamMemberTranslation;
  };
}

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://127.0.0.1:8000/api";

const defaultTeamMembers: TeamMember[] = [];

let memoryTeamMembers: TeamMember[] | null = null;

const CACHE_FILE = path.join(process.cwd(), ".data", "team_cache.json");

function readDiskCache(): TeamMember[] | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return null;
}

function writeDiskCache(data: TeamMember[]): void {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {}
}

export async function GET() {
  // 1. Try to fetch from backend Laravel API with a generous 10s timeout for cPanel shared hosting
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${BACKEND_API_URL}/team`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data)) {
        memoryTeamMembers = data;
        writeDiskCache(data);
        return NextResponse.json(data);
      }
    }
  } catch (err) {
    console.error("Backend fetch error for team:", err);
  }

  // 2. If backend fetch fails, check memory cache
  if (memoryTeamMembers) {
    return NextResponse.json(memoryTeamMembers);
  }

  // 3. Check disk cache
  const diskData = readDiskCache();
  if (diskData) {
    memoryTeamMembers = diskData;
    return NextResponse.json(diskData);
  }

  // 4. Default fallback
  return NextResponse.json(defaultTeamMembers);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const membersList: TeamMember[] = Array.isArray(body) ? body : (body.members || []);

    memoryTeamMembers = membersList;
    writeDiskCache(membersList);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${BACKEND_API_URL}/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (Array.isArray(data)) {
          memoryTeamMembers = data;
          writeDiskCache(data);
        } else if (data && Array.isArray(data.members)) {
          memoryTeamMembers = data.members;
          writeDiskCache(data.members);
        }
      }
    } catch (err) {
      console.error("Backend POST error for team:", err);
    }

    return NextResponse.json(memoryTeamMembers);
  } catch (err) {
    const fallback = memoryTeamMembers || readDiskCache() || defaultTeamMembers;
    return NextResponse.json(fallback);
  }
}
