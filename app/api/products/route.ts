import { NextResponse } from "next/server";

export interface ApiProductItem {
  id: number | string;
  sku: string;
  slug: string;
  category: string;
  brand: string;
  productType: string;
  product_type?: string;
  value: string;
  status: string;
  image?: string;
  updated_at?: string;
  translations: {
    en: {
      name: string;
      shortDescription: string;
      description: string;
      features: string[];
      specifications: { label: string; value: string }[];
      faqs: { question: string; answer: string }[];
    };
    ar: {
      name: string;
      shortDescription: string;
      description: string;
      features: string[];
      specifications: { label: string; value: string }[];
      faqs: { question: string; answer: string }[];
    };
    fr: {
      name: string;
      shortDescription: string;
      description: string;
      features: string[];
      specifications: { label: string; value: string }[];
      faqs: { question: string; answer: string }[];
    };
  };
}

export const defaultProductsData: ApiProductItem[] = [
  {
    id: 1,
    sku: "SIM-PREPAID",
    slug: "ooredoo-prepaid-sim-card",
    category: "SIM Cards",
    brand: "Ooredoo",
    productType: "SIM Card",
    value: "Prepaid",
    status: "Published",
    image: "/assets/sim-card.png",
    updated_at: "2026-05-18",
    translations: {
      en: {
        name: "Ooredoo Prepaid SIM Card",
        shortDescription: "Official Ooredoo prepaid SIM card ready for activation and distribution.",
        description: "Official Ooredoo prepaid SIM card ready for activation and distribution to retailers, wholesalers, and business partners across Algeria.",
        features: [
          "Official Ooredoo Product",
          "Ready for Activation",
          "Prepaid Service",
          "Retail Distribution",
          "Wholesale Distribution",
          "Nationwide Availability"
        ],
        specifications: [
          { label: "Product Type", value: "SIM Card" },
          { label: "Operator", value: "Ooredoo" },
          { label: "Network", value: "4G / 4G+" },
          { label: "SKU", value: "SIM-PREPAID" },
          { label: "Status", value: "Available" }
        ],
        faqs: [
          {
            question: "Is this an official Ooredoo SIM Card?",
            answer: "Yes, this is an official Ooredoo product distributed directly by SARL Smart Technologie Innovation (STI)."
          },
          {
            question: "How can retailers order in bulk?",
            answer: "Business partners can request a quotation directly through our portal or contact our sales team."
          }
        ]
      },
      ar: {
        name: "بطاقة أوريدو سيم مدفوعة مقدماً",
        shortDescription: "بطاقة أوريدو سيم رسمية جاهزة للتفعيل والتوزيع في مختلف الولايات.",
        description: "شريحة هاتف أوريدو رسمية مخصصة للبيع والتوزيع عبر المحلات والتجار والموزعين المعتمدين عبر كامل التراب الوطني.",
        features: [
          "منتج أوريدو رسمي 100%",
          "جاهزة للتفعيل الفوري",
          "شريحة الدفع المسبق",
          "توزيع بالجملة والتجزئة",
          "تغطية وطنية 58 ولاية"
        ],
        specifications: [
          { label: "نوع المنتج", value: "شريحة هاتف SIM" },
          { label: "المتعامل", value: "أوريدو الجزائر" },
          { label: "الشبكة", value: "4G / 4G+" },
          { label: "الرمز SKU", value: "SIM-PREPAID" },
          { label: "الحالة", value: "متوفر" }
        ],
        faqs: [
          {
            question: "هل الشريحة معتمدة ورسمية من أوريدو؟",
            answer: "نعم، جميع الشرائح الموزعة رسمية ومضمونة مباشرة عبر شركة STI."
          },
          {
            question: "كيف يمكن تقديم طلبات الشراء بالجملة؟",
            answer: "يمكن للتجار والموزعين التواصل مباشرة مع فريق المبيعات لطلب كميات الجملة."
          }
        ]
      },
      fr: {
        name: "Carte SIM Prépayée Ooredoo",
        shortDescription: "Carte SIM prépayée officielle Ooredoo prête pour activation et distribution.",
        description: "Carte SIM prépayée officielle Ooredoo prête pour activation et distribution aux détaillants, grossistes et partenaires commerciaux en Algérie.",
        features: [
          "Produit Officiel Ooredoo",
          "Prête pour Activation",
          "Service Prépayé",
          "Distribution Grossiste & Détaillant",
          "Disponibilité Nationale"
        ],
        specifications: [
          { label: "Type de Produit", value: "Carte SIM" },
          { label: "Opérateur", value: "Ooredoo" },
          { label: "Réseau", value: "4G / 4G+" },
          { label: "SKU", value: "SIM-PREPAID" },
          { label: "Statut", value: "Disponible" }
        ],
        faqs: [
          {
            question: "Est-ce une carte SIM officielle Ooredoo ?",
            answer: "Oui, produit 100% officiel distribué par STI."
          },
          {
            question: "Comment commander en gros ?",
            answer: "Contactez directement notre équipe commerciale pour les tarifs de gros."
          }
        ]
      }
    }
  },
  {
    id: 2,
    sku: "OOR-RECHARGE",
    slug: "recharge-credit",
    category: "Recharge Credit Distribution",
    brand: "Ooredoo",
    productType: "Recharge Credit",
    value: "Flexible",
    status: "Published",
    image: "/assets/recharge-card.png",
    updated_at: "2026-05-18",
    translations: {
      en: {
        name: "Recharge Credit Distribution",
        shortDescription: "Official Ooredoo mobile recharge credit distribution in flexible denominations.",
        description: "Official Ooredoo mobile recharge credit distribution available in flexible denominations for retailers, wholesalers, and business partners across Algeria.",
        features: [
          "Official Ooredoo Product",
          "Physical & Digital Recharge",
          "Flexible Denominations",
          "Wholesale & Retail Distribution",
          "Immediate Fulfillment"
        ],
        specifications: [
          { label: "Product Type", value: "Recharge Credit" },
          { label: "Denominations", value: "Flexible" },
          { label: "Operator", value: "Ooredoo" },
          { label: "SKU", value: "OOR-RECHARGE" }
        ],
        faqs: [
          {
            question: "What denominations are available?",
            answer: "We supply official Ooredoo recharge credit in flexible denominations."
          },
          {
            question: "Is this recharge credit genuine?",
            answer: "Yes, 100% official Ooredoo recharge credit distributed by authorized partner STI."
          }
        ]
      },
      ar: {
        name: "توزيع رصيد الشحن الهاتفي أوريدو",
        shortDescription: "توزيع رصيد إعادة الشحن أوريدو بمختلف الفئات للتجار والموزعين.",
        description: "توزيع رصيد الشحن الهاتفي المعتمد من أوريدو بمختلف الفئات للشركاء والتجار عبر كامل ولايات الوطن.",
        features: [
          "منتج أوريدو رسمي 100%",
          "شحن رقمي وبطاقات شحن",
          "فئات متعددة ومتنوعة",
          "توزيع بالجملة والتجزئة",
          "تزويد فوري ودائم"
        ],
        specifications: [
          { label: "نوع المنتج", value: "رصيد شحن" },
          { label: "الفئات", value: "متعددة ومختلفة" },
          { label: "المتعامل", value: "أوريدو الجزائر" }
        ],
        faqs: [
          {
            question: "هل رصيد الشحن رسمي ومضمون؟",
            answer: "نعم، جميع خدمات الشحن رسمية 100% وموزعة عبر شبكة STI المعتمدة."
          }
        ]
      },
      fr: {
        name: "Distribution de Crédit de Recharge Ooredoo",
        shortDescription: "Distribution officielle de crédit de recharge Ooredoo en différentes dénominations.",
        description: "Distribution officielle de crédit de recharge Ooredoo disponible en différentes valeurs pour les détaillants et grossistes.",
        features: [
          "Produit Officiel Ooredoo",
          "Recharge Numérique & Physique",
          "Dénominations Flexibles",
          "Distribution Grossiste & Détaillant"
        ],
        specifications: [
          { label: "Type de Produit", value: "Crédit de Recharge" },
          { label: "Opérateur", value: "Ooredoo" }
        ],
        faqs: [
          {
            question: "Est-ce du crédit officiel ?",
            answer: "Oui, crédit 100% officiel distribué par STI."
          }
        ]
      }
    }
  },
  {
    id: 3,
    sku: "DELIVERY-TICKET",
    slug: "recharge-credit-delivery-ticket",
    category: "Recharge Delivery Tickets",
    brand: "STI / Ooredoo",
    productType: "Distribution Document",
    value: "Ticket",
    status: "Published",
    image: "/assets/delivery-ticket.png",
    updated_at: "2026-05-15",
    translations: {
      en: {
        name: "Recharge Credit Delivery Ticket",
        shortDescription: "Official delivery ticket accompanying recharge credit distribution.",
        description: "Official delivery ticket accompanying recharge credit distribution to retailers and wholesalers across Algeria.",
        features: [
          "Official Distribution Document",
          "Order Verification",
          "Delivery Tracking"
        ],
        specifications: [
          { label: "Document Type", value: "Delivery Ticket" },
          { label: "Purpose", value: "Order Verification & Tracking" }
        ],
        faqs: [
          {
            question: "What is the purpose of the delivery ticket?",
            answer: "It serves as official proof of delivery for bulk recharge credit distribution."
          }
        ]
      },
      ar: {
        name: "وصل تسليم رصيد الشحن",
        shortDescription: "وصل تسليم رسمي يرافق عمليات توزيع وتزويد رصيد الشحن.",
        description: "وثيقة ووصل تسليم رسمي معتمد يرافق طلبات وشحنات رصيد الشحن لتأكيد وضبط عمليات التوزيع.",
        features: [
          "وثيقة توزيع رسمية",
          "تأكيد والتحقق من الطلبيات",
          "متابعة الشحنات والتوزيع"
        ],
        specifications: [
          { label: "نوع الوثيقة", value: "وصل تسليم" },
          { label: "الغرض", value: "إثبات وتأكيد الشحنات" }
        ],
        faqs: [
          {
            question: "ما هو الغرض من وصل التسليم؟",
            answer: "يُعد إثباتاً رسمياً وموثقاً لتسليم شحنات رصيد الشحن بالجملة."
          }
        ]
      },
      fr: {
        name: "Ticket de Livraison de Crédit",
        shortDescription: "Ticket de livraison officiel accompagnant la distribution de crédit.",
        description: "Document et ticket de livraison officiel accompagnant la distribution de crédit aux commerçants et grossistes.",
        features: [
          "Document Officiel de Distribution",
          "Vérification de Commande",
          "Suivi de Livraison"
        ],
        specifications: [
          { label: "Type de Document", value: "Ticket de Livraison" }
        ],
        faqs: [
          {
            question: "À quoi sert le ticket de livraison ?",
            answer: "Il sert de preuve officielle pour la livraison des commandes en gros."
          }
        ]
      }
    }
  }
];

let memoryProducts: ApiProductItem[] | null = null;

export function getMemoryProducts(): ApiProductItem[] {
  if (!memoryProducts) {
    memoryProducts = [...defaultProductsData];
  }
  return memoryProducts;
}

export function updateMemoryProduct(id: string | number, fields: any): ApiProductItem | null {
  const list = getMemoryProducts();
  const index = list.findIndex((p) => String(p.id) === String(id) || p.slug === id);
  if (index !== -1) {
    list[index] = {
      ...list[index],
      ...fields,
      productType: fields.productType || fields.product_type || list[index].productType || "SIM Card",
    };
    return list[index];
  }
  return null;
}

export function deleteMemoryProduct(id: string | number): boolean {
  const list = getMemoryProducts();
  const index = list.findIndex((p) => String(p.id) === String(id) || p.slug === id);
  if (index !== -1) {
    list.splice(index, 1);
    return true;
  }
  return false;
}

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://127.0.0.1:8000/api";

export async function GET() {
  const currentMemory = getMemoryProducts();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${BACKEND_API_URL}/products`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((p: any) => ({
          ...p,
          productType: p.productType || p.product_type || "SIM Card",
          product_type: p.product_type || p.productType || "SIM Card",
          image: p.image || "/assets/sim-card.png",
        }));
        memoryProducts = mapped;
        return NextResponse.json(mapped);
      }
    }
  } catch {}

  return NextResponse.json(memoryProducts || defaultProductsData);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!memoryProducts) {
      memoryProducts = [...defaultProductsData];
    }

    const newId = memoryProducts.length > 0 ? Math.max(...memoryProducts.map((p) => Number(p.id) || 0)) + 1 : 1;
    const newProduct: any = {
      id: newId,
      sku: body.sku || `PROD-${newId}`,
      slug: body.slug || `product-${newId}`,
      category: body.category || "SIM Cards",
      brand: body.brand || "Ooredoo",
      productType: body.productType || body.product_type || "SIM Card",
      product_type: body.product_type || body.productType || "SIM Card",
      value: body.value || "Available",
      status: body.status || "Published",
      image: body.image || "/assets/sim-card.png",
      translations: body.translations || { en: { name: body.slug, shortDescription: "", description: "", features: [], specifications: [], faqs: [] }, ar: { name: body.slug, shortDescription: "", description: "", features: [], specifications: [], faqs: [] }, fr: { name: body.slug, shortDescription: "", description: "", features: [], specifications: [], faqs: [] } },
    };

    memoryProducts.push(newProduct);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);

      // Truncate large base64 image before sending to backend DB to prevent PHP 500 error
      const backendBody = { ...body };
      if (backendBody.image && typeof backendBody.image === "string" && backendBody.image.length > 5000) {
        backendBody.image = "/assets/sim-card.png";
      }

      const res = await fetch(`${BACKEND_API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendBody),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.id) {
          const mapped = {
            ...data,
            productType: data.productType || data.product_type || "SIM Card",
            product_type: data.product_type || data.productType || "SIM Card",
            image: body.image || data.image || "/assets/sim-card.png",
          };
          memoryProducts[memoryProducts.length - 1] = mapped;
          return NextResponse.json(mapped);
        }
      }
    } catch {}

    return NextResponse.json(newProduct);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}
