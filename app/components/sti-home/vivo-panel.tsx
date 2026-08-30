"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowRight, Smartphone, Sparkles } from "lucide-react"

type PanelState = "default" | "expanded" | "collapsed"

const PRODUCTS = [
  { label: "Smartphones", icon: Smartphone },
  { label: "Nouveautés", icon: Sparkles },
]

export function VivoPanel({ state, expanded }: { state: PanelState; expanded: boolean }) {
  const params = useParams()
  const currentLocale = (params?.locale as string) || "fr"
  const isCollapsed = state === "collapsed"

  return (
    <div className="relative h-full w-full overflow-hidden bg-warm-gray text-charcoal">
      {/* Faint STI-inspired arc */}
      <div className="pointer-events-none absolute -right-24 top-1/2 h-[130%] w-[80%] -translate-y-1/2 rounded-full border-[3px] border-crimson/10" />
      <div className="pointer-events-none absolute -right-10 top-1/2 h-[90%] w-[55%] -translate-y-1/2 rounded-full border-2 border-crimson/[0.07]" />

      {/* Background visual */}
      <div className="absolute inset-0">
        <Image
          src="/assets/vivo-smartphones.png"
          alt="Smartphones VIVO : Série V et Série Y"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center opacity-95 transition-transform duration-700 ease-out"
          style={{
            transform: expanded ? "scale(1.05)" : isCollapsed ? "scale(0.98)" : "scale(1)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-gray/75 via-warm-gray/40 to-transparent md:bg-gradient-to-l md:from-warm-gray/75 md:via-warm-gray/40 md:to-warm-gray/10" />
      </div>

      {/* Content */}
      <div className="relative flex h-full flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-14">
        {/* Center editorial content */}
        <div className="my-auto max-w-md py-6 pt-16 sm:pt-20 md:pt-32 lg:pt-40">
          <h2
            className="font-heading text-3xl font-bold tracking-tight text-charcoal sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Espace VIVO
          </h2>

          <p className="mt-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Production &amp; distribution
          </p>

          <div
            className="overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ opacity: isCollapsed ? 0 : 1, maxHeight: isCollapsed ? 0 : 340 }}
          >
            <p className="mt-5 max-w-sm text-pretty leading-relaxed text-charcoal/75">
              Smartphones Série V, Série Y &amp; nouveautés.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {PRODUCTS.map((p) => (
                <li
                  key={p.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300/80 bg-white/85 px-3.5 py-1 text-xs font-medium text-neutral-800 backdrop-blur-sm shadow-sm transition-colors hover:border-neutral-400"
                >
                  <p.icon className="h-3 w-3 text-neutral-600" />
                  {p.label}
                </li>
              ))}
            </ul>

            <Link
              href={`/${currentLocale}/vivo`}
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
            >
              Explorer l&apos;espace VIVO
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Info card */}
        <div
          className="absolute bottom-6 right-6 hidden items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/80 px-4 py-2.5 shadow-xl backdrop-blur-md transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:bottom-8 sm:right-8 md:flex lg:right-12"
          style={{
            opacity: isCollapsed ? 0 : expanded ? 1 : 0.9,
            transform: expanded ? "translateY(0) scale(1.02)" : "translateY(4px) scale(1)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
          </span>
          <div className="text-left">
            <p className="text-xs font-semibold text-neutral-900 tracking-tight">Performance &amp; Design</p>
            <p className="text-[11px] text-neutral-500">Smartphones certifiés VIVO</p>
          </div>
          <Sparkles className="ml-2 h-4 w-4 text-neutral-400" />
        </div>
      </div>
    </div>
  )
}
