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

export function VivoNavbar() {
  const params = useParams();
  const pathname = usePathname() || "";
  const locale = (params?.locale as string) || "fr";

  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    { label: "Produits", href: `/${locale}/vivo/products`, dropdown: true },
    { label: "Technologie", href: `/${locale}/vivo/technology` },
    { label: "Support", href: `/${locale}/vivo/support` },
    { label: "À propos", href: `/${locale}/vivo/about` },
  ];

  return (
    <>
      <div className="announcement-bar">
        <div className="announcement-inner">
          <span className="announcement-dot" aria-hidden="true" />
          <span>vivo Algérie — Distributeur officiel</span>
          <Link href={`/${locale}/vivo/about`}>En savoir plus</Link>
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
          <nav className="desktop-nav flex items-center h-full my-auto" aria-label="Navigation principale">
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
                      <span className="eyebrow eyebrow--blue">Explorer vivo</span>
                      <p>Une gamme pensée pour chaque façon de voir le monde.</p>
                    </div>
                    <div className="products-menu-grid">
                      {[
                        ["X Series", "Imagerie professionnelle", `/${locale}/vivo/products#x-series`],
                        ["V Series", "Portraits qui se démarquent", `/${locale}/vivo/products`],
                        ["Y Series", "L’essentiel, en mieux", `/${locale}/vivo/products/y-series`],
                        ["Accessoires", "L’écosystème vivo", `/${locale}/vivo/support`],
                      ].map(([name, detail, href]) => (
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
              aria-label="Rechercher"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={18} strokeWidth={1.65} />
            </button>
            <Link href={`/${locale}/vivo/find-a-store`} className="nav-cta">
              Trouver un point de vente <ArrowUpRight size={14} />
            </Link>
            <button
              className="mobile-toggle"
              type="button"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={21} strokeWidth={1.7} /> : <Menu size={21} strokeWidth={1.7} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-inner">
              <div className="mobile-menu-kicker">Navigation</div>
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
                <span>Distributeur Officiel STI</span>
                <Link href={`/${locale}/vivo/find-a-store`} onClick={closePanels}>
                  Trouver un point de vente <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Recherche">
          <button
            className="search-close"
            type="button"
            aria-label="Fermer la recherche"
            onClick={() => setSearchOpen(false)}
          >
            <X size={22} />
          </button>
          <div className="search-panel">
            <span className="eyebrow eyebrow--blue">Recherche vivo Algérie</span>
            <h2>Que cherchez-vous ?</h2>
            <label className="search-field">
              <Search size={22} strokeWidth={1.55} />
              <input autoFocus type="search" placeholder="Rechercher un produit, une série…" />
            </label>
            <p>Essayez « Série X », « service après-vente » ou « revendeurs ».</p>
          </div>
        </div>
      )}
    </>
  );
}
