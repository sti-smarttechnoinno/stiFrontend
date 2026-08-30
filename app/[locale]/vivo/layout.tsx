import type { Metadata } from "next";
import "./vivo.css";
import { VivoFooter } from "@/app/components/vivo/VivoFooter";

export const metadata: Metadata = {
  title: {
    template: "%s | STI - Distributeur Officiel VIVO Algérie",
    default: "VIVO Algérie | Distributeur Officiel STI - Smartphones & SAV",
  },
  description:
    "Découvrez les smartphones VIVO officiels en Algérie avec SARL Smart Technologie Innovation (STI) : Séries V et Y, garantie constructeur, réseau de points de vente et service après-vente agréé.",
  keywords: [
    "STI",
    "Smart Technologie Innovation",
    "SARL STI",
    "vivo",
    "vivo Algérie",
    "vivo DZ",
    "smartphones vivo",
    "Distributeur Officiel vivo Algérie",
    "vivo V Series",
    "vivo Y Series",
    "vivo V40",
    "vivo V70 FE",
    "vivo Y28",
    "vivo Y21D",
    "vivo Y05",
    "Garantie Officielle vivo",
    "SAV vivo Algérie",
    "Boutique vivo Algérie",
    "Points de vente vivo Algérie",
    "Prix smartphone vivo Algérie",
  ],
  openGraph: {
    title: "VIVO Algérie | Distributeur Officiel STI",
    description:
      "Découvrez la précision et l'élégance des smartphones vivo en Algérie avec STI, partenaire et distributeur officiel.",
    type: "website",
    siteName: "VIVO Algérie · STI Official Partner",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function VivoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="vivo-showcase-root min-h-screen bg-[#f2f1ed] text-[#102039] flex flex-col justify-between">
      <div className="flex-1">
        {children}
      </div>
      <VivoFooter />
    </div>
  );
}
