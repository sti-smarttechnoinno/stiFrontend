"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowRight, Smartphone, CreditCard, Ticket, CheckCircle2 } from "lucide-react"

import { useTranslations } from "@/app/[locale]/use-translations"

type PanelState = "default" | "expanded" | "collapsed"

export function OoredooPanel({ state, expanded }: { state: PanelState; expanded: boolean }) {
  const params = useParams()
  const currentLocale = (params?.locale as string) || "fr"
  const isCollapsed = state === "collapsed"
  const t = useTranslations() as any
  const panelT = t?.stiHome?.ooredooPanel || {
    title: "Espace Ooredoo",
    badge: "Distribution agréée",
    description: "Rechargez votre crédit et obtenez votre carte SIM facilement.",
    cta: "Découvrir les produits Ooredoo",
    infoTitle: "Recharge & SIM Disponible",
    infoSub: "Distribution officielle & activation immédiate",
    recharge: "Recharge crédit",
    sim: "Carte SIM",
    ticket: "Ticket de recharge",
  }

  const products = [
    { label: panelT.recharge || "Recharge crédit", icon: Smartphone },
    { label: panelT.sim || "Carte SIM", icon: CreditCard },
    { label: panelT.ticket || "Ticket de recharge", icon: Ticket },
  ]

  return (
    <div className="relative h-full w-full min-h-[340px] sm:min-h-[380px] md:min-h-0 overflow-hidden bg-charcoal text-white">
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
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/45 to-transparent md:bg-gradient-to-r md:from-charcoal/80 md:via-charcoal/45 md:to-charcoal/10 rtl:md:bg-gradient-to-l" />
      </div>

      {/* Content */}
      <div className="relative flex h-full flex-col justify-center md:justify-between p-5 sm:p-7 md:p-10 lg:p-14">
        {/* Center editorial content */}
        <div className="max-w-md py-4 sm:py-6 md:my-auto md:pt-32 lg:pt-40">
          <h2
            className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {panelT.title}
          </h2>

          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium uppercase tracking-wide text-white/70">
            {panelT.badge}
          </p>

          <div
            className="overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ opacity: isCollapsed ? 0 : 1, maxHeight: isCollapsed ? 0 : 450 }}
          >
            <p className="mt-3 sm:mt-4 max-w-sm text-pretty text-sm sm:text-base leading-relaxed text-white/80">
              {panelT.description}
            </p>

            <ul className="mt-3.5 sm:mt-5 flex flex-wrap gap-2">
              {products.map((p) => (
                <li
                  key={p.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 sm:px-3.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm shadow-sm transition-colors hover:border-white/30"
                >
                  <p.icon className="h-3 w-3 text-crimson-light shrink-0" />
                  {p.label}
                </li>
              ))}
            </ul>

            <Link
              href={`/${currentLocale}/ooredoo`}
              className="group mt-5 sm:mt-6 inline-flex items-center gap-2 rounded-full bg-crimson px-6 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-crimson-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {panelT.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
            </Link>
          </div>
        </div>

        {/* Info card */}
        <div
          className="absolute bottom-6 start-6 hidden items-center gap-3 rounded-2xl border border-white/10 bg-neutral-950/75 px-4 py-2.5 shadow-xl backdrop-blur-md transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:bottom-8 sm:start-8 md:flex lg:start-12"
          style={{
            opacity: isCollapsed ? 0 : expanded ? 1 : 0.9,
            transform: expanded ? "translateY(0) scale(1.02)" : "translateY(4px) scale(1)",
          }}
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson" />
          </span>
          <div className="text-start">
            <p className="text-xs font-semibold text-white tracking-tight">{panelT.infoTitle}</p>
            <p className="text-[11px] text-white/70">{panelT.infoSub}</p>
          </div>
          <CheckCircle2 className="ms-2 h-4 w-4 text-emerald-400 shrink-0" />
        </div>
      </div>
    </div>
  )
}
