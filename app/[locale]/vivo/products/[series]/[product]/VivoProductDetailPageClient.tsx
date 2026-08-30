"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ShieldCheck,
} from "lucide-react";
import { VivoNavbar } from "@/app/components/vivo/VivoNavbar";
import {
  getProductData,
  getSeriesData,
  VIVO_PRODUCTS_DATA,
  VIVO_SERIES_DATA,
} from "@/app/components/vivo/productsData";
import { useTranslations } from "@/app/[locale]/use-translations";
import { usePreferences } from "@/app/[locale]/preferences-context";

export default function VivoProductDetailPageClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";
  const rawSeries = (params?.series as string) || "y-series";
  const rawProduct = (params?.product as string) || "y21d";
  const t = useTranslations() as any;
  const { email: dbEmail } = usePreferences();
  const contactEmail = dbEmail || "service@dz.vivo.com";

  const product = getProductData(rawProduct) || VIVO_PRODUCTS_DATA["y21d"];
  const series = getSeriesData(rawSeries) || getSeriesData(product.seriesSlug) || VIVO_SERIES_DATA["y-series"];

  const productHeroDict = t?.vivoProductDetailHero || t?.stiHome?.vivoProductDetailHero;
  const currentProductT = productHeroDict?.[product.slug] || {};

  const seriesKey = rawSeries === "v-series" || rawSeries.includes("v") ? "v-series" : "y-series";
  const localizedSeriesName = productHeroDict?.seriesLabels?.[seriesKey] || series.name;
  const discoverPrefix = productHeroDict?.discoverPrefix || "Découvrir";
  const allSeriesPrefix = productHeroDict?.allSeriesPrefix || "Toute la";
  const scrollPromptText = productHeroDict?.scrollPrompt || "Défiler pour découvrir";

  const heroEyebrow = currentProductT.eyebrow || product.eyebrow;
  const heroTitle = currentProductT.title || product.title;
  const heroAccent = currentProductT.accent || product.accent;
  const heroDescription = currentProductT.description || product.heroDescription;
  const trustText = currentProductT.trustText || product.trustText;
  const heroCaptionName = currentProductT.captionName || product.heroCaptionName;
  const heroCaptionDesc = currentProductT.captionDesc || product.heroCaptionDesc;
  const heroImageAlt = currentProductT.imageAlt || `${product.name} présenté en studio`;

  const productHighlightsDict = t?.vivoProductDetailHighlights || t?.stiHome?.vivoProductDetailHighlights;
  const currentHighlightsT = productHighlightsDict?.[product.slug] || {};
  const highlightsEyebrow = productHighlightsDict?.eyebrow || "01 / Une présence simple";

  const introTitle = currentHighlightsT.introTitle || product.introTitle;
  const introAccent = currentHighlightsT.introAccent || product.introAccent;
  const introDescription = currentHighlightsT.introDescription || product.introDescription;

  const translatedPillars = product.pillars.map((pillar, idx) => {
    const tPillar = currentHighlightsT.pillars?.[idx];
    return {
      ...pillar,
      number: tPillar?.number || pillar.number,
      title: tPillar?.title || pillar.title,
      copy: tPillar?.copy || pillar.copy,
    };
  });

  const productStoryDict = t?.vivoProductDetailStory || t?.stiHome?.vivoProductDetailStory;
  const currentStoryT = productStoryDict?.[product.slug] || {};
  const storyTag = productStoryDict?.tag || "02 / DÉTAILS";
  const storyEyebrow = productStoryDict?.eyebrow || "L’attention au détail";

  const detailTitle = currentStoryT.title || product.detailTitle;
  const detailAccent = currentStoryT.accent || product.detailAccent;
  const detailDescription = currentStoryT.description || product.detailDescription;
  const detailImageAlt = currentStoryT.alt || `Détail de ${product.name}`;

  const translatedPoints: string[] =
    currentStoryT.points && Array.isArray(currentStoryT.points)
      ? currentStoryT.points
      : product.detailPoints;

  const productCtaDict = t?.vivoProductDetailCta || t?.stiHome?.vivoProductDetailCta;
  const ctaEyebrowPrefix = productCtaDict?.eyebrowPrefix || "03 /";
  const ctaTitle = productCtaDict?.title || "Prêt à le";
  const ctaAccent = productCtaDict?.accent || "découvrir ?";
  const ctaDescription = (
    productCtaDict?.descriptionTemplate ||
    "Contactez l’équipe vivo Algérie pour connaître la disponibilité du {name} et être orienté vers le point de vente adapté."
  ).replace("{name}", product.name);
  const ctaContactTeam = productCtaDict?.contactTeam || "Contacter l’équipe";
  const ctaSeeAllSeriesPrefix = productCtaDict?.seeAllSeriesPrefix || "Voir toute la";

  return (
    <div className="product-detail-page">
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
                  href={`/${locale}/vivo/products/${series.slug}/${product.slug}#highlights`}
                >
                  {discoverPrefix} {product.name} <ArrowUpRight size={16} />
                </Link>
                <Link
                  className="text-link"
                  href={`/${locale}/vivo/products/${series.slug}`}
                >
                  {allSeriesPrefix} {localizedSeriesName} <ArrowDownRight size={16} />
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
                src={product.heroImage}
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

        <section id="highlights" className="technology-pillars">
          <div className="content-container technology-pillars-heading">
            <div>
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                {highlightsEyebrow}
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
            {translatedPillars.map(({ number, icon: Icon, title, copy }) => (
              <article className="technology-pillar" key={number}>
                <div className="technology-pillar-top">
                  <span>{number}</span>
                  <Icon size={20} strokeWidth={1.35} />
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="technology-pillar-rule" />
              </article>
            ))}
          </div>
        </section>

        <section className="detail-image-story">
          <div className="content-container detail-image-grid">
            <div className="detail-image-frame relative min-h-[360px]">
              <Image
                src={product.detailImage}
                alt={detailImageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-cover"
              />
              <span>{storyTag}</span>
            </div>
            <div className="detail-image-copy">
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                {storyEyebrow}
              </span>
              <h2>
                {detailTitle}
                <br />
                <em>{detailAccent}</em>
              </h2>
              <p>{detailDescription}</p>
              <ul>
                {translatedPoints.map((point, i) => (
                  <li key={i}>
                    <Check size={15} /> {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="detail-cta">
          <div className="content-container detail-cta-inner">
            <div>
              <span className="eyebrow">
                <span className="section-rule section-rule--light" />
                {ctaEyebrowPrefix} {product.name}
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
                  {ctaContactTeam} <ArrowUpRight size={16} />
                </a>
                <Link
                  href={`/${locale}/vivo/products/${series.slug}`}
                  className="text-link detail-back-link"
                >
                  {ctaSeeAllSeriesPrefix} {localizedSeriesName} <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
