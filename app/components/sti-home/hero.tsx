"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "@/app/[locale]/use-translations"
import { useLocale } from "@/app/[locale]/locale-context"
import { OoredooPanel } from "./ooredoo-panel"
import { VivoPanel } from "./vivo-panel"

type Active = "ooredoo" | "vivo" | null

const EASE = "cubic-bezier(0.22,1,0.36,1)"

export function Hero() {
  const [active, setActive] = useState<Active>(null)
  const { dir } = useLocale()
  const isRtl = dir === "rtl"

  const t = useTranslations() as any
  const heroT = t?.stiHome?.hero || {
    tagline: "SMART TECHNOLOGY INNOVATION",
    headline: "Deux univers. Une seule expertise.",
    subheadline: "Accédez directement à nos produits et solutions Ooredoo et VIVO.",
    scrollCue: "DÉFILER POUR DÉCOUVRIR",
    ariaLabel: "Deux univers STI : Ooredoo et VIVO",
  }
  const ooredooAria = t?.stiHome?.ooredooPanel?.cta || "Accéder à l'espace Ooredoo"
  const vivoAria = t?.stiHome?.vivoPanel?.cta || "Accéder à l'espace VIVO"

  const ooredooGrow = active === "ooredoo" ? 1.857 : active === "vivo" ? 1 : 1.3
  const vivoGrow = active === "vivo" ? 1.857 : active === "ooredoo" ? 1 : 1.3
  const dividerLeft = isRtl
    ? active === "vivo"
      ? "65%"
      : active === "ooredoo"
      ? "35%"
      : "50%"
    : active === "ooredoo"
    ? "65%"
    : active === "vivo"
    ? "35%"
    : "50%"

  const stateOf = (panel: "ooredoo" | "vivo"): "default" | "expanded" | "collapsed" => {
    if (active === null) return "default"
    return active === panel ? "expanded" : "collapsed"
  }

  return (
    <section
      id="accueil"
      aria-label={heroT.ariaLabel || "Deux univers STI : Ooredoo et VIVO"}
      className="relative h-auto w-full overflow-hidden md:h-[calc(100vh-36px)] md:min-h-[680px]"
    >
      {/* Mobile intro (in flow) */}
      <div className="bg-charcoal px-6 py-8 text-center md:hidden">
        <p className="text-[0.7rem] font-semibold tracking-[0.35em] text-crimson">{heroT.tagline}</p>
        <div className="my-3 flex justify-center">
          <Image
            src="/assets/logo.png"
            alt="STI — Smart Technologie Innovation"
            width={220}
            height={75}
            className="h-14 sm:h-16 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          />
        </div>
        <h1 className="mt-2 font-heading text-2xl font-bold leading-tight text-balance text-white">
          {heroT.headline}
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-relaxed text-white/80">
          {heroT.subheadline}
        </p>
      </div>

      {/* Desktop intro (overlay) */}
      <div className="pointer-events-none absolute left-1/2 top-6 z-30 hidden w-[92%] max-w-xl -translate-x-1/2 text-center md:block">
        <p className="text-xs font-semibold tracking-[0.4em] text-crimson">{heroT.tagline}</p>
        <div className="my-3 flex justify-center">
          <Image
            src="/assets/logo.png"
            alt="STI — Smart Technologie Innovation"
            width={280}
            height={90}
            className="h-16 lg:h-20 w-auto drop-shadow-[0_4px_20px_rgba(0,0,0,0.65)]"
          />
        </div>
        <p className="mt-2 font-heading text-3xl font-bold leading-tight text-balance text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] lg:text-[2.4rem]">
          {heroT.headline}
        </p>
        <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
          {heroT.subheadline}
        </p>
      </div>

      {/* Panels */}
      <div className="flex h-full w-full flex-col md:flex-row">
        {/* Ooredoo */}
        <div
          role="button"
          tabIndex={0}
          aria-label={ooredooAria}
          onMouseEnter={() => setActive("ooredoo")}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive("ooredoo")}
          onBlur={() => setActive(null)}
          onClick={() => setActive((a) => (a === "ooredoo" ? null : "ooredoo"))}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setActive((a) => (a === "ooredoo" ? null : "ooredoo"))
            }
          }}
          className="relative h-[48vh] shrink-0 basis-auto cursor-pointer text-start outline-none ring-inset transition-[flex-grow] duration-[600ms] focus-visible:ring-4 focus-visible:ring-crimson md:h-full md:basis-0"
          style={{ flexGrow: ooredooGrow, transitionTimingFunction: EASE }}
        >
          <OoredooPanel state={stateOf("ooredoo")} expanded={active === "ooredoo"} />
        </div>

        {/* VIVO */}
        <div
          role="button"
          tabIndex={0}
          aria-label={vivoAria}
          onMouseEnter={() => setActive("vivo")}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive("vivo")}
          onBlur={() => setActive(null)}
          onClick={() => setActive((a) => (a === "vivo" ? null : "vivo"))}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setActive((a) => (a === "vivo" ? null : "vivo"))
            }
          }}
          className="relative h-[48vh] shrink-0 basis-auto cursor-pointer text-start outline-none ring-inset transition-[flex-grow] duration-[600ms] focus-visible:ring-4 focus-visible:ring-crimson md:h-full md:basis-0"
          style={{ flexGrow: vivoGrow, transitionTimingFunction: EASE }}
        >
          <VivoPanel state={stateOf("vivo")} expanded={active === "vivo"} />
        </div>
      </div>

      {/* Center divider (desktop) */}
      <div
        className="pointer-events-none absolute inset-y-0 z-20 hidden -translate-x-1/2 md:block"
        style={{ left: dividerLeft, transition: `left 600ms ${EASE}` }}
      >
        <div className="relative h-full w-px bg-gradient-to-b from-transparent via-crimson to-transparent">
          <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-crimson/40 bg-white shadow-lg">
            <span className="absolute inset-1.5 rounded-full border-[3px] border-crimson" />
            <ArrowRight className={`relative h-4 w-4 text-crimson transition-transform duration-300 ${isRtl ? "rotate-180" : ""}`} />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[0.7rem] font-medium tracking-[0.25em] text-white/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
          {heroT.scrollCue}
        </span>
        <span className="relative flex h-9 w-5 items-start justify-center rounded-full border border-white/50">
          <span className="animate-sti-scroll-dot mt-1.5 h-1.5 w-1.5 rounded-full bg-crimson" />
        </span>
      </div>
    </section>
  )
}
