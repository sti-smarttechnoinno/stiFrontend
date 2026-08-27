"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { usePreferences } from '@/app/[locale]/preferences-context';

const DEFAULT_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3220.1233568508337!2d5.4240589120880305!3d36.18788167231293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f315007983d29b%3A0xb969c549a0ef2f09!2sSARL%20Smart%20Technologie%20Innovation%20-%20STI!5e0!3m2!1sfr!2sdz!4v1786524577700!5m2!1sfr!2sdz";

function parseGoogleMapInputs(gmapsEmbedInput?: string, addressText?: string) {
  let raw =
    gmapsEmbedInput && typeof gmapsEmbedInput === "string" && gmapsEmbedInput.trim()
      ? gmapsEmbedInput.trim()
      : DEFAULT_EMBED_URL;

  // Extract src if full iframe tag is passed
  if (raw.includes("<iframe") && raw.includes("src=")) {
    const match = raw.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      raw = match[1];
    }
  }

  let embedUrl = raw;
  let lat = "";
  let lng = "";
  let placeName = "";

  // Try extracting coordinates (!2d = lng, !3d = lat) from Google Maps embed pb parameter
  const lngMatch = raw.match(/!2d(-?\d+\.\d+)/);
  const latMatch = raw.match(/!3d(-?\d+\.\d+)/);
  if (lngMatch && lngMatch[1]) lng = lngMatch[1];
  if (latMatch && latMatch[1]) lat = latMatch[1];

  // Try extracting place name (!2s...) from Google Maps embed pb parameter
  const placeMatch = raw.match(/!2s([^!&]+)/);
  if (placeMatch && placeMatch[1]) {
    try {
      placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
    } catch {}
  }

  let externalUrl = "";

  // Priority 1: Place name + Address search
  if (placeName) {
    const query = `${placeName}, ${addressText || "Setif, Algeria"}`;
    externalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
  // Priority 2: Direct lat,lng coordinates search
  else if (lat && lng) {
    externalUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  // Priority 3: Check if input is direct Google Maps link
  else if ((raw.startsWith("http://") || raw.startsWith("https://")) && !raw.includes("/maps/embed") && !raw.includes("output=embed")) {
    externalUrl = raw;
    embedUrl = DEFAULT_EMBED_URL;
  }
  // Fallback: Default STI location search query
  else {
    const query = `SARL Smart Technologie Innovation - STI, ${addressText || "Setif, Algeria"}`;
    externalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  return { embedUrl, externalUrl };
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
    "Setif, Algeria";

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