"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useTranslations } from "@/app/[locale]/use-translations";

export function VivoNavbar() {
  const params = useParams();
  const pathname = usePathname() || "";
  const locale = (params?.locale as string) || "fr";
  const t = useTranslations() as any;

  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const localeDicts: Record<string, any> = {
    fr: {
      announcement: "vivo Algérie — Distributeur officiel",
      learnMore: "En savoir plus",
      products: "Produits",
      technology: "Technologie",
      support: "Support",
      about: "À propos",
      exploreIntro: "Explorer vivo",
      exploreDesc: "Une gamme pensée pour chaque façon de voir le monde.",
      vSeriesName: "Série V",
      vSeriesDesc: "Portraits qui se démarquent · Design premium",
      ySeriesName: "Série Y",
      ySeriesDesc: "L’essentiel, en mieux · Autonomie longue durée",
      findStore: "Trouver un point de vente",
      searchAria: "Rechercher",
      menuOpenAria: "Ouvrir le menu",
      menuCloseAria: "Fermer le menu",
      navAria: "Navigation principale",
      mobileNavKicker: "Navigation",
      mobileFooterDistributor: "Distributeur Officiel STI",
      searchOverlayAria: "Recherche",
      searchCloseAria: "Fermer la recherche",
      searchEyebrow: "Recherche vivo Algérie",
      searchTitle: "Que cherchez-vous ?",
      searchPlaceholder: "Rechercher un produit, une série…",
      searchHint: "Essayez « Série V », « Série Y », « service après-vente » ou « revendeurs ».",
    },
    en: {
      announcement: "vivo Algeria — Official Distributor",
      learnMore: "Learn more",
      products: "Products",
      technology: "Technology",
      support: "Support",
      about: "About",
      exploreIntro: "Explore vivo",
      exploreDesc: "A lineup designed for every perspective on the world.",
      vSeriesName: "V Series",
      vSeriesDesc: "Portraits that stand out · Premium design",
      ySeriesName: "Y Series",
      ySeriesDesc: "The essentials, elevated · Long battery life",
      findStore: "Find a Store",
      searchAria: "Search",
      menuOpenAria: "Open menu",
      menuCloseAria: "Close menu",
      navAria: "Main navigation",
      mobileNavKicker: "Navigation",
      mobileFooterDistributor: "Official STI Distributor",
      searchOverlayAria: "Search",
      searchCloseAria: "Close search",
      searchEyebrow: "Search vivo Algeria",
      searchTitle: "What are you looking for?",
      searchPlaceholder: "Search a product, series…",
      searchHint: "Try \"V Series\", \"Y Series\", \"after-sales service\" or \"retailers\".",
    },
    ar: {
      announcement: "فيفو الجزائر — الموزع الرسمي",
      learnMore: "اعرف المزيد",
      products: "المنتجات",
      technology: "التكنولوجيا",
      support: "الدعم",
      about: "من نحن",
      exploreIntro: "استكشف فيفو",
      exploreDesc: "تشكيلة مبتكرة صُممت لكل أسلوب ورؤية.",
      vSeriesName: "سلسلة V",
      vSeriesDesc: "بورتريه مميز واستثنائي · تصميم راقٍ",
      ySeriesName: "سلسلة Y",
      ySeriesDesc: "الأساسيات بأداء أفضل · بطارية تدوم طويلاً",
      findStore: "العثور على نقطة بيع",
      searchAria: "بحث",
      menuOpenAria: "فتح القائمة",
      menuCloseAria: "إغلاق القائمة",
      navAria: "التنقل الرئيسي",
      mobileNavKicker: "التنقل",
      mobileFooterDistributor: "الموزع الرسمي STI",
      searchOverlayAria: "البحث",
      searchCloseAria: "إغلاق البحث",
      searchEyebrow: "البحث في فيفو الجزائر",
      searchTitle: "عن ماذا تبحث؟",
      searchPlaceholder: "ابحث عن منتج، سلسلة…",
      searchHint: "جرب «سلسلة V»، «سلسلة Y»، «خدمة ما بعد البيع» أو «الموزعين».",
    },
  };

  const navT =
    t?.vivoNavbar ||
    t?.stiHome?.vivoNavbar ||
    localeDicts[locale] ||
    localeDicts.fr;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  const closePanels = () => {
    setMenuOpen(false);
    setProductsOpen(false);
    setSearchOpen(false);
  };

  const navLinks = [
    { label: navT.products || "Produits", href: `/${locale}/vivo/products`, dropdown: true },
    { label: navT.technology || "Technologie", href: `/${locale}/vivo/technology` },
    { label: navT.support || "Support", href: `/${locale}/vivo/support` },
    { label: navT.about || "À propos", href: `/${locale}/vivo/about` },
  ];

  const productDropdownItems = [
    [
      navT.vSeriesName || "Série V",
      navT.vSeriesDesc || "Portraits qui se démarquent · Design premium",
      `/${locale}/vivo/products/v-series`,
    ],
    [
      navT.ySeriesName || "Série Y",
      navT.ySeriesDesc || "L’essentiel, en mieux · Autonomie longue durée",
      `/${locale}/vivo/products/y-series`,
    ],
  ];

  return (
    <>
      <div className="announcement-bar">
        <div className="announcement-inner">
          <span className="announcement-dot" aria-hidden="true" />
          <span>{navT.announcement}</span>
          <Link href={`/${locale}/vivo/about`}>{navT.learnMore}</Link>
        </div>
      </div>
      <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <div className="nav-wrap">
          {/* Left Brand: STI Logo + Divider + VIVO Logo (Centered in Y-axis) */}
          <div className="nav-brand flex items-center gap-3 sm:gap-4 my-auto h-full">
            <Link
              href={`/${locale}`}
              className="flex items-center group transition-transform duration-200 hover:scale-[1.03]"
              title="STI — Smart Technologie Innovation"
              onClick={closePanels}
            >
              <div className="relative flex items-center h-8 sm:h-9">
                <Image
                  src="/assets/logo.png"
                  alt="STI — Smart Technologie Innovation"
                  width={140}
                  height={45}
                  priority
                  className="h-7 sm:h-8 w-auto object-contain brightness-0 invert drop-shadow-[0_2px_10px_rgba(255,255,255,0.18)]"
                />
              </div>
            </Link>

            <span className="brand-divider my-auto" aria-hidden="true" />

            <Link
              href={`/${locale}/vivo`}
              className="flex items-center group transition-transform duration-200 hover:scale-[1.03]"
              aria-label="vivo Algérie — Accueil"
              onClick={closePanels}
            >
              <div className="relative flex items-center h-7 sm:h-8 w-20 sm:w-24">
                <Image
                  src="/assets/vivo-logo.svg"
                  alt="vivo"
                  width={100}
                  height={28}
                  priority
                  className="h-5 sm:h-6 w-auto object-contain brightness-0 invert opacity-95"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links (Centered in Y-axis) */}
          <nav className="desktop-nav flex items-center h-full my-auto" aria-label={navT.navAria || "Navigation principale"}>
            {navLinks.map((link) => (
              <div
                className="nav-item-wrap flex items-center h-full"
                key={link.label}
                onMouseEnter={() => link.dropdown && setProductsOpen(true)}
                onMouseLeave={() => link.dropdown && setProductsOpen(false)}
                onFocus={() => link.dropdown && setProductsOpen(true)}
              >
                <Link
                  href={link.href}
                  className={`nav-link flex items-center justify-center h-full ${
                    pathname === link.href || (link.dropdown && pathname.startsWith(`/${locale}/vivo/products`))
                      ? "nav-link--active"
                      : ""
                  }`}
                  onClick={() => link.dropdown && setProductsOpen(false)}
                  aria-expanded={link.dropdown ? productsOpen : undefined}
                >
                  {link.label}
                  {link.dropdown && (
                    <ChevronDown
                      size={14}
                      strokeWidth={1.7}
                      className={productsOpen ? "chevron-rotated" : ""}
                    />
                  )}
                </Link>
                {link.dropdown && productsOpen && (
                  <div className="products-menu" role="menu">
                    <div className="products-menu-intro">
                      <span className="eyebrow eyebrow--blue">{navT.exploreIntro}</span>
                      <p>{navT.exploreDesc}</p>
                    </div>
                    <div className="products-menu-grid">
                      {productDropdownItems.map(([name, detail, href]) => (
                        <Link
                          key={name}
                          href={href}
                          role="menuitem"
                          onClick={() => setProductsOpen(false)}
                        >
                          <span>{name}</span>
                          <small>{detail}</small>
                          <ArrowUpRight size={15} strokeWidth={1.8} />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions: Search + Find Store CTA + Mobile toggle (Centered in Y-axis) */}
          <div className="nav-actions flex items-center h-full my-auto">
            <button
              className="icon-button"
              type="button"
              aria-label={navT.searchAria || "Rechercher"}
              onClick={() => setSearchOpen(true)}
            >
              <Search size={18} strokeWidth={1.65} />
            </button>
            <Link href={`/${locale}/vivo/find-a-store`} className="nav-cta">
              {navT.findStore} <ArrowUpRight size={14} />
            </Link>
            <button
              className="mobile-toggle"
              type="button"
              aria-label={menuOpen ? (navT.menuCloseAria || "Fermer le menu") : (navT.menuOpenAria || "Ouvrir le menu")}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={21} strokeWidth={1.7} /> : <Menu size={21} strokeWidth={1.7} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-inner">
              <div className="mobile-menu-kicker">{navT.mobileNavKicker}</div>
              {navLinks.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="mobile-link"
                  onClick={closePanels}
                >
                  <span>
                    <sup>0{index + 1}</sup>
                    {link.label}
                  </span>
                  {link.dropdown ? <ChevronDown size={17} /> : <ArrowUpRight size={17} />}
                </Link>
              ))}
              <div className="mobile-menu-footer">
                <span>{navT.mobileFooterDistributor}</span>
                <Link href={`/${locale}/vivo/find-a-store`} onClick={closePanels}>
                  {navT.findStore} <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label={navT.searchOverlayAria || "Recherche"}>
          <button
            className="search-close"
            type="button"
            aria-label={navT.searchCloseAria || "Fermer la recherche"}
            onClick={() => setSearchOpen(false)}
          >
            <X size={22} />
          </button>
          <div className="search-panel">
            <span className="eyebrow eyebrow--blue">{navT.searchEyebrow}</span>
            <h2>{navT.searchTitle}</h2>
            <label className="search-field">
              <Search size={22} strokeWidth={1.55} />
              <input autoFocus type="search" placeholder={navT.searchPlaceholder} />
            </label>
            <p>{navT.searchHint}</p>
          </div>
        </div>
      )}
    </>
  );
}
