import type { Metadata } from "next";
import VivoHomePageClient from "./VivoHomePageClient";

interface PageParams {
  locale: string;
}

const SEO_CONTENT = {
  fr: {
    title: "VIVO Algérie | Distributeur Officiel STI - Smartphones, Séries V & Y, SAV",
    description:
      "Bienvenue sur l'espace officiel VIVO Algérie par STI (Smart Technologie Innovation). Découvrez les séries V et Y, les technologies d'imagerie avancées, les points de vente agréés et le service après-vente officiel en Algérie.",
    keywords: [
      "STI",
      "vivo",
      "vivo Algérie",
      "Smartphones vivo",
      "Distributeur Officiel vivo",
      "vivo V Series",
      "vivo Y Series",
      "vivo V40",
      "vivo Y28",
      "vivo Y21d",
      "Garantie Officielle vivo",
      "SAV vivo Algérie",
      "Boutique vivo Algérie",
      "Smart Technologie Innovation",
      "Téléphonie Algérie",
      "Prix vivo Algérie",
    ],
    ogTitle: "VIVO Algérie | Distributeur Officiel STI",
    ogDescription:
      "Explorez les smartphones VIVO officiels en Algérie avec garantie constructeur, réseau de distribution national STI et service après-vente dédié.",
  },
  ar: {
    title: "فيفو الجزائر | الموزع الرسمي STI - أحدث هواتف vivo، السلسلة V و Y والضمان",
    description:
      "الموقع الرسمي لهواتف فيفو (vivo) في الجزائر برعاية الشريك والموزع الرسمي STI سمارت تكنولوجي إنوفايشن. استكشف أحدث الهواتف الذكية، نقاط البيع المعتمدة، وخدمات ما بعد البيع والضمان الرسمي في الجزائر.",
    keywords: [
      "STI",
      "vivo",
      "فيفو",
      "فيفو الجزائر",
      "vivo Algeria",
      "هواتف فيفو",
      "الموزع الرسمي فيفو الجزائر",
      "سمارت تكنولوجي إنوفايشن",
      "سلسلة vivo V",
      "سلسلة vivo Y",
      "vivo V40",
      "vivo Y28",
      "vivo Y21d",
      "ضمان فيفو الرسمي",
      "خدمة ما بعد البيع فيفو الجزائر",
      "نقاط بيع فيفو الجزائر",
      "أسعار هواتف فيفو في الجزائر",
    ],
    ogTitle: "فيفو الجزائر | الموزع الرسمي STI",
    ogDescription:
      "هواتف فيفو الأصلية في الجزائر مع الضمان الرسمي وشبكة التوزيع المعتمدة وخدمة الزبائن من STI.",
  },
  en: {
    title: "VIVO Algeria | Official Distributor STI - Smartphones, V & Y Series, Support",
    description:
      "Official VIVO Algeria hub by STI (Smart Technologie Innovation). Explore V and Y Series smartphones, cutting-edge mobile imaging, authorized retail points of sale, and official customer service in Algeria.",
    keywords: [
      "STI",
      "vivo",
      "vivo Algeria",
      "vivo smartphones",
      "Official vivo Distributor",
      "Smart Technologie Innovation",
      "vivo V Series",
      "vivo Y Series",
      "vivo V40",
      "vivo Y28",
      "vivo Y21d",
      "vivo Official Warranty",
      "vivo Service Center Algeria",
      "vivo Store Algeria",
      "vivo mobile prices Algeria",
    ],
    ogTitle: "VIVO Algeria | Official Distributor STI",
    ogDescription:
      "Official authorized distributor for VIVO smartphones in Algeria. Authentic devices, manufacturer warranty, and certified support.",
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
  const canonicalUrl = `${siteUrl}/${loc}/vivo`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${siteUrl}/fr/vivo`,
        ar: `${siteUrl}/ar/vivo`,
        en: `${siteUrl}/en/vivo`,
        "x-default": `${siteUrl}/fr/vivo`,
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
          alt: "VIVO Algeria - Official Distributor STI",
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

export default async function VivoHomePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  const loc = (locale as "en" | "ar" | "fr") || "fr";
  const siteUrl = "https://sti.dz";

  const brandSchema = {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: "vivo",
    url: `${siteUrl}/${loc}/vivo`,
    logo: `${siteUrl}/assets/logo.png`,
    description: "Official VIVO Smartphones and customer support in Algeria distributed by STI.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "280",
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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(brandSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <VivoHomePageClient />
    </>
  );
}
