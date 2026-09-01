"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from '@/app/[locale]/use-translations';
import { usePreferences } from '@/app/[locale]/preferences-context';

export default function HeroContact() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";
  const { phone } = usePreferences();
  const telHref = `tel:${(currentLocale === "ar" ? "0552023536" : (phone || "+213552023536")).replace(/[^0-9+]/g, "")}`;

  const staticT = {
    en: {
      home: "Home",
      badgeNav: "Contact Us",
      badge: "Contact STI",
      title: "Get in Touch with Our Team",
      subtitle: "Have questions about our Ooredoo products or distribution services? Contact SARL STI today for dedicated partner support.",
      ctaForm: "Send a Message",
      ctaCall: "Call Support",
    },
    ar: {
      home: "الرئيسية",
      badgeNav: "اتصل بنا",
      badge: "تواصل مع STI",
      title: "تواصل مع فريقنا الاحترافي",
      subtitle: "هل لديك استفسارات حول منتجات أوريدو أو خدمات التوزيع؟ تواصل مع شركة STI اليوم للحصول على دعم مخصص لشركائنا.",
      ctaForm: "إرسال رسالة",
      ctaCall: "الاتصال بالدعم",
    },
    fr: {
      home: "Accueil",
      badgeNav: "Contactez-nous",
      badge: "Contactez STI",
      title: "Entrez en Contact avec Notre Équipe",
      subtitle: "Des questions sur nos produits Ooredoo ou nos services de distribution ? Contactez SARL STI dès aujourd'hui pour un support dédié.",
      ctaForm: "Envoyer un Message",
      ctaCall: "Appeler le Support",
    },
  }[currentLocale] || {
    home: "Home",
    badgeNav: "Contact Us",
    badge: "Contact STI",
    title: "Get in Touch with Our Team",
    subtitle: "Have questions about our Ooredoo products or distribution services? Contact SARL STI today for dedicated partner support.",
    ctaForm: "Send a Message",
    ctaCall: "Call Support",
  };

  return (
    <section className="relative flex items-center bg-white pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #C8102E 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1320px] px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-label="Breadcrumb"
          className="mb-8"
        >
          <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <li>
              <Link href={`/${currentLocale}/ooredoo`} className="transition-colors hover:text-red-primary">
                {t.nav?.home || staticT.home}
              </Link>
            </li>
            <li>
              <ChevronRight size={12} className="rtl:rotate-180" />
            </li>
            <li className="text-gray-700">{t.contact?.hero?.badge || staticT.badgeNav}</li>
          </ol>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
              {t.contact?.hero?.badge || staticT.badge}
            </span>

            <h1
              className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 lg:text-5xl xl:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.contact?.hero?.title || staticT.title}
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-gray-500 mb-8">
              {t.contact?.hero?.subtitle || staticT.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact-form"
                className="group inline-flex items-center gap-2.5 rounded-full bg-red-primary px-8 py-3.5 text-sm font-semibold text-white transition-all duration-250 hover:shadow-xl hover:shadow-red-primary/25 hover:scale-[1.03]"
              >
                {t.contact?.hero?.cta_form || staticT.ctaForm}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </a>
              <a
                href={telHref}
                className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-250 hover:border-gray-300 hover:shadow-lg hover:scale-[1.03]"
              >
                <Phone size={16} />
                {t.contact?.hero?.cta_call || staticT.ctaCall}
              </a>
            </div>
          </motion.div>

          {/* Right — Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex items-center justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-[780px] aspect-square mx-auto lg:mx-0 lg:-ml-12 lg:scale-110 rtl:lg:-ml-0 rtl:lg:-mr-12">
              <Image
                src="/assets/contact.webp"
                alt="Contact STI"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}