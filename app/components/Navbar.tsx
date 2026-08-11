"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Phone,
  ChevronDown,
  Menu,
  X,
  Globe,
  Smartphone,
  Building2,
  Zap,
  CardSim,
  Package,
  ArrowRight,
} from "lucide-react";
import { useTranslations } from "../[locale]/use-translations";

const languages = ["en", "fr", "ar"];

function getSolutionIcon(slug: string) {
  switch (slug) {
    case "mobile-recharge-credit":
      return <Smartphone size={20} />;
    case "prepaid-sim-cards":
      return <CardSim size={20} />;
    case "wholesale-recharge":
      return <Building2 size={20} />;
    case "partner-services":
      return <Zap size={20} />;
    default:
      return <Package size={20} />;
  }
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [workingHoursObj, setWorkingHoursObj] = useState<{ [key: string]: string }>({});
  const [dbSolutions, setDbSolutions] = useState<Array<{ icon: React.ReactNode; title: string; description: string; href: string }>>([]);

  const currentLocale = pathname.split("/")[1] || "en";

  useEffect(() => {
    const localPhone = localStorage.getItem("sti_pref_phone");
    const localHoursJson = localStorage.getItem("sti_pref_working_hours_json");
    if (localPhone) setPhone(localPhone);
    if (localHoursJson) {
      try {
        setWorkingHoursObj(JSON.parse(localHoursJson));
      } catch {}
    }

    fetch("/api/preferences")
      .then((res) => res.json())
      .then((data) => {
        if (data.phone) setPhone(data.phone);
        if (data.workingHours) {
          if (typeof data.workingHours === "object") {
            setWorkingHoursObj(data.workingHours);
          } else if (typeof data.workingHours === "string") {
            setWorkingHoursObj((prev) => ({ ...prev, [currentLocale]: data.workingHours }));
          }
        }
      })
      .catch(() => {});
  }, [currentLocale]);

  useEffect(() => {
    async function loadSolutions() {
      try {
        const res = await fetch("/api/solutions");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const published = data.filter((s: any) => !s.status || s.status === "Published");
            const top4 = published.slice(0, 4).map((s: any) => {
              const lang = s.translations?.[currentLocale] || s.translations?.en || {};
              const desc = Array.isArray(lang.description) ? lang.description[0] : (lang.description || "");
              return {
                icon: getSolutionIcon(s.slug),
                title: lang.shortName || lang.name || s.slug,
                description: desc,
                href: `/${currentLocale}/solutions/${s.slug}`,
              };
            });
            if (top4.length > 0) {
              setDbSolutions(top4);
            }
          }
        }
      } catch {}
    }
    loadSolutions();
  }, [currentLocale]);

  const activeWorkingHours = workingHoursObj[currentLocale] || workingHoursObj.en || "";

  const defaultSolutionChildren = [
    {
      icon: <Smartphone size={20} />,
      title: t.nav.solutions_sub.mobile_recharge,
      description: t.nav.solutions_sub.mobile_recharge_desc,
      href: `/${currentLocale}/solutions/mobile-recharge-credit`,
    },
    {
      icon: <CardSim size={20} />,
      title: t.nav.solutions_sub.sim_cards,
      description: t.nav.solutions_sub.sim_cards_desc,
      href: `/${currentLocale}/solutions/prepaid-sim-cards`,
    },
    {
      icon: <Building2 size={20} />,
      title: t.nav.solutions_sub.wholesale,
      description: t.nav.solutions_sub.wholesale_desc,
      href: `/${currentLocale}/solutions/wholesale-recharge`,
    },
    {
      icon: <Zap size={20} />,
      title: t.nav.solutions_sub.partner,
      description: t.nav.solutions_sub.partner_desc,
      href: `/${currentLocale}/solutions/partner-services`,
    },
  ];

  const solutionChildren = dbSolutions.length > 0 ? dbSolutions : defaultSolutionChildren;

  const navItems = [
    { label: t.nav.home, href: `/${currentLocale}` },
    { label: t.nav.about, href: `/${currentLocale}/about` },
    {
      label: t.nav.solutions,
      href: `/${currentLocale}/solutions`,
      children: solutionChildren,
    },
    { label: t.nav.products, href: `/${currentLocale}/products` },
    { label: t.nav.news, href: `/${currentLocale}/news` },
    { label: t.nav.contact, href: `/${currentLocale}/contact` },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const onClick = () => setLangOpen(false);
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [langOpen]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setExpandedMobile(null);
  }, []);

  const switchLocale = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        }`}
        style={{ height: 76 }}
      >
        <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.05]">
            <Image
              src="/assets/logo.png"
              alt="STI - Smart Technologie Innovation"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="nav-item relative">
                <Link
                  href={item.href}
                  className={`nav-link flex items-center gap-1 px-3 py-1.5 text-[13px] font-semibold transition-colors rounded-lg hover:bg-gray-50 ${
                    scrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown size={14} className="opacity-50" />}
                </Link>

                {/* Mega Menu */}
                {item.children && (
                  <div className="mega-menu absolute top-full left-0 rtl:left-auto rtl:right-0 pt-3">
                    <div className="w-[540px] rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
                      <div className="grid grid-cols-2 gap-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.title}
                            href={child.href ?? item.href}
                            className="flex items-start gap-3 rounded-xl p-3.5 transition-all hover:bg-gray-50 group"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-primary/8 text-red-primary transition-colors group-hover:bg-red-primary group-hover:text-white">
                              {child.icon}
                            </div>
                            <div>
                              <div className="text-[12px] font-semibold text-gray-900 group-hover:text-red-primary transition-colors line-clamp-1">
                                {child.title}
                              </div>
                              <div className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{child.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end">
                        <Link
                          href={`/${currentLocale}/solutions`}
                          className="inline-flex items-center gap-1.5 text-[12px] font-bold text-red-primary transition-colors hover:text-red-accent group"
                        >
                          <span>{t.nav.view_all_solutions || "View All Solutions"}</span>
                          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50/80 px-2.5 py-1 text-[11px] font-semibold text-gray-700 transition-all hover:bg-gray-100"
              >
                <Globe size={14} />
                {currentLocale.toUpperCase()}
                <ChevronDown size={12} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 rtl:right-auto rtl:left-0 mt-2 w-28 rounded-xl border border-gray-100 bg-white py-1 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                  {languages.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        switchLocale(l);
                        setLangOpen(false);
                      }}
                      className={`flex w-full items-center px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-gray-50 ${
                        currentLocale === l ? "text-red-primary" : "text-gray-700"
                      }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Phone & Working Hours */}
            {phone && (
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                itemProp="telephone"
                aria-label={`Call STI Ooredoo distributor at ${phone}`}
                className="hidden xl:flex items-center gap-2 text-gray-600 transition-colors hover:text-red-primary"
              >
                <Phone size={15} className="shrink-0 text-red-primary" aria-hidden="true" />
                <div className="text-start">
                  <div className="text-[12px] font-bold leading-tight tracking-tight text-gray-900">
                    <bdo dir="ltr" className="inline-block">{phone}</bdo>
                  </div>
                  {activeWorkingHours && (
                    <div className="text-[9px] font-medium text-gray-500" itemProp="openingHours">
                      {activeWorkingHours}
                    </div>
                  )}
                </div>
              </a>
            )}

            {/* Mobile Toggle */}
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" onClick={closeMobile} />
      )}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-80 bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-gray-100 px-6">
          <span className="text-sm font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            {t.nav.menu}
          </span>
          <button
            aria-label="Close menu"
            onClick={closeMobile}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-4" style={{ height: "calc(100vh - 76px)" }}>
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-gray-50">
              {item.children ? (
                <>
                  <button
                    onClick={() => setExpandedMobile(expandedMobile === item.label ? null : item.label)}
                    className="flex w-full items-center justify-between py-3 text-[13px] font-semibold text-gray-700"
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${expandedMobile === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all ${
                      expandedMobile === item.label ? "max-h-96 pb-3" : "max-h-0"
                    }`}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        href={child.href ?? item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-primary/8 text-red-primary">
                          {child.icon}
                        </div>
                        <div>
                          <div className="text-[12px] font-semibold text-gray-900">{child.title}</div>
                          <div className="text-[10px] text-gray-500 line-clamp-1">{child.description}</div>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/${currentLocale}/solutions`}
                      onClick={closeMobile}
                      className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 px-3 py-2 text-[12px] font-bold text-red-primary"
                    >
                      <span>{t.nav.view_all_solutions || "View All Solutions"}</span>
                      <ArrowRight size={14} className="rtl:rotate-180" />
                    </Link>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={closeMobile}
                  className="block py-3 text-[13px] font-semibold text-gray-700 hover:text-red-primary"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <div className="mt-6 space-y-3">
            {phone && (
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                className="flex items-center gap-3 rounded-xl px-4 py-3 bg-gray-50 text-gray-700"
              >
                <Phone size={16} className="shrink-0 text-red-primary" />
                <div className="text-start">
                  <div className="text-[12px] font-bold">
                    <bdo dir="ltr" className="inline-block">{phone}</bdo>
                  </div>
                  {activeWorkingHours && <div className="text-[10px] text-gray-400">{activeWorkingHours}</div>}
                </div>
              </a>
            )}
            <div className="flex items-center gap-2 px-4 py-3">
              <Globe size={16} className="text-gray-500" />
              <div className="flex gap-2">
                {languages.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      switchLocale(l);
                      closeMobile();
                    }}
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      currentLocale === l ? "bg-red-primary text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}