import type { Metadata } from "next";
import VivoProductDetailPageClient from "./VivoProductDetailPageClient";
import {
  getProductData,
  getSeriesData,
  VIVO_PRODUCTS_DATA,
  VIVO_SERIES_DATA,
} from "@/app/components/vivo/productsData";

interface PageParams {
  locale: string;
  series: string;
  product: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale, series: rawSeries, product: rawProduct } = await params;
  const loc = (locale as "en" | "ar" | "fr") || "fr";
  const product = getProductData(rawProduct) || VIVO_PRODUCTS_DATA["y21d"];
  const series = getSeriesData(rawSeries) || getSeriesData(product.seriesSlug) || VIVO_SERIES_DATA["y-series"];

  const productName = product?.name || "VIVO Smartphone";
  const seriesName = series?.name || "VIVO";

  const siteUrl = "https://sti.dz";
  const canonicalUrl = `${siteUrl}/${loc}/vivo/products/${rawSeries}/${rawProduct}`;

  const titles = {
    fr: `${productName} Algérie | Distributeur Officiel STI - Prix, Fiche Technique & Garantie`,
    ar: `هاتف فيفو ${productName} في الجزائر | الموزع الرسمي STI - السعر، المواصفات والضمان`,
    en: `${productName} Algeria | Official STI Distributor - Price, Specs & Warranty`,
  };

  const descriptions = {
    fr: `Découvrez le smartphone officiel ${productName} (${seriesName}) en Algérie distribué par STI. Fiche technique, autonomie, appareil photo haute résolution et garantie constructeur officielle.`,
    ar: `تعرف على هاتف فيفو الرسمي ${productName} (${seriesName}) في الجزائر برعاية الموزع الرسمي STI. المواصفات الكاملة، الكاميرا، البطارية والضمان المعتمد.`,
    en: `Explore the official ${productName} (${seriesName}) smartphone in Algeria distributed by STI. Specifications, camera features, battery life, and authorized manufacturer warranty.`,
  };

  const keywordsMap = {
    fr: [
      "STI",
      "vivo",
      productName,
      `vivo ${productName}`,
      `${productName} Algérie`,
      `Prix ${productName} Algérie`,
      `Fiche technique ${productName}`,
      "vivo Algérie",
      "Distributeur Officiel vivo",
      "Smart Technologie Innovation",
      "Garantie officielle vivo Algérie",
    ],
    ar: [
      "STI",
      "vivo",
      "فيفو",
      productName,
      `هاتف فيفو ${productName}`,
      `${productName} الجزائر`,
      `سعر ${productName} في الجزائر`,
      `مواصفات ${productName}`,
      "فيفو الجزائر",
      "الموزع الرسمي فيفو",
      "سمارت تكنولوجي إنوفايشن",
      "ضمان فيفو المعتمد",
    ],
    en: [
      "STI",
      "vivo",
      productName,
      `vivo ${productName}`,
      `${productName} Algeria`,
      `${productName} price Algeria`,
      `${productName} specs`,
      "vivo Algeria",
      "Official vivo Distributor",
      "Smart Technologie Innovation",
      "vivo official warranty Algeria",
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
        fr: `${siteUrl}/fr/vivo/products/${rawSeries}/${rawProduct}`,
        ar: `${siteUrl}/ar/vivo/products/${rawSeries}/${rawProduct}`,
        en: `${siteUrl}/en/vivo/products/${rawSeries}/${rawProduct}`,
        "x-default": `${siteUrl}/fr/vivo/products/${rawSeries}/${rawProduct}`,
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
          url: product.heroImage || `${siteUrl}/assets/logo.png`,
          width: 800,
          height: 600,
          alt: `${productName} Algeria - STI Official Distributor`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.heroImage || `${siteUrl}/assets/logo.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function DynamicVivoProductDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale, series: rawSeries, product: rawProduct } = await params;
  const loc = (locale as "en" | "ar" | "fr") || "fr";
  const product = getProductData(rawProduct) || VIVO_PRODUCTS_DATA["y21d"];
  const series = getSeriesData(rawSeries) || getSeriesData(product.seriesSlug) || VIVO_SERIES_DATA["y-series"];
  const siteUrl = "https://sti.dz";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.heroDescription,
    image: [product.heroImage],
    brand: {
      "@type": "Brand",
      name: "vivo",
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/${loc}/vivo/products/${rawSeries}/${rawProduct}`,
      priceCurrency: "DZD",
      price: "0.00",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "SARL Smart Technologie Innovation",
      },
    },
  };

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
        name: series?.name || rawSeries,
        item: `${siteUrl}/${loc}/vivo/products/${rawSeries}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${siteUrl}/${loc}/vivo/products/${rawSeries}/${rawProduct}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <VivoProductDetailPageClient />
    </>
  );
}
