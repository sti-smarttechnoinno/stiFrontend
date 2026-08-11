import type { Metadata } from "next";
import Providers from "./providers";
import DirSetter from "./dir-setter";

export const metadata: Metadata = {
  title: "STI - Smart Technologie Innovation | Official Ooredoo Distributor Algeria",
  description:
    "SARL Smart Technologie Innovation is the official Ooredoo distributor in Algeria, providing mobile recharge distribution, SIM activation, enterprise connectivity, internet solutions, routers, and digital transformation services.",
  keywords: [
    "Ooredoo Algeria",
    "STI",
    "Smart Technologie Innovation",
    "telecom distributor Algeria",
    "mobile recharge",
    "SIM activation",
    "enterprise connectivity",
    "internet solutions",
    "router",
    "digital transformation",
  ],
  openGraph: {
    title: "STI - Smart Technologie Innovation | Official Ooredoo Distributor",
    description:
      "Official Ooredoo distributor in Algeria. Enterprise connectivity, mobile solutions, and digital transformation.",
    type: "website",
    locale: "en_US",
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
  const dir = locale === "ar" ? "rtl" : "ltr";
  
  return (
    <>
      <DirSetter locale={locale} />
      <Providers locale={locale}>{children}</Providers>
    </>
  );
}