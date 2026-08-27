"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { VivoNavbar } from "@/app/components/vivo/VivoNavbar";
import { getSeriesData, VIVO_SERIES_DATA } from "@/app/components/vivo/productsData";

export default function DynamicVivoSeriesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";
  const rawSeries = (params?.series as string) || "y-series";

  const series = getSeriesData(rawSeries) || VIVO_SERIES_DATA["y-series"];

  return (
    <div className="y-series-page">
      <VivoNavbar />

      <main id="top">
        <section className="hero-section">
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-halo" aria-hidden="true" />
          <div className="hero-content content-container hero-content--centered">
            <div className="hero-copy hero-copy--centered" aria-live="polite">
              <div className="hero-eyebrow reveal-item reveal-item--1">
                <span className="eyebrow-line" />
                <span>{series.eyebrow}</span>
              </div>
              <h1 className="hero-title reveal-item reveal-item--2">
                {series.title}
                <br />
                <em>{series.accent}</em>
              </h1>
              <p className="hero-description reveal-item reveal-item--3">
                {series.heroDescription}
              </p>
              <div className="hero-actions reveal-item reveal-item--4">
                <Link
                  className="button button--primary"
                  href={`/${locale}/vivo/products/${series.slug}/${series.primaryProductSlug}`}
                >
                  {series.primaryCtaText} <ArrowUpRight size={16} />
                </Link>
                <Link
                  className="text-link"
                  href={`/${locale}/vivo/products/${series.slug}#models`}
                >
                  Voir les modèles <ArrowDownRight size={16} />
                </Link>
              </div>
              <div className="hero-trust reveal-item reveal-item--5">
                <ShieldCheck size={17} strokeWidth={1.5} />
                <span>{series.trustText}</span>
              </div>
            </div>

            <div className="hero-product hero-product--centered reveal-item reveal-item--3">
              <Image
                className="hero-phone hero-slide-image"
                src={series.heroImage}
                alt={`Collection ${series.name} en Algérie`}
                fill
                priority
                sizes="100vw"
              />

              <div className="product-caption">
                <span className="caption-rule" />
                <div>
                  <strong>{series.heroCaptionName}</strong>
                  <span>{series.heroCaptionDesc}</span>
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

        <section className="technology-pillars">
          <div className="content-container technology-pillars-heading">
            <div>
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                01 / Choisir simplement
              </span>
              <h2>
                {series.introTitle}
                <br />
                <em>{series.introAccent}</em>
              </h2>
            </div>
            <p>{series.introDescription}</p>
          </div>
          <div className="content-container technology-pillar-grid">
            {series.pillars.map(({ number, title, copy }) => (
              <article className="technology-pillar" key={number}>
                <div className="technology-pillar-top">
                  <span>{number}</span>
                  <span className="detail-rule" />
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="technology-pillar-rule" />
              </article>
            ))}
          </div>
        </section>

        <section id="models" className="y-series-models">
          <div className="content-container">
            <div className="y-series-heading">
              <div>
                <span className="eyebrow eyebrow--blue">
                  <span className="section-rule" />
                  02 / Les modèles
                </span>
                <h2>
                  Trouvez celui
                  <br />
                  <em>qui vous ressemble.</em>
                </h2>
              </div>
              <p>
                Chaque fiche présente l’essentiel du modèle. Les détails de disponibilité et de
                configuration sont à confirmer avec l’équipe vivo Algérie de STI.
              </p>
            </div>
            <div className="y-series-model-grid">
              {series.models.map((model) => (
                <article className="y-series-model" key={model.name}>
                  <div className="y-series-model-media relative min-h-[300px]">
                    <Image
                      src={model.image}
                      alt={model.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <span>{model.number} / {series.name.toUpperCase()}</span>
                  </div>
                  <div className="y-series-model-copy">
                    <div className="y-series-model-top">
                      <span>{model.name}</span>
                      <small>{model.state}</small>
                    </div>
                    <h3>{model.phrase}</h3>
                    <p>{model.copy}</p>
                    <Link
                      href={`/${locale}/vivo/products/${series.slug}/${model.slug}`}
                      className="button button--dark"
                    >
                      {model.cta} <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="detail-cta">
          <div className="content-container detail-cta-inner">
            <div>
              <span className="eyebrow">
                <span className="section-rule section-rule--light" />
                03 / vivo Algérie
              </span>
              <h2>
                {series.ctaTitle}
                <br />
                <em>{series.ctaAccent}</em>
              </h2>
            </div>
            <div className="detail-cta-side">
              <p>{series.ctaDescription}</p>
              <div className="detail-cta-actions">
                <a className="button button--primary" href="mailto:service@dz.vivo.com">
                  Contacter l’équipe <ArrowUpRight size={16} />
                </a>
                <Link
                  className="text-link detail-back-link"
                  href={`/${locale}/vivo/products`}
                >
                  Retour à tous les produits <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-container footer-inner">
          <span>© 2026 vivo Algeria · STI Partenaire officiel</span>
          <span>{series.name} · {series.models.length} modèle{series.models.length > 1 ? "s" : ""}</span>
          <Link href={`/${locale}/vivo`}>
            Retour à l’accueil vivo <ArrowUpRight size={14} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
