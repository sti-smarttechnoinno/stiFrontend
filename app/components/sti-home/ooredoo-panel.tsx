"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowRight, Smartphone, CreditCard, Ticket, CheckCircle2 } from "lucide-react"

type PanelState = "default" | "expanded" | "collapsed"

const PRODUCTS = [
  { label: "Recharge crédit", icon: Smartphone },
  { label: "Carte SIM", icon: CreditCard },
  { label: "Ticket de recharge", icon: Ticket },
]

export function OoredooPanel({ state, expanded }: { state: PanelState; expanded: boolean }) {
  const params = useParams()
  const currentLocale = (params?.locale as string) || "fr"
  const isCollapsed = state === "collapsed"

  return (
    <div className="relative h-full w-full overflow-hidden bg-charcoal text-white">
      {/* Background visual */}
      <div className="absolute inset-0">
        <Image
          src="/assets/ooredoo-recharge.png"
          alt="Produits Ooredoo : téléphone, carte SIM et ticket de recharge"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center opacity-75 transition-transform duration-700 ease-out"
          style={{
            transform: expanded ? "scale(1.05)" : isCollapsed ? "scale(0.98)" : "scale(1)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/45 to-transparent md:bg-gradient-to-r md:from-charcoal/80 md:via-charcoal/45 md:to-charcoal/10" />
      </div>

      {/* Content */}
      <div className="relative flex h-full flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-14">
        {/* Center editorial content */}
        <div className="my-auto max-w-md py-6 pt-16 sm:pt-20 md:pt-32 lg:pt-40">
          <h2
            className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Espace Ooredoo
          </h2>

          <p className="mt-2 text-sm font-medium uppercase tracking-wide text-white/70">
            Distribution agréée
          </p>

          <div
            className="overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ opacity: isCollapsed ? 0 : 1, maxHeight: isCollapsed ? 0 : 340 }}
          >
            <p className="mt-5 max-w-sm text-pretty leading-relaxed text-white/80">
              Rechargez votre crédit et obtenez votre carte SIM facilement.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {PRODUCTS.map((p) => (
                <li
                  key={p.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm shadow-sm transition-colors hover:border-white/30"
                >
                  <p.icon className="h-3 w-3 text-crimson-light" />
                  {p.label}
                </li>
              ))}
            </ul>

            <Link
              href={`/${currentLocale}/ooredoo`}
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-crimson px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-crimson-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Découvrir les produits Ooredoo
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Info card */}
        <div
          className="absolute bottom-6 left-6 hidden items-center gap-3 rounded-2xl border border-white/10 bg-neutral-950/75 px-4 py-2.5 shadow-xl backdrop-blur-md transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:bottom-8 sm:left-8 md:flex lg:left-12"
          style={{
            opacity: isCollapsed ? 0 : expanded ? 1 : 0.9,
            transform: expanded ? "translateY(0) scale(1.02)" : "translateY(4px) scale(1)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson" />
          </span>
          <div className="text-left">
            <p className="text-xs font-semibold text-white tracking-tight">Recharge &amp; SIM Disponible</p>
            <p className="text-[11px] text-white/70">Distribution officielle &amp; activation immédiate</p>
          </div>
          <CheckCircle2 className="ml-2 h-4 w-4 text-emerald-400" />
        </div>
      </div>
    </div>
  )
}
