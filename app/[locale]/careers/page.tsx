import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CareerHero from "../../components/careers/CareerHero";
import WhyJoin from "../../components/careers/WhyJoin";
import CompanyCulture from "../../components/careers/CompanyCulture";
import JobSearch from "../../components/careers/JobSearch";
import RecruitmentTimeline from "../../components/careers/RecruitmentTimeline";
import ApplicationForm from "../../components/careers/ApplicationForm";
import CareerFAQ from "../../components/careers/CareerFAQ";
import FinalCTA from "../../components/FinalCTA";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:8000/api";

export const metadata: Metadata = {
  title: "Careers | Join STI Official Ooredoo Distributor Algeria",
  description:
    "Explore career opportunities at SARL Smart Technologie Innovation (STI). Join our growing team and build your future with an official Ooredoo distributor specializing in mobile recharge credit and prepaid SIM card distribution across Algeria.",
  keywords: [
    "Careers STI",
    "Jobs Algeria",
    "Ooredoo Distributor Jobs",
    "Telecom Careers Algeria",
    "Sales Jobs Algeria",
    "Warehouse Jobs Algeria",
    "Customer Support Jobs",
    "Distribution Careers",
    "Apply for Jobs Algeria",
    "STI Recruitment",
  ],
  openGraph: {
    title: "Careers | Join STI Official Ooredoo Distributor Algeria",
    description:
      "Explore career opportunities at SARL Smart Technologie Innovation (STI). Join our growing team and build your future with an official Ooredoo distributor.",
    images: ["/assets/hero.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | Join STI Official Ooredoo Distributor Algeria",
    description:
      "Explore career opportunities at SARL Smart Technologie Innovation (STI). Join our growing team.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://sti-dz.com/careers",
  },
};

interface JobFromApi {
  id: number | string;
  title: string;
  slug: string;
  department: string;
  location: string;
  street_address?: string;
  streetAddress?: string;
  address_region?: string;
  addressRegion?: string;
  postal_code?: string;
  postalCode?: string;
  type: string;
  experience: string;
  description: string;
  salary: string;
  status: string;
  translations?: Record<string, any>;
}

async function fetchJobs(): Promise<JobFromApi[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${BACKEND_API_URL}/jobs?status=Published`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        return data.filter((j: JobFromApi) => j.status === "Published");
      }
    }
  } catch {}

  return [];
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SARL Smart Technologie Innovation",
  alternateName: "STI",
  url: "https://sti-dz.com",
  logo: "https://sti-dz.com/logo.png",
  description:
    "Official Ooredoo distributor specializing in mobile recharge credit and prepaid SIM card distribution across Algeria.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "DZ",
  },
};

export default async function CareersPage() {
  const jobs = await fetchJobs();

  const jobPostingSchemas = jobs.map((job) => {
    const locality = job.location && job.location.trim() ? job.location.trim() : "Oran";
    const streetAddress =
      job.street_address ||
      job.streetAddress ||
      (job.translations?.en?.streetAddress as string) ||
      "Siège Social SARL Smart Technologie Innovation";
    const addressRegion =
      job.address_region ||
      job.addressRegion ||
      (job.translations?.en?.addressRegion as string) ||
      locality;
    const postalCode =
      job.postal_code ||
      job.postalCode ||
      (job.translations?.en?.postalCode as string) ||
      "31000";

    const safeTitle = job.title && job.title.trim() ? job.title.trim() : "Offre d'emploi chez STI";
    const safeDescription =
      job.description && job.description.trim()
        ? job.description.trim()
        : `<p>Rejoignez l'équipe de SARL Smart Technologie Innovation (STI), distributeur officiel Ooredoo en Algérie. Poste basé à ${locality}.</p>`;

    return {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: safeTitle,
      description: safeDescription,
      datePosted: "2026-05-20",
      validThrough: "2026-12-31",
      employmentType:
        job.type === "Full-time" || job.type === "Temps plein"
          ? "FULL_TIME"
          : job.type === "Part-time" || job.type === "Temps partiel"
          ? "PART_TIME"
          : "CONTRACT",
      directApply: true,
      hiringOrganization: {
        "@type": "Organization",
        name: "SARL Smart Technologie Innovation",
        sameAs: "https://sti-dz.com",
        logo: "https://sti-dz.com/logo.png",
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          streetAddress,
          addressLocality: locality,
          addressRegion,
          postalCode,
          addressCountry: "DZ",
        },
      },
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      {jobPostingSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
      <Navbar />
      <main>
        <CareerHero />
        <WhyJoin />
        <CompanyCulture />
        <JobSearch />
        <RecruitmentTimeline />
        <ApplicationForm />
        <CareerFAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
