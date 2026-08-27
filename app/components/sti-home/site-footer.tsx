"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Phone, Mail } from "lucide-react";
import { usePreferences } from "@/app/[locale]/preferences-context";

const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const NAV = [
  { label: "Accueil", href: "#accueil" },
  { label: "À propos", href: "#a-propos" },
  { label: "Nos univers", href: "#nos-espaces" },
  { label: "Nos services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export function SiteFooter() {
  const params = useParams();
  const currentLocale = (params?.locale as string) || "fr";
  const currentYear = new Date().getFullYear();

  const { preferences, phone, email, socialMedia, locationObj, activeLocation } = usePreferences();

  const companyName =
    preferences?.businessInfo?.companyName?.[currentLocale as "en" | "fr" | "ar"] ||
    preferences?.businessInfo?.companyName?.fr ||
    preferences?.businessInfo?.companyName?.en ||
    "SARL Smart Technologie Innovation";

  const displayLocation =
    activeLocation ||
    locationObj[currentLocale] ||
    locationObj.fr ||
    locationObj.en ||
    "Cité Ennasr, Bordj Bou Arréridj, Algérie";

  const displayPhone = phone || "+213 35 82 60 60";
  const displayEmail = email || "contact@sti-dz.com";

  const socials = [
    { icon: <LinkedinIcon />, label: "LinkedIn", href: socialMedia?.linkedin },
    { icon: <FacebookIcon />, label: "Facebook", href: socialMedia?.facebook },
    { icon: <TwitterIcon />, label: "Twitter", href: socialMedia?.twitter },
    { icon: <YoutubeIcon />, label: "YouTube", href: socialMedia?.youtube },
    { icon: <InstagramIcon />, label: "Instagram", href: socialMedia?.instagram },
  ].filter((s) => s.href && s.href.trim() !== "" && s.href !== "#");

  const OOREDOO_LINKS = [
    { label: "Accueil Ooredoo", href: `/${currentLocale}/ooredoo` },
    { label: "Solutions de distribution", href: `/${currentLocale}/ooredoo/solutions` },
    { label: "Produits & Cartes SIM", href: `/${currentLocale}/ooredoo/products` },
    { label: "À propos du partenariat", href: `/${currentLocale}/ooredoo/about` },
    { label: "Actualités & Guides", href: `/${currentLocale}/ooredoo/news` },
    { label: "Contacter l'équipe", href: `/${currentLocale}/ooredoo/contact` },
  ];

  const VIVO_LINKS = [
    { label: "Accueil VIVO", href: `/${currentLocale}/vivo` },
    { label: "Tous les smartphones", href: `/${currentLocale}/vivo/products` },
    { label: "Smartphones Série V", href: `/${currentLocale}/vivo/products/v-series` },
    { label: "Smartphones Série Y", href: `/${currentLocale}/vivo/products/y-series` },
    { label: "Trouver un point de vente", href: `/${currentLocale}/vivo/find-a-store` },
    { label: "À propos de VIVO Algérie", href: `/${currentLocale}/vivo/about` },
  ];

  return (
    <footer className="bg-gray-900 pt-20 pb-8 border-t border-gray-800 text-gray-400">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="grid gap-10 md:gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.1fr_1.1fr]">
          {/* Identity & Contact */}
          <div>
            <div className="mb-5 flex items-center gap-2.5">
              <a href="#accueil" className="inline-block transition-opacity hover:opacity-90">
                <Image
                  src="/assets/logo.png"
                  alt="STI - Smart Technologie Innovation"
                  width={180}
                  height={60}
                  className="h-12 w-auto brightness-0 invert opacity-90"
                />
              </a>
            </div>
            <p className="mb-2 font-semibold text-sm text-white">
              {companyName}
            </p>
            <p className="mb-5 max-w-sm text-xs leading-relaxed text-gray-400">
              Distributeur Agréé Ooredoo en Algérie &amp; Production et Distribution VIVO.
            </p>

            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-primary" aria-hidden="true" />
                <span>{displayLocation}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-red-primary" aria-hidden="true" />
                <a href={`tel:${displayPhone.replace(/\s+/g, "")}`} className="transition-colors hover:text-white">
                  {displayPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-red-primary" aria-hidden="true" />
                <a href={`mailto:${displayEmail}`} className="transition-colors hover:text-white">
                  {displayEmail}
                </a>
              </li>
            </ul>

            {socials.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-800 text-gray-400 transition-all duration-200 hover:bg-red-primary hover:text-white"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h3>
            <ul className="space-y-3 text-xs">
              {NAV.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Espace Ooredoo */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-red-400">
              Espace Ooredoo
            </h3>
            <ul className="space-y-3 text-xs">
              {OOREDOO_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Espace VIVO */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-blue-400">
              Espace VIVO
            </h3>
            <ul className="space-y-3 text-xs">
              {VIVO_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-center border-t border-gray-800 pt-8 text-xs text-gray-500 text-center">
          <p>© {currentYear} {companyName}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
