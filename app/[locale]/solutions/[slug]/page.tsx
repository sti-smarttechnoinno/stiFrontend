import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import SolutionLayout from "../../../components/solutions/detail/SolutionLayout";
import { solutions, getSolutionBySlug, getRelatedSolutions } from "./data";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const LOCALES = ["en", "fr", "ar"];

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    solutions.map((s) => ({ locale, slug: s.slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) return {};

  return {
    title: `${solution.name} | STI Official Ooredoo Distributor Algeria`,
    description: `Learn about STI's ${solution.name} for retailers, wholesalers, and business partners across Algeria. Official Ooredoo distributor providing reliable telecom products and professional support.`,
    alternates: { canonical: `/solutions/${slug}` },
    openGraph: {
      title: `${solution.name} | STI Official Ooredoo Distributor Algeria`,
      description: `Learn about STI's ${solution.name} for retailers, wholesalers, and business partners across Algeria. Official Ooredoo distributor providing reliable telecom products and professional support.`,
      type: "website",
      locale: "en_US",
      siteName: "STI - Smart Technologie Innovation",
    },
    twitter: {
      card: "summary_large_image",
      title: `${solution.name} | STI Official Ooredoo Distributor Algeria`,
      description: `Learn about STI's ${solution.name} for retailers, wholesalers, and business partners across Algeria. Official Ooredoo distributor providing reliable telecom products and professional support.`,
    },
    keywords: [
      solution.name,
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
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) notFound();

  const related = getRelatedSolutions(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: solution.name,
    description: solution.description[0],
    provider: {
      "@type": "Organization",
      name: "SARL Smart Technologie Innovation (STI)",
      url: "https://sti-dz.com",
    },
    serviceType: "Telecom Distribution",
    areaServed: {
      "@type": "Country",
      name: "Algeria",
    },
    url: `/solutions/${slug}`,
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