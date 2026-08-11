import { NextResponse } from "next/server";

export interface CategoryTranslation {
  en: string;
  ar: string;
  fr: string;
}

export interface ApiCategoryItem {
  id: string;
  translations: CategoryTranslation;
}

let newsCategories: ApiCategoryItem[] = [
  {
    id: "company-news",
    translations: {
      en: "Company News",
      ar: "أخبار الشركة",
      fr: "Actualités de l'entreprise",
    },
  },
  {
    id: "product-update",
    translations: {
      en: "Product Update",
      ar: "تحديثات المنتجات",
      fr: "Mises à jour des produits",
    },
  },
  {
    id: "partnership",
    translations: {
      en: "Partnership",
      ar: "الشراكات",
      fr: "Partenariats",
    },
  },
  {
    id: "wholesale-promotions",
    translations: {
      en: "Wholesale Promotions",
      ar: "العروض الترويجية بالجملة",
      fr: "Promotions de gros",
    },
  },
  {
    id: "events-announcements",
    translations: {
      en: "Events & Announcements",
      ar: "الفعاليات والإعلانات",
      fr: "Événements & Annonces",
    },
  },
];

export async function GET() {
  return NextResponse.json(newsCategories);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { en, ar, fr } = body;
    
    if (!en?.trim() || !ar?.trim() || !fr?.trim()) {
      return NextResponse.json({ error: "Translations for EN, AR, FR are required" }, { status: 400 });
    }

    const id = en.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Check if category already exists
    if (!newsCategories.some((c) => c.id === id)) {
      newsCategories.push({
        id,
        translations: {
          en: en.trim(),
          ar: ar.trim(),
          fr: fr.trim(),
        },
      });
    }
    return NextResponse.json(newsCategories, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add category" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      newsCategories = newsCategories.filter((c) => c.id !== id);
    }
    return NextResponse.json(newsCategories);
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 400 });
  }
}
