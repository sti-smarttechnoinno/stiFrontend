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

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_API_URL}/team`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    console.error("Backend fetch error for team:", err);
  }

  return NextResponse.json(defaultTeamMembers);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_API_URL}/team`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    const errData = await res.json();
    return NextResponse.json(errData, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save team members in backend database" }, { status: 500 });
  }
}

