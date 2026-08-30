import type { Metadata } from "next";
import VivoTechnologyPageClient from "./VivoTechnologyPageClient";

interface PageParams {
  locale: string;
}

const SEO_CONTENT = {
  fr: {
    title: "Technologie & Innovations VIVO Algérie | Imagerie & Performance - STI",
    description:
      "Explorez les technologies d'imagerie avancées, les optiques de précision et l'ingénierie mobile des smartphones VIVO en Algérie, distribués par STI (Smart Technologie Innovation).",
    keywords: [
      "STI",
      "vivo",
      "vivo Algérie",
      "Technologie vivo",
      "Imagerie mobile vivo",
      "Appareil photo vivo",
      "Smartphones vivo Algérie",
      "Optique vivo",
      "Smart Technologie Innovation",
      "Innovation vivo Algérie",
    ],
    ogTitle: "Technologie & Innovations VIVO Algérie | STI Distributeur Officiel",
    ogDescription:
      "Optique de précision, portrait haute définition et performances durables avec la technologie vivo en Algérie.",
  },
  ar: {
    title: "تكنولوجيا وابتكارات فيفو في الجزائر | كاميرا متطورة وأداء سلس - STI",
    description:
      "استكشف أحدث ابتكارات وتكنولوجيا هواتف فيفو (vivo) في الجزائر، من أنظمة التصوير الاحترافية والعدسات الدقيقة إلى الأداء الفائق والبطارية القوية برعاية STI سمارت تكنولوجي إنوفايشن.",
    keywords: [
      "STI",
      "vivo",
      "فيفو",
      "فيفو الجزائر",
      "تكنولوجيا فيفو",
      "كاميرا هواتف فيفو",
      "ابتكارات فيفو",
      "هواتف فيفو الجزائر",
      "سمارت تكنولوجي إنوفايشن",
      "الموزع الرسمي فيفو",
    ],
    ogTitle: "تكنولوجيا وابتكارات فيفو الجزائر | STI الموزع الرسمي",
    ogDescription:
      "دقة التصوير، البورتريه الاحترافي والتكنولوجيا الحديثة في هواتف فيفو بالجزائر.",
  },
  en: {
    title: "VIVO Technology & Mobile Innovation Algeria | Imaging & Performance - STI",
    description:
      "Explore advanced camera optics, studio portrait imaging, and mobile innovation in VIVO smartphones across Algeria, officially distributed by STI (Smart Technologie Innovation).",
    keywords: [
      "STI",
      "vivo",
      "vivo Algeria",
      "vivo technology",
      "vivo mobile camera",
      "vivo smartphone innovation",
      "Official vivo Distributor Algeria",
      "Smart Technologie Innovation",
    ],
    ogTitle: "VIVO Technology & Innovation Algeria | STI Official Distributor",
    ogDescription:
      "Precision mobile optics, studio portraits, and powerful battery life with VIVO technology in Algeria.",
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
  const canonicalUrl = `${siteUrl}/${loc}/vivo/technology`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${siteUrl}/fr/vivo/technology`,
        ar: `${siteUrl}/ar/vivo/technology`,
        en: `${siteUrl}/en/vivo/technology`,
        "x-default": `${siteUrl}/fr/vivo/technology`,
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
          alt: "VIVO Technology Algeria - STI Official Distributor",
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

export default async function VivoTechnologyPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  const loc = (locale as "en" | "ar" | "fr") || "fr";
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
        name: loc === "ar" ? "التكنولوجيا" : loc === "en" ? "Technology" : "Technologie",
        item: `${siteUrl}/${loc}/vivo/technology`,
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
      <VivoTechnologyPageClient />
    </>
  );
}
