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

export default function DynamicVivoProductDetailPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";
  const rawSeries = (params?.series as string) || "y-series";
  const rawProduct = (params?.product as string) || "y21d";

  const product = getProductData(rawProduct) || VIVO_PRODUCTS_DATA["y21d"];
  const series = getSeriesData(rawSeries) || getSeriesData(product.seriesSlug) || VIVO_SERIES_DATA["y-series"];

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
                <span>{product.eyebrow}</span>
              </div>
              <h1 className="hero-title reveal-item reveal-item--2">
                {product.title}
                <br />
                <em>{product.accent}</em>
              </h1>
              <p className="hero-description reveal-item reveal-item--3">
                {product.heroDescription}
              </p>
              <div className="hero-actions reveal-item reveal-item--4">
                <Link
                  className="button button--primary"
                  href={`/${locale}/vivo/products/${series.slug}/${product.slug}#highlights`}
                >
                  Découvrir {product.name} <ArrowUpRight size={16} />
                </Link>
                <Link
                  className="text-link"
                  href={`/${locale}/vivo/products/${series.slug}`}
                >
                  Toute la {series.name} <ArrowDownRight size={16} />
                </Link>
              </div>
              <div className="hero-trust reveal-item reveal-item--5">
                <ShieldCheck size={17} strokeWidth={1.5} />
                <span>{product.trustText}</span>
              </div>
            </div>

            <div className="hero-product hero-product--centered reveal-item reveal-item--3">
              <Image
                className="hero-phone hero-slide-image"
                src={product.heroImage}
                alt={`${product.name} présenté en studio`}
                fill
                priority
                sizes="100vw"
              />

              <div className="product-caption">
                <span className="caption-rule" />
                <div>
                  <strong>{product.heroCaptionName}</strong>
                  <span>{product.heroCaptionDesc}</span>
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

        <section id="highlights" className="technology-pillars">
          <div className="content-container technology-pillars-heading">
            <div>
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                01 / Une présence simple
              </span>
              <h2>
                {product.introTitle}
                <br />
                <em>{product.introAccent}</em>
              </h2>
            </div>
            <p>{product.introDescription}</p>
          </div>
          <div className="content-container technology-pillar-grid">
            {product.pillars.map(({ number, icon: Icon, title, copy }) => (
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
                alt={`Détail de ${product.name}`}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-cover"
              />
              <span>02 / DÉTAILS</span>
            </div>
            <div className="detail-image-copy">
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                L’attention au détail
              </span>
              <h2>
                {product.detailTitle}
                <br />
                <em>{product.detailAccent}</em>
              </h2>
              <p>{product.detailDescription}</p>
              <ul>
                {product.detailPoints.map((point, i) => (
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
                03 / {product.name}
              </span>
              <h2>
                Prêt à le
                <br />
                <em>découvrir ?</em>
              </h2>
            </div>
            <div className="detail-cta-side">
              <p>
                Contactez l’équipe vivo Algérie pour connaître la disponibilité du {product.name} et être
                orienté vers le point de vente adapté.
              </p>
              <div className="detail-cta-actions">
                <a className="button button--primary" href="mailto:service@dz.vivo.com">
                  Contacter l’équipe <ArrowUpRight size={16} />
                </a>
                <Link
                  href={`/${locale}/vivo/products/${series.slug}`}
                  className="text-link detail-back-link"
                >
                  Voir toute la {series.name} <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-container footer-inner">
          <span>© 2026 vivo Algeria · STI Partenaire officiel</span>
          <span>{product.name} · {series.name}</span>
          <Link href={`/${locale}/vivo/products`}>
            Retour aux produits <ArrowUpRight size={14} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
