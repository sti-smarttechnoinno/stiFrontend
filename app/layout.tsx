import type { Metadata } from "next";
import "./globals.css";

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
    "VIVO",
    "VIVO Algeria",
    "vivo smartphones",
    "Distributeur Officiel VIVO",
    "telecom distributor Algeria",
    "mobile recharge",
    "SIM activation",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
