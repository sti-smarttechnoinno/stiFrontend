export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  category: string;
  categoryId: string;
  value: string;
  description: string;
  shortDescription: string;
  availability: string;
  format: string;
  wholesale: string;
  suitableFor: string[];
  brand: string;
  productType: string;
  authenticity: string;
  network?: string;
  operator?: string;
  denominations?: string[];
  features: string[];
  specifications: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
  image?: string;
  translations?: Record<string, any>;
  relatedSlugs: string[];
}

export const productCategories = [
  {
    id: "sim-cards",
    name: "SIM Cards",
    description: "Official Ooredoo prepaid SIM cards for retailers, wholesalers, and business partners."
  },
  {
    id: "recharge-credit",
    name: "Recharge Credit Distribution",
    description: "Official Ooredoo recharge credit available in multiple denominations for business partners."
  },
  {
    id: "delivery-tickets",
    name: "Recharge Delivery Tickets",
    description: "Official delivery tickets used for the distribution of Ooredoo recharge credit."
  }
];

export const products: Product[] = [
  {
    id: "SIM-001",
    sku: "SIM-PREPAID",
    slug: "ooredoo-prepaid-sim-card",
    name: "Ooredoo Prepaid SIM Card",
    category: "SIM Cards",
    categoryId: "sim-cards",
    value: "Prepaid",
    description: "Official Ooredoo prepaid SIM card ready for activation and distribution to retailers, wholesalers, and business partners across Algeria.",
    shortDescription: "Official Ooredoo prepaid SIM card ready for activation and distribution.",
    availability: "Available",
    format: "Standard SIM Card",
    wholesale: "Available",
    suitableFor: ["Retailers", "Wholesalers", "Business Partners"],
    brand: "Ooredoo",
    productType: "SIM Card",
    authenticity: "Official Ooredoo Product",
    network: "4G / 4G+",
    operator: "Ooredoo",
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
      { label: "Status", value: "Available" },
      { label: "Distribution", value: "Retail & Wholesale" }
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
    ],
    relatedSlugs: ["recharge-credit", "recharge-credit-delivery-ticket"]
  },
  {
    id: "RC-GLOBAL",
    sku: "OOR-RECHARGE",
    slug: "recharge-credit",
    name: "Recharge Credit Distribution",
    category: "Recharge Credit Distribution",
    categoryId: "recharge-credit",
    value: "Flexible",
    description: "Official Ooredoo mobile recharge credit distribution available in flexible denominations for retailers, wholesalers, and business partners across Algeria.",
    shortDescription: "Official Ooredoo mobile recharge credit distribution in flexible denominations.",
    availability: "Available",
    format: "Physical & Digital Recharge",
    wholesale: "Available",
    suitableFor: ["Retailers", "Wholesalers", "Business Partners"],
    brand: "Ooredoo",
    productType: "Recharge Credit",
    authenticity: "Official Ooredoo Product",
    operator: "Ooredoo",
    features: [
      "Official Ooredoo Product",
      "Physical & Digital Recharge",
      "Flexible Denominations",
      "Wholesale & Retail Distribution",
      "Nationwide Availability",
      "Immediate Fulfillment"
    ],
    specifications: [
      { label: "Product Type", value: "Recharge Credit Distribution" },
      { label: "Denominations", value: "Flexible Denominations" },
      { label: "Operator", value: "Ooredoo" },
      { label: "SKU", value: "OOR-RECHARGE" },
      { label: "Status", value: "Available" },
      { label: "Distribution", value: "Retail & Wholesale" }
    ],
    faqs: [
      {
        question: "What denominations are available?",
        answer: "We supply official Ooredoo recharge credit in flexible denominations tailored to client requirements."
      },
      {
        question: "Is this recharge credit genuine?",
        answer: "Yes, 100% official Ooredoo recharge credit distributed by authorized partner STI."
      }
    ],
    relatedSlugs: ["ooredoo-prepaid-sim-card", "recharge-credit-delivery-ticket"]
  },
  {
    id: "DT-001",
    sku: "DELIVERY-TICKET",
    slug: "recharge-credit-delivery-ticket",
    name: "Recharge Credit Delivery Ticket",
    category: "Recharge Delivery Tickets",
    categoryId: "delivery-tickets",
    value: "Ticket",
    description: "Official delivery ticket accompanying recharge credit distribution to retailers and wholesalers across Algeria.",
    shortDescription: "Official delivery ticket accompanying recharge credit distribution.",
    availability: "Available",
    format: "Official Document",
    wholesale: "Available",
    suitableFor: ["Retailers", "Wholesalers", "Distributors"],
    brand: "STI / Ooredoo",
    productType: "Distribution Document",
    authenticity: "Official Distribution Document",
    features: [
      "Official Distribution Document",
      "Business Ready",
      "Order Verification",
      "Delivery Tracking",
      "Retail & Wholesale Distribution"
    ],
    specifications: [
      { label: "Document Type", value: "Delivery Ticket" },
      { label: "Purpose", value: "Order Verification & Tracking" },
      { label: "SKU", value: "DELIVERY-TICKET" },
      { label: "Status", value: "Available" }
    ],
    faqs: [
      {
        question: "What is the purpose of the delivery ticket?",
        answer: "It serves as official proof and verification of delivery for bulk recharge credit distribution."
      }
    ],
    relatedSlugs: ["recharge-credit", "ooredoo-prepaid-sim-card"]
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product): Product[] {
  return products.filter((p) => product.relatedSlugs.includes(p.slug));
}

export function getAllProductSlugs(): string[] {
  return products.map((p) => p.slug);
}