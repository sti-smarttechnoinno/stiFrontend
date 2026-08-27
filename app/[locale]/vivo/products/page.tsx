"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { VivoNavbar } from "@/app/components/vivo/VivoNavbar";
import { VIVO_ASSETS } from "@/app/components/vivo/assets";

export default function VivoProductsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";

  const productCards = [
    {
      id: "v-series",
      series: "V Series",
      name: "vivo V70 FE",
      eyebrow: "Portraits d’exception · Design premium",
      copy: "Une collection pensée autour du portrait, de l'élégance et de la lumière naturelle.",
      image: VIVO_ASSETS.v70fe || VIVO_ASSETS.camera,
      alt: "Smartphone vivo V70 FE",
      tone: "product-card--dark",
      cta: "Découvrir V70 FE",
      href: `/${locale}/vivo/products/v-series/v70fe`,
    },
    {
      id: "y21d",
      series: "Y Series",
      name: "vivo Y21D",
      eyebrow: "L’essentiel, en mieux",
      copy: "Une expérience vivo pensée pour accompagner le rythme de chaque journée avec fluidité.",
      image: VIVO_ASSETS.y21dHero || VIVO_ASSETS.y21d,
      alt: "Smartphone vivo Y21D",
      tone: "product-card--warm",
      cta: "Découvrir Y21D",
      href: `/${locale}/vivo/products/y-series/y21d`,
    },
    {
      id: "y05",
      series: "Y Series",
      name: "vivo Y05",
      eyebrow: "Simplement vivo",
      copy: "Un modèle accessible à découvrir avec une approche claire et une autonomie durable.",
      image: VIVO_ASSETS.y05Hero || VIVO_ASSETS.camera,
      alt: "Smartphone vivo Y05",
      tone: "product-card--blue",
      cta: "Découvrir Y05",
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
                <span>La collection vivo · Algérie</span>
              </div>
              <h1 className="hero-title reveal-item reveal-item--2">
                Trouvez votre
                <br />
                <em>façon de voir.</em>
              </h1>
              <p className="hero-description reveal-item reveal-item--3">
                Explorez les séries V et Y de Vivo pensées pour différents usages, styles et façons de vivre la
                technologie en Algérie avec STI.
              </p>
              <div className="hero-actions reveal-item reveal-item--4">
                <Link className="button button--primary" href={`/${locale}/vivo/products#v-series`}>
                  Découvrir la Série V <ArrowUpRight size={16} />
                </Link>
                <Link className="text-link" href={`/${locale}/vivo/products#y-series`}>
                  Explorer la Série Y <ArrowDownRight size={16} />
                </Link>
              </div>
              <div className="hero-trust reveal-item reveal-item--5">
                <ShieldCheck size={17} strokeWidth={1.5} />
                <span>Catalogue officiel STI · Disponibilité garantie en Algérie</span>
              </div>
            </div>

            <div className="hero-product hero-product--centered reveal-item reveal-item--3">
              <Image
                className="hero-phone hero-slide-image"
                src={VIVO_ASSETS.productsHero}
                alt="La collection vivo en Algérie - V Series et Y Series"
                fill
                priority
                sizes="100vw"
              />

              <div className="product-caption">
                <span className="caption-rule" />
                <div>
                  <strong>Collection Officielle</strong>
                  <span>V Series · Y Series</span>
                </div>
              </div>
              <div className="product-orbit product-orbit--one" aria-hidden="true" />
              <div className="product-orbit product-orbit--two" aria-hidden="true" />
            </div>
          </div>

          <div className="hero-scroll content-container">
            <span>Défiler pour découvrir</span>
            <span className="scroll-line" />
          </div>
        </section>

        <section className="series-nav" aria-label="Filtrer par série">
          <div className="content-container series-nav-inner">
            <span className="series-nav-label">Explorer par série</span>
            <div className="series-nav-links">
              <Link href={`/${locale}/vivo/products/v-series`} className="series-nav-link">
                V Series <ArrowUpRight size={14} />
              </Link>
              <Link href={`/${locale}/vivo/products/y-series`} className="series-nav-link">
                Y Series <ArrowUpRight size={14} />
              </Link>
            </div>
            <span className="series-nav-note">Modèles officiels disponibles en Algérie</span>
          </div>
        </section>

        <section id="v-series" className="series-section series-section--dark">
          <div className="content-container series-heading">
            <div>
              <span className="eyebrow">
                <span className="section-rule section-rule--light" />
                02 / V Series
              </span>
              <h2>
                Votre lumière
                <br />
                <em>en signature.</em>
              </h2>
            </div>
            <p>
              Des portraits plus naturels, des couleurs plus justes et une présence qui vous ressemble
              au quotidien avec le design raffiné de la Série V.
            </p>
          </div>
          <div className="content-container feature-product feature-product--dark">
            <div className="feature-product-image relative min-h-[380px]">
              <Image
                src={VIVO_ASSETS.vSeries}
                alt="vivo V Series en Algérie"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-contain p-4"
              />
              <span>01 / V SERIES</span>
            </div>
            <div className="feature-product-copy">
              <span className="product-kicker">V SERIES</span>
              <h3>
                Le portrait
                <br />
                <em>en haute définition.</em>
              </h3>
              <p>
                Le modèle vivo V70 FE offre un équilibre parfait entre esthétique haut de gamme,
                photographie de portrait avancée et performances fluides.
              </p>
              <Link href={`/${locale}/vivo/products/v-series`} className="button button--primary">
                Découvrir la Série V <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section id="y-series" className="series-section series-section--light">
          <div className="content-container series-heading series-heading--light">
            <div>
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                03 / Y Series
              </span>
              <h2>
                Votre rythme,
                <br />
                <em>votre Vivo.</em>
              </h2>
            </div>
            <p>
              La série Y rassemble des modèles à découvrir avec une navigation simple, une lecture
              claire et un accompagnement local STI.
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
                      {card.id === "y21d" ? "02" : "03"} / Y SERIES
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
                04 / Votre sélection
              </span>
              <h2>
                Un modèle
                <br />
                <em>qui vous suit.</em>
              </h2>
              <p>
                Vous hésitez entre la Série V et la Série Y ? Notre équipe vous accompagne pour trouver le
                modèle qui correspond à vos usages.
              </p>
              <Link href={`/${locale}/vivo/support#contact-form`} className="button button--dark">
                Parler à l’équipe <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="selection-note">
              <ShieldCheck size={20} strokeWidth={1.45} />
              <span>
                <strong>Distribution officielle STI</strong>
                <small>Disponibilité et conseil local en Algérie</small>
              </span>
            </div>
          </div>
        </section>

        <section id="contact" className="detail-cta">
          <div className="content-container detail-cta-inner">
            <div>
              <span className="eyebrow">
                <span className="section-rule section-rule--light" />
                05 / Vivo Algérie
              </span>
              <h2>
                Prêt à trouver
                <br />
                <em>le vôtre ?</em>
              </h2>
            </div>
            <div className="detail-cta-side">
              <p>
                Découvrez les modèles officiels vivo disponibles près de chez vous ou contactez
                l’équipe STI pour un conseil personnalisé.
              </p>
              <div className="detail-cta-actions">
                <Link href={`/${locale}/vivo/find-a-store`} className="button button--primary">
                  Trouver un point de vente <ArrowUpRight size={16} />
                </Link>
                <a href="mailto:service@dz.vivo.com" className="text-link detail-back-link">
                  Parler à un conseiller <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-container footer-inner">
          <span>© 2026 vivo Algeria · STI Partenaire officiel</span>
          <span>Conçu pour l’Algérie, avec précision.</span>
          <Link href={`/${locale}/vivo`}>
            Retour à l’accueil vivo <ArrowUpRight size={14} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
