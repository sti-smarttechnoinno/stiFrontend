import fs from "fs";
import path from "path";

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

export const defaultProductsData: ApiProductItem[] = [];

let memoryProducts: ApiProductItem[] | null = null;
const CACHE_FILE = path.join(process.cwd(), ".data", "products_cache.json");

export function readProductsDiskCache(): ApiProductItem[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [];
}

export function writeProductsDiskCache(data: ApiProductItem[]): void {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {}
}

export function getMemoryProducts(): ApiProductItem[] {
  if (!memoryProducts) {
    memoryProducts = readProductsDiskCache();
    if (memoryProducts.length === 0) {
      memoryProducts = [...defaultProductsData];
    }
  }
  return memoryProducts;
}

export function setMemoryProducts(products: ApiProductItem[]): void {
  memoryProducts = products;
  writeProductsDiskCache(products);
}

export function updateMemoryProduct(id: string | number, fields: any): ApiProductItem | null {
  const list = getMemoryProducts();
  const index = list.findIndex((p) => String(p.id) === String(id) || p.slug === id);
  if (index !== -1) {
    list[index] = {
      ...list[index],
      ...fields,
      productType: fields.productType || fields.product_type || list[index].productType || "SIM Card",
      image: fields.image !== undefined ? fields.image : list[index].image,
    };
    writeProductsDiskCache(list);
    return list[index];
  }
  return null;
}

export function deleteMemoryProduct(id: string | number): boolean {
  const list = getMemoryProducts();
  const index = list.findIndex((p) => String(p.id) === String(id) || p.slug === id);
  if (index !== -1) {
    list.splice(index, 1);
    writeProductsDiskCache(list);
    return true;
  }
  return false;
}
