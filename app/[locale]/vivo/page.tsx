"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { VivoNavbar } from "@/app/components/vivo/VivoNavbar";
import { VivoMark } from "@/app/components/vivo/VivoMark";
import { VIVO_ASSETS } from "@/app/components/vivo/assets";
import { useTranslations } from "@/app/[locale]/use-translations";

export default function VivoHomePage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";
  const t = useTranslations() as any;

  const vivoHeroT = t?.vivoHero || t?.stiHome?.vivoHero || {
    viewAll: "Voir tous les produits",
    trust: "Distribution officielle STI · Service local en Algérie",
    scroll: "Défiler pour découvrir",
    navGroupAria: "Naviguer entre les visuels du hero",
    prevAria: "Visuel précédent",
    nextAria: "Visuel suivant",
    showAria: "Afficher",
    slides: [
      {
        name: "X Series",
        eyebrow: "Nouvelle génération",
        title: "La précision",
        accent: "qui se ressent.",
        description:
          "Des images qui restent fidèles à l’instant. Une puissance qui suit votre rythme. Découvrez l’expérience vivo en Algérie.",
        cta: "Découvrir la Série X",
        caption: "Optique de précision",
        alt: "Smartphone vivo X Series bleu nuit présenté en studio",
      },
      {
        name: "V Series",
        eyebrow: "Portraits nouvelle génération",
        title: "Votre lumière",
        accent: "en signature.",
        description:
          "Des portraits plus naturels, des couleurs plus justes et une présence qui vous ressemble au quotidien.",
        cta: "Explorer la Série V",
        caption: "Portrait, avec intention",
        alt: "Détail de l’optique d’un smartphone vivo",
      },
      {
        name: "Y Series",
        eyebrow: "L’essentiel, en mieux",
        title: "Pensé pour",
        accent: "chaque jour.",
        description:
          "Une expérience vivo simple, fluide et fiable, conçue pour suivre vos journées en Algérie.",
        cta: "Voir la Série Y",
        caption: "La vie, en mouvement",
        alt: "Utilisatrice avec un smartphone vivo sur un rooftop à Alger",
      },
    ],
  };

  const slideConfigs = [
    {
      href: `/${locale}/vivo/technology`,
      image: VIVO_ASSETS.hero,
    },
    {
      href: `/${locale}/vivo/products`,
      image: VIVO_ASSETS.camera,
    },
    {
      href: `/${locale}/vivo/products/y-series`,
      image: VIVO_ASSETS.lifestyle,
    },
  ];

  const heroSlides = (vivoHeroT.slides || []).map((slide: any, index: number) => ({
    name: slide.name || (index === 0 ? "X Series" : index === 1 ? "V Series" : "Y Series"),
    eyebrow: slide.eyebrow,
    title: slide.title,
    accent: slide.accent,
    description: slide.description,
    cta: slide.cta,
    href: slideConfigs[index]?.href || `/${locale}/vivo/products`,
    image: slideConfigs[index]?.image || VIVO_ASSETS.hero,
    caption: slide.caption,
    alt: slide.alt,
  }));

  const [activeSlide, setActiveSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const currentSlide = heroSlides[activeSlide] || heroSlides[0];

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (heroPaused || reduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6200);
    return () => window.clearInterval(timer);
  }, [heroPaused, heroSlides.length]);

  const goToSlide = (index: number) => {
    setActiveSlide((index + heroSlides.length) % heroSlides.length);
    setHeroPaused(true);
  };

  return (
    <div className="site-shell">
      <VivoNavbar />

      <main id="top">
        <section className="hero-section">
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-halo" aria-hidden="true" />
          <div className="hero-content content-container hero-content--centered">
            <div className="hero-copy hero-copy--centered" key={activeSlide} aria-live="polite">
              <div className="hero-eyebrow reveal-item reveal-item--1">
                <span className="eyebrow-line" />
                <span>
                  {currentSlide.eyebrow} · vivo {currentSlide.name}
                </span>
              </div>
              <h1 className="hero-title reveal-item reveal-item--2">
                {currentSlide.title}
                <br />
                <em>{currentSlide.accent}</em>
              </h1>
              <p className="hero-description reveal-item reveal-item--3">
                {currentSlide.description}
              </p>
              <div className="hero-actions reveal-item reveal-item--4">
                <Link className="button button--primary" href={currentSlide.href}>
                  {currentSlide.cta} <ArrowUpRight size={16} />
                </Link>
                <Link className="text-link" href={`/${locale}/vivo/products`}>
                  {vivoHeroT.viewAll || "Voir tous les produits"} <ArrowDownRight size={16} />
                </Link>
              </div>
              <div className="hero-trust reveal-item reveal-item--5">
                <ShieldCheck size={17} strokeWidth={1.5} />
                <span>{vivoHeroT.trust || "Distribution officielle STI · Service local en Algérie"}</span>
              </div>
            </div>

            <div
              className="hero-product hero-product--centered reveal-item reveal-item--3"
              onMouseEnter={() => setHeroPaused(true)}
              onMouseLeave={() => setHeroPaused(false)}
              onFocus={() => setHeroPaused(true)}
              onBlur={() => setHeroPaused(false)}
            >
              <div className="product-index" role="group" aria-label={vivoHeroT.navGroupAria || "Naviguer entre les visuels du hero"}>
                <button
                  type="button"
                  className="hero-nav-arrow"
                  onClick={() => goToSlide(activeSlide - 1)}
                  aria-label={vivoHeroT.prevAria || "Visuel précédent"}
                >
                  <ArrowLeft size={14} />
                </button>
                {heroSlides.map((slide: any, index: number) => (
                  <button
                    type="button"
                    key={slide.name}
                    className={`hero-progress ${index === activeSlide ? "hero-progress--active" : ""}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`${vivoHeroT.showAria || "Afficher"} ${slide.name}`}
                    aria-current={index === activeSlide ? "true" : undefined}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                ))}
                <button
                  type="button"
                  className="hero-nav-arrow"
                  onClick={() => goToSlide(activeSlide + 1)}
                  aria-label={vivoHeroT.nextAria || "Visuel suivant"}
                >
                  <ArrowRight size={14} />
                </button>
              </div>

              <Image
                key={currentSlide.image}
                className="hero-phone hero-slide-image"
                src={currentSlide.image}
                alt={currentSlide.alt}
                fill
                priority
                sizes="100vw"
              />

              <div className="product-caption">
                <span className="caption-rule" />
                <div>
                  <strong>{currentSlide.name}</strong>
                  <span>{currentSlide.caption}</span>
                </div>
              </div>
              <div className="product-orbit product-orbit--one" aria-hidden="true" />
              <div className="product-orbit product-orbit--two" aria-hidden="true" />
            </div>
          </div>

          <div className="hero-scroll content-container">
            <span>{vivoHeroT.scroll || "Défiler pour découvrir"}</span>
            <span className="scroll-line" />
          </div>
        </section>

        <section className="signal-strip" aria-label="Points forts vivo">
          <div className="content-container signal-inner">
            <div className="signal-label">
              <span className="signal-number">01</span>
              <span>Pourquoi vivo</span>
            </div>
            <div className="signal-items">
              <div>
                <Camera size={18} strokeWidth={1.4} />
                <span>
                  Imagerie inspirée
                  <br />
                  par le réel
                </span>
              </div>
              <div>
                <Sparkles size={18} strokeWidth={1.4} />
                <span>
                  Design qui attire
                  <br />
                  le regard
                </span>
              </div>
              <div>
                <Globe2 size={18} strokeWidth={1.4} />
                <span>
                  Une présence
                  <br />
                  en Algérie
                </span>
              </div>
            </div>
            <Link href={`/${locale}/vivo/about`} className="signal-link">
              Notre différence <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>

        <section id="technology" className="feature-section">
          <div className="content-container feature-layout">
            <div className="feature-image-wrap">
              <Image
                src={VIVO_ASSETS.camera}
                alt="Détail de l’optique du smartphone vivo"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-cover"
              />
              <span className="image-index">02 / OPTIQUE</span>
            </div>
            <div className="feature-copy">
              <span className="eyebrow eyebrow--blue">L’œil avant tout</span>
              <h2>
                Chaque détail
                <br />
                <em>a sa lumière.</em>
              </h2>
              <p>
                Une approche de la photographie mobile qui privilégie la profondeur, la nuance et le
                mouvement — pour des souvenirs qui ressemblent vraiment à votre histoire.
              </p>
              <Link href={`/${locale}/vivo/technology`} className="text-link text-link--dark">
                Explorer la technologie <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section id="about" className="local-section">
          <div className="content-container local-layout">
            <div className="local-copy">
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                vivo en Algérie
              </span>
              <h2>
                Une technologie
                <br />
                <em>proche de vous.</em>
              </h2>
              <p>
                STI est le partenaire distributeur officiel qui vous ouvre les portes de l’univers
                vivo — avec une sélection authentique, des conseils qui comptent et un accompagnement
                à chaque étape.
              </p>
              <div className="local-assurance">
                <span className="assurance-icon">
                  <ShieldCheck size={17} strokeWidth={1.5} />
                </span>
                <span>
                  <strong>Partenaire officiel vivo</strong>
                  <small>Disponibilité locale · Assistance dédiée STI</small>
                </span>
              </div>
              <Link href={`/${locale}/vivo/about`} className="button button--dark">
                Rencontrer vivo Algérie <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="local-image-wrap">
              <Image
                src={VIVO_ASSETS.lifestyle}
                alt="Une utilisatrice avec un smartphone vivo sur un rooftop à Alger"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
              <div className="local-note">
                <span className="note-dot" />
                Alger · Algérie
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="product-rail">
          <div className="content-container rail-heading">
            <div>
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                La collection vivo
              </span>
              <h2>
                Choisissez votre
                <br />
                <em>façon de voir.</em>
              </h2>
            </div>
            <Link href={`/${locale}/vivo/products`} className="text-link text-link--dark">
              Comparer les séries <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="content-container rail-items">
            {[
              { series: "V Series", href: `/${locale}/vivo/products/v-series`, image: VIVO_ASSETS.v70fe },
              { series: "Y Series", href: `/${locale}/vivo/products/y-series`, image: VIVO_ASSETS.y21d },
            ].map(({ series, href, image }, index) => (
              <Link className="rail-card" href={href} key={series}>
                <span className="rail-card-number">0{index + 1}</span>
                <ArrowUpRight size={18} />
                <span className={`rail-device rail-device--${index + 1}`} aria-hidden="true">
                  <Image
                    src={image}
                    alt={series}
                    width={105}
                    height={155}
                    className="rail-device-image object-contain"
                  />
                </span>
                <span className="rail-card-name">{series}</span>
                <span className="rail-card-line" />
              </Link>
            ))}
          </div>
        </section>

        <section id="support" className="support-section">
          <div className="content-container support-inner">
            <div>
              <span className="eyebrow">
                <span className="section-rule section-rule--light" />
                04 / Support officiel
              </span>
              <h2>
                On reste
                <br />
                <em>à vos côtés.</em>
              </h2>
            </div>
            <div className="support-links">
              <Link href={`/${locale}/vivo/find-a-store`}>
                Trouver un point de vente <ArrowUpRight size={16} />
              </Link>
              <Link href={`/${locale}/vivo/support`}>
                Service après-vente <ArrowUpRight size={16} />
              </Link>
              <Link href={`/${locale}/vivo/support#contact-form`}>
                Contacter l’équipe <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section id="contact" className="detail-cta">
          <div className="content-container detail-cta-inner">
            <div>
              <span className="eyebrow">
                <span className="section-rule section-rule--light" />
                05 / Le prochain regard
              </span>
              <h2>
                Prêt à voir
                <br />
                <em>autrement ?</em>
              </h2>
            </div>
            <div className="detail-cta-side">
              <p>
                Découvrez les smartphones vivo officiels en Algérie, explorez nos séries ou contactez
                notre équipe partenaire STI pour être orienté avec précision.
              </p>
              <div className="detail-cta-actions">
                <a className="button button--primary" href="mailto:service@dz.vivo.com">
                  Parler à vivo Algérie <ArrowUpRight size={16} />
                </a>
                <Link
                  className="text-link detail-back-link"
                  href={`/${locale}/vivo/products`}
                >
                  Explorer les produits <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-container footer-inner">
          <span>© 2026 vivo Algeria · STI Partenaire officiel</span>
          <span>Conçu pour l’Algérie, avec précision.</span>
          <Link href={`/${locale}`}>Retour au site STI <ArrowUpRight size={14} /></Link>
        </div>
      </footer>
    </div>
  );
}
