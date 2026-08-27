"use client";

import { usePathname, useRouter } from "next/navigation";
import { Phone, Globe, Clock } from "lucide-react";
import { usePreferences } from "@/app/[locale]/preferences-context";
import { useState } from "react";

const languages = [
  { code: "fr", label: "Français", short: "FR" },
  { code: "ar", label: "العربية", short: "عربي" },
  { code: "en", label: "English", short: "EN" },
];

const announcementText: Record<string, { company: string; details: string }> = {
  fr: {
    company: "SARL Smart Technologie Innovation",
    details: "Distributeur Agréé Ooredoo & Producteur et Distributeur VIVO",
  },
  ar: {
    company: "شركة سمارت تكنولوجي إينوفيشين",
    details: "الموزع المعتمد لأوريدو | منتج وموزع فيفو (VIVO)",
  },
  en: {
    company: "SARL Smart Technologie Innovation",
    details: "Official Ooredoo Distributor & VIVO Producer and Distributor",
  },
};

export default function AnnouncementBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { phone, activeWorkingHours, workingHoursObj = {} } = usePreferences();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments.find((s) => ["en", "fr", "ar"].includes(s)) || "fr";

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    setLangDropdownOpen(false);

    const parts = pathname.split("/").filter(Boolean);
    const localeIndex = parts.findIndex((p) => ["en", "fr", "ar"].includes(p));

    if (localeIndex !== -1) {
      parts[localeIndex] = newLocale;
      router.push("/" + parts.join("/"));
    } else {
      router.push(`/${newLocale}`);
    }
  };

  const item = announcementText[currentLocale] || announcementText.fr;
  const workingHours = (workingHoursObj && workingHoursObj[currentLocale]) || activeWorkingHours || "";

  return (
    <aside
      aria-label="Informations et sélection de langue"
      className="fixed top-0 left-0 right-0 z-50 w-full h-9 border-b border-neutral-800/80 bg-neutral-950 text-neutral-200 text-xs tracking-tight backdrop-blur-md"
    >
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Announcement Message */}
        <p className="text-[11px] sm:text-xs text-neutral-200 truncate font-semibold flex items-center gap-1.5">
          <span className="font-bold text-white">{item.company}</span>
          <span className="text-neutral-500 select-none">—</span>
          <span className="font-medium text-neutral-300">{item.details}</span>
        </p>

        {/* Right Controls: Working Hours + Phone + Minimal Language Switcher */}
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          {workingHours && (
            <div className="hidden lg:inline-flex items-center gap-1.5 text-[11px] text-neutral-400">
              <Clock className="h-3 w-3 text-neutral-500" aria-hidden="true" />
              <span>{workingHours}</span>
            </div>
          )}

          {phone && (
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
              className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors"
            >
              <Phone className="h-3 w-3 text-neutral-500" />
              <bdo dir="ltr" className="font-medium">{phone}</bdo>
            </a>
          )}

          {/* Simple Clean Language Switcher */}
          <nav aria-label="Langues" className="flex items-center gap-1.5 text-[11px] text-neutral-400">
            <Globe className="h-3 w-3 text-neutral-500" aria-hidden="true" />
            {languages.map((lang, idx) => {
              const isActive = currentLocale === lang.code;
              return (
                <span key={lang.code} className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`transition-colors tracking-wide ${
                      isActive
                        ? "text-white font-semibold underline underline-offset-4 decoration-red-500 decoration-2"
                        : "text-neutral-400 hover:text-white"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {lang.code === "ar" ? "عربي" : lang.short}
                  </button>
                  {idx < languages.length - 1 && (
                    <span className="text-neutral-700 select-none">|</span>
                  )}
                </span>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}

