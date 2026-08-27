"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, Camera, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { VivoNavbar } from "@/app/components/vivo/VivoNavbar";
import { VIVO_ASSETS } from "@/app/components/vivo/assets";

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

export default function VivoTechnologyPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";

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
                <span>Technologie · vivo Algérie</span>
              </div>
              <h1 className="hero-title reveal-item reveal-item--2">
                La précision
                <br />
                <em>qui se ressent.</em>
              </h1>
              <p className="hero-description reveal-item reveal-item--3">
                Chez vivo, l’innovation reste au service d’une expérience plus naturelle : regarder,
                créer, partager et continuer.
              </p>
              <div className="hero-actions reveal-item reveal-item--4">
                <Link className="button button--primary" href={`/${locale}/vivo/products`}>
                  Explorer les produits <ArrowUpRight size={16} />
                </Link>
                <Link className="text-link" href={`/${locale}/vivo/technology#principles`}>
                  Découvrir les principes <ArrowDownRight size={16} />
                </Link>
              </div>
              <div className="hero-trust reveal-item reveal-item--5">
                <ShieldCheck size={17} strokeWidth={1.5} />
                <span>Distribution officielle STI · Précision &amp; Innovation</span>
              </div>
            </div>

            <div className="hero-product hero-product--centered reveal-item reveal-item--3">
              <Image
                className="hero-phone hero-slide-image"
                src={VIVO_ASSETS.hero}
                alt="Smartphone vivo présenté dans une scène studio bleue"
                fill
                priority
                sizes="100vw"
              />

              <div className="product-caption">
                <span className="caption-rule" />
                <div>
                  <strong>Optique de précision</strong>
                  <span>vivo Technology · Algérie</span>
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

        <section id="principles" className="technology-pillars">
          <div className="content-container technology-pillars-heading">
            <div>
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                02 / Les principes
              </span>
              <h2>
                Invisible dans le geste.
                <br />
                <em>Présente dans le résultat.</em>
              </h2>
            </div>
            <p>
              La technologie la plus utile est celle qui vous laisse vous concentrer sur ce que vous
              êtes venu faire.
            </p>
          </div>
          <div className="content-container technology-pillar-grid">
            {pillars.map(({ number, icon: Icon, title, copy }) => (
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
                alt="Détail macro de l’optique d’un smartphone vivo"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-cover"
              />
              <span>03 / OPTIQUE</span>
            </div>
            <div className="technology-story-copy">
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                Regarder autrement
              </span>
              <h2>
                Chaque détail
                <br />
                <em>a sa lumière.</em>
              </h2>
              <p>
                Une photographie ne commence pas au moment où l’on appuie. Elle commence dans la
                façon dont un téléphone comprend une scène et vous aide à la garder fidèle à votre
                intention.
              </p>
              <div className="technology-story-note">
                <ShieldCheck size={18} strokeWidth={1.35} />
                <span>
                  <strong>Une vision Vivo avec STI</strong>
                  <small>
                    La technologie racontée simplement, avec des informations adaptées à chaque
                    modèle officiel.
                  </small>
                </span>
              </div>
              <Link href={`/${locale}/vivo/products`} className="text-link text-link--dark">
                Explorer les produits <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="technology-experience">
          <div className="content-container technology-experience-inner">
            <div className="technology-experience-copy">
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                04 / Dans la vie
              </span>
              <h2>
                La puissance
                <br />
                <em>sans le bruit.</em>
              </h2>
              <p>
                Une expérience bien pensée ne cherche pas à se faire remarquer à chaque instant. Elle
                devient une présence fiable, prête quand vous l’êtes.
              </p>
              <div className="technology-experience-list">
                <span>
                  <strong>01</strong> Des gestes qui restent naturels
                </span>
                <span>
                  <strong>02</strong> Des détails qui se découvrent
                </span>
                <span>
                  <strong>03</strong> Une expérience qui suit le rythme
                </span>
              </div>
            </div>
            <div className="technology-experience-media relative min-h-[380px]">
              <Image
                src={VIVO_ASSETS.lifestyle}
                alt="Utilisatrice avec un smartphone vivo sur un rooftop à Alger"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-cover"
              />
              <span>ALGÉRIE / EVERYDAY</span>
            </div>
          </div>
        </section>

        <section className="technology-series">
          <div className="content-container technology-series-heading">
            <div>
              <span className="eyebrow">
                <span className="section-rule section-rule--light" />
                05 / Choisir son expérience
              </span>
              <h2>
                Une technologie
                <br />
                <em>pour chaque regard.</em>
              </h2>
            </div>
            <p>
              Retrouvez l’approche vivo dans les séries pensées pour différents usages et différentes
              façons de voir.
            </p>
          </div>
          <div className="content-container technology-series-grid">
            <Link
              href={`/${locale}/vivo/products#x-series`}
              className="technology-series-card technology-series-card--dark"
            >
              <span>01 / X SERIES</span>
              <strong>
                Voir plus
                <br />
                <em>loin.</em>
              </strong>
              <ArrowUpRight size={18} />
            </Link>
            <Link
              href={`/${locale}/vivo/products`}
              className="technology-series-card technology-series-card--warm"
            >
              <span>02 / V SERIES</span>
              <strong>
                Votre lumière
                <br />
                <em>en signature.</em>
              </strong>
              <ArrowUpRight size={18} />
            </Link>
            <Link
              href={`/${locale}/vivo/products/y-series`}
              className="technology-series-card technology-series-card--blue"
            >
              <span>03 / Y SERIES</span>
              <strong>
                Pensé pour
                <br />
                <em>chaque jour.</em>
              </strong>
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>

        <section className="technology-contact">
          <div className="content-container technology-contact-inner">
            <div>
              <span className="eyebrow">
                <span className="section-rule section-rule--light" />
                06 / Vivo Algérie
              </span>
              <h2>
                Une question
                <br />
                <em>sur la technologie ?</em>
              </h2>
            </div>
            <div>
              <p>
                Notre équipe vous aide à comprendre l’essentiel et à trouver le modèle qui correspond
                à vos usages.
              </p>
              <Link href={`/${locale}/vivo/support`} className="button button--primary">
                Parler au support <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-container footer-inner">
          <span>© 2026 vivo Algeria · STI Partenaire officiel</span>
          <span>Technologie au quotidien</span>
          <Link href={`/${locale}/vivo`}>
            Retour à l’accueil vivo <ArrowUpRight size={14} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
