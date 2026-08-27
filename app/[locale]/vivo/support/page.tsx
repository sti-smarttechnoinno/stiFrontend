"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  Check,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { VivoNavbar } from "@/app/components/vivo/VivoNavbar";
import { VIVO_ASSETS } from "@/app/components/vivo/assets";

const faqItems = [
  {
    question: "Où acheter un produit vivo officiel en Algérie ?",
    answer:
      "Utilisez le bouton « Trouver un point de vente » pour découvrir les revendeurs agréés et partenaires officiels STI à travers l'Algérie.",
  },
  {
    question: "Comment obtenir des informations sur un modèle spécifique ?",
    answer:
      "Ouvrez la page du modèle depuis la collection Produits (X Series, V Series ou Y Series), puis contactez notre équipe pour confirmer les coloris et la disponibilité locale.",
  },
  {
    question: "Comment demander un accompagnement après l’achat ou faire jouer la garantie ?",
    answer:
      "Sélectionnez « Service après-vente » dans le formulaire ci-dessous et indiquez le modèle concerné. Nos techniciens vous orienteront vers le centre de service agréé le plus proche.",
  },
  {
    question: "Quels éléments dois-je préparer pour une demande ?",
    answer:
      "Pour accélérer le traitement, préparez le nom du modèle, votre ville/wilaya en Algérie et une description claire de votre besoin.",
  },
];

export default function VivoSupportPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";

  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="support-page">
      <VivoNavbar />

      <main id="top">
        <section className="hero-section">
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-halo" aria-hidden="true" />
          <div className="hero-content content-container hero-content--centered">
            <div className="hero-copy hero-copy--centered" aria-live="polite">
              <div className="hero-eyebrow reveal-item reveal-item--1">
                <span className="eyebrow-line" />
                <span>Support · vivo Algérie</span>
              </div>
              <h1 className="hero-title reveal-item reveal-item--2">
                On reste
                <br />
                <em>à vos côtés.</em>
              </h1>
              <p className="hero-description reveal-item reveal-item--3">
                Une question sur un modèle, un achat ou un service ? Consultez notre FAQ ou écrivez
                directement à notre équipe locale.
              </p>
              <div className="hero-actions reveal-item reveal-item--4">
                <Link className="button button--primary" href={`/${locale}/vivo/support#contact-form`}>
                  Nous écrire <ArrowUpRight size={16} />
                </Link>
                <Link className="text-link" href={`/${locale}/vivo/support#faq`}>
                  Consulter la FAQ <ArrowDownRight size={16} />
                </Link>
              </div>
              <div className="hero-trust reveal-item reveal-item--5">
                <ShieldCheck size={17} strokeWidth={1.5} />
                <span>Service client &amp; SAV officiel STI en Algérie</span>
              </div>
            </div>

            <div className="hero-product hero-product--centered reveal-item reveal-item--3">
              <Image
                className="hero-phone hero-slide-image"
                src={VIVO_ASSETS.camera}
                alt="Support technique et service après-vente vivo Algérie"
                fill
                priority
                sizes="100vw"
              />

              <div className="product-caption">
                <span className="caption-rule" />
                <div>
                  <strong>Assistance officielle</strong>
                  <span>Service &amp; Garantie · STI Algérie</span>
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

        <section className="support-shortcuts">
          <div className="content-container support-shortcuts-inner">
            <Link href={`/${locale}/vivo/support#faq`}>
              <span className="shortcut-number">01</span>
              <span>
                <strong>Questions fréquentes</strong>
                <small>Consulter la FAQ</small>
              </span>
              <ArrowUpRight size={16} />
            </Link>
            <Link href={`/${locale}/vivo/support#contact-form`}>
              <span className="shortcut-number">02</span>
              <span>
                <strong>Contacter l’équipe</strong>
                <small>Envoyer un message</small>
              </span>
              <ArrowUpRight size={16} />
            </Link>
            <a href="mailto:service@dz.vivo.com">
              <span className="shortcut-number">03</span>
              <span>
                <strong>Écrire directement</strong>
                <small>service@dz.vivo.com</small>
              </span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

        <section id="faq" className="faq-section">
          <div className="content-container faq-layout">
            <div className="faq-heading">
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                02 / FAQ
              </span>
              <h2>
                Les réponses
                <br />
                <em>essentielles.</em>
              </h2>
              <p>
                Retrouvez les réponses aux questions les plus courantes posées par nos clients en
                Algérie.
              </p>
            </div>
            <div className="faq-list">
              {faqItems.map((item, index) => (
                <div
                  className={`faq-item ${openFaq === index ? "faq-item--open" : ""}`}
                  key={item.question}
                >
                  <button
                    type="button"
                    className="faq-trigger"
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    aria-expanded={openFaq === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span>
                      <small>0{index + 1}</small>
                      {item.question}
                    </span>
                    <ChevronDown size={17} />
                  </button>
                  <div id={`faq-answer-${index}`} className="faq-answer" role="region">
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="support-guidance">
          <div className="content-container support-guidance-inner">
            <div className="support-guidance-media">
              <div className="guidance-orbit guidance-orbit--one" />
              <div className="guidance-orbit guidance-orbit--two" />
              <ShieldCheck size={54} strokeWidth={1.15} />
              <span>VIVO / DZ</span>
            </div>
            <div className="support-guidance-copy">
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                03 / Bien préparer
              </span>
              <h2>
                Votre demande,
                <br />
                <em>bien orientée.</em>
              </h2>
              <p>
                Quelques informations simples nous aident à vous répondre avec plus de précision et à
                vous orienter vers le bon interlocuteur STI.
              </p>
              <div className="guidance-list">
                <span>
                  <Check size={15} /> Le modèle concerné
                </span>
                <span>
                  <Check size={15} /> Votre wilaya en Algérie
                </span>
                <span>
                  <Check size={15} /> Le sujet de votre demande
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="contact-form" className="contact-section">
          <div className="content-container contact-layout">
            <div className="contact-copy">
              <span className="eyebrow">
                <span className="section-rule section-rule--light" />
                04 / Nous écrire
              </span>
              <h2>
                Parlons
                <br />
                <em>de votre besoin.</em>
              </h2>
              <p>
                Notre équipe est à votre disposition pour toute demande commerciale, technique ou
                partenariat.
              </p>
              <div className="contact-direct">
                <Mail size={18} strokeWidth={1.4} />
                <span>
                  <strong>service@dz.vivo.com</strong>
                  <small>Support client officiel STI Algérie</small>
                </span>
              </div>
            </div>
            <div className="contact-form-wrap">
              {submitted ? (
                <div className="form-success" role="status">
                  <Check size={25} />
                  <span>
                    <strong>Demande envoyée avec succès.</strong>
                    <small>
                      Merci. Votre message a été transmis à l’équipe vivo Algérie de STI.
                    </small>
                  </span>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setSubmitted(false)}
                  >
                    Envoyer un autre message <ArrowUpRight size={15} />
                  </button>
                </div>
              ) : (
                <form className="support-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <label>
                      Nom complet
                      <input name="name" required placeholder="Votre nom" />
                    </label>
                    <label>
                      Adresse e-mail
                      <input name="email" type="email" required placeholder="vous@exemple.com" />
                    </label>
                  </div>
                  <label>
                    Sujet
                    <select name="subject" defaultValue="general">
                      <option value="general">Question générale</option>
                      <option value="product">Informations produit</option>
                      <option value="after-sales">Service après-vente &amp; Garantie</option>
                      <option value="retailer">Point de vente &amp; Distribution</option>
                    </select>
                  </label>
                  <label>
                    Message
                    <textarea
                      name="message"
                      required
                      placeholder="Comment pouvons-nous vous aider ?"
                      rows={5}
                    />
                  </label>
                  <button type="submit" className="button button--primary">
                    Envoyer la demande <ArrowUpRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-container footer-inner">
          <span>© 2026 vivo Algeria · STI Partenaire officiel</span>
          <span>Support local</span>
          <Link href={`/${locale}/vivo`}>
            Retour à l’accueil vivo <ArrowUpRight size={14} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
