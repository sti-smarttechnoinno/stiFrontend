"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CompanyPreferences } from "../api/preferences/route";
import { formatBusinessHours } from "../utils/formatHours";

interface PreferencesContextType {
  preferences: CompanyPreferences | null;
  phone: string;
  email: string;
  socialMedia: { linkedin?: string; facebook?: string; twitter?: string; youtube?: string; instagram?: string };
  locationObj: Record<string, string>;
  workingHoursObj: Record<string, string>;
  activeWorkingHours: string;
  activeLocation: string;
  loading: boolean;
}

const defaultPreferencesState: PreferencesContextType = {
  preferences: null,
  phone: "",
  email: "contact@sti.dz",
  socialMedia: {},
  locationObj: {
    en: "Lot 24, Zone Industrielle, Bab Ezzouar, Algiers, Algeria",
    ar: "المنطقة الصناعية رقم 24، باب الزوار، الجزائر العاصمة",
    fr: "Lot 24, Zone Industrielle, Bab Ezzouar, Alger, Algérie",
  },
  workingHoursObj: {},
  activeWorkingHours: "",
  activeLocation: "Lot 24, Zone Industrielle, Bab Ezzouar, Algiers, Algeria",
  loading: true,
};

const PreferencesContext = createContext<PreferencesContextType>(defaultPreferencesState);

let cachedPreferences: CompanyPreferences | null = null;

export function PreferencesProvider({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const [preferences, setPreferences] = useState<CompanyPreferences | null>(cachedPreferences);
  const [loading, setLoading] = useState(!cachedPreferences);
  const [phone, setPhone] = useState(cachedPreferences?.phone || "");
  const [email, setEmail] = useState(cachedPreferences?.email || "contact@sti.dz");
  const [socialMedia, setSocialMedia] = useState(cachedPreferences?.socialMedia || {});
  const [locationObj, setLocationObj] = useState<Record<string, string>>({
    en: "Lot 24, Zone Industrielle, Bab Ezzouar, Algiers, Algeria",
    ar: "المنطقة الصناعية رقم 24، باب الزوار، الجزائر العاصمة",
    fr: "Lot 24, Zone Industrielle, Bab Ezzouar, Alger, Algérie",
  });
  const [workingHoursObj, setWorkingHoursObj] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cachedPreferences) {
      applyPreferences(cachedPreferences);
      setLoading(false);
      return;
    }

    let isSubscribed = true;
    fetch("/api/preferences")
      .then((res) => res.json())
      .then((data) => {
        if (isSubscribed && data && typeof data === "object") {
          cachedPreferences = data;
          setPreferences(data);
          applyPreferences(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isSubscribed) setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const applyPreferences = (data: any) => {
    if (data.phone) setPhone(data.phone);
    if (data.email) setEmail(data.email);
    if (data.socialMedia) setSocialMedia(data.socialMedia);
    if (data.address && typeof data.address === "object") {
      setLocationObj(data.address);
    } else if (data.location && typeof data.location === "object") {
      setLocationObj(data.location);
    }
    if (data.businessHours) {
      const hoursText = formatBusinessHours(data.businessHours, locale, "Sat - Thu: 08:00 - 17:00");
      setWorkingHoursObj((prev) => ({ ...prev, [locale]: hoursText }));
    } else if (data.workingHours) {
      if (typeof data.workingHours === "object") {
        setWorkingHoursObj(data.workingHours);
      } else if (typeof data.workingHours === "string") {
        setWorkingHoursObj((prev) => ({ ...prev, [locale]: data.workingHours }));
      }
    }
  };

  const activeWorkingHours = workingHoursObj[locale] || workingHoursObj.en || "";
  const activeLocation = locationObj[locale] || locationObj.en || "Lot 24, Zone Industrielle, Bab Ezzouar, Algiers, Algeria";

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        phone,
        email,
        socialMedia,
        locationObj,
        workingHoursObj,
        activeWorkingHours,
        activeLocation,
        loading,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
