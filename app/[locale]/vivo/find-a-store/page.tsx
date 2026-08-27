"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowUpRight,
  Crosshair,
  ExternalLink,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { VivoNavbar } from "@/app/components/vivo/VivoNavbar";
import { MapView, STI_LOCATIONS, STILocation } from "@/app/components/vivo/Map";

export default function VivoFindAStorePage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";

  const mapRef = useRef<{ panTo: (pos: { lat: number; lng: number }) => void; setZoom: (z: number) => void } | null>(null);
  const [activeLocation, setActiveLocation] = useState<STILocation>(STI_LOCATIONS[0]);
  const [locationMessage, setLocationMessage] = useState("");

  const handleSelectLocation = (loc: STILocation) => {
    setActiveLocation(loc);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: loc.lat, lng: loc.lng });
    }
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      setLocationMessage("La géolocalisation n’est pas disponible sur cet appareil.");
      return;
    }
    setLocationMessage("Recherche de votre position…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        // Find closest STI location
        const dSetif = Math.hypot(userLat - STI_LOCATIONS[0].lat, userLng - STI_LOCATIONS[0].lng);
        const dAlger = Math.hypot(userLat - STI_LOCATIONS[1].lat, userLng - STI_LOCATIONS[1].lng);
        const closest = dSetif < dAlger ? STI_LOCATIONS[0] : STI_LOCATIONS[1];
        handleSelectLocation(closest);
        setLocationMessage(`Point le plus proche : ${closest.name}`);
      },
      () => setLocationMessage("Position indisponible. Choisissez un site dans la liste.")
    );
  };

  return (
    <div className="store-locator-page">
      <VivoNavbar />

      <main>
        <section className="store-locator-hero">
          <div className="content-container store-locator-hero-inner">
            <div>
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                Vivo Algérie · Réseau officiel STI
              </span>
              <h1>
                Trouvez votre
                <br />
                <em>point de vente.</em>
              </h1>
              <p>
                Localisez le siège officiel STI et les annexes agréées vivo en Algérie.
              </p>
            </div>
            <div className="store-locator-hero-meta">
              <span>01 / LOCALISER</span>
              <span>STI NETWORK</span>
            </div>
          </div>
        </section>

        <section className="store-locator-tool">
          <div className="content-container locator-layout">
            <div className="locator-controls">
              <div className="locator-heading">
                <span className="eyebrow eyebrow--blue">
                  <span className="section-rule" />
                  02 / Implantations STI
                </span>
                <h2>
                  Centres
                  <br />
                  <em>officiels.</em>
                </h2>
                <p>Sélectionnez un site pour afficher sa localisation Google Maps.</p>
              </div>

              <div className="wilaya-list">
                {STI_LOCATIONS.map((loc) => {
                  const isActive = activeLocation.id === loc.id;
                  return (
                    <button
                      type="button"
                      className={`wilaya-option ${isActive ? "wilaya-option--active" : ""}`}
                      key={loc.id}
                      onClick={() => handleSelectLocation(loc)}
                    >
                      <div className="flex flex-col gap-1 py-1">
                        <span className="font-bold flex items-center gap-2">
                          <MapPin size={15} className={isActive ? "text-[#5f8dff]" : "text-gray-400"} />
                          {loc.name}
                        </span>
                        <small className="text-xs text-[#697587] pl-6">{loc.address}</small>
                      </div>
                      <a
                        href={loc.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Ouvrir dans Google Maps"
                        className="p-2 text-[#5f8dff] hover:text-[#102039] transition-colors"
                      >
                        <ExternalLink size={15} />
                      </a>
                    </button>
                  );
                })}
              </div>

              <button type="button" className="location-button" onClick={locateMe}>
                <Crosshair size={16} />
                Trouver le centre le plus proche
              </button>
              {locationMessage && (
                <p className="location-message" role="status">
                  {locationMessage}
                </p>
              )}
            </div>

            <div className="locator-map-wrap">
              <MapView
                className="locator-map"
                activeLocation={activeLocation}
                initialCenter={{ lat: STI_LOCATIONS[0].lat, lng: STI_LOCATIONS[0].lng }}
                initialZoom={15}
                onMapReady={(map) => {
                  mapRef.current = map;
                }}
              />
              <div className="locator-map-label">
                <span className="locator-map-dot" />
                Point sélectionné :
                <span className="locator-map-city">{activeLocation.wilaya}</span>
              </div>
              <div className="locator-map-note">
                <ShieldCheck size={16} />
                <span>
                  Réseau officiel
                  <br />
                  <small>Garantie &amp; Service STI</small>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="store-empty-state">
          <div className="content-container store-empty-inner">
            <div className="store-empty-mark">
              <ShieldCheck size={48} strokeWidth={1.2} />
            </div>
            <div>
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                Distributeur Officiel
              </span>
              <h2>
                Devenir revendeur
                <br />
                <em>partenaire.</em>
              </h2>
              <p>
                Vous êtes un professionnel de la téléphonie en Algérie et souhaitez distribuer les
                smartphones vivo officiels ? Rejoignez le réseau STI.
              </p>
              <Link href={`/${locale}/vivo/support#contact-form`} className="button button--primary">
                Rejoindre le réseau de distribution <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-container footer-inner">
          <span>© 2026 vivo Algeria · STI Partenaire officiel</span>
          <span>Réseau de distribution Algérie · Sétif &amp; Alger</span>
          <Link href={`/${locale}/vivo`}>
            Retour à l’accueil vivo <ArrowUpRight size={14} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
