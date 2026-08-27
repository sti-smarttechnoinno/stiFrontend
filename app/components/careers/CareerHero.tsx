"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, MapPin, Users, Award, TrendingUp, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from '@/app/[locale]/use-translations';

export default function CareerHero() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const [provincesCount, setProvincesCount] = useState("58");

  useEffect(() => {
    async function loadPrefs() {
      try {
        const res = await fetch("/api/preferences");
        if (res.ok) {
          const data = await res.json();
          if (data?.statistics?.provincesServed) {
            setProvincesCount(data.statistics.provincesServed);
          }
        }
      } catch {}
    }
    loadPrefs();
  }, []);

  const staticT = {
    en: {
      home: "Home",
      careers: "Careers",
      badge: "We're Hiring • Build Your Future",
      titleStart: "Build Your Career ",
      titleHighlight: "with STI",
      subtitle: "Join SARL Smart Technologie Innovation (STI), an Official Ooredoo Distributor, and become part of a growing company delivering official Ooredoo mobile recharge credit and prepaid SIM card distribution across Algeria.",
      viewPositions: "View Open Positions",
      submitCv: "Submit Your CV",
      provinces: `${provincesCount} Provinces Covered`,
      team: "Professional Team",
      distributor: "Official Ooredoo Distributor",
      growing: "Growing Team",
    },
    ar: {
      home: "الرئيسية",
      careers: "الوظائف",
      badge: "نحن نلتحق بكفاءات • ابنِ مستقبلك معنا",
      titleStart: "ابنِ مسارك المهني ",
      titleHighlight: "مع STI",
      subtitle: "انضم إلى شركة STI، الموزع الرسمي المعتمد لأوريدو الجزائر، وكن جزءاً من فريق متنامٍ يوزع رصيد الشحن الهاتفي وشرائح أوريدو عبر كامل التراب الوطني.",
      viewPositions: "عرض الوظائف الشاغرة",
      submitCv: "إرسال السيرة الذاتية",
      provinces: `تغطية ${provincesCount} ولاية`,
      team: "فريق عمل احترافي",
      distributor: "موزع أوريدو الرسمي",
      growing: "فريق في نمو دائم",
    },
    fr: {
      home: "Accueil",
      careers: "Carrières",
      badge: "Nous Recrutons • Construisez Votre Avenir",
      titleStart: "Construisez Votre Carrière ",
      titleHighlight: "avec STI",
      subtitle: "Rejoignez SARL Smart Technologie Innovation (STI), Distributeur Officiel Ooredoo, et intégrez une entreprise en forte croissance qui distribue le crédit de recharge et les cartes SIM Ooredoo à travers l'Algérie.",
      viewPositions: "Voir les Postes Ouverts",
      submitCv: "Envoyer Votre CV",
      provinces: `${provincesCount} Wilayas Couvertes`,
      team: "Équipe Professionnelle",
      distributor: "Distributeur Officiel Ooredoo",
      growing: "Équipe en Croissance",
    },
  }[currentLocale] || {
    home: "Home",
    careers: "Careers",
    badge: "We're Hiring • Build Your Future",
    titleStart: "Build Your Career ",
    titleHighlight: "with STI",
    subtitle: "Join SARL Smart Technologie Innovation (STI), an Official Ooredoo Distributor, and become part of a growing company delivering official Ooredoo mobile recharge credit and prepaid SIM card distribution across Algeria.",
    viewPositions: "View Open Positions",
    submitCv: "Submit Your CV",
    provinces: `${provincesCount} Provinces Covered`,
    team: "Professional Team",
    distributor: "Official Ooredoo Distributor",
    growing: "Growing Team",
  };

  const stats = [
    { icon: MapPin, label: staticT.provinces },
    { icon: Users, label: staticT.team },
    { icon: Award, label: staticT.distributor },
    { icon: TrendingUp, label: staticT.growing },
  ];

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
              <Link href={`/${currentLocale}`} className="transition-colors hover:text-red-primary">
                {t.nav?.home || staticT.home}
              </Link>
            </li>
            <li>
              <ChevronRight size={12} className="rtl:rotate-180" />
            </li>
            <li className="text-gray-700">{staticT.careers}</li>
          </ol>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
                {staticT.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 lg:text-5xl xl:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {staticT.titleStart}<span className="text-red-primary">{staticT.titleHighlight}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-xl text-lg leading-relaxed text-gray-500 mb-8"
            >
              {staticT.subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <a
                href="#positions"
                className="group inline-flex items-center gap-2.5 rounded-full bg-red-primary px-8 py-3.5 text-sm font-semibold text-white transition-all duration-250 hover:shadow-xl hover:shadow-red-primary/25 hover:scale-[1.03]"
              >
                <Briefcase size={16} />
                {staticT.viewPositions}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </a>
              <a
                href="#apply"
                className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-250 hover:border-gray-300 hover:shadow-lg hover:scale-[1.03]"
              >
                {staticT.submitCv}
              </a>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-primary/10 flex items-center justify-center shrink-0 text-red-primary">
                    <stat.icon size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex items-center justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-[780px] aspect-square mx-auto lg:mx-0 lg:-ml-12 lg:scale-110 rtl:lg:-ml-0 rtl:lg:-mr-12">
              <Image
                src="/assets/careers.png"
                alt="STI Careers"
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