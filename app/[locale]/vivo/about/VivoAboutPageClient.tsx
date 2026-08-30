"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { VivoNavbar } from "@/app/components/vivo/VivoNavbar";
import { VIVO_ASSETS } from "@/app/components/vivo/assets";
import { useTranslations } from "@/app/[locale]/use-translations";
import { usePreferences } from "@/app/[locale]/preferences-context";

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

export default function VivoAboutPageClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";
  const t = useTranslations() as any;
  const { email: dbEmail } = usePreferences();
  const heroT = t?.vivoAboutHero || t?.stiHome?.vivoAboutHero || {};

  const heroEyebrow = heroT.eyebrow || "À propos · vivo Algérie";
  const heroTitle = heroT.title || "La technologie";
  const heroAccent = heroT.accent || "prend racine.";
  const heroDescription =
    heroT.description ||
    "STI est le partenaire distributeur officiel qui fait vivre l’univers vivo en Algérie — de la découverte d’un produit jusqu’à l’expérience qui suit.";
  const discoverCollectionText = heroT.discoverCollection || "Découvrir la collection";
  const ourApproachText = heroT.ourApproach || "Notre manière";
  const trustText = heroT.trustText || "Partenaire & distributeur officiel STI en Algérie";
  const captionName = heroT.captionName || "Présence locale STI";
  const captionDesc = heroT.captionDesc || "Alger · Algérie";
  const imageAlt =
    heroT.imageAlt || "Une utilisatrice avec un smartphone vivo dans un paysage urbain algérien";
  const scrollPromptText = heroT.scrollPrompt || "Défiler pour découvrir";

  const roleT = t?.vivoAboutRole || t?.stiHome?.vivoAboutRole || {};
  const roleEyebrow = roleT.eyebrow || "02 / Notre rôle";
  const roleTitle = roleT.title || "Vivo, vu";
  const roleAccent = roleT.accent || "d’ici.";
  const roleDescription =
    roleT.description ||
    "Notre entreprise STI accompagne la présence de vivo en Algérie en réunissant deux responsabilités : distribuer avec exigence, puis traduire cette innovation en une expérience plus proche, plus lisible et plus utile.";
  const roleNoteLine1 = roleT.noteLine1 || "Une technologie globale.";
  const roleNoteLine2 = roleT.noteLine2 || "Une lecture locale.";
  const roleDiscoverText = roleT.discoverCollection || "Découvrir la collection";

  const principlesT = t?.vivoAboutPrinciples || t?.stiHome?.vivoAboutPrinciples || {};
  const principlesEyebrow = principlesT.eyebrow || "03 / Notre manière";
  const principlesTitle = principlesT.title || "Ce qui nous";
  const principlesAccent = principlesT.accent || "guide.";
  const principlesDescription =
    principlesT.description ||
    "Chaque contact avec vivo Algérie doit être aussi précis que le produit qu’il présente.";

  const translatedPrinciples = principles.map((item, idx) => {
    const tItem = principlesT.items?.[idx];
    return {
      number: tItem?.number || item.number,
      title: tItem?.title || item.title,
      copy: tItem?.copy || item.copy,
    };
  });

  const techT = t?.vivoAboutTechnology || t?.stiHome?.vivoAboutTechnology || {};
  const techImageIndex = techT.imageIndex || "04 / IMAGING";
  const techImageAlt = techT.imageAlt || "Détail d’une caméra de smartphone vivo";
  const techEyebrow = techT.eyebrow || "Une exigence partagée";
  const techTitle = techT.title || "La forme";
  const techAccent = techT.accent || "de la confiance.";
  const techDescription =
    techT.description ||
    "Nous croyons qu’un bon produit mérite une présentation claire, une disponibilité transparente et une relation qui ne s’arrête pas au premier contact. C’est cette exigence qui donne du sens à notre rôle de distributeur officiel en Algérie.";
  const techItems = techT.items || [
    "Sélection et information claires",
    "Présence locale et conseil",
    "Accompagnement après l’achat",
  ];

  const contactT = t?.vivoAboutContact || t?.stiHome?.vivoAboutContact || {};
  const contactEyebrow = contactT.eyebrow || "05 / Parlons-nous";
  const contactTitle = contactT.title || "Construisons";
  const contactAccent = contactT.accent || "le prochain regard.";
  const contactDescription =
    contactT.description ||
    "Une question sur vivo en Algérie, nos produits ou notre accompagnement ? Notre équipe est là pour vous orienter.";
  const contactTeamText = contactT.contactTeam || "Contacter l’équipe";
  const contactEmail = dbEmail || "service@dz.vivo.com";

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
                <Link className="button button--primary" href={`/${locale}/vivo/products`}>
                  {discoverCollectionText} <ArrowUpRight size={16} />
                </Link>
                <Link className="text-link" href={`/${locale}/vivo/about#principles`}>
                  {ourApproachText} <ArrowDownRight size={16} />
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
                src={VIVO_ASSETS.lifestyle}
                alt={imageAlt}
                fill
                priority
                sizes="100vw"
              />

              <div className="product-caption">
                <span className="caption-rule" />
                <div>
                  <strong>{captionName}</strong>
                  <span>{captionDesc}</span>
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

        <section className="about-intro">
          <div className="content-container about-intro-grid">
            <div className="about-intro-heading">
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                {roleEyebrow}
              </span>
              <h2>
                {roleTitle}
                <br />
                <em>{roleAccent}</em>
              </h2>
            </div>
            <div className="about-intro-copy">
              <p>{roleDescription}</p>
              <div className="about-intro-note">
                <span className="note-rule" />
                <p>
                  {roleNoteLine1}
                  <br />
                  {roleNoteLine2}
                </p>
              </div>
              <Link href={`/${locale}/vivo/products`} className="text-link text-link--dark">
                {roleDiscoverText} <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section id="principles" className="about-principles">
          <div className="content-container">
            <div className="about-section-heading">
              <div>
                <span className="eyebrow eyebrow--blue">
                  <span className="section-rule" />
                  {principlesEyebrow}
                </span>
                <h2>
                  {principlesTitle}
                  <br />
                  <em>{principlesAccent}</em>
                </h2>
              </div>
              <p>{principlesDescription}</p>
            </div>
            <div className="principle-grid">
              {translatedPrinciples.map((item) => (
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
                alt={techImageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-cover"
              />
              <span className="image-index">{techImageIndex}</span>
            </div>
            <div className="about-tech-copy">
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                {techEyebrow}
              </span>
              <h2>
                {techTitle}
                <br />
                <em>{techAccent}</em>
              </h2>
              <p>{techDescription}</p>
              <div className="about-check-list">
                {techItems.map((item: string, idx: number) => (
                  <span key={idx}>
                    <Check size={15} /> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about-contact">
          <div className="content-container about-contact-inner">
            <div>
              <span className="eyebrow">
                <span className="section-rule section-rule--light" />
                {contactEyebrow}
              </span>
              <h2>
                {contactTitle}
                <br />
                <em>{contactAccent}</em>
              </h2>
            </div>
            <div className="about-contact-side">
              <p>{contactDescription}</p>
              <a className="button button--primary" href={`mailto:${contactEmail}`}>
                {contactTeamText} <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
