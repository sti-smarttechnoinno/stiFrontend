import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchFromBackend } from "../../backend-helper";

export interface VivoContactMessageItem {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  source?: string;
  status: string; // Unread, Read, Replied, Archived
  created_at?: string;
  date?: string;
}

// In-Memory Rate Limiting: Max 3 messages per 10 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Extract client IP for rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    // 2. Rate Limit Check
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "rate_limit_exceeded",
          message: "Trop de tentatives. Veuillez patienter avant d'envoyer un nouveau message.",
          retryAfter: rateCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfterSeconds),
          },
        }
      );
    }

    const body = await req.json();

    // 3. Anti-Spam Honeypot Check
    if (body.hp_website && String(body.hp_website).trim() !== "") {
      console.warn(`[Anti-Spam] Honeypot triggered on VIVO support form by IP ${ip}`);
      return NextResponse.json({ success: true, message: "Demande reçue avec succès." });
    }

    // 4. Validate Form Fields
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const rawSubject = String(body.subject || "general").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "validation_error", message: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "invalid_email", message: "Veuillez saisir une adresse e-mail valide." },
        { status: 400 }
      );
    }

    // Map subject labels
    const subjectMap: Record<string, string> = {
      general: "Question générale",
      product: "Informations produit",
      "after-sales": "Service après-vente & Garantie",
      retailer: "Point de vente & Distribution",
    };
    const humanSubject = subjectMap[rawSubject] || rawSubject;

    const newId = Date.now();
    const formattedDate = new Date().toLocaleDateString("fr-DZ", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const messageData: VivoContactMessageItem = {
      id: newId,
      name,
      email,
      phone: phone || "Non renseigné",
      subject: `[VIVO Support] ${humanSubject}`,
      message,
      source: "vivo-support",
      status: "Unread",
      created_at: new Date().toISOString(),
      date: formattedDate,
    };

    // 5. Store message in Backend Database (Mailbox)
    try {
      await fetchFromBackend(
        "/messages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messageData),
        },
        8000
      );
    } catch (err) {
      console.error("Failed to persist VIVO support message to backend DB:", err);
    }

    // 6. Send Email Notification via Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const toEmail = process.env.RESEND_TO_EMAIL || "service@dz.vivo.com";
        const fromEmail =
          process.env.RESEND_FROM_EMAIL ||
          "VIVO Algérie Support <onboarding@resend.dev>";

        const emailHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau message support VIVO Algérie</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f2f1ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #102039;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f2f1ed; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(16, 32, 57, 0.08); border: 1px solid rgba(16, 32, 57, 0.08);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #102039; padding: 36px 32px; text-align: left; border-bottom: 3px solid #5f8dff;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; padding: 4px 12px; background-color: rgba(95, 141, 255, 0.2); border-radius: 20px; color: #7fa5ff; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px;">
                      VIVO Algérie · Support STI
                    </span>
                    <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.2;">
                      Nouveau message de contact
                    </h1>
                    <p style="margin: 6px 0 0 0; color: rgba(255, 255, 255, 0.65); font-size: 13px;">
                      Reçu le ${formattedDate} via le formulaire de support vivo
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px;">
              
              <!-- Sender Info Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9f9f7; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #e8e7e2;">
                <tr>
                  <td style="padding-bottom: 10px; border-bottom: 1px solid #e8e7e2;">
                    <span style="font-size: 11px; font-weight: 700; color: #697587; text-transform: uppercase; letter-spacing: 0.08em;">Expéditeur :</span>
                    <div style="font-size: 16px; font-weight: 700; color: #102039; margin-top: 2px;">${name}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e8e7e2;">
                    <span style="font-size: 11px; font-weight: 700; color: #697587; text-transform: uppercase; letter-spacing: 0.08em;">Adresse E-mail :</span>
                    <div style="font-size: 14px; font-weight: 600; color: #5f8dff; margin-top: 2px;">
                      <a href="mailto:${email}" style="color: #5f8dff; text-decoration: none;">${email}</a>
                    </div>
                  </td>
                </tr>
                ${
                  phone && phone !== "Non renseigné"
                    ? `<tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e8e7e2;">
                    <span style="font-size: 11px; font-weight: 700; color: #697587; text-transform: uppercase; letter-spacing: 0.08em;">Téléphone / Wilaya :</span>
                    <div style="font-size: 14px; font-weight: 600; color: #102039; margin-top: 2px;">${phone}</div>
                  </td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding-top: 10px;">
                    <span style="font-size: 11px; font-weight: 700; color: #697587; text-transform: uppercase; letter-spacing: 0.08em;">Sujet de la demande :</span>
                    <div style="display: inline-block; font-size: 13px; font-weight: 700; color: #102039; background-color: rgba(95, 141, 255, 0.15); padding: 3px 10px; border-radius: 4px; margin-top: 4px;">
                      ${humanSubject}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Message Section -->
              <div style="margin-bottom: 28px;">
                <span style="font-size: 11px; font-weight: 700; color: #697587; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 8px;">
                  Message :
                </span>
                <div style="background-color: #ffffff; border-left: 3px solid #5f8dff; padding: 18px 20px; border-radius: 0 8px 8px 0; border-top: 1px solid #e8e7e2; border-right: 1px solid #e8e7e2; border-bottom: 1px solid #e8e7e2; color: #102039; font-size: 14px; line-height: 1.65; white-space: pre-wrap;">${message}</div>
              </div>

              <!-- Reply Action Button -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}?subject=Re:%20[VIVO%20Support]%20${encodeURIComponent(
                      humanSubject
                    )}" style="display: inline-block; background-color: #102039; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 6px; letter-spacing: 0.02em;">
                      Répondre directement à ${name}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f7; padding: 24px 32px; text-align: center; border-top: 1px solid #e8e7e2; font-size: 12px; color: #697587; line-height: 1.5;">
              <p style="margin: 0 0 4px 0; font-weight: 600; color: #102039;">
                SARL Smart Technologie Innovation (STI)
              </p>
              <p style="margin: 0; font-size: 11px;">
                Partenaire et Distributeur Officiel VIVO en Algérie · Siège Sétif / Annexe Alger
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            reply_to: email,
            subject: `[VIVO Support] ${humanSubject} - ${name}`,
            html: emailHtml,
          }),
        });
      } catch (emailErr) {
        console.error("Failed to send VIVO support email via Resend:", emailErr);
      }
    } else {
      console.warn("RESEND_API_KEY is not set. VIVO support message saved to DB without sending email.");
    }

    return NextResponse.json({
      success: true,
      message: "Demande envoyée avec succès.",
      data: messageData,
    });
  } catch (err: any) {
    console.error("VIVO messages POST error:", err);
    return NextResponse.json(
      { error: "server_error", message: "Une erreur est survenue lors de l'envoi." },
      { status: 500 }
    );
  }
}
