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
  type: string;
  experience: string;
  description: string;
  salary: string;
  status: string;
}

async function fetchJobs(): Promise<JobFromApi[]> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/jobs?status=Published`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {}

  try {
    const res = await fetch("http://localhost:3000/api/jobs?status=Published", {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
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

  const jobPostingSchemas = jobs.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: "2026-05-20",
    validThrough: "2026-12-31",
    employmentType: job.type === "Full-time" ? "FULL_TIME" : job.type === "Part-time" ? "PART_TIME" : "CONTRACT",
    hiringOrganization: {
      "@type": "Organization",
      name: "SARL Smart Technologie Innovation",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "DZ",
      },
    },
  }));

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
