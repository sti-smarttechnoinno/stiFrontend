"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import HeroSolution from "./HeroSolution";
import { FeaturesSection } from "./FeatureCard";
import SolutionTimeline from "./SolutionTimeline";
import RelatedCard from "./RelatedCard";
import FAQAccordion from "./FAQAccordion";
import FinalCTA from "../../FinalCTA";
import SolutionDetailSkeleton from "./SolutionSkeleton";
import { useTranslations } from '@/app/[locale]/use-translations';
import type { SolutionData } from "@/app/[locale]/ooredoo/solutions/[slug]/data";

interface Props {
  solution?: SolutionData;
  related?: SolutionData[];
}

interface ApiSolutionItem {
  id: number;
  slug: string;
  status?: string;
  image?: string;
  translations?: {
    en?: { name: string; shortName: string; badge: string; title?: string; description: string[]; highlights: string[]; features: any[]; benefits: any[]; faqs: any[] };
    ar?: { name: string; shortName: string; badge: string; title?: string; description: string[]; highlights: string[]; features: any[]; benefits: any[]; faqs: any[] };
    fr?: { name: string; shortName: string; badge: string; title?: string; description: string[]; highlights: string[]; features: any[]; benefits: any[]; faqs: any[] };
  };
}

function getIllustrationType(slug: string): "recharge" | "sim" | "wholesale" | "retail" | "partnership" | "support" {
  const s = (slug || "").toLowerCase();
  if (s.includes("sim") || s.includes("card")) return "sim";
  if (s.includes("wholesale") || s.includes("bulk") || s.includes("gros")) return "wholesale";
  if (s.includes("retail") || s.includes("pos") || s.includes("point")) return "retail";
  if (s.includes("partner") || s.includes("business") || s.includes("b2b")) return "partnership";
  if (s.includes("support") || s.includes("help") || s.includes("service")) return "support";
  return "recharge";
}

export default function SolutionLayout({ solution: initialSolution, related: initialRelated }: Props) {
  const pathname = usePathname();
  const t = useTranslations();
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = (segments[0] === "ar" || segments[0] === "fr" || segments[0] === "en" ? segments[0] : "en") as "en" | "ar" | "fr";
  const slugFromUrl = segments[segments.length - 1] || "";

  const [activeSolution, setActiveSolution] = useState<SolutionData | null>(initialSolution || null);
  const [otherSolutions, setOtherSolutions] = useState<SolutionData[]>(
    initialRelated && initialSolution ? initialRelated.filter((r) => r.slug !== initialSolution.slug) : []
  );
  const [loading, setLoading] = useState(!initialSolution);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    if (initialSolution) {
      setActiveSolution(initialSolution);
      setOtherSolutions(initialRelated ? initialRelated.filter((r) => r.slug !== initialSolution.slug) : []);
      setLoading(false);
    }
  }, [initialSolution, initialRelated]);

  useEffect(() => {
    let isMounted = true;

    async function fetchDatabaseSolutions() {
      try {
        const res = await fetch("/api/solutions");
        if (res.ok && isMounted) {
          const apiData: ApiSolutionItem[] = await res.json();
          if (Array.isArray(apiData) && apiData.length > 0) {
            const published = apiData.filter((s) => !s.status || s.status === "Published");
            const targetSlug = initialSolution?.slug || slugFromUrl;

            const dbMatch = published.find((s) => s.slug === targetSlug);
            if (dbMatch && isMounted) {
              const langContent = dbMatch.translations?.[currentLocale] || dbMatch.translations?.en || dbMatch.translations?.fr || dbMatch.translations?.ar;
              const enContent = dbMatch.translations?.en;

              if (langContent) {
                const finalFeatures = (langContent.features && langContent.features.length > 0)
                  ? langContent.features
                  : (enContent?.features && enContent.features.length > 0)
                  ? enContent.features
                  : initialSolution?.features;

                const finalBenefits = (langContent.benefits && langContent.benefits.length > 0)
                  ? langContent.benefits
                  : (enContent?.benefits && enContent.benefits.length > 0)
                  ? enContent.benefits
                  : initialSolution?.benefits;

                const finalFaqs = (langContent.faqs && langContent.faqs.length > 0)
                  ? langContent.faqs
                  : (enContent?.faqs && enContent.faqs.length > 0)
                  ? enContent.faqs
                  : initialSolution?.faqs;

                setActiveSolution({
                  slug: dbMatch.slug,
                  name: langContent.name || initialSolution?.name || dbMatch.slug,
                  shortName: langContent.shortName || initialSolution?.shortName || dbMatch.slug,
                  badge: langContent.badge || initialSolution?.badge || "Official Ooredoo Solution",
                  title: langContent.title || langContent.name || initialSolution?.title || dbMatch.slug,
                  description: langContent.description?.length ? langContent.description : (initialSolution?.description || ["Official STI Ooredoo Distribution Solution"]),
                  highlights: langContent.highlights?.length ? langContent.highlights : initialSolution?.highlights,
                  features: finalFeatures || [],
                  benefits: finalBenefits || [],
                  faqs: finalFaqs || [],
                  illustration: getIllustrationType(dbMatch.slug),
                });
                setIsNotFound(false);
                setLoading(false);
              }
            } else if (!initialSolution && isMounted) {
              setIsNotFound(true);
              setLoading(false);
            }

            const dbOthers = published
              .filter((s) => s.slug !== targetSlug)
              .map((s) => {
                const lang = s.translations?.[currentLocale] || s.translations?.en || s.translations?.fr || s.translations?.ar;
                return {
                  slug: s.slug,
                  name: lang?.name || s.slug,
                  shortName: lang?.shortName || lang?.name || s.slug,
                  badge: lang?.badge || "",
                  title: lang?.title || lang?.name || s.slug,
                  description: Array.isArray(lang?.description) ? lang.description : [lang?.description || "Distribution Solution"],
                  features: lang?.features || [],
                  benefits: lang?.benefits || [],
                  faqs: lang?.faqs || [],
                  illustration: getIllustrationType(s.slug),
                };
              });

            if (dbOthers.length > 0 && isMounted) {
              setOtherSolutions(dbOthers);
            }
          }
        }
      } catch {
        if (!initialSolution && isMounted) {
          setIsNotFound(true);
          setLoading(false);
        }
      }
    }

    fetchDatabaseSolutions();

    return () => {
      isMounted = false;
    };
  }, [initialSolution?.slug, currentLocale, slugFromUrl]);

  if (loading) {
    return <SolutionDetailSkeleton />;
  }

  if (isNotFound || !activeSolution) {
    return (
      <main className="py-36 text-center bg-white min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Solution Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          The solution you are looking for does not exist or has been moved.
        </p>
        <Link
          href={`/${currentLocale}/ooredoo/solutions`}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-red-primary text-white font-medium hover:bg-red-700 transition"
        >
          Explore All Solutions
        </Link>
      </main>
    );
  }

  return (
    <main>
      <HeroSolution
        badge={activeSolution.badge}
        title={activeSolution.title}
        description={activeSolution.description}
        highlights={activeSolution.highlights}
        illustration={activeSolution.illustration}
      />

      <FeaturesSection features={activeSolution.features} />

      <SolutionTimeline />

      <section className="py-20 sm:py-28 lg:py-36 bg-gray-50">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="mb-12 sm:mb-16 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
              {(t as any).solutionDetail?.other_solutions_badge || "Solutions"}
            </span>
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-manrope)" }}>
              {(t as any).solutionDetail?.other_solutions_title || "Explore Other Solutions"}
            </h2>
            <p className="mx-auto max-w-xl text-sm sm:text-base text-gray-500">
              {(t as any).solutionDetail?.other_solutions_subtitle || "Discover other STI distribution solutions tailored for your business"}
            </p>
          </div>
          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {otherSolutions.map((r) => (
              <RelatedCard key={r.slug} slug={r.slug} title={r.shortName || r.name} description={r.description[0]} />
            ))}
          </div>
        </div>
      </section>

      <FAQAccordion faqs={activeSolution.faqs} />

      <FinalCTA />
    </main>
  );
}
