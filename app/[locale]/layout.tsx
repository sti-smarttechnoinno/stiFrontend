import type { Metadata } from "next";
import Providers from "./providers";
import DirSetter from "./dir-setter";
import AnnouncementBar from "@/app/components/AnnouncementBar";
import { getAllSolutionsServer } from '@/app/data/solutions-server';
import { getAllProductsServer } from '@/app/data/products-server';
import { getAllPublishedArticlesServer, getFeaturedArticleServer } from '@/app/data/news-server';

export const metadata: Metadata = {
  title: "STI - Smart Technologie Innovation | Official Ooredoo & VIVO Distributor Algeria",
  description:
    "SARL Smart Technologie Innovation is the official authorized distributor for Ooredoo telecom solutions and VIVO smartphones in Algeria, providing wholesale mobile recharge distribution, SIM card activations, official VIVO phones with warranty, and enterprise digital solutions.",
  keywords: [
    "STI",
    "Smart Technologie Innovation",
    "SARL STI",
    "STI Algeria",
    "Ooredoo",
    "Ooredoo Algeria",
    "Distributeur Officiel Ooredoo",
    "telecom distributor Algeria",
    "mobile recharge",
    "SIM activation",
    "VIVO",
    "VIVO Algeria",
    "vivo smartphones",
    "Distributeur Officiel VIVO",
    "enterprise connectivity",
    "internet solutions",
    "router",
    "digital transformation",
  ],
  openGraph: {
    title: "STI - Smart Technologie Innovation | Official Ooredoo & VIVO Distributor",
    description:
      "Official authorized distributor for Ooredoo telecom and VIVO mobile smartphones in Algeria. Enterprise connectivity, wholesale distribution, and warranty support.",
    type: "website",
    locale: "fr_DZ",
    siteName: "STI - Smart Technologie Innovation",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Fetch initial datasets in parallel on the server from DB
  const [solutions, products, news, featuredArticle] = await Promise.all([
    getAllSolutionsServer(locale).catch(() => []),
    getAllProductsServer(locale).catch(() => []),
    getAllPublishedArticlesServer(locale).catch(() => []),
    getFeaturedArticleServer(locale).catch(() => null),
  ]);

  const initialData = {
    solutions,
    products,
    news,
    featuredArticleId: featuredArticle ? featuredArticle.id : null,
  };

  return (
    <>
      <DirSetter locale={locale} />
      <Providers locale={locale} initialData={initialData}>
        <AnnouncementBar />
        {children}
      </Providers>
    </>
  );
}