"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "@/app/[locale]/use-translations"

export function SpacesNav() {
  const params = useParams()
  const currentLocale = (params?.locale as string) || "fr"
  const t = useTranslations() as any
  const spacesT = t?.stiHome?.spaces || {
    title: "Explorez nos espaces dédiés",
    ooredooTitle: "Espace Ooredoo",
    ooredooDesc: "Recharge crédit · Carte SIM · Ticket de recharge",
    ooredooCta: "Voir les produits Ooredoo",
    vivoTitle: "Espace VIVO",
    vivoDesc: "Smartphones Série V et Série Y · Garantie constructeur STI",
    vivoCta: "Découvrir la gamme VIVO",
  }

  return (
    <section id="nos-espaces" aria-labelledby="spaces-heading" className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="spaces-heading" className="font-heading text-3xl font-bold text-balance text-charcoal sm:text-4xl">
            {spacesT.title}
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-crimson" />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Ooredoo card */}
          <article className="group relative overflow-hidden rounded-2xl border border-border bg-charcoal shadow-lg">
            <div className="relative h-56 w-full overflow-hidden sm:h-64">
              <Image
                src="/assets/ooredoo-recharge.webp"
                alt="Produits Ooredoo : téléphone, carte SIM et ticket de recharge"
                width={800}
                height={500}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
            </div>
            <div className="p-7">
              <h3 className="font-heading text-xl font-bold text-white">{spacesT.ooredooTitle}</h3>
              <p className="mt-2 text-sm font-medium text-white/70">
                {spacesT.ooredooDesc}
              </p>
              <Link
                href={`/${currentLocale}/ooredoo`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-crimson px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-crimson-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
              >
                {spacesT.ooredooCta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
          </article>

          {/* VIVO card */}
          <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            <div className="relative h-56 w-full overflow-hidden sm:h-64">
              <Image
                src="/assets/vivo-smartphones.webp"
                alt="Smartphones VIVO et accessoires premium"
                width={800}
                height={500}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            </div>
            <div className="p-7">
              <h3 className="font-heading text-xl font-bold text-charcoal">{spacesT.vivoTitle}</h3>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{spacesT.vivoDesc}</p>
              <Link
                href={`/${currentLocale}/vivo`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
              >
                {spacesT.vivoCta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
