"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"

const NAV_LINKS = [
  { label: "Accueil", href: "#accueil", active: true },
  { label: "À propos", href: "#a-propos", active: false },
  { label: "Nos espaces", href: "#nos-espaces", active: false },
  { label: "Services", href: "#services", active: false },
  { label: "Contact", href: "#contact", active: false },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-9 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <nav
        aria-label="Navigation principale"
        className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8"
      >
        {/* Logo */}
        <a href="#accueil" className="flex shrink-0 items-center" aria-label="STI — Accueil">
          <Image
            src="/assets/logo.png"
            alt="STI — Smart Technologie Innovation, distributeur agréé Ooredoo"
            width={132}
            height={132}
            className="h-12 w-auto"
            priority
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                aria-current={link.active ? "page" : undefined}
                className="group relative py-1 text-sm font-medium text-charcoal transition-colors hover:text-crimson"
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 bg-crimson transition-all duration-300 ${
                    link.active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#contact"
          className="hidden shrink-0 rounded-full bg-crimson px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:bg-crimson-dark hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson md:inline-flex"
        >
          Demander un devis
        </a>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="#contact"
            className="rounded-full bg-crimson px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm"
          >
            Devis
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-charcoal transition-colors hover:bg-warm-gray focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background md:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col px-5 py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={link.active ? "page" : undefined}
                  className={`block border-l-2 py-3 pl-3 text-sm font-medium transition-colors ${
                    link.active
                      ? "border-crimson text-crimson"
                      : "border-transparent text-charcoal hover:border-crimson/40 hover:text-crimson"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
