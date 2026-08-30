import type { Metadata } from "next";
import { Hero } from "@/app/components/sti-home/hero";
import { TrustStrip } from "@/app/components/sti-home/trust-strip";
import { OoredooSection } from "@/app/components/sti-home/ooredoo-section";
import { VivoSection } from "@/app/components/sti-home/vivo-section";
import { ServicesSection } from "@/app/components/sti-home/services-section";
import { WhySti } from "@/app/components/sti-home/why-sti";
import { SpacesNav } from "@/app/components/sti-home/spaces-nav";
import { FaqSection } from "@/app/components/sti-home/faq-section";
import { ContactCta } from "@/app/components/sti-home/contact-cta";
import { SiteFooter } from "@/app/components/sti-home/site-footer";

interface PageParams {
  locale: string;
}

const SEO_CONTENT = {
  fr: {
    title: "STI - Smart Technologie Innovation | Distributeur Officiel Ooredoo & VIVO Algérie",
    description:
      "SARL Smart Technologie Innovation (STI) est le distributeur officiel agréé Ooredoo et VIVO en Algérie. Solutions télécoms, recharge de gros, puces SIM, smartphones VIVO officiels avec garantie constructeur, et services pour entreprises.",
    keywords: [
      "STI",
      "Smart Technologie Innovation",
      "SARL STI",
      "STI Algérie",
      "Ooredoo",
      "Ooredoo Algérie",
      "Distributeur Officiel Ooredoo",
      "Recharge Ooredoo Gros",
      "Cartes SIM Ooredoo",
      "Solutions Télécom Entreprise",
      "VIVO",
      "VIVO Algérie",
      "Smartphones VIVO",
      "Distributeur Officiel VIVO",
      "VIVO V Series",
      "VIVO Y Series",
      "Garantie VIVO Algérie",
      "SAV VIVO Algérie",
      "Grossiste Téléphonie Algérie",
      "Distribution Télécom Algérie",
      "Bordj Bou Arreridj",
      "Alger",
    ],
    ogTitle: "STI - Distributeur Officiel Ooredoo & VIVO en Algérie",
    ogDescription:
      "Partenaire officiel des leaders des télécoms et des technologies mobiles en Algérie. Solutions Ooredoo et smartphones VIVO pour professionnels et particuliers.",
  },
  ar: {
    title: "STI سمارت تكنولوجي إنوفايشن | الموزع الرسمي المعتمد لأوريدو و فيفو في الجزائر",
    description:
      "شركة SARL Smart Technologie Innovation (STI) الموزع الرسمي المعتمد لشركة أوريدو (Ooredoo) وهواتف فيفو (vivo) في الجزائر. توزيع رصيد الشحن، شرائح SIM، أحدث هواتف فيفو بضمان رسمي، وحلول المؤسسات.",
    keywords: [
      "STI",
      "سمارت تكنولوجي إنوفايشن",
      "شركة STI الجزائر",
      "مؤسسة STI",
      "أوريدو",
      "أوريدو الجزائر",
      "Ooredoo",
      "موزع رسمي أوريدو",
      "رصيد شحن أوريدو جملة",
      "شرائح أوريدو",
      "حلول أوريدو للشركات والمؤسسات",
      "فيفو",
      "فيفو الجزائر",
      "vivo",
      "vivo Algeria",
      "هواتف فيفو",
      "موزع رسمي فيفو الجزائر",
      "سلسلة vivo V",
      "سلسلة vivo Y",
      "ضمان فيفو الجزائر",
      "خدمة ما بعد البيع فيفو",
      "توزيع الاتصالات في الجزائر",
      "تجارة الهواتف بالجملة",
      "برج بوعريريج",
      "الجزائر",
    ],
    ogTitle: "STI - الموزع الرسمي المعتمد لأوريدو و فيفو في الجزائر",
    ogDescription:
      "الشريك الرسمي الرائد في قطاع الاتصالات والهواتف الذكية بالجزائر. خدمات أوريدو الشاملة وهواتف فيفو الأصلية مع ضمان معتمد.",
  },
  en: {
    title: "STI - Smart Technologie Innovation | Official Ooredoo & VIVO Distributor Algeria",
    description:
      "SARL Smart Technologie Innovation (STI) is the official authorized distributor for Ooredoo telecom solutions and VIVO smartphones in Algeria. Wholesale recharge credit, SIM cards, official VIVO phones with manufacturer warranty, and enterprise digital solutions.",
    keywords: [
      "STI",
      "Smart Technologie Innovation",
      "SARL STI",
      "STI Algeria",
      "Ooredoo",
      "Ooredoo Algeria",
      "Official Ooredoo Distributor",
      "Ooredoo Wholesale Recharge",
      "Ooredoo SIM Cards",
      "Enterprise Connectivity",
      "VIVO",
      "VIVO Algeria",
      "vivo smartphones",
      "Official VIVO Distributor",
      "VIVO V Series",
      "VIVO Y Series",
      "VIVO Official Warranty",
      "VIVO Service Center Algeria",
      "Telecom Distributor Algeria",
      "Wholesale Mobile Distribution",
      "Bordj Bou Arreridj",
      "Algiers",
    ],
    ogTitle: "STI - Official Ooredoo & VIVO Distributor Algeria",
    ogDescription:
      "Official partner and authorized distributor for Ooredoo telecom and VIVO mobile technologies in Algeria. B2B and retail solutions.",
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
  const canonicalUrl = `${siteUrl}/${loc}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${siteUrl}/fr`,
        ar: `${siteUrl}/ar`,
        en: `${siteUrl}/en`,
        "x-default": `${siteUrl}/fr`,
      },
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: canonicalUrl,
      siteName: "STI - Smart Technologie Innovation",
      locale: loc === "ar" ? "ar_DZ" : loc === "en" ? "en_US" : "fr_DZ",
      type: "website",
      images: [
        {
          url: `${siteUrl}/assets/logo.png`,
          width: 800,
          height: 600,
          alt: "STI - Smart Technologie Innovation (Ooredoo & VIVO Official Distributor)",
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
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  const loc = (locale as "en" | "ar" | "fr") || "fr";
  const siteUrl = "https://sti.dz";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Corporation",
    name: "SARL Smart Technologie Innovation",
    alternateName: ["STI", "Smart Technologie Innovation", "STI Algérie", "سمارت تكنولوجي إنوفايشن"],
    url: siteUrl,
    logo: `${siteUrl}/assets/logo.png`,
    description:
      loc === "ar"
        ? "شركة SARL Smart Technologie Innovation الموزع الرسمي المعتمد لشركة أوريدو وهواتف فيفو في الجزائر."
        : loc === "en"
        ? "SARL Smart Technologie Innovation is the official authorized distributor for Ooredoo and VIVO in Algeria."
        : "SARL Smart Technologie Innovation est le distributeur officiel agréé Ooredoo et VIVO en Algérie.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "02, Rue de la Paix, Centre Ville",
      addressLocality: "Bordj Bou Arreridj",
      addressRegion: "Bordj Bou Arreridj",
      postalCode: "34000",
      addressCountry: "DZ",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+213-35-82-60-60",
        contactType: "customer service",
        areaServed: "DZ",
        availableLanguage: ["French", "Arabic", "English"],
      },
    ],
    brand: [
      {
        "@type": "Brand",
        name: "Ooredoo",
        description: "Official telecom solutions and mobile distribution in Algeria.",
      },
      {
        "@type": "Brand",
        name: "vivo",
        description: "Official smartphones and authorized customer service in Algeria.",
      },
    ],
    knowsAbout: [
      "Telecom Distribution",
      "Ooredoo Algeria",
      "vivo Smartphones",
      "Mobile Recharge Wholesale",
      "SIM Card Activation",
      "Enterprise Telecom Solutions",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "STI - Smart Technologie Innovation",
    url: siteUrl,
    inLanguage: [
      { "@type": "Language", name: "French", alternateName: "fr" },
      { "@type": "Language", name: "Arabic", alternateName: "ar" },
      { "@type": "Language", name: "English", alternateName: "en" },
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/${loc}/vivo/products?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <main className="min-h-screen bg-background pt-9">
        <Hero />
        <TrustStrip />
        <OoredooSection />
        <VivoSection />
        <ServicesSection />
        <WhySti />
        <SpacesNav />
        <FaqSection />
        <ContactCta />
        <SiteFooter />
      </main>
    </>
  );
}

