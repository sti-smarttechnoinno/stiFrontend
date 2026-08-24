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

export function getMemoryProducts(): ApiProductItem[] {
  if (!memoryProducts) {
    memoryProducts = [];
  }
  return memoryProducts;
}

export function setMemoryProducts(products: ApiProductItem[]): void {
  memoryProducts = products;
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
