"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Landmark } from "lucide-react";
import { useTranslations } from '@/app/[locale]/use-translations';
import type { CompanyPreferences } from '@/app/api/preferences/route';

import { formatBusinessHours } from "../../utils/formatHours";

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
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);

export default function BusinessInfoCard() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const [prefs, setPrefs] = useState<CompanyPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrefs() {
      try {
        const res = await fetch("/api/preferences");
        if (res.ok) {
          const data = await res.json();
          setPrefs(data);
        }
      } catch {} finally {
        setLoading(false);
      }
    }
    loadPrefs();
  }, []);

  const phoneValue = prefs?.phone || "";
  const emailValue = prefs?.email || "";
  const addressValue = prefs?.address?.[currentLocale] || prefs?.address?.fr || prefs?.address?.en || prefs?.address?.ar || "";

  const workingHoursText = formatBusinessHours(
    prefs?.businessHours,
    currentLocale,
    "Sat - Thu 08:00 - 17:00"
  );

  const socialsList = [
    { icon: <LinkedinIcon />, href: prefs?.socialMedia?.linkedin, label: "LinkedIn" },
    { icon: <FacebookIcon />, href: prefs?.socialMedia?.facebook, label: "Facebook" },
    { icon: <TwitterIcon />, href: prefs?.socialMedia?.twitter, label: "Twitter" },
    { icon: <YoutubeIcon />, href: prefs?.socialMedia?.youtube, label: "YouTube" },
  ].filter((s) => s.href && s.href.trim() !== "");

  const companyNameText = prefs?.businessInfo?.companyName?.[currentLocale] || prefs?.businessInfo?.companyName?.en || "SARL Smart Technologie Innovation";

  const labels = {
    en: {
      title: "Business Contact Info",
      subtitle: "Official communication pathways and localized helpdesks.",
      phone: "Customer Support & Inquiry",
      email: "Electronic Mailing Desk",
      address: "Headquarters Location",
      hours: "Customer Service Hours",
      socials: "Follow Our Updates",
    },
    ar: {
      title: "معلومات الاتصال بالشركة",
      subtitle: "قنوات الاتصال الرسمية ومكتب المساعدة المحلي.",
      phone: "دعم العملاء والاستفسارات",
      email: "مكتب المراسلات الإلكترونية",
      address: "مقر الشركة الرئيسي",
      hours: "أوقات خدمة العملاء",
      socials: "تابع مستجداتنا",
    },
    fr: {
      title: "Informations de Contact",
      subtitle: "Canaux de communication officiels et bureaux d'assistance locaux.",
      phone: "Support Client & Demandes",
      email: "Bureau des Courriels Électroniques",
      address: "Localisation du Siège Social",
      hours: "Heures de Service Client",
      socials: "Suivez nos Actualités",
    },
  }[currentLocale] || {
    title: "Business Contact Info",
    subtitle: "Official communication pathways and localized helpdesks.",
    phone: "Customer Support & Inquiry",
    email: "Electronic Mailing Desk",
    address: "Headquarters Location",
    hours: "Customer Service Hours",
    socials: "Follow Our Updates",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl border border-gray-100 bg-white p-8 lg:p-10 shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between"
    >
      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-48 bg-gray-200 rounded-xl" />
          <div className="h-3 w-64 bg-gray-100 rounded-full" />
          <div className="space-y-6 pt-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-primary/10 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-40 bg-gray-200 rounded-lg" />
                  <div className="h-2.5 w-24 bg-gray-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-1" style={{ fontFamily: "var(--font-display)" }}>
              {labels.title}
            </h3>
            <p className="text-xs text-gray-500 mb-8 leading-relaxed">{labels.subtitle}</p>

            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-primary/10 text-red-primary">
                  <Landmark size={18} />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-gray-900">{companyNameText}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    {currentLocale === "ar" ? "الاسم التجاري للشركة" : "Corporate Legal Name"}
                  </div>
                </div>
              </li>

              {phoneValue && (
                <li className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-primary/10 text-red-primary">
                    <Phone size={18} />
                  </div>
                  <div>
                    <a href={`tel:${phoneValue.replace(/[^0-9+]/g, "")}`} className="text-sm font-semibold text-gray-900 hover:text-red-primary transition-colors">
                      <bdo dir="ltr" className="inline-block">{phoneValue}</bdo>
                    </a>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{labels.phone}</div>
                  </div>
                </li>
              )}

              {emailValue && (
                <li className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-primary/10 text-red-primary">
                    <Mail size={18} />
                  </div>
                  <div>
                    <a href={`mailto:${emailValue}`} className="text-sm font-semibold text-gray-900 hover:text-red-primary transition-colors">
                      {emailValue}
                    </a>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{labels.email}</div>
                  </div>
                </li>
              )}

              {addressValue && (
                <li className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-primary/10 text-red-primary">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{addressValue}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{labels.address}</div>
                  </div>
                </li>
              )}

              <li className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-primary/10 text-red-primary">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{workingHoursText}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{labels.hours}</div>
                </div>
              </li>
            </ul>
          </div>

          {socialsList.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3" style={{ fontFamily: "var(--font-manrope)" }}>
                {labels.socials}
              </h4>
              <div className="flex gap-2">
                {socialsList.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-all hover:bg-red-primary hover:text-white"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}