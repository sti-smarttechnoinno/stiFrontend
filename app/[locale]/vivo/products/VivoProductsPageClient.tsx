"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { VivoNavbar } from "@/app/components/vivo/VivoNavbar";
import { VIVO_ASSETS } from "@/app/components/vivo/assets";
import { useTranslations } from "@/app/[locale]/use-translations";
import { usePreferences } from "@/app/[locale]/preferences-context";

export default function VivoProductsPageClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";
  const t = useTranslations() as any;
  const { email: dbEmail } = usePreferences();
  const contactEmail = dbEmail || "service@dz.vivo.com";

  const vivoProductsHeroT = t?.vivoProductsHero || t?.stiHome?.vivoProductsHero || {
    eyebrow: "La collection vivo · Algérie",
    title: "Trouvez votre",
    accent: "façon de voir.",
    description:
      "Explorez les séries V et Y de vivo pensées pour différents usages, styles et façons de vivre la technologie en Algérie avec STI.",
    ctaPrimary: "Découvrir la Série V",
    ctaSecondary: "Explorer la Série Y",
    trustBadge: "Catalogue officiel STI · Disponibilité garantie en Algérie",
    imageAlt: "La collection vivo en Algérie - V Series et Y Series",
    captionTitle: "Collection Officielle",
    captionSubtitle: "V Series · Y Series",
    scrollPrompt: "Défiler pour découvrir",
  };

  const vivoProductsSeriesNavT = t?.vivoProductsSeriesNav || t?.stiHome?.vivoProductsSeriesNav || {
    ariaLabel: "Filtrer par série",
    label: "Explorer par série",
    vSeries: "Série V",
    ySeries: "Série Y",
    note: "Modèles officiels disponibles en Algérie",
  };

  const vivoProductsVSeriesT = t?.vivoProductsVSeries || t?.stiHome?.vivoProductsVSeries || {
    eyebrow: "02 / Série V",
    title: "Votre lumière",
    accent: "en signature.",
    description:
      "Des portraits plus naturels, des couleurs plus justes et une présence qui vous ressemble au quotidien avec le design raffiné de la Série V.",
    imageAlt: "vivo Série V en Algérie",
    imageIndex: "01 / SÉRIE V",
    kicker: "SÉRIE V",
    featureTitle: "Le portrait",
    featureAccent: "en haute définition.",
    featureDescription:
      "Le modèle vivo V70 FE offre un équilibre parfait entre esthétique haut de gamme, photographie de portrait avancée et performances fluides.",
    cta: "Découvrir la Série V",
  };

  const vivoProductsYSeriesT = t?.vivoProductsYSeries || t?.stiHome?.vivoProductsYSeries || {
    eyebrow: "03 / Série Y",
    title: "Votre rythme,",
    accent: "votre vivo.",
    description:
      "La série Y rassemble des modèles à découvrir avec une navigation simple, une lecture claire et un accompagnement local STI.",
    y21d: {
      index: "02 / SÉRIE Y",
      eyebrow: "L’essentiel, en mieux",
      copy: "Une expérience vivo pensée pour accompagner le rythme de chaque journée avec fluidité.",
      cta: "Découvrir Y21D",
      alt: "Smartphone vivo Y21D",
    },
    y05: {
      index: "03 / SÉRIE Y",
      eyebrow: "Simplement vivo",
      copy: "Un modèle accessible à découvrir avec une approche claire et une autonomie durable.",
      cta: "Découvrir Y05",
      alt: "Smartphone vivo Y05",
    },
  };

  const vivoProductsSelectionT =
    t?.vivoProductsSelection || t?.stiHome?.vivoProductsSelection || {
      eyebrow: "04 / Votre sélection",
      title: "Un modèle",
      accent: "qui vous suit.",
      description:
        "Vous hésitez entre la Série V et la Série Y ? Notre équipe vous accompagne pour trouver le modèle qui correspond à vos usages.",
      cta: "Parler à l’équipe",
      noteTitle: "Distribution officielle STI",
      noteSubtitle: "Disponibilité et conseil local en Algérie",
    };

  const vivoProductsContactT = t?.vivoProductsContact || t?.stiHome?.vivoProductsContact || {
    eyebrow: "05 / vivo Algérie",
    title: "Prêt à trouver",
    accent: "le vôtre ?",
    description:
      "Découvrez les modèles officiels vivo disponibles près de chez vous ou contactez l’équipe STI pour un conseil personnalisé.",
    findStore: "Trouver un point de vente",
    talkAdvisor: "Parler à un conseiller",
  };

  const productCards = [
    {
      id: "v-series",
      series: "V Series",
      name: "vivo V70 FE",
      eyebrow: "Portraits d’exception · Design premium",
      copy: "Une collection pensée autour du portrait, de l'élégance et de la lumière naturelle.",
      image: VIVO_ASSETS.v70feHero || VIVO_ASSETS.v70fe || VIVO_ASSETS.camera,
      alt: "Smartphone vivo V70 FE",
      index: "01 / SÉRIE V",
      tone: "product-card--dark",
      cta: "Découvrir V70 FE",
      href: `/${locale}/vivo/products/v-series/v70fe`,
    },
    {
      id: "y21d",
      series: "Y Series",
      name: "vivo Y21D",
      eyebrow: vivoProductsYSeriesT.y21d?.eyebrow || "L’essentiel, en mieux",
      copy: vivoProductsYSeriesT.y21d?.copy || "Une expérience vivo pensée pour accompagner le rythme de chaque journée avec fluidité.",
      image: VIVO_ASSETS.y21dHero || VIVO_ASSETS.y21d,
      alt: vivoProductsYSeriesT.y21d?.alt || "Smartphone vivo Y21D",
      index: vivoProductsYSeriesT.y21d?.index || "02 / SÉRIE Y",
      tone: "product-card--warm",
      cta: vivoProductsYSeriesT.y21d?.cta || "Découvrir Y21D",
      href: `/${locale}/vivo/products/y-series/y21d`,
    },
    {
      id: "y05",
      series: "Y Series",
      name: "vivo Y05",
      eyebrow: vivoProductsYSeriesT.y05?.eyebrow || "Simplement vivo",
      copy: vivoProductsYSeriesT.y05?.copy || "Un modèle accessible à découvrir avec une approche claire et une autonomie durable.",
      image: VIVO_ASSETS.y05Hero || VIVO_ASSETS.camera,
      alt: vivoProductsYSeriesT.y05?.alt || "Smartphone vivo Y05",
      index: vivoProductsYSeriesT.y05?.index || "03 / SÉRIE Y",
      tone: "product-card--blue",
      cta: vivoProductsYSeriesT.y05?.cta || "Découvrir Y05",
      href: `/${locale}/vivo/products/y-series/y05`,
    },
  ];

  return (
    <div className="products-page">
      <VivoNavbar />

      <main id="top">
        <section className="hero-section">
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-halo" aria-hidden="true" />
          <div className="hero-content content-container hero-content--centered">
            <div className="hero-copy hero-copy--centered" aria-live="polite">
              <div className="hero-eyebrow reveal-item reveal-item--1">
                <span className="eyebrow-line" />
                <span>{vivoProductsHeroT.eyebrow}</span>
              </div>
              <h1 className="hero-title reveal-item reveal-item--2">
                {vivoProductsHeroT.title}
                <br />
                <em>{vivoProductsHeroT.accent}</em>
              </h1>
              <p className="hero-description reveal-item reveal-item--3">
                {vivoProductsHeroT.description}
              </p>
              <div className="hero-actions reveal-item reveal-item--4">
                <Link className="button button--primary" href={`/${locale}/vivo/products#v-series`}>
                  {vivoProductsHeroT.ctaPrimary} <ArrowUpRight size={16} />
                </Link>
                <Link className="text-link" href={`/${locale}/vivo/products#y-series`}>
                  {vivoProductsHeroT.ctaSecondary} <ArrowDownRight size={16} />
                </Link>
              </div>
              <div className="hero-trust reveal-item reveal-item--5">
                <ShieldCheck size={17} strokeWidth={1.5} />
                <span>{vivoProductsHeroT.trustBadge}</span>
              </div>
            </div>

            <div className="hero-product hero-product--centered reveal-item reveal-item--3">
              <Image
                className="hero-phone hero-slide-image"
                src={VIVO_ASSETS.productsHero}
                alt={vivoProductsHeroT.imageAlt}
                fill
                priority
                sizes="100vw"
              />

              <div className="product-caption">
                <span className="caption-rule" />
                <div>
                  <strong>{vivoProductsHeroT.captionTitle}</strong>
                  <span>{vivoProductsHeroT.captionSubtitle}</span>
                </div>
              </div>
              <div className="product-orbit product-orbit--one" aria-hidden="true" />
              <div className="product-orbit product-orbit--two" aria-hidden="true" />
            </div>
          </div>

          <div className="hero-scroll content-container">
            <span>{vivoProductsHeroT.scrollPrompt}</span>
            <span className="scroll-line" />
          </div>
        </section>

        <section className="series-nav" aria-label={vivoProductsSeriesNavT.ariaLabel || "Filtrer par série"}>
          <div className="content-container series-nav-inner">
            <span className="series-nav-label">{vivoProductsSeriesNavT.label || "Explorer par série"}</span>
            <div className="series-nav-links">
              <Link href={`/${locale}/vivo/products/v-series`} className="series-nav-link">
                {vivoProductsSeriesNavT.vSeries || "V Series"} <ArrowUpRight size={14} />
              </Link>
              <Link href={`/${locale}/vivo/products/y-series`} className="series-nav-link">
                {vivoProductsSeriesNavT.ySeries || "Y Series"} <ArrowUpRight size={14} />
              </Link>
            </div>
            <span className="series-nav-note">{vivoProductsSeriesNavT.note || "Modèles officiels disponibles en Algérie"}</span>
          </div>
        </section>

        <section id="v-series" className="series-section series-section--dark">
          <div className="content-container series-heading">
            <div>
              <span className="eyebrow">
                <span className="section-rule section-rule--light" />
                {vivoProductsVSeriesT.eyebrow || "02 / Série V"}
              </span>
              <h2>
                {vivoProductsVSeriesT.title || "Votre lumière"}
                <br />
                <em>{vivoProductsVSeriesT.accent || "en signature."}</em>
              </h2>
            </div>
            <p>
              {vivoProductsVSeriesT.description}
            </p>
          </div>
          <div className="content-container feature-product feature-product--dark">
            <div className="feature-product-image relative min-h-[380px]">
              <Image
                src={VIVO_ASSETS.vSeries}
                alt={vivoProductsVSeriesT.imageAlt || "vivo Série V en Algérie"}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-contain p-4"
              />
              <span>{vivoProductsVSeriesT.imageIndex || "01 / SÉRIE V"}</span>
            </div>
            <div className="feature-product-copy">
              <span className="product-kicker">{vivoProductsVSeriesT.kicker || "SÉRIE V"}</span>
              <h3>
                {vivoProductsVSeriesT.featureTitle || "Le portrait"}
                <br />
                <em>{vivoProductsVSeriesT.featureAccent || "en haute définition."}</em>
              </h3>
              <p>
                {vivoProductsVSeriesT.featureDescription}
              </p>
              <Link href={`/${locale}/vivo/products/v-series`} className="button button--primary">
                {vivoProductsVSeriesT.cta || "Découvrir la Série V"} <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section id="y-series" className="series-section series-section--light">
          <div className="content-container series-heading series-heading--light">
            <div>
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                {vivoProductsYSeriesT.eyebrow || "03 / Série Y"}
              </span>
              <h2>
                {vivoProductsYSeriesT.title || "Votre rythme,"}
                <br />
                <em>{vivoProductsYSeriesT.accent || "votre vivo."}</em>
              </h2>
            </div>
            <p>
              {vivoProductsYSeriesT.description}
            </p>
          </div>
          <div className="content-container product-card-grid">
            {productCards
              .filter((card) => card.series === "Y Series")
              .map((card) => (
                <article className={`product-card ${card.tone}`} key={card.id}>
                  <div className="product-card-image relative min-h-[220px]">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <span className="product-card-index">
                      {card.index || (card.id === "y21d" ? "02 / SÉRIE Y" : "03 / SÉRIE Y")}
                    </span>
                  </div>
                  <div className="product-card-body">
                    <span className="product-kicker">{card.eyebrow}</span>
                    <h3>{card.name}</h3>
                    <p>{card.copy}</p>
                    <Link href={card.href} className="text-link text-link--dark">
                      {card.cta} <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
          </div>
        </section>

        <section className="products-selection">
          <div className="content-container selection-inner">
            <div className="selection-copy">
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                {vivoProductsSelectionT.eyebrow || "04 / Votre sélection"}
              </span>
              <h2>
                {vivoProductsSelectionT.title || "Un modèle"}
                <br />
                <em>{vivoProductsSelectionT.accent || "qui vous suit."}</em>
              </h2>
              <p>
                {vivoProductsSelectionT.description}
              </p>
              <Link href={`/${locale}/vivo/support#contact-form`} className="button button--dark">
                {vivoProductsSelectionT.cta || "Parler à l’équipe"} <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="selection-note">
              <ShieldCheck size={20} strokeWidth={1.45} />
              <span>
                <strong>{vivoProductsSelectionT.noteTitle || "Distribution officielle STI"}</strong>
                <small>{vivoProductsSelectionT.noteSubtitle || "Disponibilité et conseil local en Algérie"}</small>
              </span>
            </div>
          </div>
        </section>

        <section id="contact" className="detail-cta">
          <div className="content-container detail-cta-inner">
            <div>
              <span className="eyebrow">
                <span className="section-rule section-rule--light" />
                {vivoProductsContactT.eyebrow || "05 / vivo Algérie"}
              </span>
              <h2>
                {vivoProductsContactT.title || "Prêt à trouver"}
                <br />
                <em>{vivoProductsContactT.accent || "le vôtre ?"}</em>
              </h2>
            </div>
            <div className="detail-cta-side">
              <p>
                {vivoProductsContactT.description}
              </p>
              <div className="detail-cta-actions">
                <Link href={`/${locale}/vivo/find-a-store`} className="button button--primary">
                  {vivoProductsContactT.findStore || "Trouver un point de vente"} <ArrowUpRight size={16} />
                </Link>
                <a href={`mailto:${contactEmail}`} className="text-link detail-back-link">
                  {vivoProductsContactT.talkAdvisor || "Parler à un conseiller"} <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
