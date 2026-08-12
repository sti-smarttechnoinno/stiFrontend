import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { fetchFromBackend } from "../backend-helper";

export interface ContactMessageItem {
  id: number | string;
  name: string;
  company_name?: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: string; // Unread, Read, Replied, Archived
  created_at?: string;
  date?: string;
}

// In-Memory Rate Limiting: Max 3 messages per 10 minutes per IP
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

const CACHE_FILE = path.join(process.cwd(), ".data", "messages_cache.json");
let memoryMessages: ContactMessageItem[] | null = null;

function readDiskCache(): ContactMessageItem[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function writeDiskCache(data: ContactMessageItem[]): void {
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
    const res = await fetchFromBackend("/messages", { cache: "no-store" }, 10000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data)) {
        // Merge backend data with local disk cache so local messages are preserved
        const combined = [...data, ...disk, ...(memoryMessages || [])];
        const uniqueMap = new Map();
        for (const item of combined) {
          const idKey = String(item.id);
          if (!uniqueMap.has(idKey)) {
            uniqueMap.set(idKey, item);
          }
        }
        const normalized = Array.from(uniqueMap.values()).map((item: any) => ({
          ...item,
          name: item.name || "Anonymous Sender",
          date: item.created_at ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : item.date || "Just now",
        }));
        memoryMessages = normalized;
        writeDiskCache(normalized);
        return NextResponse.json(normalized);
      }
    }
  } catch (err) {
    console.error("Backend fetch error for contact messages:", err);
  }

  if (!memoryMessages || memoryMessages.length === 0) {
    memoryMessages = disk;
  }

  return NextResponse.json(memoryMessages);
}

export async function POST(req: NextRequest) {
  try {
    // Extract IP address for rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    // 1. Rate Limit Check
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many contact attempts. Please wait 10 minutes before sending another message." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Anti-Spam Honeypot Check
    if (body.hp_website && String(body.hp_website).trim() !== "") {
      console.warn(`[Anti-Spam] Honeypot triggered by IP ${ip}`);
      return NextResponse.json({ success: true, message: "Message received." });
    }

    // 3. Validation
    const name = String(body.name || body.fullName || "").trim();
    const company_name = String(body.company_name || body.company || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const subject = String(body.subject || "Direct Inquiry").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields: Name, Email, Phone, and Message are required." },
        { status: 400 }
      );
    }

    const newId = Date.now();
    const formattedDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const messageData: ContactMessageItem = {
      id: newId,
      name,
      company_name,
      phone,
      email,
      subject,
      message,
      status: "Unread",
      created_at: new Date().toISOString(),
      date: formattedDate,
    };

    // Save locally to memory & disk cache
    if (!memoryMessages) {
      memoryMessages = readDiskCache();
    }
    memoryMessages.unshift(messageData);
    writeDiskCache(memoryMessages);

    // 4. Save to Backend Database
    try {
      await fetchFromBackend("/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      }, 10000);
    } catch (err) {
      console.error("Failed to post contact message to backend DB:", err);
    }

    // 5. Send Notification Email via Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const toEmail = process.env.RESEND_TO_EMAIL || "contact@sti.dz";
        const fromEmail = process.env.RESEND_FROM_EMAIL || "STI Contact Form <onboarding@resend.dev>";

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; background-color: #ffffff;">
            <div style="background-color: #D71920; padding: 20px; border-radius: 12px; text-align: center; color: #ffffff; margin-bottom: 24px;">
              <h2 style="margin: 0; font-size: 22px; font-weight: bold;">New Website Contact Message</h2>
              <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.95;">SARL Smart Technologie Innovation - Helpdesk Portal</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #111827; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 12px;">Contact Information</h3>
              <p><strong>Sender Name:</strong> ${name}</p>
              ${company_name ? `<p><strong>Company Name:</strong> ${company_name}</p>` : ""}
              <p><strong>Email Address:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Phone Number:</strong> <a href="tel:${phone}">${phone}</a></p>
              <p><strong>Subject:</strong> <span style="color: #D71920; font-weight: bold;">${subject}</span></p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #111827; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 12px;">Message Content</h3>
              <div style="background-color: #f9fafb; padding: 16px; border-radius: 12px; color: #374151; border: 1px solid #f3f4f6; line-height: 1.6; white-space: pre-wrap;">
${message}
              </div>
            </div>

            <div style="text-align: center; margin-top: 28px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
              <p>View and manage all contact messages in your STI Admin Console under Mailbox.</p>
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
            subject: `Contact Form: ${subject} - ${name}`,
            html: emailHtml,
          }),
        });
      } catch (emailErr) {
        console.error("Failed to send contact notification email via Resend:", emailErr);
      }
    }

    return NextResponse.json({ success: true, message: messageData });
  } catch (err: any) {
    console.error("Message POST handler error:", err);
    return NextResponse.json({ error: "Failed to send contact message" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    // Update in memory & disk cache
    if (!memoryMessages) {
      memoryMessages = readDiskCache();
    }

    const index = memoryMessages.findIndex((m) => String(m.id) === String(id));
    if (index !== -1) {
      memoryMessages[index].status = status;
      writeDiskCache(memoryMessages);
    }

    // Update in backend DB
    try {
      await fetchFromBackend(`/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }, 10000);
    } catch {}

    return NextResponse.json({ success: true, message: memoryMessages[index] || null });
  } catch {
    return NextResponse.json({ error: "Failed to update message status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (!memoryMessages) {
      memoryMessages = readDiskCache();
    }

    memoryMessages = memoryMessages.filter((m) => String(m.id) !== String(id));
    writeDiskCache(memoryMessages);

    try {
      await fetchFromBackend(`/messages/${id}`, {
        method: "DELETE",
      }, 10000);
    } catch {}

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
