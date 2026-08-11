import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export interface DayHours {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface CompanyPreferences {
  phone: string;
  whatsapp?: string;
  email: string;
  address: {
    en: string;
    ar: string;
    fr: string;
  } | any;
  gmapsEmbed: string;
  emergencyContact?: string;
  
  // Business Information
  businessInfo: {
    companyName: {
      en: string;
      ar: string;
      fr: string;
    };
    rcNumber: string;
    nifNumber: string;
    nisNumber: string;
    articleNumber: string;
  };

  // Social Media
  socialMedia: {
    facebook: string;
    linkedin: string;
    twitter: string;
    youtube: string;
    instagram?: string;
  };

  // Business Hours of each day
  businessHours: {
    saturday: DayHours;
    sunday: DayHours;
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
  };

  // Company Statistics
  statistics?: {
    provincesServed: string;
    officialProducts: string;
    businessPartners: string;
    averageResponse: string;
  };
}

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://127.0.0.1:8000/api";

const defaultPreferences: CompanyPreferences = {
  phone: "0550 123 456",
  whatsapp: "0550 123 456",
  email: "contact@sti.dz",
  address: {
    en: "Lot 24, Zone Industrielle, Bab Ezzouar, Algiers, Algeria",
    ar: "المنطقة الصناعية رقم 24، باب الزوار، الجزائر العاصمة",
    fr: "Lot 24, Zone Industrielle, Bab Ezzouar, Alger, Algérie",
  },
  gmapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3236.4678129532675!2d5.4263334!3d36.1878916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f315007983d29b%3A0xb969c549a0ef2f09!2sSARL%20Smart%20Technologie%20Innovation%20-%20STI!5e0!3m2!1sen!2sdz!4v1700000000000!5m2!1sen!2sdz",
  emergencyContact: "",
  businessInfo: {
    companyName: {
      en: "SARL Smart Technologie Innovation",
      ar: "ذ.م.م سمارت تكنولوجي إينوفيشين",
      fr: "SARL Smart Technologie Innovation",
    },
    rcNumber: "26/00-1234567B26",
    nifNumber: "001616091234567",
    nisNumber: "001616090012345",
    articleNumber: "16220123456",
  },
  socialMedia: {
    facebook: "https://facebook.com/sti.algeria",
    linkedin: "https://linkedin.com/company/sti-algeria",
    twitter: "https://twitter.com/sti_algeria",
    youtube: "https://youtube.com/@sti_algeria",
    instagram: "",
  },
  businessHours: {
    saturday: { open: "08:00", close: "17:00", isClosed: false },
    sunday: { open: "08:00", close: "17:00", isClosed: false },
    monday: { open: "08:00", close: "17:00", isClosed: false },
    tuesday: { open: "08:00", close: "17:00", isClosed: false },
    wednesday: { open: "08:00", close: "17:00", isClosed: false },
    thursday: { open: "08:00", close: "17:00", isClosed: false },
    friday: { open: "00:00", close: "00:00", isClosed: true },
  },
  statistics: {
    provincesServed: "58",
    officialProducts: "100%",
    businessPartners: "1000+",
    averageResponse: "24h",
  },
};

export async function GET() {
  const isLocalHost = !process.env.BACKEND_API_URL || process.env.BACKEND_API_URL.includes("127.0.0.1") || process.env.BACKEND_API_URL.includes("localhost");

  if (process.env.NODE_ENV === "production" && isLocalHost) {
    return NextResponse.json(defaultPreferences);
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${BACKEND_API_URL}/preferences`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data) return NextResponse.json(data);
    }
  } catch (err) {
    console.error("Backend fetch error for preferences:", err);
  }

  return NextResponse.json(defaultPreferences);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const isLocalHost = !process.env.BACKEND_API_URL || process.env.BACKEND_API_URL.includes("127.0.0.1") || process.env.BACKEND_API_URL.includes("localhost");

    if (process.env.NODE_ENV === "production" && isLocalHost) {
      return NextResponse.json({ success: true, preferences: body });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${BACKEND_API_URL}/preferences`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data) return NextResponse.json(data);
    }

    return NextResponse.json({ success: true, preferences: body });
  } catch (err) {
    const fallbackBody = await request.json().catch(() => null);
    return NextResponse.json({ success: true, preferences: fallbackBody || defaultPreferences });
  }
}

