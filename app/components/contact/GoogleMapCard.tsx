"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { usePreferences } from "../../[locale]/preferences-context";

function parseGoogleMapInputs(gmapsEmbedInput?: string, addressText?: string) {
  if (!gmapsEmbedInput || typeof gmapsEmbedInput !== "string" || !gmapsEmbedInput.trim()) {
    return { embedUrl: "", externalUrl: "" };
  }

  let raw = gmapsEmbedInput.trim();

  // Extract src if full iframe tag is passed
  if (raw.includes("<iframe") && raw.includes("src=")) {
    const match = raw.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      raw = match[1];
    }
  }

  // If it's an embed URL, construct an interactive Google Maps URL for opening
  if (raw.includes("/maps/embed") || raw.includes("output=embed")) {
    const embedUrl = raw;
    const query = addressText || "SARL Smart Technologie Innovation STI";
    const externalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    return { embedUrl, externalUrl };
  }

  // If it's already an external map/place URL
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    const externalUrl = raw;
    const query = addressText || "SARL Smart Technologie Innovation STI";
    const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    return { embedUrl, externalUrl };
  }

  return { embedUrl: "", externalUrl: "" };
}

export default function GoogleMapCard() {
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const { preferences, loading } = usePreferences();
  const addressText =
    preferences?.address?.[currentLocale] ||
    preferences?.address?.en ||
    preferences?.address?.fr ||
    preferences?.address?.ar ||
    "";

  const { embedUrl, externalUrl: googleMapsUrl } = parseGoogleMapInputs(
    preferences?.gmapsEmbed,
    addressText
  );

  const openMapsLabel =
    currentLocale === "ar"
      ? "افتح في خرائط جوجل"
      : currentLocale === "fr"
      ? "Ouvrir dans Google Maps"
      : "Open in Google Maps";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-3xl border border-gray-100 overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.04)] bg-white mb-20 sm:mb-28 lg:mb-36"
    >
      {loading ? (
        <div className="relative bg-gray-100 h-[460px] animate-pulse flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-primary/20 flex items-center justify-center text-red-primary animate-bounce">
              <MapPin size={24} />
            </div>
            <span className="text-xs font-semibold text-gray-400">Loading Location Map...</span>
          </div>
        </div>
      ) : (
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
      )}
    </motion.div>
  );
}