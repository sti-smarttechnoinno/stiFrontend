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
import { useTranslations } from "@/app/[locale]/use-translations";
import { usePreferences } from "@/app/[locale]/preferences-context";

const faqItems = [
  {
    question: "Où acheter un produit vivo officiel en Algérie ?",
    answer:
      "Utilisez le bouton « Trouver un point de vente » pour découvrir les revendeurs agréés et partenaires officiels STI à travers l'Algérie.",
  },
  {
    question: "Comment obtenir des informations sur un modèle spécifique ?",
    answer:
      "Ouvrez la page du modèle depuis la collection Produits (V Series ou Y Series), puis contactez notre équipe pour confirmer les coloris et la disponibilité locale.",
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

export default function VivoSupportPageClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";
  const t = useTranslations() as any;
  const { email: dbEmail } = usePreferences();
  const heroT = t?.vivoSupportHero || t?.stiHome?.vivoSupportHero || {};

  const heroEyebrow = heroT.eyebrow || "Support · vivo Algérie";
  const heroTitle = heroT.title || "On reste";
  const heroAccent = heroT.accent || "à vos côtés.";
  const heroDescription =
    heroT.description ||
    "Une question sur un modèle, un achat ou un service ? Consultez notre FAQ ou écrivez directement à notre équipe locale.";
  const writeToUsText = heroT.writeToUs || "Nous écrire";
  const viewFaqText = heroT.viewFaq || "Consulter la FAQ";
  const trustText = heroT.trustText || "Service client & SAV officiel STI en Algérie";
  const captionName = heroT.captionName || "Assistance officielle";
  const captionDesc = heroT.captionDesc || "Service & Garantie · STI Algérie";
  const imageAlt =
    heroT.imageAlt || "Support technique et service après-vente vivo Algérie";
  const scrollPromptText = heroT.scrollPrompt || "Défiler pour découvrir";

  const shortcutsT = t?.vivoSupportShortcuts || t?.stiHome?.vivoSupportShortcuts || {};
  const faqShortcut = shortcutsT.faq || {};
  const contactShortcut = shortcutsT.contact || {};
  const emailShortcut = shortcutsT.email || {};

  const faqShortcutTitle = faqShortcut.title || "Questions fréquentes";
  const faqShortcutSubtitle = faqShortcut.subtitle || "Consulter la FAQ";
  const contactShortcutTitle = contactShortcut.title || "Contacter l’équipe";
  const contactShortcutSubtitle = contactShortcut.subtitle || "Envoyer un message";
  const emailShortcutTitle = emailShortcut.title || "Écrire directement";
  const contactEmail = dbEmail || emailShortcut.subtitle || "service@dz.vivo.com";

  const faqT = t?.vivoSupportFaq || t?.stiHome?.vivoSupportFaq || {};
  const faqEyebrow = faqT.eyebrow || "02 / FAQ";
  const faqTitle = faqT.title || "Les réponses";
  const faqAccent = faqT.accent || "essentielles.";
  const faqDescription =
    faqT.description ||
    "Retrouvez les réponses aux questions les plus courantes posées par nos clients en Algérie.";

  const translatedFaqItems = faqItems.map((item, idx) => {
    const tItem = faqT.items?.[idx];
    return {
      question: tItem?.question || item.question,
      answer: tItem?.answer || item.answer,
    };
  });

  const guidanceT = t?.vivoSupportGuidance || t?.stiHome?.vivoSupportGuidance || {};
  const guidanceTag = guidanceT.tag || "VIVO / DZ";
  const guidanceEyebrow = guidanceT.eyebrow || "03 / Bien préparer";
  const guidanceTitle = guidanceT.title || "Votre demande,";
  const guidanceAccent = guidanceT.accent || "bien orientée.";
  const guidanceDescription =
    guidanceT.description ||
    "Quelques informations simples nous aident à vous répondre avec plus de précision et à vous orienter vers le bon interlocuteur STI.";
  const guidanceItems = guidanceT.items || [
    "Le modèle concerné",
    "Votre wilaya en Algérie",
    "Le sujet de votre demande",
  ];

  const contactT = t?.vivoSupportContact || t?.stiHome?.vivoSupportContact || {};
  const contactEyebrow = contactT.eyebrow || "04 / Nous écrire";
  const contactTitle = contactT.title || "Parlons";
  const contactAccent = contactT.accent || "de votre besoin.";
  const contactDescription =
    contactT.description ||
    "Notre équipe est à votre disposition pour toute demande commerciale, technique ou partenariat.";
  const contactDirectNote = contactT.directNote || "Support client officiel STI Algérie";
  const nameLabel = contactT.nameLabel || "Nom complet";
  const namePlaceholder = contactT.namePlaceholder || "Votre nom";
  const emailLabel = contactT.emailLabel || "Adresse e-mail";
  const emailPlaceholder = contactT.emailPlaceholder || "vous@exemple.com";
  const phoneLabel = contactT.phoneLabel || "Numéro de téléphone / Wilaya (Optionnel)";
  const phonePlaceholder = contactT.phonePlaceholder || "ex: 0550... / Sétif";
  const subjectLabel = contactT.subjectLabel || "Sujet";
  const subjectsT = contactT.subjects || {};
  const subjectGeneral = subjectsT.general || "Question générale";
  const subjectProduct = subjectsT.product || "Informations produit";
  const subjectAfterSales = subjectsT.afterSales || "Service après-vente & Garantie";
  const subjectRetailer = subjectsT.retailer || "Point de vente & Distribution";
  const messageLabel = contactT.messageLabel || "Message";
  const messagePlaceholder = contactT.messagePlaceholder || "Comment pouvons-nous vous aider ?";
  const sendButtonText = contactT.sendButton || "Envoyer la demande";
  const sendingButtonText = contactT.sendingButton || "Envoi en cours...";
  const successTitle = contactT.successTitle || "Demande envoyée avec succès.";
  const successNote =
    contactT.successNote ||
    "Merci. Votre message a été transmis à l’équipe vivo Algérie de STI.";
  const sendAnotherText = contactT.sendAnother || "Envoyer un autre message";

  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const form = event.currentTarget;
      const formDataObj = new FormData(form);
      const payload = {
        name: formDataObj.get("name"),
        email: formDataObj.get("email"),
        phone: formDataObj.get("phone") || "",
        subject: formDataObj.get("subject"),
        message: formDataObj.get("message"),
        hp_website: formDataObj.get("hp_website") || "",
      };

      const res = await fetch("/api/vivo/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMessage(
            locale === "ar"
              ? "لقد قمت بإرسال عدة طلبات مؤخراً. يرجى الانتظار بضع دقائق قبل المحاولة مجدداً."
              : locale === "en"
              ? "Too many contact attempts. Please wait a few minutes before trying again."
              : "Trop de tentatives récentes. Veuillez patienter quelques minutes avant de renvoyer un message."
          );
        } else {
          setErrorMessage(
            data?.message ||
              (locale === "ar"
                ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى."
                : locale === "en"
                ? "An error occurred while sending. Please try again."
                : "Une erreur est survenue lors de l'envoi. Veuillez réessayer.")
          );
        }
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error("VIVO Support form submit error:", err);
      setErrorMessage(
        locale === "ar"
          ? "تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت."
          : locale === "en"
          ? "Unable to reach the server. Please check your internet connection."
          : "Impossible de joindre le serveur. Veuillez vérifier votre connexion."
      );
      setIsSubmitting(false);
    }
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
                <Link className="button button--primary" href={`/${locale}/vivo/support#contact-form`}>
                  {writeToUsText} <ArrowUpRight size={16} />
                </Link>
                <Link className="text-link" href={`/${locale}/vivo/support#faq`}>
                  {viewFaqText} <ArrowDownRight size={16} />
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
                src={VIVO_ASSETS.camera}
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

        <section className="support-shortcuts">
          <div className="content-container support-shortcuts-inner">
            <Link href={`/${locale}/vivo/support#faq`}>
              <span className="shortcut-number">01</span>
              <span>
                <strong>{faqShortcutTitle}</strong>
                <small>{faqShortcutSubtitle}</small>
              </span>
              <ArrowUpRight size={16} />
            </Link>
            <Link href={`/${locale}/vivo/support#contact-form`}>
              <span className="shortcut-number">02</span>
              <span>
                <strong>{contactShortcutTitle}</strong>
                <small>{contactShortcutSubtitle}</small>
              </span>
              <ArrowUpRight size={16} />
            </Link>
            <a href={`mailto:${contactEmail}`}>
              <span className="shortcut-number">03</span>
              <span>
                <strong>{emailShortcutTitle}</strong>
                <small>{contactEmail}</small>
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
                {faqEyebrow}
              </span>
              <h2>
                {faqTitle}
                <br />
                <em>{faqAccent}</em>
              </h2>
              <p>{faqDescription}</p>
            </div>
            <div className="faq-list">
              {translatedFaqItems.map((item, index) => (
                <div
                  className={`faq-item ${openFaq === index ? "faq-item--open" : ""}`}
                  key={index}
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
                    <ChevronDown size={18} />
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
              <span>{guidanceTag}</span>
            </div>
            <div className="support-guidance-copy">
              <span className="eyebrow eyebrow--blue">
                <span className="section-rule" />
                {guidanceEyebrow}
              </span>
              <h2>
                {guidanceTitle}
                <br />
                <em>{guidanceAccent}</em>
              </h2>
              <p>{guidanceDescription}</p>
              <div className="guidance-list">
                {guidanceItems.map((item: string, idx: number) => (
                  <span key={idx}>
                    <Check size={15} /> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact-form" className="contact-section">
          <div className="content-container contact-layout">
            <div className="contact-copy">
              <span className="eyebrow">
                <span className="section-rule section-rule--light" />
                {contactEyebrow}
              </span>
              <h2>
                {contactTitle}
                <br />
                <em>{contactAccent}</em>
              </h2>
              <p>{contactDescription}</p>
              <div className="contact-direct">
                <Mail size={18} strokeWidth={1.4} />
                <span>
                  <strong>{contactEmail}</strong>
                  <small>{contactDirectNote}</small>
                </span>
              </div>
            </div>
            <div className="contact-form-wrap">
              {submitted ? (
                <div className="form-success" role="status">
                  <Check size={25} />
                  <span>
                    <strong>{successTitle}</strong>
                    <small>{successNote}</small>
                  </span>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setSubmitted(false)}
                  >
                    {sendAnotherText} <ArrowUpRight size={15} />
                  </button>
                </div>
              ) : (
                <form className="support-form" onSubmit={handleSubmit}>
                  {/* Anti-Spam Honeypot Field */}
                  <input
                    type="text"
                    name="hp_website"
                    style={{ display: "none", opacity: 0, position: "absolute", left: "-9999px" }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  {errorMessage && (
                    <div
                      role="alert"
                      style={{
                        padding: "12px 16px",
                        backgroundColor: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239, 68, 68, 0.35)",
                        borderRadius: "6px",
                        color: "#fca5a5",
                        fontSize: "13px",
                        lineHeight: 1.5,
                      }}
                    >
                      {errorMessage}
                    </div>
                  )}

                  <div className="form-row">
                    <label>
                      {nameLabel}
                      <input name="name" required placeholder={namePlaceholder} disabled={isSubmitting} />
                    </label>
                    <label>
                      {emailLabel}
                      <input name="email" type="email" required placeholder={emailPlaceholder} disabled={isSubmitting} />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      {phoneLabel}
                      <input name="phone" type="tel" placeholder={phonePlaceholder} disabled={isSubmitting} />
                    </label>
                    <label>
                      {subjectLabel}
                      <select name="subject" defaultValue="general" disabled={isSubmitting}>
                        <option value="general">{subjectGeneral}</option>
                        <option value="product">{subjectProduct}</option>
                        <option value="after-sales">{subjectAfterSales}</option>
                        <option value="retailer">{subjectRetailer}</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    {messageLabel}
                    <textarea
                      name="message"
                      required
                      placeholder={messagePlaceholder}
                      rows={5}
                      disabled={isSubmitting}
                    />
                  </label>
                  <button
                    type="submit"
                    className="button button--primary"
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
                  >
                    {isSubmitting ? sendingButtonText : sendButtonText}{" "}
                    <ArrowUpRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
