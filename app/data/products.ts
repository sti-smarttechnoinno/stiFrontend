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

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
}

export const productCategories: ProductCategory[] = [
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

export const products: Product[] = [];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product): Product[] {
  return products.filter((p) => product.relatedSlugs?.includes(p.slug));
}

export function getAllProductSlugs(): string[] {
  return products.map((p) => p.slug);
}