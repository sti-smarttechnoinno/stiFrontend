import type { Metadata } from "next";
import VivoProductsPageClient from "./VivoProductsPageClient";

interface PageParams {
  locale: string;
}

const SEO_CONTENT = {
  fr: {
    title: "Catalogue Smartphones VIVO Algérie | Séries V & Y - Distributeur Officiel STI",
    description:
      "Explorez tous les smartphones VIVO disponibles officiellement en Algérie par STI. Gamme V Series (V70 FE, portraits haute définition), Y Series (Y21D, Y05, autonomie et fluidité) avec garantie officielle.",
    keywords: [
      "STI",
      "vivo",
      "vivo Algérie",
      "Smartphones vivo Algérie",
      "vivo V Series",
      "vivo Y Series",
      "vivo V70 FE",
      "vivo Y21D",
      "vivo Y05",
      "Prix vivo Algérie",
      "Catalogue officiel vivo",
      "Smart Technologie Innovation",
      "Acheter téléphone vivo Algérie",
      "Garantie officielle vivo Algérie",
    ],
    ogTitle: "Catalogue Smartphones VIVO Algérie | STI Distributeur Officiel",
    ogDescription:
      "Découvrez les gammes de smartphones VIVO officiels en Algérie avec garantie constructeur et assistance locale STI.",
  },
  ar: {
    title: "كتالوج هواتف فيفو في الجزائر | السلسلة V و Y - الموزع الرسمي STI",
    description:
      "تصفح جميع هواتف فيفو (vivo) الذكية المتوفرة رسمياً في الجزائر برعاية STI. هواتف السلسلة V (V70 FE، تصوير البورتريه الاحترافي)، والسلسلة Y (Y21D، Y05، بطارية قوية وسلاسة عالية) مع الضمان الرسمي المعتمد.",
    keywords: [
      "STI",
      "vivo",
      "فيفو",
      "فيفو الجزائر",
      "هواتف فيفو الجزائر",
      "سلسلة vivo V",
      "سلسلة vivo Y",
      "vivo V70 FE",
      "vivo Y21D",
      "vivo Y05",
      "أسعار هواتف فيفو في الجزائر",
      "كتالوج هواتف فيفو",
      "سمارت تكنولوجي إنوفايشن",
      "شراء هاتف فيفو الجزائر",
      "ضمان فيفو المعتمد",
    ],
    ogTitle: "كتالوج هواتف فيفو الجزائر | الموزع الرسمي STI",
    ogDescription:
      "اكتشف تشكيلة هواتف فيفو الأصلية في الجزائر مع الضمان الرسمي والمواصفات الكاملة.",
  },
  en: {
    title: "VIVO Smartphones Catalog Algeria | V & Y Series - Official STI Distributor",
    description:
      "Explore all official VIVO smartphones available in Algeria through STI. Discover the V Series (V70 FE, studio portrait camera), Y Series (Y21D, Y05, long-lasting battery and smooth performance) with official warranty.",
    keywords: [
      "STI",
      "vivo",
      "vivo Algeria",
      "vivo smartphones Algeria",
      "vivo V Series",
      "vivo Y Series",
      "vivo V70 FE",
      "vivo Y21D",
      "vivo Y05",
      "vivo smartphone prices Algeria",
      "Official vivo catalog",
      "Smart Technologie Innovation",
      "Buy vivo Algeria",
      "vivo official warranty Algeria",
    ],
    ogTitle: "VIVO Smartphones Catalog Algeria | STI Official Distributor",
    ogDescription:
      "Explore the full range of authentic VIVO smartphones in Algeria with manufacturer warranty and local STI service support.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = (locale as "en" | "ar" | "fr") || "fr";
  const seo = SEO_CONTENT[loc] || SEO_CONTENT.fr;

  const siteUrl = "https://sti.dz";
  const canonicalUrl = `${siteUrl}/${loc}/vivo/products`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${siteUrl}/fr/vivo/products`,
        ar: `${siteUrl}/ar/vivo/products`,
        en: `${siteUrl}/en/vivo/products`,
        "x-default": `${siteUrl}/fr/vivo/products`,
      },
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: canonicalUrl,
      siteName: "VIVO Algeria · STI Official Partner",
      locale: loc === "ar" ? "ar_DZ" : loc === "en" ? "en_US" : "fr_DZ",
      type: "website",
      images: [
        {
          url: `${siteUrl}/assets/logo.png`,
          width: 800,
          height: 600,
          alt: "VIVO Smartphones Catalog Algeria - STI Official Distributor",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [`${siteUrl}/assets/logo.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function VivoProductsPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  const loc = (locale as "en" | "ar" | "fr") || "fr";
  const siteUrl = "https://sti.dz";

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: loc === "ar" ? "كتالوج هواتف فيفو الجزائر" : loc === "en" ? "VIVO Smartphones Algeria" : "Catalogue Smartphones VIVO Algérie",
    url: `${siteUrl}/${loc}/vivo/products`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "vivo V70 FE",
        url: `${siteUrl}/${loc}/vivo/products/v-series/v70fe`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "vivo Y21D",
        url: `${siteUrl}/${loc}/vivo/products/y-series/y21d`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "vivo Y05",
        url: `${siteUrl}/${loc}/vivo/products/y-series/y05`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />
      <VivoProductsPageClient />
    </>
  );
}
