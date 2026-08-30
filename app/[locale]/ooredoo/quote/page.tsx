import type { Metadata } from "next";
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import QuoteHero from '@/app/components/quote/QuoteHero';
import QuoteProcess from '@/app/components/quote/QuoteProcess';
import QuoteRequestForm from '@/app/components/quote/QuoteRequestForm';
import PartnerAdvantages from '@/app/components/quote/PartnerAdvantages';
import FAQAccordion from '@/app/components/quote/FAQAccordion';
import FinalCTA from '@/app/components/FinalCTA';

export const metadata: Metadata = {
  title: "Request a Quote | STI Official Ooredoo Distributor Algeria",
  description:
    "Request a personalized quotation from SARL Smart Technologie Innovation (STI), the official Ooredoo distributor in Algeria. Get competitive pricing for mobile recharge credit, prepaid SIM cards, wholesale solutions, and business partnerships.",
  keywords: [
    "STI",
    "Ooredoo Distributor",
    "Request Quote Algeria",
    "Mobile Recharge Credit",
    "Prepaid SIM Cards",
    "Wholesale Distribution",
    "Business Quote Algeria",
    "Telecom Wholesale",
  ],
  openGraph: {
    title: "Request a Quote | STI Official Ooredoo Distributor Algeria",
    description:
      "Request a personalized quotation from SARL Smart Technologie Innovation (STI), the official Ooredoo distributor in Algeria.",
    images: ["/assets/hero.webp"],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function QuotePage() {
  return (
    <>
      <Navbar />
      <main>
        <QuoteHero />
        <QuoteProcess />
        <QuoteRequestForm />
        <PartnerAdvantages />
        <FAQAccordion />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}