import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { fetchFromBackend } from "../backend-helper";

export interface FileAttachment {
  name: string;
  url: string; // base64 data URL
}

export interface SubmissionItem {
  id: number | string;
  candidate_name: string;
  candidate?: string; // alias for UI compatibility
  email: string;
  phone: string;
  position: string;
  city?: string;
  nationality?: string;
  experience?: string;
  education?: string;
  linkedin?: string;
  portfolio?: string;
  salary?: string;
  availability?: string;
  message?: string;
  cv_file?: FileAttachment | string | null;
  cover_file?: FileAttachment | string | null;
  cert_file?: FileAttachment | string | null;
  status: string; // New, Reviewing, Shortlisted, Interview, Accepted, Rejected
  created_at?: string;
  submitted?: string;
}

// In-Memory Rate Limiting: Max 3 submissions per 10 minutes per IP
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

const CACHE_FILE = path.join(process.cwd(), ".data", "submissions_cache.json");
let memorySubmissions: SubmissionItem[] | null = null;

function readDiskCache(): SubmissionItem[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function writeDiskCache(data: SubmissionItem[]): void {
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
    const res = await fetchFromBackend("/submissions", { cache: "no-store" }, 10000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data)) {
        // Merge backend data with local disk cache so newly posted local submissions are never lost
        const combined = [...data, ...disk, ...(memorySubmissions || [])];
        const uniqueMap = new Map();
        for (const item of combined) {
          const idKey = String(item.id);
          if (!uniqueMap.has(idKey)) {
            uniqueMap.set(idKey, item);
          }
        }
        const normalized = Array.from(uniqueMap.values()).map((item: any) => ({
          ...item,
          candidate: item.candidate_name || item.candidate || "Unknown Candidate",
          candidate_name: item.candidate_name || item.candidate || "Unknown Candidate",
          submitted: item.created_at ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : item.submitted || "Just now",
        }));
        memorySubmissions = normalized;
        writeDiskCache(normalized);
        return NextResponse.json(normalized);
      }
    }
  } catch (err) {
    console.error("Backend fetch error for submissions:", err);
  }

  if (!memorySubmissions || memorySubmissions.length === 0) {
    memorySubmissions = disk;
  }

  return NextResponse.json(memorySubmissions);
}

export async function POST(req: NextRequest) {
  try {
    // Extract IP address for rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    // 1. Rate Limit Check
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many application attempts. Please wait 10 minutes before submitting again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Anti-Spam Honeypot Check
    if (body.hp_website && String(body.hp_website).trim() !== "") {
      console.warn(`[Anti-Spam] Honeypot triggered by IP ${ip}`);
      return NextResponse.json({ success: true, message: "Application received." });
    }

    // 3. Validation
    const firstName = String(body.firstName || body.first_name || "").trim();
    const lastName = String(body.lastName || body.last_name || "").trim();
    const candidateName = body.candidate_name || body.candidate || `${firstName} ${lastName}`.trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const position = String(body.position || "").trim();

    if (!candidateName || !email || !phone || !position) {
      return NextResponse.json(
        { error: "Missing required fields: Name, Email, Phone, and Target Position are required." },
        { status: 400 }
      );
    }

    const newId = Date.now();
    const formattedDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const submissionData: SubmissionItem = {
      id: newId,
      candidate_name: candidateName,
      candidate: candidateName,
      email,
      phone,
      position,
      city: body.city || "",
      nationality: body.nationality || "",
      experience: body.experience || "",
      education: body.education || "",
      linkedin: body.linkedin || "",
      portfolio: body.portfolio || "",
      salary: body.salary || "",
      availability: body.availability || "",
      message: body.message || "",
      cv_file: body.cv_file || body.cvName || null,
      cover_file: body.cover_file || body.coverName || null,
      cert_file: body.cert_file || body.certName || null,
      status: "New",
      created_at: new Date().toISOString(),
      submitted: formattedDate,
    };

    // Save locally to memory & disk cache
    if (!memorySubmissions) {
      memorySubmissions = readDiskCache();
    }
    memorySubmissions.unshift(submissionData);
    writeDiskCache(memorySubmissions);

    // 4. Save to Backend Database
    try {
      await fetchFromBackend("/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...submissionData,
          // Format attachment objects as JSON strings or names for DB storage if DB text column is limited
          cv_file: typeof submissionData.cv_file === "object" ? JSON.stringify(submissionData.cv_file) : submissionData.cv_file,
          cover_file: typeof submissionData.cover_file === "object" ? JSON.stringify(submissionData.cover_file) : submissionData.cover_file,
          cert_file: typeof submissionData.cert_file === "object" ? JSON.stringify(submissionData.cert_file) : submissionData.cert_file,
        }),
      }, 10000);
    } catch (err) {
      console.error("Failed to post submission to backend DB:", err);
    }

    // 5. Send Notification Email via Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const toEmail = process.env.RESEND_TO_EMAIL || "administration@sti.dz";
        const fromEmail = process.env.RESEND_FROM_EMAIL || "STI Recruitment <onboarding@resend.dev>";

        // Build attachments array for Resend
        const emailAttachments: Array<{ filename: string; content: string }> = [];

        const extractResendAttachment = (fileObj: any, defaultName: string) => {
          if (!fileObj) return null;
          if (typeof fileObj === "object" && fileObj.url && fileObj.url.startsWith("data:")) {
            const parts = fileObj.url.split(",");
            if (parts.length > 1) {
              return { filename: fileObj.name || defaultName, content: parts[1] };
            }
          }
          if (typeof fileObj === "string" && fileObj.startsWith("data:")) {
            const parts = fileObj.split(",");
            if (parts.length > 1) {
              return { filename: defaultName, content: parts[1] };
            }
          }
          return null;
        };

        const cvAtt = extractResendAttachment(submissionData.cv_file, `CV_${candidateName.replace(/\s+/g, "_")}.pdf`);
        if (cvAtt) emailAttachments.push(cvAtt);

        const coverAtt = extractResendAttachment(submissionData.cover_file, `Cover_${candidateName.replace(/\s+/g, "_")}.pdf`);
        if (coverAtt) emailAttachments.push(coverAtt);

        const certAtt = extractResendAttachment(submissionData.cert_file, `Certificates_${candidateName.replace(/\s+/g, "_")}.pdf`);
        if (certAtt) emailAttachments.push(certAtt);

        const getFileName = (fileObj: any) => {
          if (!fileObj) return "None";
          if (typeof fileObj === "object" && fileObj.name) return fileObj.name;
          if (typeof fileObj === "string") return fileObj.startsWith("data:") ? "Uploaded Document" : fileObj;
          return "Uploaded Document";
        };

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; background-color: #ffffff;">
            <div style="background-color: #D71920; padding: 20px; border-radius: 12px; text-align: center; color: #ffffff; margin-bottom: 24px;">
              <h2 style="margin: 0; font-size: 22px; font-weight: bold;">New Job Application Received</h2>
              <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.95;">SARL Smart Technologie Innovation - Recruitment Portal</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #111827; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 12px;">Candidate Personal & Contact Details</h3>
              <p><strong>Candidate Name:</strong> ${candidateName}</p>
              <p><strong>Target Position:</strong> <span style="color: #D71920; font-weight: bold; font-size: 15px;">${position}</span></p>
              <p><strong>Email Address:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Phone Number:</strong> <a href="tel:${phone}">${phone}</a></p>
              <p><strong>City / Wilaya:</strong> ${submissionData.city || "N/A"}</p>
              <p><strong>Nationality:</strong> ${submissionData.nationality || "N/A"}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #111827; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 12px;">Professional Background & Preferences</h3>
              <p><strong>Years of Experience:</strong> ${submissionData.experience || "N/A"}</p>
              <p><strong>Education Level:</strong> ${submissionData.education || "N/A"}</p>
              <p><strong>Expected Salary:</strong> ${submissionData.salary || "N/A"}</p>
              <p><strong>Notice Period / Availability:</strong> ${submissionData.availability || "N/A"}</p>
            </div>

            ${submissionData.linkedin || submissionData.portfolio ? `
            <div style="margin-bottom: 20px;">
              <h3 style="color: #111827; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 12px;">Online Profiles & Links</h3>
              ${submissionData.linkedin ? `<p><strong>LinkedIn Profile:</strong> <a href="${submissionData.linkedin}">${submissionData.linkedin}</a></p>` : ""}
              ${submissionData.portfolio ? `<p><strong>Portfolio / Website:</strong> <a href="${submissionData.portfolio}">${submissionData.portfolio}</a></p>` : ""}
            </div>` : ""}

            ${submissionData.message ? `
            <div style="margin-bottom: 20px;">
              <h3 style="color: #111827; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 12px;">Cover Note / Additional Comments</h3>
              <div style="background-color: #f9fafb; padding: 14px; border-radius: 10px; font-style: italic; color: #374151; border: 1px solid #f3f4f6;">
                "${submissionData.message}"
              </div>
            </div>` : ""}

            <div style="margin-bottom: 20px;">
              <h3 style="color: #111827; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 12px;">Uploaded Attachments</h3>
              <p><strong>Curriculum Vitae (CV):</strong> ${getFileName(submissionData.cv_file)}</p>
              <p><strong>Cover Letter:</strong> ${getFileName(submissionData.cover_file)}</p>
              <p><strong>Certificates:</strong> ${getFileName(submissionData.cert_file)}</p>
            </div>

            <div style="text-align: center; margin-top: 28px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
              <p>Review and manage this application inside your STI Admin Console under Applications / Submissions.</p>
            </div>
          </div>
        `;

        const emailPayload: any = {
          from: fromEmail,
          to: [toEmail],
          subject: `New Job Application: ${candidateName} - ${position}`,
          html: emailHtml,
        };

        if (emailAttachments.length > 0) {
          emailPayload.attachments = emailAttachments;
        }

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailPayload),
        });
      } catch (emailErr) {
        console.error("Failed to send notification email via Resend:", emailErr);
      }
    }

    return NextResponse.json({ success: true, submission: submissionData });
  } catch (err: any) {
    console.error("Submission POST handler error:", err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
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
    if (!memorySubmissions) {
      memorySubmissions = readDiskCache();
    }

    const index = memorySubmissions.findIndex((s) => String(s.id) === String(id));
    if (index !== -1) {
      memorySubmissions[index].status = status;
      writeDiskCache(memorySubmissions);
    }

    // Update in backend DB
    try {
      await fetchFromBackend(`/submissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }, 10000);
    } catch {}

    return NextResponse.json({ success: true, submission: memorySubmissions[index] || null });
  } catch {
    return NextResponse.json({ error: "Failed to update submission status" }, { status: 500 });
  }
}
