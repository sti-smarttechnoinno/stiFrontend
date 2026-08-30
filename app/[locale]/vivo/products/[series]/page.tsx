import type { Metadata } from "next";
import VivoSeriesPageClient from "./VivoSeriesPageClient";
import { getSeriesData, VIVO_SERIES_DATA } from "@/app/components/vivo/productsData";

interface PageParams {
  locale: string;
  series: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale, series: rawSeries } = await params;
  const loc = (locale as "en" | "ar" | "fr") || "fr";
  const series = getSeriesData(rawSeries) || VIVO_SERIES_DATA["y-series"];
  const seriesName = series?.name || "VIVO Series";

  const siteUrl = "https://sti.dz";
  const canonicalUrl = `${siteUrl}/${loc}/vivo/products/${rawSeries}`;

  const titles = {
    fr: `vivo ${seriesName} Algérie | Distributeur Officiel STI - Modèles, Prix & Garantie`,
    ar: `هواتف فيفو ${seriesName} في الجزائر | الموزع الرسمي STI - الأسعار والضمان`,
    en: `vivo ${seriesName} Algeria | Official STI Distributor - Models & Warranty`,
  };

  const descriptions = {
    fr: `Découvrez la gamme officielle vivo ${seriesName} en Algérie distribuée par STI. Portraits haute définition, autonomie longue durée et garantie constructeur officielle.`,
    ar: `اكتشف تشكيلة هواتف فيفو ${seriesName} الرسمية في الجزائر برعاية الشريك الرسمي STI. تصوير متطور، بطارية تدوم طويلاً، وضمان معتمد.`,
    en: `Explore the official vivo ${seriesName} smartphone collection in Algeria distributed by STI. Advanced camera technology, long battery life, and official warranty.`,
  };

  const keywordsMap = {
    fr: [
      "STI",
      "vivo",
      "vivo Algérie",
      `vivo ${seriesName}`,
      `Smartphones vivo ${seriesName}`,
      "Distributeur Officiel vivo Algérie",
      "Smart Technologie Innovation",
      "Prix vivo Algérie",
      "Garantie officielle vivo",
    ],
    ar: [
      "STI",
      "vivo",
      "فيفو",
      "فيفو الجزائر",
      `سلسلة فيفو ${seriesName}`,
      `هواتف فيفو ${seriesName}`,
      "الموزع الرسمي فيفو الجزائر",
      "سمارت تكنولوجي إنوفايشن",
      "ضمان فيفو المعتمد",
    ],
    en: [
      "STI",
      "vivo",
      "vivo Algeria",
      `vivo ${seriesName}`,
      `vivo ${seriesName} smartphones`,
      "Official vivo Distributor Algeria",
      "Smart Technologie Innovation",
      "vivo warranty Algeria",
    ],
  };

  const title = titles[loc] || titles.fr;
  const description = descriptions[loc] || descriptions.fr;
  const keywords = keywordsMap[loc] || keywordsMap.fr;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${siteUrl}/fr/vivo/products/${rawSeries}`,
        ar: `${siteUrl}/ar/vivo/products/${rawSeries}`,
        en: `${siteUrl}/en/vivo/products/${rawSeries}`,
        "x-default": `${siteUrl}/fr/vivo/products/${rawSeries}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "VIVO Algeria · STI Official Partner",
      locale: loc === "ar" ? "ar_DZ" : loc === "en" ? "en_US" : "fr_DZ",
      type: "website",
      images: [
        {
          url: `${siteUrl}/assets/logo.png`,
          width: 800,
          height: 600,
          alt: `vivo ${seriesName} Algeria - STI Official Distributor`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/assets/logo.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function DynamicVivoSeriesPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale, series: rawSeries } = await params;
  const loc = (locale as "en" | "ar" | "fr") || "fr";
  const series = getSeriesData(rawSeries) || VIVO_SERIES_DATA["y-series"];
  const siteUrl = "https://sti.dz";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: loc === "ar" ? "الرئيسية" : loc === "en" ? "Home" : "Accueil",
        item: `${siteUrl}/${loc}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "VIVO",
        item: `${siteUrl}/${loc}/vivo`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: loc === "ar" ? "الهواتف" : loc === "en" ? "Products" : "Produits",
        item: `${siteUrl}/${loc}/vivo/products`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: series?.name || rawSeries,
        item: `${siteUrl}/${loc}/vivo/products/${rawSeries}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <VivoSeriesPageClient />
    </>
  );
}
