"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useTranslations } from "../../[locale]/use-translations";
import { useScrollReveal } from "../../hooks";
import type { CompanyPreferences } from "../../api/preferences/route";

const daysList = [
  { key: "saturday", en: "Saturday", ar: "السبت", fr: "Samedi" },
  { key: "sunday", en: "Sunday", ar: "الأحد", fr: "Dimanche" },
  { key: "monday", en: "Monday", ar: "الإثنين", fr: "Lundi" },
  { key: "tuesday", en: "Tuesday", ar: "الثلاثاء", fr: "Mardi" },
  { key: "wednesday", en: "Wednesday", ar: "الأربعاء", fr: "Mercredi" },
  { key: "thursday", en: "Thursday", ar: "الخميس", fr: "Jeudi" },
  { key: "friday", en: "Friday", ar: "الجمعة", fr: "Vendredi" },
] as const;

export default function BusinessHoursCard() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";
  const { ref, visible } = useScrollReveal(0.1);

  const [prefs, setPrefs] = useState<CompanyPreferences | null>(null);

  useEffect(() => {
    async function loadPrefs() {
      try {
        const res = await fetch("/api/preferences");
        if (res.ok) {
          const data = await res.json();
          setPrefs(data);
        }
      } catch {}
    }
    loadPrefs();
  }, []);

  const businessHours = prefs?.businessHours || {
    saturday: { open: "08:00", close: "17:00", isClosed: false },
    sunday: { open: "08:00", close: "17:00", isClosed: false },
    monday: { open: "08:00", close: "17:00", isClosed: false },
    tuesday: { open: "08:00", close: "17:00", isClosed: false },
    wednesday: { open: "08:00", close: "17:00", isClosed: false },
    thursday: { open: "08:00", close: "17:00", isClosed: false },
    friday: { open: "00:00", close: "00:00", isClosed: true },
  };

  const closedText = currentLocale === "ar" ? "مغلق" : currentLocale === "fr" ? "Fermé" : "Closed";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full flex flex-col justify-center"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-primary/10 text-red-primary">
          <Clock size={18} />
        </div>
        <h3 className="text-lg font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          {t.contact.hours.title}
        </h3>
      </div>

      <div className="space-y-0 flex-1 flex flex-col justify-between">
        {daysList.map((day, i) => {
          const config = businessHours[day.key];
          const name = day[currentLocale] || day.en;
          const openTime = currentLocale === "fr" ? config.open.replace(":", "h") : config.open;
          const closeTime = currentLocale === "fr" ? config.close.replace(":", "h") : config.close;

          return (
            <div
              key={day.key}
              className={`flex items-center justify-between py-3.5 ${
                i < daysList.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span className="text-sm font-medium text-gray-700">{name}</span>
              <span className={`text-sm font-semibold ${config.isClosed ? "text-gray-400" : "text-gray-900"}`}>
                {config.isClosed ? closedText : `${openTime} - ${closeTime}`}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}