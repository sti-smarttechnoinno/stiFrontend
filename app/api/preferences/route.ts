import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
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

const CACHE_FILE = path.join(process.cwd(), ".data", "preferences_cache.json");

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

function readDiskCache(): CompanyPreferences | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {}
  return null;
}

function writeDiskCache(data: CompanyPreferences): void {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {}
}

export async function GET() {
  // 1. Try backend fetch using fetchFromBackend (auto HTTP/HTTPS/localhost fallback)
  try {
    const res = await fetchFromBackend("/preferences", { cache: "no-store" }, 10000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && typeof data === "object" && Object.keys(data).length > 0) {
        const merged = cleanMerge(defaultPreferences, data);
        memoryPreferences = merged;
        writeDiskCache(merged);
        return NextResponse.json(merged);
      }
    }
  } catch (err) {
    console.error("Backend fetch error for preferences:", err);
  }

  // 2. Check memory cache
  if (memoryPreferences) {
    return NextResponse.json(memoryPreferences);
  }

  // 3. Check disk cache
  const diskData = readDiskCache();
  if (diskData) {
    memoryPreferences = diskData;
    return NextResponse.json(diskData);
  }

  // 4. Default fallback
  return NextResponse.json(defaultPreferences);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const incomingPrefs = body.preferences || body;

    const current = memoryPreferences || readDiskCache() || defaultPreferences;
    const updated = cleanMerge(current, incomingPrefs);

    memoryPreferences = updated;
    writeDiskCache(updated);

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
            writeDiskCache(merged);
          }
        }
      }
    } catch (err) {
      console.error("Backend POST error for preferences:", err);
    }

    return NextResponse.json({ success: true, preferences: memoryPreferences });
  } catch (err) {
    const fallback = memoryPreferences || readDiskCache() || defaultPreferences;
    return NextResponse.json({ success: true, preferences: fallback });
  }
}
