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

let memoryPreferences: CompanyPreferences | null = null;

const defaultPreferences: CompanyPreferences = {
  phone: "0550 02 35 36",
  whatsapp: "0550 02 35 36",
  email: "administration@sti.dz",
  address: {
    en: "Sétif, Algeria",
    ar: "سطيف",
    fr: "Sétif, Algérie",
  },
  gmapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3236.4678129532675!2d5.4263334!3d36.1878916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f315007983d29b%3A0xb969c549a0ef2f09!2sSARL%20Smart%20Technologie%20Innovation%20-%20STI!5e0!3m2!1sen!2sdz!4v1700000000000!5m2!1sen!2sdz",
  emergencyContact: "",
  businessInfo: {
    companyName: {
      en: "SARL Smart Technologie Innovation",
      ar: "ذ.م.م سمارت تكنولوجي إينوفيشين",
      fr: "SARL Smart Technologie Innovation",
    },
  },
  socialMedia: {
    facebook: "https://facebook.com/sti.algeria",
    linkedin: "https://linkedin.com/company/sti-algeria",
    twitter: "",
    youtube: "",
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
  if (memoryPreferences) {
    return NextResponse.json(memoryPreferences);
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
      if (data && data.phone) {
        memoryPreferences = data;
        return NextResponse.json(data);
      }
    }
  } catch (err) {
    console.error("Backend fetch error for preferences:", err);
  }

  return NextResponse.json(defaultPreferences);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const incomingPrefs = body.preferences || body;

    memoryPreferences = {
      ...defaultPreferences,
      ...memoryPreferences,
      ...incomingPrefs,
    };

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${BACKEND_API_URL}/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incomingPrefs),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.preferences) {
          memoryPreferences = data.preferences;
        }
      }
    } catch {}

    return NextResponse.json({ success: true, preferences: memoryPreferences });
  } catch (err) {
    return NextResponse.json({ success: true, preferences: memoryPreferences || defaultPreferences });
  }
}

