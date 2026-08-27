import type { Metadata } from "next";
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Hero from '@/app/components/solutions/Hero';
import SolutionsGrid from '@/app/components/solutions/SolutionsGrid';
import PartnerBenefits from '@/app/components/solutions/PartnerBenefits';
import FinalCTA from '@/app/components/FinalCTA';

export const metadata: Metadata = {
  title: "Telecom Distribution Solutions | STI - Official Ooredoo Distributor",
  description:
    "Explore STI's official Ooredoo mobile recharge credit and SIM card distribution solutions across Algeria. We provide fast delivery, bulk credit, wholesale pricing, and partner support for retailers and resellers.",
  keywords: [
    "Ooredoo Mobile Recharge Credit",
    "SIM Card Distribution Algeria",
    "Telecom Wholesaler Algeria",
    "Bulk Mobile Recharge",
    "Ooredoo Reseller Partner",
    "STI Distribution Solutions",
    "Telecom Retailer Supply",
  ],
  openGraph: {
    title: "Telecom Distribution Solutions | STI",
    description:
      "Official Ooredoo mobile recharge credit & prepaid SIM card distribution across Algeria. Partner solutions for retailers and wholesalers.",
    images: ["/assets/hero.png"],
    type: "website",
    siteName: "STI - Smart Technologie Innovation",
  },
  twitter: {
    card: "summary_large_image",
    title: "Telecom Distribution Solutions | STI",
    description:
      "Official Ooredoo mobile recharge credit & SIM card distribution solutions across Algeria.",
    images: ["/assets/hero.png"],
  },
};

export default function SolutionsPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <SolutionsGrid />
      <PartnerBenefits />
      <FinalCTA />
      <Footer />
    </>
  );
}