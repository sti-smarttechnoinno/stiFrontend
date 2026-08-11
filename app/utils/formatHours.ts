export interface DayHours {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface BusinessHours {
  saturday?: DayHours;
  sunday?: DayHours;
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
}

const dayNamesMap: Record<string, Record<string, string>> = {
  saturday: { en: "Sat", fr: "Sam", ar: "السبت" },
  sunday: { en: "Sun", fr: "Dim", ar: "الأحد" },
  monday: { en: "Mon", fr: "Lun", ar: "الإثنين" },
  tuesday: { en: "Tue", fr: "Mar", ar: "الثلاثاء" },
  wednesday: { en: "Wed", fr: "Mer", ar: "الأربعاء" },
  thursday: { en: "Thu", fr: "Jeu", ar: "الخميس" },
  friday: { en: "Fri", fr: "Ven", ar: "الجمعة" },
};

const weekOrder = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"];

export function formatBusinessHours(
  businessHours?: BusinessHours | null,
  locale: string = "en",
  fallback: string = ""
): string {
  if (!businessHours || typeof businessHours !== "object") {
    return fallback;
  }

  const openDays = weekOrder.filter((dayKey) => {
    const dayData = (businessHours as any)[dayKey];
    return dayData && !dayData.isClosed;
  });

  if (openDays.length === 0) {
    if (locale === "ar") return "مغلق";
    if (locale === "fr") return "Fermé";
    return "Closed";
  }

  const firstDayKey = openDays[0];
  const lastDayKey = openDays[openDays.length - 1];

  const firstDayData = (businessHours as any)[firstDayKey];
  const lang = ["en", "fr", "ar"].includes(locale) ? locale : "en";

  const firstName = dayNamesMap[firstDayKey]?.[lang] || firstDayKey;
  const lastName = dayNamesMap[lastDayKey]?.[lang] || lastDayKey;

  let rawOpen = firstDayData?.open || "08:00";
  let rawClose = firstDayData?.close || "17:00";

  if (lang === "fr") {
    rawOpen = rawOpen.replace(":", "h");
    rawClose = rawClose.replace(":", "h");
  }

  const dayRange = firstDayKey === lastDayKey ? firstName : `${firstName} - ${lastName}`;
  return `${dayRange} ${rawOpen} - ${rawClose}`;
}
