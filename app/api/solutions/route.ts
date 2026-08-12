import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;

const fallbackSolutions = [
  {
    id: 1,
    slug: "mobile-recharge-credit",
    status: "Published",
    image: "/assets/mobile-recharge-credit.png",
    translations: {
      en: {
        name: "Official Ooredoo Mobile Recharge Credit Distribution",
        shortName: "Mobile Recharge Credit",
        badge: "Mobile Recharge Credit",
        title: "Official Ooredoo Mobile Recharge Credit Distribution",
        description: ["Our commitment is to deliver authentic Ooredoo recharge credit through a trusted distribution network."],
        highlights: ["Official Ooredoo Recharge Credit", "Multiple Denominations Available"],
        features: [{ icon: "Wallet", title: "Multiple Denominations", description: "Official Ooredoo recharge credit available in multiple values." }],
        benefits: [{ title: "Increase Sales", description: "Expand your product offering." }],
        faqs: [{ question: "Are credits official?", answer: "Yes, 100% official." }],
      },
    },
  },
  {
    id: 2,
    slug: "prepaid-sim-cards",
    status: "Published",
    image: "/assets/prepaid-sim-cards.png",
    translations: {
      en: {
        name: "Official Ooredoo Prepaid SIM Card Distribution",
        shortName: "Prepaid SIM Cards",
        badge: "SIM Card Distribution",
        title: "Official Ooredoo Prepaid SIM Card Distribution",
        description: ["Our distribution services are designed to help retailers and authorized resellers."],
        highlights: ["Official Ooredoo Prepaid SIM Cards", "Ready for Customer Activation"],
        features: [{ icon: "Smartphone", title: "Official Ooredoo SIM Cards", description: "100% genuine SIM cards." }],
        benefits: [{ title: "Official Products", description: "Offer authentic SIM cards." }],
        faqs: [{ question: "Are SIM cards ready?", answer: "Yes, ready for activation." }],
      },
    },
  },
  {
    id: 3,
    slug: "wholesale-recharge",
    status: "Published",
    image: "/assets/wholesale-recharge.png",
    translations: {
      en: {
        name: "Wholesale Mobile Recharge & SIM Card Solutions",
        shortName: "Wholesale Solutions",
        badge: "Wholesale Solutions",
        title: "Wholesale Mobile Recharge & SIM Card Solutions",
        description: ["Flexible purchasing options tailored for bulk telecom product buyers."],
        highlights: ["Competitive Wholesale Pricing"],
        features: [{ icon: "Package", title: "Bulk Options", description: "Purchase in large quantities." }],
        benefits: [{ title: "Increase Profitability", description: "Improve margins." }],
        faqs: [{ question: "Minimum quantity?", answer: "Varies by contract." }],
      },
    },
  },
];

let memorySolutions: any[] | null = null;

import { fetchFromBackend } from "../backend-helper";

export async function GET() {
  try {
    const res = await fetchFromBackend("/solutions", { cache: "no-store" }, 10000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        memorySolutions = data;
        return NextResponse.json(data);
      }
    }
  } catch {}

  if (memorySolutions && memorySolutions.length > 0) {
    return NextResponse.json(memorySolutions);
  }

  return NextResponse.json(fallbackSolutions);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!memorySolutions) {
      memorySolutions = [...fallbackSolutions];
    }

    const newId = memorySolutions.length > 0 ? Math.max(...memorySolutions.map((s) => Number(s.id) || 0)) + 1 : 1;
    const newSolution = {
      id: newId,
      status: "Published",
      ...body,
    };

    memorySolutions.push(newSolution);

    try {
      const res = await fetchFromBackend("/solutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }, 10000);

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.id) {
          memorySolutions[memorySolutions.length - 1] = data;
          return NextResponse.json(data, { status: 201 });
        }
      }
    } catch {}

    return NextResponse.json(newSolution, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to save solution" }, { status: 500 });
  }
}
