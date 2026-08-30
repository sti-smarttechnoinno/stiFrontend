import type { Metadata } from "next";
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import NewsHero from '@/app/components/news/NewsHero';
import FeaturedArticle from '@/app/components/news/FeaturedArticle';
import NewsGrid from '@/app/components/news/NewsGrid';
import CategoryCards from '@/app/components/news/CategoryCards';
import NewsletterSection from '@/app/components/news/NewsletterSection';
import FinalCTA from '@/app/components/FinalCTA';

export const metadata: Metadata = {
  title: "News & Updates | STI Official Ooredoo Distributor Algeria",
  description:
    "Stay informed with the latest news, official announcements, product updates, wholesale promotions, and partnership opportunities from SARL Smart Technologie Innovation (STI), the official Ooredoo distributor in Algeria.",
  keywords: [
    "STI News",
    "Ooredoo Algeria News",
    "Mobile Recharge Updates",
    "Prepaid SIM Cards Algeria",
    "Telecom Distribution News",
    "Official Ooredoo Distributor",
    "Wholesale Telecom Algeria",
    "Retail Partner Updates",
    "STI Announcements",
    "Telecom Industry Algeria",
  ],
  openGraph: {
    title: "News & Updates | STI Official Ooredoo Distributor Algeria",
    description:
      "Stay informed with the latest news, official announcements, product updates, wholesale promotions, and partnership opportunities from STI Algeria.",
    images: ["/assets/hero.webp"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "News & Updates | STI Official Ooredoo Distributor Algeria",
    description:
      "Stay informed with the latest news, official announcements, product updates, wholesale promotions, and partnership opportunities from STI Algeria.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://sti.dz/news",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SARL Smart Technologie Innovation",
  alternateName: "STI",
  url: "https://sti.dz",
  logo: "https://sti.dz/logo.png",
  description:
    "Official Ooredoo distributor specializing in mobile recharge credit and prepaid SIM card distribution across Algeria.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "DZ",
  },
};

const newsArticleSchema = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: "STI Expands Distribution Services Across Algeria",
  description:
    "SARL Smart Technologie Innovation continues strengthening its distribution capabilities, ensuring retailers and business partners receive reliable access to official Ooredoo mobile recharge credit and prepaid SIM cards throughout Algeria.",
  author: {
    "@type": "Organization",
    name: "STI Team",
  },
  publisher: {
    "@type": "Organization",
    name: "SARL Smart Technologie Innovation",
    logo: {
      "@type": "ImageObject",
      url: "https://sti.dz/logo.png",
    },
  },
  datePublished: "2026-05-20",
  dateModified: "2026-05-20",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://sti.dz/news/sti-expands-distribution",
  },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "News & Updates",
  description:
    "Latest news, announcements, and updates from SARL Smart Technologie Innovation (STI), official Ooredoo distributor in Algeria.",
  url: "https://sti.dz/news",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: 6,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        url: "https://sti.dz/news/sti-opens-new-regional-distribution-center",
      },
      {
        "@type": "ListItem",
        position: 2,
        url: "https://sti.dz/news/new-ooredoo-recharge-options",
      },
      {
        "@type": "ListItem",
        position: 3,
        url: "https://sti.dz/news/growing-our-retail-partner-network",
      },
    ],
  },
};

export default function NewsPage() {
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
          __html: JSON.stringify(newsArticleSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />
      <Navbar />
      <main>
        <NewsHero />
        <FeaturedArticle />
        <NewsGrid />
        <CategoryCards />
        <NewsletterSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}