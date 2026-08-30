import type { Metadata } from "next";
import VivoSupportPageClient from "./VivoSupportPageClient";

interface PageParams {
  locale: string;
}

const SEO_CONTENT = {
  fr: {
    title: "Support & SAV VIVO Algérie | Service Client & Garantie Officielle STI",
    description:
      "Besoin d'aide pour votre smartphone VIVO en Algérie ? Contactez le service client officiel STI, découvrez nos FAQ, faites jouer la garantie constructeur ou demandez une réparation en centre agréé.",
    keywords: [
      "STI",
      "vivo",
      "vivo Algérie",
      "SAV vivo Algérie",
      "Service client vivo Algérie",
      "Support technique vivo",
      "Garantie officielle vivo Algérie",
      "Réparation téléphone vivo",
      "Smart Technologie Innovation",
      "Contact vivo Algérie",
      "Service après-vente vivo",
    ],
    ogTitle: "Support & SAV VIVO Algérie | STI Distributeur Officiel",
    ogDescription:
      "Assistance technique, prise en charge sous garantie et service client officiel VIVO Algérie par STI.",
  },
  ar: {
    title: "الدعم الفني وخدمة ما بعد البيع لفيفو الجزائر | الضمان الرسمي STI",
    description:
      "مركز الدعم الفني وخدمة ما بعد البيع الرسمي لهواتف فيفو (vivo) في الجزائر برعاية STI. الإجابة على الأسئلة الشائعة، تفعيل ومتابعة الضمان، وخدمات الصيانة المعتمدة.",
    keywords: [
      "STI",
      "vivo",
      "فيفو",
      "فيفو الجزائر",
      "خدمة ما بعد البيع فيفو الجزائر",
      "الدعم الفني فيفو",
      "ضمان فيفو الرسمي في الجزائر",
      "صيانة هواتف فيفو الجزائر",
      "خدمة زبائن فيفو",
      "سمارت تكنولوجي إنوفايشن",
      "اتصل بفيفو الجزائر",
    ],
    ogTitle: "الدعم الفني وخدمة ما بعد البيع لفيفو الجزائر | STI",
    ogDescription:
      "المساعدة الفنية الرسمية، خدمة الضمان المعتمد واستفسارات الزبائن لهواتف فيفو بالجزائر.",
  },
  en: {
    title: "VIVO Support & Customer Service Algeria | Official STI Warranty & Repair",
    description:
      "Need assistance with your VIVO smartphone in Algeria? Contact the official STI customer support, browse FAQs, claim your manufacturer warranty, or find an authorized repair center.",
    keywords: [
      "STI",
      "vivo",
      "vivo Algeria",
      "vivo customer service Algeria",
      "vivo support Algeria",
      "vivo warranty Algeria",
      "vivo repair Algeria",
      "Smart Technologie Innovation",
      "vivo after sales service",
    ],
    ogTitle: "VIVO Support & Customer Service Algeria | STI",
    ogDescription:
      "Official customer service, warranty support, and authorized repair assistance for VIVO Algeria.",
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

  const siteUrl = "https://sti-dz.com";
  const canonicalUrl = `${siteUrl}/${loc}/vivo/support`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${siteUrl}/fr/vivo/support`,
        ar: `${siteUrl}/ar/vivo/support`,
        en: `${siteUrl}/en/vivo/support`,
        "x-default": `${siteUrl}/fr/vivo/support`,
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
          alt: "VIVO Support Algeria - STI Official Distributor",
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

export default async function VivoSupportPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  const loc = (locale as "en" | "ar" | "fr") || "fr";
  const siteUrl = "https://sti-dz.com";

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: loc === "ar" ? "الدعم الفني لفيفو الجزائر" : loc === "en" ? "VIVO Support Algeria" : "Support VIVO Algérie",
    url: `${siteUrl}/${loc}/vivo/support`,
    description: "Official VIVO customer service and technical support in Algeria by STI.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageSchema),
        }}
      />
      <VivoSupportPageClient />
    </>
  );
}
