"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { VivoNavbar } from "@/app/components/vivo/VivoNavbar";
import { getSeriesData, VIVO_SERIES_DATA } from "@/app/components/vivo/productsData";
import { useTranslations } from "@/app/[locale]/use-translations";
import { usePreferences } from "@/app/[locale]/preferences-context";

export default function VivoSeriesPageClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";
  const rawSeries = (params?.series as string) || "y-series";
  const t = useTranslations() as any;
  const { email: dbEmail } = usePreferences();
  const contactEmail = dbEmail || "service@dz.vivo.com";

  const series = getSeriesData(rawSeries) || VIVO_SERIES_DATA["y-series"];
  const seriesKey = rawSeries === "v-series" || rawSeries.includes("v") ? "v-series" : "y-series";

  const seriesHeroDict = t?.vivoSeriesHero || t?.stiHome?.vivoSeriesHero;
  const currentSeriesT = seriesHeroDict?.[seriesKey] || {};
  const seeModelsText = seriesHeroDict?.seeModels || "Voir les modèles";
  const scrollPromptText = seriesHeroDict?.scrollPrompt || "Défiler pour découvrir";

  const heroEyebrow = currentSeriesT.eyebrow || series.eyebrow;
  const heroTitle = currentSeriesT.title || series.title;
  const heroAccent = currentSeriesT.accent || series.accent;
  const heroDescription = currentSeriesT.description || series.heroDescription;
  const primaryCtaText = currentSeriesT.primaryCtaText || series.primaryCtaText;
  const trustText = currentSeriesT.trustText || series.trustText;
  const heroCaptionName = currentSeriesT.captionName || series.heroCaptionName;
  const heroCaptionDesc = currentSeriesT.captionDesc || series.heroCaptionDesc;
  const heroImageAlt = currentSeriesT.imageAlt || `Collection ${series.name} en Algérie`;

  const seriesPillarsDict = t?.vivoSeriesPillars || t?.stiHome?.vivoSeriesPillars;
  const currentPillarsT = seriesPillarsDict?.[seriesKey] || {};
  const pillarsEyebrow = seriesPillarsDict?.eyebrow || "01 / Choisir simplement";

  const introTitle = currentPillarsT.introTitle || series.introTitle;
  const introAccent = currentPillarsT.introAccent || series.introAccent;
  const introDescription = currentPillarsT.introDescription || series.introDescription;

  const translatedPillars = series.pillars.map((pillar, idx) => {
    const tPillar = currentPillarsT.pillars?.[idx];
    return {
      number: tPillar?.number || pillar.number,
      title: tPillar?.title || pillar.title,
      copy: tPillar?.copy || pillar.copy,
    };
  });

  const seriesModelsDict = t?.vivoSeriesModels || t?.stiHome?.vivoSeriesModels;
  const currentSeriesModelsDict = seriesModelsDict?.[seriesKey] || {};
  const modelsEyebrow = seriesModelsDict?.eyebrow || "02 / Les modèles";
  const modelsTitle = seriesModelsDict?.title || "Trouvez celui";
  const modelsAccent = seriesModelsDict?.accent || "qui vous ressemble.";
  const modelsDescription =
    seriesModelsDict?.description ||
    "Chaque fiche présente l’essentiel du modèle. Les détails de disponibilité et de configuration sont à confirmer avec l’équipe vivo Algérie de STI.";

  const translatedModels = series.models.map((model) => {
    const tModel = currentSeriesModelsDict?.[model.slug] || {};
    return {
      ...model,
      tag: tModel.tag || `${model.number} / ${series.name.toUpperCase()}`,
      state: tModel.state || model.state,
      phrase: tModel.phrase || model.phrase,
      copy: tModel.copy || model.copy,
      cta: tModel.cta || model.cta,
      alt: tModel.alt || model.alt,
    };
  });

  const seriesContactDict = t?.vivoSeriesContact || t?.stiHome?.vivoSeriesContact;
  const currentContactT = seriesContactDict?.[seriesKey] || {};
  const contactEyebrow = seriesContactDict?.eyebrow || "03 / vivo Algérie";
  const contactTeamText = seriesContactDict?.contactTeam || "Contacter l’équipe";
  const backToProductsText = seriesContactDict?.backToProducts || "Retour à tous les produits";

  const ctaTitle = currentContactT.title || series.ctaTitle;
  const ctaAccent = currentContactT.accent || series.ctaAccent;
  const ctaDescription = currentContactT.description || series.ctaDescription;

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
                <span>{heroEyebrow}</span>
              </div>
              <h1 className="hero-title reveal-item reveal-item--2">
                {heroTitle}
                <br />
                <em>{heroAccent}</em>
              </h1>
              <p className="hero-description reveal-item reveal-item--3">
                {heroDescription}
              </p>
              <div className="hero-actions reveal-item reveal-item--4">
                <Link
                  className="button button--primary"
                  href={`/${locale}/vivo/products/${series.slug}/${series.primaryProductSlug}`}
                >
                  {primaryCtaText} <ArrowUpRight size={16} />
                </Link>
                <Link
                  className="text-link"
                  href={`/${locale}/vivo/products/${series.slug}#models`}
                >
                  {seeModelsText} <ArrowDownRight size={16} />
                </Link>
              </div>
              <div className="hero-trust reveal-item reveal-item--5">
                <ShieldCheck size={17} strokeWidth={1.5} />
                <span>{trustText}</span>
              </div>
            </div>

            <div className="hero-product hero-product--centered reveal-item reveal-item--3">
              <Image
                className="hero-phone hero-slide-image"
                src={series.heroImage}
                alt={heroImageAlt}
                fill
                priority
                sizes="100vw"
              />

              <div className="product-caption">
                <span className="caption-rule" />
                <div>
                  <strong>{heroCaptionName}</strong>
                  <span>{heroCaptionDesc}</span>
                </div>
              </div>
              <div className="product-orbit product-orbit--one" aria-hidden="true" />
              <div className="product-orbit product-orbit--two" aria-hidden="true" />
            </div>
          </div>

          <div className="hero-scroll content-container">
            <span>{scrollPromptText}</span>
            <span className="scroll-line" />
          </div>
        </section>

        <section className="technology-pillars">
          <div className="content-container technology-pillars-heading">
            <div>
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                {pillarsEyebrow}
              </span>
              <h2>
                {introTitle}
                <br />
                <em>{introAccent}</em>
              </h2>
            </div>
            <p>{introDescription}</p>
          </div>
          <div className="content-container technology-pillar-grid">
            {translatedPillars.map(({ number, title, copy }) => (
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
                  {modelsEyebrow}
                </span>
                <h2>
                  {modelsTitle}
                  <br />
                  <em>{modelsAccent}</em>
                </h2>
              </div>
              <p>{modelsDescription}</p>
            </div>
            <div className="y-series-model-grid">
              {translatedModels.map((model) => (
                <article className="y-series-model" key={model.name}>
                  <div className="y-series-model-media relative min-h-[300px]">
                    <Image
                      src={model.image}
                      alt={model.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <span>{model.tag}</span>
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
                {contactEyebrow}
              </span>
              <h2>
                {ctaTitle}
                <br />
                <em>{ctaAccent}</em>
              </h2>
            </div>
            <div className="detail-cta-side">
              <p>{ctaDescription}</p>
              <div className="detail-cta-actions">
                <a className="button button--primary" href={`mailto:${contactEmail}`}>
                  {contactTeamText} <ArrowUpRight size={16} />
                </a>
                <Link
                  className="text-link detail-back-link"
                  href={`/${locale}/vivo/products`}
                >
                  {backToProductsText} <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
