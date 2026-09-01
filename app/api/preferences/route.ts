import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchFromBackend } from "../backend-helper";

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

let memoryPreferences: CompanyPreferences | null = null;

const defaultPreferences: CompanyPreferences = {
  phone: "",
  whatsapp: "",
  email: "",
  address: {
    en: "",
    ar: "",
    fr: "",
  },
  gmapsEmbed: "",
  emergencyContact: "",
  businessInfo: {
    companyName: {
      en: "",
      ar: "",
      fr: "",
    },
  },
  socialMedia: {
    facebook: "",
    linkedin: "",
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
    provincesServed: "",
    officialProducts: "",
    businessPartners: "",
    averageResponse: "",
  },
};

function cleanMerge(target: any, source: any): any {
  if (!source || typeof source !== "object") return target;
  const result = Array.isArray(target) ? [...target] : { ...target };

  for (const key of Object.keys(source)) {
    const val = source[key];
    if (val !== null && val !== undefined && val !== "") {
      if (typeof val === "object" && !Array.isArray(val)) {
        result[key] = cleanMerge(result[key] || {}, val);
      } else {
        result[key] = val;
      }
    }
  }
  return result;
}

export async function getCompanyPreferences(): Promise<CompanyPreferences> {
  try {
    const res = await fetchFromBackend("/preferences", { cache: "no-store" }, 5000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && typeof data === "object" && Object.keys(data).length > 0) {
        const merged = cleanMerge(defaultPreferences, data);
        memoryPreferences = merged;
        return merged;
      }
    }
  } catch (err) {
    console.error("Backend fetch error for preferences:", err);
  }

  if (memoryPreferences) {
    return memoryPreferences;
  }

  return defaultPreferences;
}

export async function GET() {
  const preferences = await getCompanyPreferences();
  return NextResponse.json(preferences);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const incomingPrefs = body.preferences || body;

    const current = memoryPreferences || defaultPreferences;
    const updated = cleanMerge(current, incomingPrefs);

    memoryPreferences = updated;

    try {
      const res = await fetchFromBackend("/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incomingPrefs),
      }, 10000);

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data) {
          const prefData = data.preferences || data;
          if (prefData && typeof prefData === "object") {
            const merged = cleanMerge(updated, prefData);
            memoryPreferences = merged;
          }
        }
      }
    } catch (err) {
      console.error("Backend POST error for preferences:", err);
    }

    return NextResponse.json({ success: true, preferences: memoryPreferences });
  } catch (err) {
    const fallback = memoryPreferences || defaultPreferences;
    return NextResponse.json({ success: true, preferences: fallback });
  }
}
