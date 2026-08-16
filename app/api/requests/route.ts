import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { fetchFromBackend } from "../backend-helper";

export interface QuoteRequestItem {
  id: number | string;
  business_name: string;
  contact_person: string;
  phone: string;
  email: string;
  business_type: string;
  products: string[];
  volume: string;
  contact_method: string;
  message: string;
  status: string; // Pending, Contacted, Quoted, Completed, Rejected
  created_at?: string;
  date?: string;
}

// In-Memory Rate Limiting: Max 3 quote submissions per 10 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

const CACHE_FILE = path.join(process.cwd(), ".data", "requests_cache.json");
let memoryRequests: QuoteRequestItem[] | null = null;

function readDiskCache(): QuoteRequestItem[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function writeDiskCache(data: QuoteRequestItem[]): void {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {}
}

export async function GET() {
  const disk = readDiskCache();

  try {
    const res = await fetchFromBackend("/requests", { cache: "no-store" }, 10000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data)) {
        // Merge backend data with local disk cache so local quote requests are preserved
        const combined = [...data, ...disk, ...(memoryRequests || [])];
        const uniqueMap = new Map();
        for (const item of combined) {
          const idKey = String(item.id);
          if (!uniqueMap.has(idKey)) {
            let productsArr: string[] = [];
            if (Array.isArray(item.products)) {
              productsArr = item.products;
            } else if (typeof item.products === "string") {
              try {
                productsArr = JSON.parse(item.products);
              } catch {
                productsArr = [item.products];
              }
            }
            uniqueMap.set(idKey, { ...item, products: productsArr });
          }
        }
        const normalized = Array.from(uniqueMap.values()).map((item: any) => ({
          ...item,
          business_name: item.business_name || item.businessName || "Unknown Business",
          contact_person: item.contact_person || item.contactPerson || item.name || "N/A",
          business_type: item.business_type || item.businessType || "N/A",
          contact_method: item.contact_method || item.contactMethod || "Email",
          date: item.created_at
            ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : item.date || "Just now",
        }));
        memoryRequests = normalized;
        writeDiskCache(normalized);
        return NextResponse.json(normalized);
      }
    }
  } catch (err) {
    console.error("Backend fetch error for quote requests:", err);
  }

  if (!memoryRequests || memoryRequests.length === 0) {
    memoryRequests = disk;
  }

  return NextResponse.json(memoryRequests);
}

export async function POST(req: NextRequest) {
  try {
    // Extract IP address for rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    // 1. Rate Limit Check
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many quote requests. Please wait 10 minutes before submitting again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Anti-Spam Honeypot Check
    if (body.hp_website && String(body.hp_website).trim() !== "") {
      console.warn(`[Anti-Spam] Honeypot triggered by IP ${ip}`);
      return NextResponse.json({ success: true, message: "Quote request received." });
    }

    // 3. Validation
    const businessName = String(body.businessName || body.business_name || "").trim();
    const contactPerson = String(body.contactPerson || body.contact_person || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const businessType = String(body.businessType || body.business_type || "").trim();
    const volume = String(body.volume || "").trim();
    const contactMethod = String(body.contactMethod || body.contact_method || "").trim();
    const message = String(body.message || "").trim();
    
    let products: string[] = [];
    if (Array.isArray(body.products)) {
      products = body.products;
    } else if (typeof body.products === "string") {
      products = [body.products];
    }

    if (!businessName || !contactPerson || !phone || !email) {
      return NextResponse.json(
        { error: "Missing required fields: Business Name, Contact Person, Phone, and Email are required." },
        { status: 400 }
      );
    }

    const newId = Date.now();
    const formattedDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const quoteData: QuoteRequestItem = {
      id: newId,
      business_name: businessName,
      contact_person: contactPerson,
      phone,
      email,
      business_type: businessType,
      products,
      volume,
      contact_method: contactMethod,
      message,
      status: "Pending",
      created_at: new Date().toISOString(),
      date: formattedDate,
    };

    // Save locally to memory & disk cache
    if (!memoryRequests) {
      memoryRequests = readDiskCache();
    }
    memoryRequests.unshift(quoteData);
    writeDiskCache(memoryRequests);

    // 4. Save to Backend Database (if available)
    try {
      await fetchFromBackend("/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quoteData,
          products: JSON.stringify(quoteData.products),
        }),
      }, 10000);
    } catch (err) {
      console.error("Failed to post quote request to backend DB:", err);
    }

    // 5. Send Notification Email via Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const toEmail = process.env.RESEND_TO_EMAIL || "administration.sti@gmail.com";
        const fromEmail = process.env.RESEND_FROM_EMAIL || "STI Quotations <onboarding@resend.dev>";

        const productsListHtml = products.length > 0
          ? `<ul style="margin: 4px 0 0 0; padding-left: 20px; color: #374151;">${products.map(p => `<li>${p}</li>`).join('')}</ul>`
          : '<span style="color: #6b7280;">None specified</span>';

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; background-color: #ffffff;">
            <div style="background-color: #D71920; padding: 20px; border-radius: 12px; text-align: center; color: #ffffff; margin-bottom: 24px;">
              <h2 style="margin: 0; font-size: 22px; font-weight: bold;">New Quotation Request Received</h2>
              <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.95;">SARL Smart Technologie Innovation - Official Ooredoo Distributor</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #111827; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 12px;">Business & Contact Information</h3>
              <p><strong>Business / Company Name:</strong> <span style="color: #D71920; font-weight: bold; font-size: 15px;">${businessName}</span></p>
              <p><strong>Contact Person:</strong> ${contactPerson}</p>
              <p><strong>Email Address:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Phone Number:</strong> <a href="tel:${phone}">${phone}</a></p>
              <p><strong>Business Type:</strong> ${businessType || "N/A"}</p>
              <p><strong>Preferred Contact Method:</strong> ${contactMethod || "Email"}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #111827; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 12px;">Order & Volume Details</h3>
              <p><strong>Products / Solutions Requested:</strong></p>
              ${productsListHtml}
              <p style="margin-top: 12px;"><strong>Estimated Monthly Volume:</strong> ${volume || "N/A"}</p>
            </div>

            ${message ? `
            <div style="margin-bottom: 20px;">
              <h3 style="color: #111827; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 12px;">Additional Notes / Remarks</h3>
              <div style="background-color: #f9fafb; padding: 14px; border-radius: 10px; font-style: italic; color: #374151; border: 1px solid #f3f4f6;">
                "${message}"
              </div>
            </div>` : ""}

            <div style="text-align: center; margin-top: 28px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
              <p>Review and process this quote request inside your STI Admin Console under Requests (/console/requests).</p>
            </div>
          </div>
        `;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            subject: `New Quote Request: ${businessName} - ${contactPerson}`,
            html: emailHtml,
          }),
        });
      } catch (emailErr) {
        console.error("Failed to send notification email via Resend:", emailErr);
      }
    }

    return NextResponse.json({ success: true, request: quoteData });
  } catch (err: any) {
    console.error("Quote Request POST handler error:", err);
    return NextResponse.json({ error: "Failed to submit quote request" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    if (!memoryRequests) {
      memoryRequests = readDiskCache();
    }

    const index = memoryRequests.findIndex((q) => String(q.id) === String(id));
    if (index !== -1) {
      memoryRequests[index].status = status;
      writeDiskCache(memoryRequests);
    }

    try {
      await fetchFromBackend(`/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }, 10000);
    } catch {}

    return NextResponse.json({ success: true, request: memoryRequests[index] || null });
  } catch {
    return NextResponse.json({ error: "Failed to update quote request status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing quote request ID" }, { status: 400 });
    }

    if (!memoryRequests) {
      memoryRequests = readDiskCache();
    }

    memoryRequests = memoryRequests.filter((q) => String(q.id) !== String(id));
    writeDiskCache(memoryRequests);

    try {
      await fetchFromBackend(`/requests/${id}`, {
        method: "DELETE",
      }, 10000);
    } catch {}

    return NextResponse.json({ success: true, message: "Quote request deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete quote request" }, { status: 500 });
  }
}
