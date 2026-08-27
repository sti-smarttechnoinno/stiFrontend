import type { Metadata } from "next";
import "./vivo.css";

export const metadata: Metadata = {
  title: "vivo Algérie — Distributeur & Partenaire Officiel | STI",
  description:
    "Découvrez la gamme de smartphones vivo en Algérie : Série X, Série V, Série Y et accessoires officiels avec STI, distributeur officiel.",
  keywords: [
    "vivo Algérie",
    "vivo DZ",
    "smartphones vivo",
    "vivo X Series",
    "vivo V Series",
    "vivo Y Series",
    "Y21D",
    "distributeur officiel vivo",
    "STI vivo",
  ],
  openGraph: {
    title: "vivo Algérie — Distributeur & Partenaire Officiel",
    description:
      "Découvrez la précision et l'élégance des smartphones vivo en Algérie avec STI.",
    type: "website",
  },
};

export default function VivoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="vivo-showcase-root min-h-screen bg-[#f2f1ed] text-[#102039]">
      {children}
    </div>
  );
}
