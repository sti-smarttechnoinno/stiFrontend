"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ExternalLink, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface STILocation {
  id: string;
  name: string;
  role: string;
  wilaya: string;
  address: string;
  lat: number;
  lng: number;
  zoom: number;
  googleMapsUrl: string;
  phone?: string;
  hours?: string;
}

export const STI_LOCATIONS: STILocation[] = [
  {
    id: "sti-setif",
    name: "SARL Smart Technologie Innovation - STI (Siège)",
    role: "Siège Principal & Centre National de Distribution",
    wilaya: "Sétif",
    address: "Sétif, Algérie",
    lat: 36.1878817,
    lng: 5.4266392,
    zoom: 16,
    googleMapsUrl:
      "https://www.google.com/maps/place/SARL+Smart+Technologie+Innovation+-+STI/@36.1889757,5.423104,14z/data=!4m10!1m2!2m1!1ssti!3m6!1s0x12f315007983d29b:0xb969c549a0ef2f09!8m2!3d36.1878817!4d5.4266392!15sCgNzdGmSARRkaXN0cmlidXRpb25fc2VydmljZeABAA!16s%2Fg%2F11y9z7v9ll?entry=ttu&g_ep=EgoyMDI2MDgyNC4wIKXMDSoASAFQAw%3D%3D",
    phone: "Service Commercial & Distribution Sétif",
    hours: "Dimanche - Jeudi : 08h30 - 17h00",
  },
  {
    id: "sti-alger",
    name: "SARL Smart Technologie Innovation - STI Annexe",
    role: "Annexe Régionale & Showroom vivo Centre",
    wilaya: "Alger",
    address: "Staoueli / Chéraga, Alger, Algérie",
    lat: 36.7294885,
    lng: 2.9552282,
    zoom: 16,
    googleMapsUrl:
      "https://www.google.com/maps/place/SARL+Smart+Technologie+Innovation+-+STI+Annexe/@36.7294885,2.9526533,17z/data=!3m1!4b1!4m6!3m5!1s0x128fafc0c3bec2fb:0xbe3fad98290e5145!8m2!3d36.7294885!4d2.9552282!16s%2Fg%2F11nvgvgs7q?entry=ttu&g_ep=EgoyMDI2MDgyNC4wIKXMDSoASAFQAw%3D%3D",
    phone: "Showroom & Conseil Alger",
    hours: "Dimanche - Jeudi : 08h30 - 17h00",
  },
];

interface MapViewProps {
  className?: string;
  activeLocation?: STILocation | null;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  onMapReady?: (map: { panTo: (pos: { lat: number; lng: number }) => void; setZoom: (z: number) => void }) => void;
}

export function MapView({
  className,
  activeLocation,
  initialCenter = { lat: 36.1878817, lng: 5.4266392 },
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState(initialCenter);

  useEffect(() => {
    if (activeLocation) {
      setCenter({ lat: activeLocation.lat, lng: activeLocation.lng });
    }
  }, [activeLocation]);

  useEffect(() => {
    if (onMapReady) {
      onMapReady({
        panTo: (pos: { lat: number; lng: number }) => {
          setCenter(pos);
        },
        setZoom: () => {},
      });
    }
  }, [onMapReady]);

  // Google Maps Embed URL
  const embedUrl = `https://maps.google.com/maps?q=${center.lat},${center.lng}&hl=fr&z=15&output=embed`;

  return (
    <div
      ref={mapContainer}
      className={cn(
        "relative w-full h-[520px] rounded-md overflow-hidden bg-[#0e1b2f] border border-[#102039]/15 shadow-xl transition-all duration-300",
        className
      )}
    >
      <iframe
        title="Google Maps STI vivo Algérie"
        src={embedUrl}
        className="w-full h-full border-0"
        loading="lazy"
        allowFullScreen
      />

      {/* Floating active location indicator */}
      {activeLocation && (
        <div className="absolute top-4 left-4 right-4 md:right-auto md:max-w-xs bg-[#0e1b2f]/95 backdrop-blur-md border border-[#5f8dff]/30 p-3.5 rounded shadow-xl z-10 text-white animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[#5f8dff] font-bold text-[11px] tracking-wider uppercase">
              <MapPin size={14} />
              {activeLocation.wilaya}
            </span>
            <a
              href={activeLocation.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5f8dff] hover:text-white transition-colors"
            >
              Google Maps <ArrowUpRight size={12} />
            </a>
          </div>
          <p className="text-xs font-semibold text-white mt-1.5 line-clamp-1">{activeLocation.name}</p>
          <p className="text-[11px] text-white/60 mt-0.5">{activeLocation.address}</p>
        </div>
      )}
    </div>
  );
}
