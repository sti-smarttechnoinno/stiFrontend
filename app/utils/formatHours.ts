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

  let rawOpen = firstDayData?.open || "";
  let rawClose = firstDayData?.close || "";

  if (lang === "fr") {
    rawOpen = rawOpen.replace(":", "h");
    rawClose = rawClose.replace(":", "h");
  }

  const dayRange = firstDayKey === lastDayKey ? firstName : `${firstName} - ${lastName}`;
  return `${dayRange} ${rawOpen} - ${rawClose}`;
}

const fullDayNamesMap: Record<string, Record<string, string>> = {
  saturday: { en: "Saturday", fr: "Samedi", ar: "السبت" },
  sunday: { en: "Sunday", fr: "Dimanche", ar: "الأحد" },
  monday: { en: "Monday", fr: "Lundi", ar: "الإثنين" },
  tuesday: { en: "Tuesday", fr: "Mardi", ar: "الثلاثاء" },
  wednesday: { en: "Wednesday", fr: "Mercredi", ar: "الأربعاء" },
  thursday: { en: "Thursday", fr: "Jeudi", ar: "الخميس" },
  friday: { en: "Friday", fr: "Vendredi", ar: "الجمعة" },
};

export function formatClosedDays(
  businessHours?: BusinessHours | null,
  locale: string = "en",
  fallback: string = ""
): string {
  if (!businessHours || typeof businessHours !== "object") {
    return fallback;
  }

  const closedDays = weekOrder.filter((dayKey) => {
    const dayData = (businessHours as any)[dayKey];
    return dayData && dayData.isClosed;
  });

  const lang = ["en", "fr", "ar"].includes(locale) ? locale : "en";

  if (closedDays.length === 0) {
    if (lang === "ar") return "مفتوح 7 أيام في الأسبوع";
    if (lang === "fr") return "Ouvert 7j/7";
    return "Open 7 days a week";
  }

  const dayNames = closedDays.map((d) => fullDayNamesMap[d]?.[lang] || d).join(", ");

  if (lang === "ar") return `${dayNames}: مغلق`;
  if (lang === "fr") return `${dayNames} : Fermé`;
  return `${dayNames}: Closed`;
}

