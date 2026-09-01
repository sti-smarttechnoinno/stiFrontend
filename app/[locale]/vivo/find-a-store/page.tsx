import type { Metadata } from "next";
import { getCompanyPreferences } from "@/app/api/preferences/route";
import VivoFindAStorePageClient from "./VivoFindAStorePageClient";

interface PageParams {
  locale: string;
}

const SEO_CONTENT = {
  fr: {
    title: "Points de Vente & Magasins VIVO Algérie | Réseau Officiel STI",
    description:
      "Trouvez le point de vente officiel VIVO et les centres de distribution agréés STI en Algérie (Sétif, Alger, Bordj Bou Arreridj et réseau national). Achetez des smartphones vivo avec garantie officielle.",
    keywords: [
      "STI",
      "vivo",
      "vivo Algérie",
      "Points de vente vivo Algérie",
      "Boutique vivo Algérie",
      "Magasin vivo",
      "Revendeur officiel vivo",
      "Implantations STI",
      "Smart Technologie Innovation",
      "vivo Sétif",
      "vivo Alger",
      "vivo Bordj Bou Arreridj",
      "Acheter vivo Algérie",
    ],
    ogTitle: "Trouver un Point de Vente VIVO Algérie | Réseau STI",
    ogDescription:
      "Localisez les boutiques officielles et distributeurs agréés VIVO en Algérie sur la carte interactive.",
  },
  ar: {
    title: "نقاط البيع والمتاجر الرسمية لفيفو في الجزائر | شبكة توزيع STI",
    description:
      "ابحث عن أقرب متجر رسمي ونقاط البيع المعتمدة لهواتف فيفو (vivo) وشبكة STI في الجزائر (سطيف، الجزائر العاصمة، برج بوعريريج وكافة الولايات). ضمان معتمد وتوفر دائم.",
    keywords: [
      "STI",
      "vivo",
      "فيفو",
      "فيفو الجزائر",
      "نقاط بيع فيفو الجزائر",
      "متاجر فيفو الجزائر",
      "محل فيفو",
      "موزع معتمد فيفو",
      "مقرات STI",
      "سمارت تكنولوجي إنوفايشن",
      "فيفو سطيف",
      "فيفو الجزائر العاصمة",
      "فيفو برج بوعريريج",
      "شراء هاتف فيفو في الجزائر",
    ],
    ogTitle: "نقاط البيع والمتاجر الرسمية لفيفو الجزائر | شبكة STI",
    ogDescription:
      "تحديد مواقع مراكز ونقاط البيع المعتمدة لهواتف فيفو في الجزائر عبر الخريطة التفاعلية.",
  },
  en: {
    title: "Find a VIVO Store in Algeria | Official STI Retail Network",
    description:
      "Locate official VIVO points of sale and authorized STI distribution centers across Algeria (Setif, Algiers, Bordj Bou Arreridj, and nationwide). Official warranty and genuine smartphones.",
    keywords: [
      "STI",
      "vivo",
      "vivo Algeria",
      "Find vivo store Algeria",
      "vivo official shop Algeria",
      "vivo authorized retailer",
      "STI locations Algeria",
      "Smart Technologie Innovation",
      "vivo Setif",
      "vivo Algiers",
      "Buy vivo Algeria",
    ],
    ogTitle: "Find a VIVO Store in Algeria | STI Network",
    ogDescription:
      "Locate official VIVO stores and authorized partners across Algeria on the interactive map.",
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
  const canonicalUrl = `${siteUrl}/${loc}/vivo/find-a-store`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${siteUrl}/fr/vivo/find-a-store`,
        ar: `${siteUrl}/ar/vivo/find-a-store`,
        en: `${siteUrl}/en/vivo/find-a-store`,
        "x-default": `${siteUrl}/fr/vivo/find-a-store`,
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
          alt: "Find VIVO Stores in Algeria - STI Official Distributor",
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

export default async function VivoFindAStorePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  const loc = (locale as "en" | "ar" | "fr") || "fr";
  const siteUrl = "https://sti.dz";
  const prefs = await getCompanyPreferences().catch(() => null);
  const contactPhone = prefs?.phone?.trim() || "";
  const streetAddr =
    (typeof prefs?.address === "object"
      ? prefs?.address?.[loc] || prefs?.address?.fr || prefs?.address?.en || prefs?.address?.ar
      : prefs?.address) || "";

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "STI - Distributeur Officiel VIVO Algérie",
    image: `${siteUrl}/assets/logo.png`,
    url: `${siteUrl}/${loc}/vivo/find-a-store`,
    ...(contactPhone ? { telephone: contactPhone } : {}),
    ...(streetAddr
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: streetAddr,
            addressCountry: "DZ",
          },
        }
      : {}),
    geo: {
      "@type": "GeoCoordinates",
      latitude: 36.1905,
      longitude: 5.4124,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "08:30",
        closes: "17:00",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <VivoFindAStorePageClient />
    </>
  );
}
