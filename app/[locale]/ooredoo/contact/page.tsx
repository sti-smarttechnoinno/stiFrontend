import type { Metadata } from "next";
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import FinalCTA from '@/app/components/FinalCTA';
import HeroContact from '@/app/components/contact/HeroContact';
import ContactCards from '@/app/components/contact/ContactCards';
import ContactForm from '@/app/components/contact/ContactForm';
import BusinessInfoCard from '@/app/components/contact/BusinessInfoCard';
import BusinessHoursCard from '@/app/components/contact/BusinessHoursCard';
import FAQAccordion from '@/app/components/contact/FAQAccordion';
import GoogleMapCard from '@/app/components/contact/GoogleMapCard';

export const metadata: Metadata = {
  title: "Contact STI | Official Ooredoo Distributor in Algeria",
  description:
    "Contact SARL Smart Technologie Innovation (STI), the official Ooredoo distributor in Algeria. Get assistance with mobile recharge credit, prepaid SIM cards, wholesale solutions, retail partnerships, and business support.",
  keywords: [
    "STI Contact",
    "Ooredoo Distributor Algeria",
    "Mobile Recharge Credit Algeria",
    "Prepaid SIM Card Distributor",
    "Wholesale Telecom Algeria",
    "Retail Partner Ooredoo",
    "Business Support STI",
    "Telecom Distribution Algeria",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact STI | Official Ooredoo Distributor in Algeria",
    description:
      "Contact SARL Smart Technologie Innovation (STI), the official Ooredoo distributor in Algeria. Get assistance with mobile recharge credit, prepaid SIM cards, wholesale solutions, and business support.",
    type: "website",
    locale: "en_US",
    siteName: "STI - Smart Technologie Innovation",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact STI | Official Ooredoo Distributor in Algeria",
    description:
      "Contact SARL Smart Technologie Innovation (STI), the official Ooredoo distributor in Algeria.",
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SARL Smart Technologie Innovation (STI)",
    url: "https://sti.dz",
    logo: "https://sti.dz/assets/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+213-XXX-XX-XX-XX",
      contactType: "customer service",
      areaServed: "DZ",
      availableLanguage: ["French", "Arabic", "English"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sétif",
      addressCountry: "DZ",
    },
    email: "contact@sti.dz",
    telephone: "+213-XXX-XX-XX-XX",
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"], opens: "08:00", closes: "17:00" },
    ],
    sameAs: ["https://linkedin.com/company/sti", "https://facebook.com/sti", "https://instagram.com/sti", "https://youtube.com/sti"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <HeroContact />
        <ContactCards />

        {/* Contact Form + Business Info & Hours */}
        <section id="contact-form" className="py-28 lg:py-36 bg-white">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
            {/* Form */}
            <div className="max-w-4xl mx-auto mb-12">
              <ContactForm />
            </div>

            {/* Business Information + Business Hours at the bottom */}
            <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
              <BusinessInfoCard />
              <BusinessHoursCard />
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="py-0 bg-white">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
            <GoogleMapCard />
          </div>
        </section>

        {/* FAQ Section (matches homepage FAQ UI) */}
        <FAQAccordion />

        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}