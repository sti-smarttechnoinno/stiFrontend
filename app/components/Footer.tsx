"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin } from "lucide-react";
import { useTranslations } from "../[locale]/use-translations";
import { formatBusinessHours } from "../utils/formatHours";

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("contact@sti.dz");
  const [socialMedia, setSocialMedia] = useState<{ linkedin?: string; facebook?: string; twitter?: string; youtube?: string }>({});
  const [locationObj, setLocationObj] = useState<{ [key: string]: string }>({
    en: "Lot 24, Zone Industrielle, Bab Ezzouar, Algiers, Algeria",
    ar: "المنطقة الصناعية رقم 24، باب الزوار، الجزائر العاصمة",
    fr: "Lot 24, Zone Industrielle, Bab Ezzouar, Alger, Algérie",
  });
  const [workingHoursObj, setWorkingHoursObj] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch("/api/preferences")
      .then((res) => res.json())
      .then((data) => {
        if (data.phone) setPhone(data.phone);
        if (data.email) setEmail(data.email);
        if (data.socialMedia) setSocialMedia(data.socialMedia);
        if (data.address && typeof data.address === "object") {
          setLocationObj(data.address);
        }
        if (data.location && typeof data.location === "object") {
          setLocationObj(data.location);
        }
        if (data.businessHours) {
          const hoursText = formatBusinessHours(data.businessHours, currentLocale, t.nav.phone_hours);
          setWorkingHoursObj((prev) => ({ ...prev, [currentLocale]: hoursText }));
        } else if (data.workingHours && typeof data.workingHours === "object") {
          setWorkingHoursObj(data.workingHours);
        }
      })
      .catch(() => {});
  }, [currentLocale]);

  const activeWorkingHours = workingHoursObj[currentLocale] || workingHoursObj.en || t.nav.phone_hours;
  const activeLocation = locationObj[currentLocale] || locationObj.en || "Lot 24, Zone Industrielle, Bab Ezzouar, Algiers, Algeria";

  const socials = [
    { icon: <LinkedinIcon />, href: socialMedia.linkedin, label: "LinkedIn" },
    { icon: <FacebookIcon />, href: socialMedia.facebook, label: "Facebook" },
    { icon: <TwitterIcon />, href: socialMedia.twitter, label: "Twitter" },
    { icon: <YoutubeIcon />, href: socialMedia.youtube, label: "YouTube" },
  ].filter((s) => s.href && s.href.trim() !== "" && s.href !== "#");

  const linkLabels = {
    en: {
      about: "About Us",
      careers: "Careers",
      news: "News & Insights",
      contact: "Contact Us",
      solutions: "Solutions",
      products: "Products",
      quote: "Request Quote",
    },
    ar: {
      about: "من نحن",
      careers: "الوظائف",
      news: "الأخبار والمقالات",
      contact: "اتصل بنا",
      solutions: "الحلول",
      products: "المنتجات",
      quote: "طلب عرض سعر",
    },
    fr: {
      about: "À propos de nous",
      careers: "Carrières",
      news: "Actualités",
      contact: "Contactez-nous",
      solutions: "Solutions",
      products: "Produits",
      quote: "Demander un Devis",
    },
  }[currentLocale] || {
    about: "About Us",
    careers: "Careers",
    news: "News & Insights",
    contact: "Contact Us",
    solutions: "Solutions",
    products: "Products",
    quote: "Request Quote",
  };

  const columns = [
    {
      title: t.footer.company,
      links: [
        { label: linkLabels.about, href: `/${currentLocale}/about` },
        { label: linkLabels.careers, href: `/${currentLocale}/careers` },
        { label: linkLabels.news, href: `/${currentLocale}/news` },
        { label: linkLabels.contact, href: `/${currentLocale}/contact` },
      ],
    },
    {
      title: t.footer.solutions,
      links: [
        { label: linkLabels.solutions, href: `/${currentLocale}/solutions` },
        { label: linkLabels.products, href: `/${currentLocale}/products` },
        { label: linkLabels.quote, href: `/${currentLocale}/quote` },
      ],
    },
    {
      title: t.footer.resources,
      links: [
        { label: linkLabels.contact, href: `/${currentLocale}/contact` },
        { label: linkLabels.quote, href: `/${currentLocale}/quote` },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 pt-20 pb-8">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="grid gap-10 md:gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div>
            <div className="mb-5 flex items-center gap-2.5">
              <Link href={`/${currentLocale}`}>
                <Image
                  src="/assets/logo.png"
                  alt="STI - Smart Technologie Innovation"
                  width={200}
                  height={70}
                  className="h-14 w-auto brightness-0 invert opacity-90 hover:opacity-100 transition-opacity duration-300"
                />
              </Link>
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-gray-400">
              {t.footer.brand_description}
            </p>
            {socials.length > 0 && (
              <div className="flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition-all hover:bg-red-primary hover:text-white"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              {t.footer.contact}
            </h4>
            <ul className="space-y-3">
              {phone && (
                <li className="flex items-start gap-2.5">
                  <Phone size={15} className="mt-0.5 shrink-0 text-red-primary" />
                  <div className="text-start">
                    <div className="text-sm font-bold text-gray-200">
                      <bdo dir="ltr" className="inline-block">{phone}</bdo>
                    </div>
                    {activeWorkingHours && <div className="text-xs text-gray-500">{activeWorkingHours}</div>}
                  </div>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="shrink-0 text-gray-500" />
                <a href={`mailto:${email}`} className="text-sm text-gray-300 hover:text-white transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gray-500" />
                <span className="text-sm text-gray-300 leading-snug">
                  {activeLocation}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            {currentLocale === "ar"
              ? `© ${new Date().getFullYear()} شركة سمارت تكنولوجي إينوفيشين (STI). جميع الحقوق محفوظة.`
              : currentLocale === "fr"
              ? `© ${new Date().getFullYear()} SARL Smart Technologie Innovation (STI). Tous droits réservés.`
              : `© ${new Date().getFullYear()} SARL Smart Technologie Innovation (STI). All rights reserved.`}
          </p>
          <div />
        </div>
      </div>
    </footer>
  );
}
