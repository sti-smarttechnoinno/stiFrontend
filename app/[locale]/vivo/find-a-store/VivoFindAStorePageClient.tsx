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
import { useTranslations } from "@/app/[locale]/use-translations";

export default function VivoFindAStorePageClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";
  const t = useTranslations() as any;
  const heroT = t?.vivoFindAStoreHero || t?.stiHome?.vivoFindAStoreHero || {};

  const heroEyebrow = heroT.eyebrow || "Vivo Algérie · Réseau officiel STI";
  const heroTitle = heroT.title || "Trouvez votre";
  const heroAccent = heroT.accent || "point de vente.";
  const heroDescription =
    heroT.description ||
    "Localisez le siège officiel STI et les annexes agréées vivo en Algérie.";
  const heroMetaIndex = heroT.metaIndex || "01 / LOCALISER";
  const heroMetaNetwork = heroT.metaNetwork || "STI NETWORK";

  const toolT = t?.vivoFindAStoreTool || t?.stiHome?.vivoFindAStoreTool || {};
  const toolEyebrow = toolT.eyebrow || "02 / Implantations STI";
  const toolTitle = toolT.title || "Centres";
  const toolAccent = toolT.accent || "officiels.";
  const toolDescription =
    toolT.description || "Sélectionnez un site pour afficher sa localisation Google Maps.";
  const openMapsText = toolT.openMaps || "Ouvrir dans Google Maps";
  const googleMapsText = toolT.googleMaps || "Google Maps";
  const findNearestText = toolT.findNearest || "Trouver le centre le plus proche";
  const geoUnavailableText =
    toolT.geoUnavailable || "La géolocalisation n’est pas disponible sur cet appareil.";
  const geoSearchingText = toolT.geoSearching || "Recherche de votre position…";
  const geoClosestText = toolT.geoClosest || "Point le plus proche : ";
  const geoErrorText =
    toolT.geoError || "Position indisponible. Choisissez un site dans la liste.";
  const selectedPointText = toolT.selectedPoint || "Point sélectionné :";
  const networkTitleText = toolT.networkTitle || "Réseau officiel";
  const networkSubText = toolT.networkSub || "Garantie & Service STI";

  const getLocationName = (loc: STILocation) =>
    toolT.locations?.[loc.id]?.name || loc.name;
  const getLocationAddress = (loc: STILocation) =>
    toolT.locations?.[loc.id]?.address || loc.address;
  const getLocationWilaya = (loc: STILocation) =>
    toolT.locations?.[loc.id]?.wilaya || loc.wilaya;

  const partnerT = t?.vivoFindAStorePartner || t?.stiHome?.vivoFindAStorePartner || {};
  const partnerEyebrow = partnerT.eyebrow || "Distributeur Officiel";
  const partnerTitle = partnerT.title || "Devenir revendeur";
  const partnerAccent = partnerT.accent || "partenaire.";
  const partnerDescription =
    partnerT.description ||
    "Vous êtes un professionnel de la téléphonie en Algérie et souhaitez distribuer les smartphones vivo officiels ? Rejoignez le réseau STI.";
  const partnerJoinText = partnerT.joinNetwork || "Rejoindre le réseau de distribution";

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
      setLocationMessage(geoUnavailableText);
      return;
    }
    setLocationMessage(geoSearchingText);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const dSetif = Math.hypot(userLat - STI_LOCATIONS[0].lat, userLng - STI_LOCATIONS[0].lng);
        const dAlger = Math.hypot(userLat - STI_LOCATIONS[1].lat, userLng - STI_LOCATIONS[1].lng);
        const closest = dSetif < dAlger ? STI_LOCATIONS[0] : STI_LOCATIONS[1];
        handleSelectLocation(closest);
        setLocationMessage(`${geoClosestText}${getLocationName(closest)}`);
      },
      () => setLocationMessage(geoErrorText)
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
                {heroEyebrow}
              </span>
              <h1>
                {heroTitle}
                <br />
                <em>{heroAccent}</em>
              </h1>
              <p>{heroDescription}</p>
            </div>
            <div className="store-locator-hero-meta">
              <span>{heroMetaIndex}</span>
              <span>{heroMetaNetwork}</span>
            </div>
          </div>
        </section>

        <section className="store-locator-tool">
          <div className="content-container locator-layout">
            <div className="locator-controls">
              <div className="locator-heading">
                <span className="eyebrow eyebrow--blue">
                  <span className="section-rule" />
                  {toolEyebrow}
                </span>
                <h2>
                  {toolTitle}
                  <br />
                  <em>{toolAccent}</em>
                </h2>
                <p>{toolDescription}</p>
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
                          {getLocationName(loc)}
                        </span>
                        <small className="text-xs text-[#697587] pl-6">{getLocationAddress(loc)}</small>
                      </div>
                      <a
                        href={loc.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title={openMapsText}
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
                {findNearestText}
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
                locale={locale}
                locationName={getLocationName(activeLocation)}
                locationAddress={getLocationAddress(activeLocation)}
                locationWilaya={getLocationWilaya(activeLocation)}
                googleMapsText={googleMapsText}
                onMapReady={(map) => {
                  mapRef.current = map;
                }}
              />
              <div className="locator-map-label">
                <span className="locator-map-dot" />
                {selectedPointText}
                <span className="locator-map-city">{getLocationWilaya(activeLocation)}</span>
              </div>
              <div className="locator-map-note">
                <ShieldCheck size={16} />
                <span>
                  {networkTitleText}
                  <br />
                  <small>{networkSubText}</small>
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
                {partnerEyebrow}
              </span>
              <h2>
                {partnerTitle}
                <br />
                <em>{partnerAccent}</em>
              </h2>
              <p>{partnerDescription}</p>
              <Link href={`/${locale}/vivo/support#contact-form`} className="button button--primary">
                {partnerJoinText} <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
