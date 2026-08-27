"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { VivoNavbar } from "@/app/components/vivo/VivoNavbar";
import { VIVO_ASSETS } from "@/app/components/vivo/assets";

const principles = [
  {
    number: "01",
    title: "Rendre l’innovation proche",
    copy: "Nous créons un lien direct entre les produits vivo et les usages réels des personnes qui vivent en Algérie.",
  },
  {
    number: "02",
    title: "Distribuer avec précision",
    copy: "Notre rôle est de rendre l’expérience vivo plus claire : une sélection, une disponibilité et une orientation adaptées au marché local.",
  },
  {
    number: "03",
    title: "Rester présent après l’achat",
    copy: "Une relation de confiance continue avec des informations utiles, un accompagnement humain et un accès simple au support.",
  },
];

export default function VivoAboutPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";

  return (
    <div className="about-page">
      <VivoNavbar />

      <main id="top">
        <section className="hero-section">
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-halo" aria-hidden="true" />
          <div className="hero-content content-container hero-content--centered">
            <div className="hero-copy hero-copy--centered" aria-live="polite">
              <div className="hero-eyebrow reveal-item reveal-item--1">
                <span className="eyebrow-line" />
                <span>À propos · vivo Algérie</span>
              </div>
              <h1 className="hero-title reveal-item reveal-item--2">
                La technologie
                <br />
                <em>prend racine.</em>
              </h1>
              <p className="hero-description reveal-item reveal-item--3">
                STI est le partenaire distributeur officiel qui fait vivre l’univers vivo en Algérie — de la découverte d’un
                produit jusqu’à l’expérience qui suit.
              </p>
              <div className="hero-actions reveal-item reveal-item--4">
                <Link className="button button--primary" href={`/${locale}/vivo/products`}>
                  Découvrir la collection <ArrowUpRight size={16} />
                </Link>
                <Link className="text-link" href={`/${locale}/vivo/about#principles`}>
                  Notre manière <ArrowDownRight size={16} />
                </Link>
              </div>
              <div className="hero-trust reveal-item reveal-item--5">
                <ShieldCheck size={17} strokeWidth={1.5} />
                <span>Partenaire &amp; distributeur officiel STI en Algérie</span>
              </div>
            </div>

            <div className="hero-product hero-product--centered reveal-item reveal-item--3">
              <Image
                className="hero-phone hero-slide-image"
                src={VIVO_ASSETS.lifestyle}
                alt="Une utilisatrice avec un smartphone vivo dans un paysage urbain algérien"
                fill
                priority
                sizes="100vw"
              />

              <div className="product-caption">
                <span className="caption-rule" />
                <div>
                  <strong>Présence locale STI</strong>
                  <span>Alger · Algérie</span>
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

        <section className="about-intro">
          <div className="content-container about-intro-grid">
            <div className="about-intro-index">
              <span>02</span>
              <span className="about-index-line" />
              <span>NOTRE RÔLE</span>
            </div>
            <div className="about-intro-copy">
              <span className="eyebrow eyebrow--blue">Un lien simple</span>
              <h2>
                Vivo, vu
                <br />
                <em>d’ici.</em>
              </h2>
              <p>
                Notre entreprise STI accompagne la présence de vivo en Algérie en réunissant deux
                responsabilités : distribuer avec exigence, puis traduire cette innovation en une
                expérience plus proche, plus lisible et plus utile.
              </p>
              <Link href={`/${locale}/vivo/products`} className="text-link text-link--dark">
                Découvrir la collection <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="about-intro-note">
              <span className="note-rule" />
              <p>
                Une technologie globale.
                <br />
                Une lecture locale.
              </p>
            </div>
          </div>
        </section>

        <section id="principles" className="about-principles">
          <div className="content-container">
            <div className="about-section-heading">
              <div>
                <span className="eyebrow eyebrow--blue">
                  <span className="section-rule" />
                  03 / Notre manière
                </span>
                <h2>
                  Ce qui nous
                  <br />
                  <em>guide.</em>
                </h2>
              </div>
              <p>
                Chaque contact avec vivo Algérie doit être aussi précis que le produit qu’il
                présente.
              </p>
            </div>
            <div className="principle-grid">
              {principles.map((item) => (
                <article className="principle-card" key={item.number}>
                  <div className="principle-top">
                    <span>{item.number}</span>
                    <Sparkles size={16} strokeWidth={1.5} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <span className="principle-line" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-technology">
          <div className="content-container about-tech-grid">
            <div className="about-tech-image relative min-h-[380px]">
              <Image
                src={VIVO_ASSETS.camera}
                alt="Détail d’une caméra de smartphone vivo"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-cover"
              />
              <span className="image-index">04 / IMAGING</span>
            </div>
            <div className="about-tech-copy">
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                Une exigence partagée
              </span>
              <h2>
                La forme
                <br />
                <em>de la confiance.</em>
              </h2>
              <p>
                Nous croyons qu’un bon produit mérite une présentation claire, une disponibilité
                transparente et une relation qui ne s’arrête pas au premier contact. C’est cette
                exigence qui donne du sens à notre rôle de distributeur officiel en Algérie.
              </p>
              <div className="about-check-list">
                <span>
                  <Check size={15} /> Sélection et information claires
                </span>
                <span>
                  <Check size={15} /> Présence locale et conseil
                </span>
                <span>
                  <Check size={15} /> Accompagnement après l’achat
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-contact">
          <div className="content-container about-contact-inner">
            <div>
              <span className="eyebrow">
                <span className="section-rule section-rule--light" />
                05 / Parlons-nous
              </span>
              <h2>
                Construisons
                <br />
                <em>le prochain regard.</em>
              </h2>
            </div>
            <div className="about-contact-side">
              <p>
                Une question sur vivo en Algérie, nos produits ou notre accompagnement ? Notre équipe
                est là pour vous orienter.
              </p>
              <a className="button button--primary" href="mailto:service@dz.vivo.com">
                Contacter l’équipe <ArrowUpRight size={16} />
              </a>
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
