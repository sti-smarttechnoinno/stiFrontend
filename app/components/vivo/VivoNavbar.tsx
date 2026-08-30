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
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
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
      noResults: "لم يتم العثور على نتائج تطابق « {query} »",
      suggestionsLabel: "اقتراحات سريعة:",
      clearSearch: "مسح البحث",
      quickResultsLabel: "النتائج ({count})",
    },
  };

  const navT =
    t?.vivoNavbar ||
    t?.stiHome?.vivoNavbar ||
    localeDicts[locale] ||
    localeDicts.fr;

  const [searchQuery, setSearchQuery] = useState("");

  const searchDatabase: Record<
    string,
    Array<{
      title: string;
      category: string;
      description: string;
      href: string;
      keywords: string[];
    }>
  > = {
    fr: [
      {
        title: "vivo V70 FE",
        category: "Série V",
        description: "Portraits d’exception, design ultra-fin et optique de précision.",
        href: `/${locale}/vivo/products/v-series/v70fe`,
        keywords: ["v70fe", "v70", "fe", "serie v", "v series", "portrait", "camera", "optique", "smartphone"],
      },
      {
        title: "vivo Y21D",
        category: "Série Y",
        description: "Autonomie longue durée, écran immersif et fluidité au quotidien.",
        href: `/${locale}/vivo/products/y-series/y21d`,
        keywords: ["y21d", "y21", "serie y", "y series", "batterie", "autonomie", "smartphone"],
      },
      {
        title: "vivo Y05",
        category: "Série Y",
        description: "Simplement vivo : simplicité, confort et endurance fiable.",
        href: `/${locale}/vivo/products/y-series/y05`,
        keywords: ["y05", "y5", "serie y", "y series", "accessible", "smartphone"],
      },
      {
        title: "Série V — Portraits d’exception",
        category: "Gamme vivo",
        description: "Découvrez tous les modèles Série V dédiés à la photographie et au design.",
        href: `/${locale}/vivo/products/v-series`,
        keywords: ["serie v", "v-series", "v series", "portraits", "haut de gamme", "premium"],
      },
      {
        title: "Série Y — L’essentiel, en mieux",
        category: "Gamme vivo",
        description: "Découvrez tous les modèles Série Y alliant endurance et confort.",
        href: `/${locale}/vivo/products/y-series`,
        keywords: ["serie y", "y-series", "y series", "autonomie", "batterie", "quotidien"],
      },
      {
        title: "Collection Complète vivo",
        category: "Produits",
        description: "Explorez tous les smartphones officiels vivo distribués en Algérie par STI.",
        href: `/${locale}/vivo/products`,
        keywords: ["produits", "catalogue", "tous les produits", "smartphones", "gamme", "collection"],
      },
      {
        title: "Technologie & Innovation",
        category: "Univers vivo",
        description: "Vision technologique, philosophie d’ingénierie et optique avancée.",
        href: `/${locale}/vivo/technology`,
        keywords: ["technologie", "innovation", "camera", "optique", "zeiss", "principes", "imagerie"],
      },
      {
        title: "Trouver un point de vente",
        category: "Réseau STI",
        description: "Localisez les centres officiels STI (Sétif, Alger) et revendeurs agréés.",
        href: `/${locale}/vivo/find-a-store`,
        keywords: ["magasin", "boutique", "point de vente", "store", "setif", "alger", "revendeur", "distributeur", "carte", "localisation"],
      },
      {
        title: "Support, SAV & Garantie",
        category: "Assistance",
        description: "Assistance client, service après-vente, FAQ et garantie officielle STI.",
        href: `/${locale}/vivo/support`,
        keywords: ["support", "sav", "service apres vente", "garantie", "reparation", "aide", "faq", "assistance"],
      },
      {
        title: "À propos de vivo & STI",
        category: "Entreprise",
        description: "Découvrez notre mission de distribution officielle et notre présence en Algérie.",
        href: `/${locale}/vivo/about`,
        keywords: ["a propos", "sti", "entreprise", "distributeur officiel", "qui sommes nous", "role", "algerie"],
      },
      {
        title: "Contact & Devenir revendeur",
        category: "Contact",
        description: "Envoyez une demande commerciale, question produit ou demande de partenariat.",
        href: `/${locale}/vivo/support#contact-form`,
        keywords: ["contact", "ecrire", "email", "devis", "partenaire", "rejoindre", "revendeur", "formulaire"],
      },
    ],
    en: [
      {
        title: "vivo V70 FE",
        category: "V Series",
        description: "Exceptional portraits, ultra-slim design, and precision optics.",
        href: `/${locale}/vivo/products/v-series/v70fe`,
        keywords: ["v70fe", "v70", "fe", "v series", "v-series", "portrait", "camera", "optics", "smartphone"],
      },
      {
        title: "vivo Y21D",
        category: "Y Series",
        description: "Long-lasting battery life, immersive display, and everyday smoothness.",
        href: `/${locale}/vivo/products/y-series/y21d`,
        keywords: ["y21d", "y21", "y series", "y-series", "battery", "autonomy", "smartphone"],
      },
      {
        title: "vivo Y05",
        category: "Y Series",
        description: "Simply vivo: simplicity, ergonomics, and reliable endurance.",
        href: `/${locale}/vivo/products/y-series/y05`,
        keywords: ["y05", "y5", "y series", "y-series", "accessible", "smartphone"],
      },
      {
        title: "V Series — Next-Gen Portraits",
        category: "vivo Lineup",
        description: "Explore all V Series models dedicated to photography and sleek design.",
        href: `/${locale}/vivo/products/v-series`,
        keywords: ["v series", "v-series", "portraits", "flagship", "premium"],
      },
      {
        title: "Y Series — The Essentials, Elevated",
        category: "vivo Lineup",
        description: "Explore all Y Series smartphones combining battery endurance and comfort.",
        href: `/${locale}/vivo/products/y-series`,
        keywords: ["y series", "y-series", "battery", "daily", "performance"],
      },
      {
        title: "Complete vivo Collection",
        category: "Products",
        description: "Browse all official vivo smartphones distributed in Algeria by STI.",
        href: `/${locale}/vivo/products`,
        keywords: ["products", "catalog", "all products", "smartphones", "lineup", "collection"],
      },
      {
        title: "Technology & Innovation",
        category: "vivo Universe",
        description: "Technological vision, engineering philosophy, and advanced imaging.",
        href: `/${locale}/vivo/technology`,
        keywords: ["technology", "innovation", "camera", "optics", "principles", "imaging"],
      },
      {
        title: "Find a Store & Retailers",
        category: "STI Network",
        description: "Locate official STI centers (Setif, Algiers) and authorized dealers.",
        href: `/${locale}/vivo/find-a-store`,
        keywords: ["store", "shop", "find a store", "retailer", "setif", "algiers", "dealer", "map", "location"],
      },
      {
        title: "Support, After-Sales & Warranty",
        category: "Customer Care",
        description: "Customer service, warranty verification, FAQ, and STI support.",
        href: `/${locale}/vivo/support`,
        keywords: ["support", "after sales", "warranty", "repair", "help", "faq", "customer service"],
      },
      {
        title: "About vivo & STI",
        category: "Company",
        description: "Discover our mission as official distributor and our presence in Algeria.",
        href: `/${locale}/vivo/about`,
        keywords: ["about", "sti", "company", "official distributor", "who we are", "algeria"],
      },
      {
        title: "Contact & Partnership Inquiries",
        category: "Contact",
        description: "Get in touch with our team for product inquiries or retail partnerships.",
        href: `/${locale}/vivo/support#contact-form`,
        keywords: ["contact", "email", "inquiry", "partner", "dealer", "form", "reach out"],
      },
    ],
    ar: [
      {
        title: "هاتف فيفو V70 FE",
        category: "سلسلة V",
        description: "تصوير بورتريه استثنائي، تصميم فائق النحافة وبصريات دقيقة متطورة.",
        href: `/${locale}/vivo/products/v-series/v70fe`,
        keywords: ["v70fe", "v70", "fe", "سلسلة v", "بورتريه", "كاميرا", "تصوير", "هاتف"],
      },
      {
        title: "هاتف فيفو Y21D",
        category: "سلسلة Y",
        description: "بطارية تدوم طويلاً، شاشة مريحة وأداء يومي فائق السلاسة.",
        href: `/${locale}/vivo/products/y-series/y21d`,
        keywords: ["y21d", "y21", "سلسلة y", "بطارية", "استقلالية", "هاتف"],
      },
      {
        title: "هاتف فيفو Y05",
        category: "سلسلة Y",
        description: "بساطة فيفو : سهولة استخدام، بطارية قوية واعتمادية عالية.",
        href: `/${locale}/vivo/products/y-series/y05`,
        keywords: ["y05", "y5", "سلسلة y", "اقتصادي", "هاتف"],
      },
      {
        title: "سلسلة V — بورتريه مميز وتصميم راقٍ",
        category: "تشكيلة فيفو",
        description: "استكشف جميع هواتف سلسلة V المخصصة للإبداع والتصوير المتقدم.",
        href: `/${locale}/vivo/products/v-series`,
        keywords: ["سلسلة v", "v series", "بورتريه", "تصميم راقي", "بريميوم"],
      },
      {
        title: "سلسلة Y — الأساسيات بأداء أفضل",
        category: "تشكيلة فيفو",
        description: "استكشف جميع هواتف سلسلة Y التي تجمع بين البطارية القوية والأداء السلس.",
        href: `/${locale}/vivo/products/y-series`,
        keywords: ["سلسلة y", "y series", "بطارية", "شحن", "استخدام يومي"],
      },
      {
        title: "المجموعة الكاملة لهواتف فيفو",
        category: "المنتجات",
        description: "تصفح جميع هواتف فيفو الرسمية الموزعة في الجزائر عبر STI.",
        href: `/${locale}/vivo/products`,
        keywords: ["المنتجات", "دليل", "جميع الهواتف", "هواتف", "كتالوج", "مجموعة"],
      },
      {
        title: "التكنولوجيا والابتكار",
        category: "عالم فيفو",
        description: "رؤية فيفو التكنولوجية، فلسفة الهندسة وأنظمة التصوير المتقدمة.",
        href: `/${locale}/vivo/technology`,
        keywords: ["التكنولوجيا", "الابتكار", "كاميرا", "بصريات", "مبادئ", "تصوير"],
      },
      {
        title: "نقاط البيع والمتاجر المعتمدة",
        category: "شبكة STI",
        description: "حدد مواقع المقر الرئيسي لـ STI (سطيف، الجزائر العاصمة) ونقاط البيع.",
        href: `/${locale}/vivo/find-a-store`,
        keywords: ["متجر", "محل", "نقطة بيع", "سطيف", "الجزائر", "موزع", "وكيل", "خريطة", "موقع"],
      },
      {
        title: "الدعم، الصيانة والضمان الرسمي",
        category: "خدمة العملاء",
        description: "خدمة ما بعد البيع، شهادة الضمان المعتمد والأسئلة الشائعة لدى STI.",
        href: `/${locale}/vivo/support`,
        keywords: ["الدعم", "خدمة ما بعد البيع", "الصيانة", "الضمان", "مساعدة", "اسئلة شائعة", "sav"],
      },
      {
        title: "من نحن (فيفو الجزائر و STI)",
        category: "عن الشركة",
        description: "تعرف على دور ورؤية شركة STI، الموزع الرسمي لعلامة فيفو في الجزائر.",
        href: `/${locale}/vivo/about`,
        keywords: ["من نحن", "عن الشركة", "sti", "الموزع الرسمي", "فيفو الجزائر"],
      },
      {
        title: "التواصل والانضمام لشبكة التوزيع",
        category: "اتصل بنا",
        description: "تواصل مع فريقنا لطلب معلومات المنتجات أو لطلب شراكة توزيع.",
        href: `/${locale}/vivo/support#contact-form`,
        keywords: ["اتصل بنا", "تواصل", "بريد", "طلب", "شريك", "انضمام", "موزع", "نموذج"],
      },
    ],
  };

  const currentDb = searchDatabase[locale] || searchDatabase.fr;
  const cleanQuery = searchQuery.trim().toLowerCase();

  const searchResults = cleanQuery
    ? currentDb.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(cleanQuery);
        const descMatch = item.description.toLowerCase().includes(cleanQuery);
        const catMatch = item.category.toLowerCase().includes(cleanQuery);
        const keywordMatch = item.keywords.some((kw) => kw.toLowerCase().includes(cleanQuery));
        return titleMatch || descMatch || catMatch || keywordMatch;
      })
    : [];

  const suggestionChips =
    {
      fr: ["Série V", "Série Y", "V70 FE", "Y21D", "Points de vente", "SAV & Support", "Technologie"],
      en: ["V Series", "Y Series", "V70 FE", "Y21D", "Store Locator", "Support & Warranty", "Technology"],
      ar: ["سلسلة V", "سلسلة Y", "V70 FE", "Y21D", "نقاط البيع", "الدعم والضمان", "التكنولوجيا"],
    }[locale] || ["Série V", "Série Y", "V70 FE", "Y21D", "Points de vente", "SAV & Support"];

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  const closePanels = () => {
    setMenuOpen(false);
    setProductsOpen(false);
    setMobileProductsOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
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

  const noResultsText = (navT.noResults || "Aucun résultat trouvé pour « {query} »").replace(
    "{query}",
    searchQuery
  );
  const resultsCountText = (navT.quickResultsLabel || "Résultats ({count})").replace(
    "{count}",
    String(searchResults.length)
  );

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
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-inner">
            <button
              type="button"
              className="w-full flex items-center justify-between py-3.5 mb-4 px-4 rounded bg-white/5 border border-white/10 text-white/80 text-sm hover:bg-white/10 transition-colors"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
            >
              <span className="flex items-center gap-2.5">
                <Search size={16} className="text-[#5f8dff]" />
                <span>{navT.searchPlaceholder}</span>
              </span>
              <span className="text-[10px] text-[#5f8dff] font-bold uppercase tracking-wider">
                {navT.searchAria}
              </span>
            </button>
            <div className="mobile-menu-kicker">{navT.mobileNavKicker}</div>
            {navLinks.map((link, index) => {
              if (link.dropdown) {
                return (
                  <div key={link.label} className="mobile-nav-item">
                    <button
                      type="button"
                      className="mobile-link mobile-dropdown-toggle"
                      onClick={() => setMobileProductsOpen((prev) => !prev)}
                      aria-expanded={mobileProductsOpen}
                    >
                      <span>
                        <sup>0{index + 1}</sup>
                        {link.label}
                      </span>
                      <ChevronDown
                        size={17}
                        className={`transition-transform duration-200 ${
                          mobileProductsOpen ? "rotate-180 text-[#5f8dff]" : ""
                        }`}
                      />
                    </button>

                    {mobileProductsOpen && (
                      <div className="mobile-submenu">
                        {productDropdownItems.map(([name, detail, href]) => (
                          <Link
                            key={name}
                            href={href}
                            className="mobile-sublink"
                            onClick={closePanels}
                          >
                            <div className="mobile-sublink-info">
                              <span className="mobile-sublink-title">{name}</span>
                              <span className="mobile-sublink-desc">{detail}</span>
                            </div>
                            <ArrowUpRight size={16} />
                          </Link>
                        ))}
                        <Link
                          href={`/${locale}/vivo/products`}
                          className="mobile-sublink"
                          onClick={closePanels}
                        >
                          <div className="mobile-sublink-info">
                            <span className="mobile-sublink-title text-[#5f8dff]">
                              {t?.vivoHero?.viewAll || "Voir tous les produits"}
                            </span>
                          </div>
                          <ArrowUpRight size={16} />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
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
                  <ArrowUpRight size={17} />
                </Link>
              );
            })}
            <div className="mobile-menu-footer">
              <span>{navT.mobileFooterDistributor}</span>
              <Link href={`/${locale}/vivo/find-a-store`} onClick={closePanels}>
                {navT.findStore} <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {searchOpen && (
        <div
          className="search-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={navT.searchOverlayAria || "Recherche"}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closePanels();
            }
          }}
        >
          <button
            className="search-close"
            type="button"
            aria-label={navT.searchCloseAria || "Fermer la recherche"}
            onClick={closePanels}
          >
            <X size={22} />
          </button>
          <div className="search-panel">
            <span className="eyebrow eyebrow--blue">{navT.searchEyebrow}</span>
            <h2>{navT.searchTitle}</h2>
            <label className="search-field">
              <Search size={22} strokeWidth={1.55} />
              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={navT.searchPlaceholder}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                  title={navT.clearSearch || "Effacer"}
                >
                  <X size={16} />
                </button>
              )}
            </label>

            {/* Suggestions chips */}
            {!cleanQuery && (
              <>
                <p>{navT.searchHint}</p>
                <div className="search-suggestions">
                  <span className="search-suggestions-label">
                    {navT.suggestionsLabel || "Suggestions :"}
                  </span>
                  {suggestionChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className="search-chip"
                      onClick={() => setSearchQuery(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Active search results */}
            {cleanQuery && searchResults.length > 0 && (
              <div className="search-results">
                <div className="search-results-count">{resultsCountText}</div>
                {searchResults.map((item) => (
                  <Link
                    key={item.href + item.title}
                    href={item.href}
                    className="search-result-item"
                    onClick={closePanels}
                  >
                    <div className="search-result-info">
                      <span className="search-result-badge">{item.category}</span>
                      <strong className="search-result-title">{item.title}</strong>
                      <span className="search-result-desc">{item.description}</span>
                    </div>
                    <ArrowUpRight size={18} className="search-result-arrow" />
                  </Link>
                ))}
              </div>
            )}

            {/* No results state */}
            {cleanQuery && searchResults.length === 0 && (
              <div className="search-no-results">
                <p className="!m-0">{noResultsText}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
