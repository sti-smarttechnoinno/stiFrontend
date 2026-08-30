import type { Metadata } from "next";
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import SolutionLayout from '@/app/components/solutions/detail/SolutionLayout';
import { fetchFromBackend } from '@/app/api/backend-helper';
import type { SolutionData } from "./data";

export const dynamic = "force-dynamic";

function getIllustrationType(slug: string): "recharge" | "sim" | "wholesale" | "retail" | "partnership" | "support" {
  const s = (slug || "").toLowerCase();
  if (s.includes("sim") || s.includes("card")) return "sim";
  if (s.includes("wholesale") || s.includes("bulk") || s.includes("gros")) return "wholesale";
  if (s.includes("retail") || s.includes("pos") || s.includes("point")) return "retail";
  if (s.includes("partner") || s.includes("business") || s.includes("b2b")) return "partnership";
  if (s.includes("support") || s.includes("help") || s.includes("service")) return "support";
  return "recharge";
}

function parseSolution(data: any, locale: string = "en"): SolutionData {
  const trans = data.translations?.[locale] || data.translations?.en || data.translations?.fr || data.translations?.ar || {};
  const enTrans = data.translations?.en || {};

  const rawDesc = trans.description || enTrans.description || data.description;
  const description: string[] = Array.isArray(rawDesc)
    ? rawDesc
    : typeof rawDesc === "string" && rawDesc.trim()
    ? [rawDesc]
    : ["Official STI Ooredoo Distribution Solution across Algeria."];

  const rawHighlights = trans.highlights || enTrans.highlights || data.highlights;
  const highlights: string[] | undefined = Array.isArray(rawHighlights) && rawHighlights.length > 0
    ? rawHighlights
    : undefined;

  const rawFeatures = trans.features || enTrans.features || data.features;
  const features = Array.isArray(rawFeatures) && rawFeatures.length > 0 ? rawFeatures : [];

  const rawBenefits = trans.benefits || enTrans.benefits || data.benefits;
  const benefits = Array.isArray(rawBenefits) && rawBenefits.length > 0 ? rawBenefits : [];

  const rawFaqs = trans.faqs || enTrans.faqs || data.faqs;
  const faqs = Array.isArray(rawFaqs) && rawFaqs.length > 0 ? rawFaqs : [];

  return {
    slug: data.slug,
    name: trans.name || data.name || data.slug,
    shortName: trans.shortName || trans.name || data.name || data.slug,
    badge: trans.badge || "Official Ooredoo Solution",
    title: trans.title || trans.name || data.name || data.slug,
    description,
    highlights,
    features,
    benefits,
    faqs,
    illustration: getIllustrationType(data.slug),
    translations: data.translations,
  };
}

async function fetchSolutionFromApi(slug: string, locale: string = "en"): Promise<SolutionData | undefined> {
  try {
    const res = await fetchFromBackend(`/solutions/${encodeURIComponent(slug)}`, { cache: "no-store" }, 8000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && (data.slug || data.id)) {
        return parseSolution(data, locale);
      }
    }
  } catch {}

  try {
    const listRes = await fetchFromBackend("/solutions", { cache: "no-store" }, 8000);
    if (listRes && listRes.ok) {
      const list = await listRes.json().catch(() => null);
      if (Array.isArray(list)) {
        const found = list.find((s: any) => s.slug === slug || String(s.id) === slug);
        if (found) {
          return parseSolution(found, locale);
        }
      }
    }
  } catch {}

  return undefined;
}

async function fetchRelatedSolutions(currentSlug: string, locale: string = "en"): Promise<SolutionData[]> {
  try {
    const res = await fetchFromBackend("/solutions", { cache: "no-store" }, 8000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        const published = data.filter((s: any) => (!s.status || s.status === "Published") && s.slug !== currentSlug);
        if (published.length > 0) {
          return published.map((s: any) => {
            const trans = s.translations?.[locale] || s.translations?.en || s.translations?.fr || s.translations?.ar || {};
            const rawDesc = trans.description || s.description;
            const description: string[] = Array.isArray(rawDesc)
              ? rawDesc
              : typeof rawDesc === "string" && rawDesc.trim()
              ? [rawDesc]
              : ["Official STI Ooredoo Distribution Solution"];

            return {
              slug: s.slug,
              name: trans.name || s.slug,
              shortName: trans.shortName || trans.name || s.slug,
              badge: trans.badge || "",
              title: trans.title || trans.name || s.slug,
              description,
              features: trans.features || [],
              benefits: trans.benefits || [],
              faqs: trans.faqs || [],
              illustration: getIllustrationType(s.slug),
              translations: s.translations,
            };
          });
        }
      }
    }
  } catch {}

  return [];
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const solution = await fetchSolutionFromApi(slug, locale);
  const title = solution?.name || `${slug} | STI Official Ooredoo Distributor Algeria`;
  const desc = solution?.description?.[0] || `Learn about STI solutions across Algeria.`;

  return {
    title,
    description: desc,
    alternates: { canonical: `/${locale}/solutions/${slug}` },
    openGraph: {
      title,
      description: desc,
      type: "website",
      locale: locale === "ar" ? "ar_DZ" : locale === "fr" ? "fr_DZ" : "en_US",
      siteName: "STI - Smart Technologie Innovation",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
    },
    keywords: [
      solution?.name || slug,
      "Ooredoo distributor Algeria",
      "telecom distribution Algeria",
      "official Ooredoo partner",
      "mobile recharge Algeria",
      "SIM cards Algeria",
      "wholesale telecom",
      "retail partner Algeria",
      "STI Algeria",
    ],
  };
}

export default async function SolutionPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const solution = await fetchSolutionFromApi(slug, locale);
  const related = await fetchRelatedSolutions(slug, locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: solution?.name || slug,
    description: solution?.description?.[0] || "",
    provider: {
      "@type": "Organization",
      name: "SARL Smart Technologie Innovation (STI)",
      url: "https://sti.dz",
    },
    serviceType: "Telecom Distribution",
    areaServed: {
      "@type": "Country",
      name: "Algeria",
    },
    url: `https://sti.dz/${locale}/solutions/${slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <SolutionLayout solution={solution} related={related} />
      <Footer />
    </>
  );
}