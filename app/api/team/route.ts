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

const defaultTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Karim Benali",
    position: "General Manager & Founder",
    initials: "KB",
    linkedin: "https://linkedin.com",
    translations: {
      en: { name: "Karim Benali", position: "General Manager & Founder" },
      ar: { name: "كريم بن علي", position: "المدير العام والمؤسس" },
      fr: { name: "Karim Benali", position: "Directeur Général & Fondateur" },
    },
  },
  {
    id: "2",
    name: "Yassine Mansouri",
    position: "Chief Commercial Officer",
    initials: "YM",
    linkedin: "https://linkedin.com",
    translations: {
      en: { name: "Yassine Mansouri", position: "Chief Commercial Officer" },
      ar: { name: "ياسين منصوري", position: "المدير التجاري الرئيسي" },
      fr: { name: "Yassine Mansouri", position: "Directeur Commercial" },
    },
  },
  {
    id: "3",
    name: "Amel Bouzid",
    position: "Director of Retail Partnerships",
    initials: "AB",
    linkedin: "",
    translations: {
      en: { name: "Amel Bouzid", position: "Director of Retail Partnerships" },
      ar: { name: "أمل بوزيد", position: "مديرة شراكات التجزئة" },
      fr: { name: "Amel Bouzid", position: "Directrice des Partenariats" },
    },
  },
  {
    id: "4",
    name: "Sofiane Hadj",
    position: "Head of Logistics & Supply",
    initials: "SH",
    linkedin: "",
    translations: {
      en: { name: "Sofiane Hadj", position: "Head of Logistics & Supply" },
      ar: { name: "سفيان حاج", position: "رئيس اللوجستيات والتزويد" },
      fr: { name: "Sofiane Hadj", position: "Chef Logistique & Approvisionnement" },
    },
  },
];

let memoryTeamMembers: TeamMember[] | null = null;

export async function GET() {
  if (memoryTeamMembers) {
    return NextResponse.json(memoryTeamMembers);
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${BACKEND_API_URL}/team`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        memoryTeamMembers = data;
        return NextResponse.json(data);
      }
    }
  } catch (err) {
    console.error("Backend fetch error for team:", err);
  }

  return NextResponse.json(defaultTeamMembers);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const membersList: TeamMember[] = Array.isArray(body) ? body : (body.members || []);

    memoryTeamMembers = membersList;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);

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
        } else if (data && Array.isArray(data.members)) {
          memoryTeamMembers = data.members;
        }
      }
    } catch {}

    return NextResponse.json(memoryTeamMembers);
  } catch (err) {
    return NextResponse.json(memoryTeamMembers || defaultTeamMembers);
  }
}

