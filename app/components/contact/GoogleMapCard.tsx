"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { useScrollReveal } from "../../hooks";
import type { CompanyPreferences } from "../../api/preferences/route";

export default function GoogleMapCard() {
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";
  const { ref, visible } = useScrollReveal(0.1);

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

  const embedUrl = prefs?.gmapsEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3236.4678129532675!2d5.4263334!3d36.1878916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f315007983d29b%3A0xb969c549a0ef2f09!2sSARL%20Smart%20Technologie%20Innovation%20-%20STI!5e0!3m2!1sen!2sdz!4v1700000000000!5m2!1sen!2sdz";
  
  const googleMapsUrl = prefs?.gmapsEmbed || "https://www.google.com/maps/place/SARL+Smart+Technologie+Innovation+-+STI/@36.1878916,5.4263334,19z/data=!4m6!3m5!1s0x12f315007983d29b:0xb969c549a0ef2f09!8m2!3d36.1878817!4d5.4266392";

  const addressText = prefs?.address?.[currentLocale] || prefs?.address?.en || "Official Ooredoo Distributor Headquarters, Sétif, Algeria";

  const openMapsLabel = currentLocale === "ar" ? "افتح في خرائط جوجل" : currentLocale === "fr" ? "Ouvrir dans Google Maps" : "Open in Google Maps";

  if (loading) {
    return (
      <div className="relative rounded-3xl border border-gray-100 overflow-hidden shadow-xs bg-gray-100 h-[460px] mb-20 sm:mb-28 lg:mb-36 animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-primary/20 flex items-center justify-center text-red-primary animate-bounce">
            <MapPin size={24} />
          </div>
          <span className="text-xs font-semibold text-gray-400">Loading Location Map...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-3xl border border-gray-100 overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.04)] bg-white mb-20 sm:mb-28 lg:mb-36"
    >
      <div className="h-[460px] w-full bg-gray-100 relative">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="SARL Smart Technologie Innovation - STI Location"
        />

        {/* Floating location card badge */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-xl max-w-[320px] rtl:right-auto rtl:left-4 rtl:sm:left-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-primary/10 flex items-center justify-center shrink-0 text-red-primary mt-0.5">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-display)" }}>
                SARL Smart Technologie Innovation (STI)
              </h4>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                {addressText}
              </p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-primary transition-colors hover:text-red-accent"
              >
                <span>{openMapsLabel}</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}