"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, Camera, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { VivoNavbar } from "@/app/components/vivo/VivoNavbar";
import { VIVO_ASSETS } from "@/app/components/vivo/assets";
import { useTranslations } from "@/app/[locale]/use-translations";

const pillars = [
  {
    number: "01",
    icon: Camera,
    title: "Imagerie fidèle",
    copy: "Des outils conçus pour garder le réel au centre : la lumière, les visages et les détails qui donnent du relief à chaque instant.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Expérience fluide",
    copy: "Une interface pensée pour rester claire, intuitive et agréable, du premier geste à l’usage quotidien.",
  },
  {
    number: "03",
    icon: Gauge,
    title: "Énergie sereine",
    copy: "Une approche de la technologie qui accompagne votre rythme, sans ajouter de complexité à ce qui doit rester simple.",
  },
];

export default function VivoTechnologyPageClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";
  const t = useTranslations() as any;
  const heroT = t?.vivoTechnologyHero || t?.stiHome?.vivoTechnologyHero || {};

  const heroEyebrow = heroT.eyebrow || "Technologie · vivo Algérie";
  const heroTitle = heroT.title || "La précision";
  const heroAccent = heroT.accent || "qui se ressent.";
  const heroDescription =
    heroT.description ||
    "Chez vivo, l’innovation reste au service d’une expérience plus naturelle : regarder, créer, partager et continuer.";
  const exploreProductsText = heroT.exploreProducts || "Explorer les produits";
  const discoverPrinciplesText = heroT.discoverPrinciples || "Découvrir les principes";
  const trustText = heroT.trustText || "Distribution officielle STI · Précision & Innovation";
  const captionName = heroT.captionName || "Optique de précision";
  const captionDesc = heroT.captionDesc || "vivo Technology · Algérie";
  const imageAlt = heroT.imageAlt || "Smartphone vivo présenté dans une scène studio bleue";
  const scrollPromptText = heroT.scrollPrompt || "Défiler pour découvrir";

  const principlesT = t?.vivoTechnologyPrinciples || t?.stiHome?.vivoTechnologyPrinciples || {};
  const principlesEyebrow = principlesT.eyebrow || "02 / Les principes";
  const principlesTitle = principlesT.title || "Invisible dans le geste.";
  const principlesAccent = principlesT.accent || "Présente dans le résultat.";
  const principlesDescription =
    principlesT.description ||
    "La technologie la plus utile est celle qui vous laisse vous concentrer sur ce que vous êtes venu faire.";

  const translatedPillars = pillars.map((pillar, idx) => {
    const tPillar = principlesT.pillars?.[idx];
    return {
      ...pillar,
      number: tPillar?.number || pillar.number,
      title: tPillar?.title || pillar.title,
      copy: tPillar?.copy || pillar.copy,
    };
  });

  const storyT = t?.vivoTechnologyStory || t?.stiHome?.vivoTechnologyStory || {};
  const storyTag = storyT.tag || "03 / OPTIQUE";
  const storyEyebrow = storyT.eyebrow || "Regarder autrement";
  const storyTitle = storyT.title || "Chaque détail";
  const storyAccent = storyT.accent || "a sa lumière.";
  const storyDescription =
    storyT.description ||
    "Une photographie ne commence pas au moment où l’on appuie. Elle commence dans la façon dont un téléphone comprend une scène et vous aide à la garder fidèle à votre intention.";
  const storyNoteTitle = storyT.noteTitle || "Une vision Vivo avec STI";
  const storyNoteDesc =
    storyT.noteDesc ||
    "La technologie racontée simplement, avec des informations adaptées à chaque modèle officiel.";
  const storyExploreProducts = storyT.exploreProducts || "Explorer les produits";
  const storyImageAlt = storyT.imageAlt || "Détail macro de l’optique d’un smartphone vivo";

  const experienceT = t?.vivoTechnologyExperience || t?.stiHome?.vivoTechnologyExperience || {};
  const experienceEyebrow = experienceT.eyebrow || "04 / Dans la vie";
  const experienceTitle = experienceT.title || "La puissance";
  const experienceAccent = experienceT.accent || "sans le bruit.";
  const experienceDescription =
    experienceT.description ||
    "Une expérience bien pensée ne cherche pas à se faire remarquer à chaque instant. Elle devient une présence fiable, prête quand vous l’êtes.";
  const experienceItems = experienceT.items || [
    { number: "01", text: "Des gestes qui restent naturels" },
    { number: "02", text: "Des détails qui se découvrent" },
    { number: "03", text: "Une expérience qui suit le rythme" },
  ];
  const experienceTag = experienceT.tag || "ALGÉRIE / EVERYDAY";
  const experienceImageAlt =
    experienceT.imageAlt || "Utilisatrice avec un smartphone vivo sur un rooftop à Alger";

  const seriesSectionT = t?.vivoTechnologySeries || t?.stiHome?.vivoTechnologySeries || {};
  const seriesEyebrow = seriesSectionT.eyebrow || "05 / Choisir son expérience";
  const seriesTitle = seriesSectionT.title || "Une technologie";
  const seriesAccent = seriesSectionT.accent || "pour chaque regard.";
  const seriesDescription =
    seriesSectionT.description ||
    "Retrouvez l’approche vivo dans les séries pensées pour différents usages et différentes façons de voir.";
  const seriesCardsT = seriesSectionT.cards || {};

  const xSeriesCard = seriesCardsT["x-series"] || {};
  const vSeriesCard = seriesCardsT["v-series"] || {};
  const ySeriesCard = seriesCardsT["y-series"] || {};

  const contactT = t?.vivoTechnologyContact || t?.stiHome?.vivoTechnologyContact || {};
  const contactEyebrow = contactT.eyebrow || "06 / Vivo Algérie";
  const contactTitle = contactT.title || "Une question";
  const contactAccent = contactT.accent || "sur la technologie ?";
  const contactDescription =
    contactT.description ||
    "Notre équipe vous aide à comprendre l’essentiel et à trouver le modèle qui correspond à vos usages.";
  const contactTalkToSupport = contactT.talkToSupport || "Parler au support";

  return (
    <div className="technology-page">
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
                  {exploreProductsText} <ArrowUpRight size={16} />
                </Link>
                <Link className="text-link" href={`/${locale}/vivo/technology#principles`}>
                  {discoverPrinciplesText} <ArrowDownRight size={16} />
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
                src={VIVO_ASSETS.hero}
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

        <section id="principles" className="technology-pillars">
          <div className="content-container technology-pillars-heading">
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

        <section className="technology-story">
          <div className="content-container technology-story-inner">
            <div className="technology-story-media relative min-h-[380px]">
              <Image
                src={VIVO_ASSETS.camera}
                alt={storyImageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-cover"
              />
              <span>{storyTag}</span>
            </div>
            <div className="technology-story-copy">
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                {storyEyebrow}
              </span>
              <h2>
                {storyTitle}
                <br />
                <em>{storyAccent}</em>
              </h2>
              <p>{storyDescription}</p>
              <div className="technology-story-note">
                <ShieldCheck size={18} strokeWidth={1.35} />
                <span>
                  <strong>{storyNoteTitle}</strong>
                  <small>{storyNoteDesc}</small>
                </span>
              </div>
              <Link href={`/${locale}/vivo/products`} className="text-link text-link--dark">
                {storyExploreProducts} <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="technology-experience">
          <div className="content-container technology-experience-inner">
            <div className="technology-experience-copy">
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                {experienceEyebrow}
              </span>
              <h2>
                {experienceTitle}
                <br />
                <em>{experienceAccent}</em>
              </h2>
              <p>{experienceDescription}</p>
              <div className="technology-experience-list">
                {experienceItems.map((item: any) => (
                  <span key={item.number}>
                    <strong>{item.number}</strong> {item.text}
                  </span>
                ))}
              </div>
            </div>
            <div className="technology-experience-media relative min-h-[380px]">
              <Image
                src={VIVO_ASSETS.lifestyle}
                alt={experienceImageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-cover"
              />
              <span>{experienceTag}</span>
            </div>
          </div>
        </section>

        <section className="technology-series">
          <div className="content-container technology-series-heading">
            <div>
              <span className="eyebrow">
                <span className="section-rule section-rule--light" />
                {seriesEyebrow}
              </span>
              <h2>
                {seriesTitle}
                <br />
                <em>{seriesAccent}</em>
              </h2>
            </div>
            <p>{seriesDescription}</p>
          </div>
          <div className="content-container technology-series-grid">
            <Link
              href={`/${locale}/vivo/products#x-series`}
              className="technology-series-card technology-series-card--dark"
            >
              <span>{xSeriesCard.tag || "01 / X SERIES"}</span>
              <strong>
                {xSeriesCard.title || "Voir plus"}
                <br />
                <em>{xSeriesCard.accent || "loin."}</em>
              </strong>
              <ArrowUpRight size={18} />
            </Link>
            <Link
              href={`/${locale}/vivo/products`}
              className="technology-series-card technology-series-card--warm"
            >
              <span>{vSeriesCard.tag || "02 / V SERIES"}</span>
              <strong>
                {vSeriesCard.title || "Votre lumière"}
                <br />
                <em>{vSeriesCard.accent || "en signature."}</em>
              </strong>
              <ArrowUpRight size={18} />
            </Link>
            <Link
              href={`/${locale}/vivo/products/y-series`}
              className="technology-series-card technology-series-card--blue"
            >
              <span>{ySeriesCard.tag || "03 / Y SERIES"}</span>
              <strong>
                {ySeriesCard.title || "Pensé pour"}
                <br />
                <em>{ySeriesCard.accent || "chaque jour."}</em>
              </strong>
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>

        <section className="technology-contact">
          <div className="content-container technology-contact-inner">
            <div>
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                {contactEyebrow}
              </span>
              <h2>
                {contactTitle}
                <br />
                <em>{contactAccent}</em>
              </h2>
            </div>
            <div>
              <p>{contactDescription}</p>
              <Link href={`/${locale}/vivo/support`} className="button button--primary">
                {contactTalkToSupport} <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
