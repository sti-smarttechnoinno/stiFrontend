"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "@/app/[locale]/use-translations";

export function VivoFooter() {
  const params = useParams();
  const pathname = usePathname() || "";
  const locale = (params?.locale as string) || "fr";
  const t = useTranslations() as any;

  const footerT = t?.vivoFooter || t?.stiHome?.vivoFooter || {};

  const isVivoHome = pathname === `/${locale}/vivo` || pathname === `/vivo`;
  const isProducts = pathname.includes("/vivo/products");
  const isFindStore = pathname.includes("/vivo/find-a-store");
  const isSupport = pathname.includes("/vivo/support");
  const isTech = pathname.includes("/vivo/technology");
  const isAbout = pathname.includes("/vivo/about");

  const dicts: Record<string, any> = {
    fr: {
      copyright: "© 2026 vivo Algeria · STI Partenaire officiel",
      defaultTagline: "Conçu pour l’Algérie, avec précision.",
      findStoreTagline: "Réseau de distribution Algérie · Sétif & Alger",
      supportTagline: "Support local",
      techTagline: "Technologie au quotidien",
      aboutTagline: "Conçu pour l’Algérie, avec précision.",
      productsTagline: "Conçu pour l’Algérie, avec précision.",
      backToSti: "Retour au site STI",
      backToVivo: "Retour à l’accueil vivo",
    },
    en: {
      copyright: "© 2026 vivo Algeria · STI Official Partner",
      defaultTagline: "Designed for Algeria, with precision.",
      findStoreTagline: "Distribution Network Algeria · Setif & Algiers",
      supportTagline: "Local support",
      techTagline: "Everyday technology",
      aboutTagline: "Designed for Algeria, with precision.",
      productsTagline: "Designed for Algeria, with precision.",
      backToSti: "Back to STI Website",
      backToVivo: "Back to vivo Home",
    },
    ar: {
      copyright: "© 2026 فيفو الجزائر · STI الشريك الرسمي",
      defaultTagline: "صُمم للجزائر بكل دقة وإتقان.",
      findStoreTagline: "شبكة التوزيع في الجزائر · سطيف والجزائر العاصمة",
      supportTagline: "دعم محلي",
      techTagline: "تكنولوجيا في كل يوم",
      aboutTagline: "صُمم للجزائر بكل دقة وإتقان.",
      productsTagline: "صُمم للجزائر بكل دقة وإتقان.",
      backToSti: "العودة إلى موقع STI",
      backToVivo: "العودة إلى الرئيسية فيفو",
    },
  };

  const d = dicts[locale] || dicts.fr;

  let tagline = footerT.tagline || d.defaultTagline;
  if (isFindStore) tagline = d.findStoreTagline;
  else if (isSupport) tagline = d.supportTagline;
  else if (isTech) tagline = d.techTagline;
  else if (isAbout) tagline = d.aboutTagline;
  else if (isProducts && !isVivoHome) tagline = d.productsTagline;

  let backHref = `/${locale}/vivo`;
  let backLabel = d.backToVivo;

  if (isVivoHome) {
    backHref = `/${locale}`;
    backLabel = footerT.backToSti || d.backToSti;
  }

  return (
    <footer className="site-footer">
      <div className="content-container footer-inner">
        <span>{footerT.copyright || d.copyright}</span>
        <span>{tagline}</span>
        <Link href={backHref}>
          {backLabel} <ArrowUpRight size={14} />
        </Link>
      </div>
    </footer>
  );
}
