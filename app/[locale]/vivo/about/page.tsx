import type { Metadata } from "next";
import VivoAboutPageClient from "./VivoAboutPageClient";

interface PageParams {
  locale: string;
}

const SEO_CONTENT = {
  fr: {
    title: "À Propos de VIVO Algérie & STI | Partenaire & Distributeur Officiel",
    description:
      "Découvrez l'histoire du partenariat officiel entre vivo et SARL Smart Technologie Innovation (STI) en Algérie. Notre engagement : distribuer l'innovation mobile avec rigueur, garantie et proximité locale.",
    keywords: [
      "STI",
      "vivo",
      "vivo Algérie",
      "À propos de vivo Algérie",
      "Smart Technologie Innovation",
      "Partenaire officiel vivo",
      "Distributeur Officiel vivo Algérie",
      "Smartphones vivo Algérie",
      "Histoire STI vivo",
      "Garantie et distribution Algérie",
    ],
    ogTitle: "À Propos de VIVO Algérie & STI | Distributeur Officiel",
    ogDescription:
      "L'histoire, les valeurs et l'engagement de STI pour faire vivre l'univers vivo en Algérie.",
  },
  ar: {
    title: "من نحن | فيفو الجزائر و STI - الشريك والموزع الرسمي المعتمد",
    description:
      "تعرف على مسار وشراكة شركة فيفو (vivo) مع شركة سمارت تكنولوجي إنوفايشن (STI) في الجزائر. التزامنا بتقديم أحدث الهواتف الذكية مع الضمان المعتمد والمرافقة المحلية المتميزة.",
    keywords: [
      "STI",
      "vivo",
      "فيفو",
      "فيفو الجزائر",
      "عن فيفو الجزائر",
      "سمارت تكنولوجي إنوفايشن",
      "الموزع الرسمي لفيفو الجزائر",
      "شراكة STI وفيفو",
      "ضمان هواتف فيفو في الجزائر",
    ],
    ogTitle: "من نحن | فيفو الجزائر و STI الموزع الرسمي",
    ogDescription:
      "شراكة STI الرسمية مع فيفو لتقديم أفضل تجربة هواتف ذكية وضمان رسمي في الجزائر.",
  },
  en: {
    title: "About VIVO Algeria & STI | Official Partner & Authorized Distributor",
    description:
      "Learn about the official partnership between vivo and SARL Smart Technologie Innovation (STI) in Algeria. Bringing smartphone innovation, warranty support, and local distribution excellence.",
    keywords: [
      "STI",
      "vivo",
      "vivo Algeria",
      "About vivo Algeria",
      "Smart Technologie Innovation",
      "Official vivo Partner Algeria",
      "Official vivo Distributor",
      "vivo smartphones Algeria",
      "STI vivo distribution",
    ],
    ogTitle: "About VIVO Algeria & STI | Official Distributor",
    ogDescription:
      "The official story, values, and commitment of STI to empowering the VIVO experience across Algeria.",
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
  const canonicalUrl = `${siteUrl}/${loc}/vivo/about`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${siteUrl}/fr/vivo/about`,
        ar: `${siteUrl}/ar/vivo/about`,
        en: `${siteUrl}/en/vivo/about`,
        "x-default": `${siteUrl}/fr/vivo/about`,
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
          alt: "About VIVO Algeria - STI Official Distributor",
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

export default async function VivoAboutPage({
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
        name: loc === "ar" ? "عن فيفو الجزائر" : loc === "en" ? "About VIVO" : "À Propos",
        item: `${siteUrl}/${loc}/vivo/about`,
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
      <VivoAboutPageClient />
    </>
  );
}
