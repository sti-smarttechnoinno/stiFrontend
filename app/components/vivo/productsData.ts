import { VIVO_ASSETS } from "./assets";
import { BatteryCharging, Camera, ShieldCheck, Sparkles, Smartphone, LucideIcon } from "lucide-react";

export interface VivoProductPillar {
  number: string;
  icon: LucideIcon;
  title: string;
  copy: string;
}

export interface VivoProductDetail {
  slug: string;
  name: string;
  series: string;
  seriesSlug: string;
  eyebrow: string;
  title: string;
  accent: string;
  heroDescription: string;
  heroImage: string;
  heroCaptionName: string;
  heroCaptionDesc: string;
  trustText: string;
  introTitle: string;
  introAccent: string;
  introDescription: string;
  pillars: VivoProductPillar[];
  detailImage: string;
  detailTitle: string;
  detailAccent: string;
  detailDescription: string;
  detailPoints: string[];
}

export interface VivoSeriesModel {
  number: string;
  slug: string;
  name: string;
  phrase: string;
  copy: string;
  image: string;
  alt: string;
  state: string;
  cta: string;
}

export interface VivoSeriesDetail {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  accent: string;
  heroDescription: string;
  heroImage: string;
  heroCaptionName: string;
  heroCaptionDesc: string;
  trustText: string;
  primaryCtaText: string;
  primaryProductSlug: string;
  introTitle: string;
  introAccent: string;
  introDescription: string;
  pillars: VivoProductPillar[];
  models: VivoSeriesModel[];
  ctaTitle: string;
  ctaAccent: string;
  ctaDescription: string;
}

export const VIVO_PRODUCTS_DATA: Record<string, VivoProductDetail> = {
  y21d: {
    slug: "y21d",
    name: "vivo Y21D",
    series: "Y Series",
    seriesSlug: "y-series",
    eyebrow: "Y Series · vivo Y21D",
    title: "Le quotidien,",
    accent: "en mieux.",
    heroDescription:
      "Une expérience vivo pensée pour suivre vos journées avec simplicité, style, autonomie et confiance en Algérie.",
    heroImage: VIVO_ASSETS.y21dHero,
    heroCaptionName: "vivo Y21D",
    heroCaptionDesc: "Autonomie longue durée · Design élégant",
    trustText: "Distribution officielle STI · Garantie & Service local en Algérie",
    introTitle: "Tout ce qui",
    introAccent: "compte.",
    introDescription:
      "Le vivo Y21D s’inscrit dans la série Y avec une promesse claire : rendre l’expérience smartphone plus naturelle, plus fluide et parfaitement adaptée à votre quotidien en Algérie.",
    pillars: [
      {
        number: "01",
        icon: BatteryCharging,
        title: "Batterie longue durée",
        copy: "Une autonomie généreuse conçue pour accompagner votre rythme toute la journée sans interruption.",
      },
      {
        number: "02",
        icon: Sparkles,
        title: "Écran immersif",
        copy: "Une dalle lumineuse et confortable pour apprécier tous vos contenus avec fluidité et netteté.",
      },
      {
        number: "03",
        icon: ShieldCheck,
        title: "Garantie & Service STI",
        copy: "Un modèle certifié avec garantie constructeur officielle et accompagnement dédié par les équipes STI en Algérie.",
      },
    ],
    detailImage: VIVO_ASSETS.y21dDetails,
    detailTitle: "Votre journée,",
    detailAccent: "votre angle.",
    detailDescription:
      "Le Y21D se découvre dans les détails : une silhouette soignée, une expérience réactive et une technologie qui reste au service de votre rythme.",
    detailPoints: [
      "Présentation claire du modèle",
      "Conseil et disponibilité locale en Algérie",
      "Orientation vers le réseau officiel STI",
    ],
  },
  v70fe: {
    slug: "v70fe",
    name: "vivo V70 FE",
    series: "V Series",
    seriesSlug: "v-series",
    eyebrow: "V Series · vivo V70 FE",
    title: "Votre lumière",
    accent: "en signature.",
    heroDescription:
      "Des portraits d’exception, un design fin et élégant et une technologie d'imagerie avancée pensée pour l'Algérie.",
    heroImage: VIVO_ASSETS.v70feHero || VIVO_ASSETS.v70fe,
    heroCaptionName: "vivo V70 FE",
    heroCaptionDesc: "Portraits studio · Design premium ultra-fin",
    trustText: "Distribution officielle STI · Garantie & SAV certifié en Algérie",
    introTitle: "La beauté",
    introAccent: "du détail.",
    introDescription:
      "Le vivo V70 FE sublime chaque instant avec une optique de précision et des algorithmes de portrait conçus pour restituer des couleurs justes et éclatantes.",
    pillars: [
      {
        number: "01",
        icon: Camera,
        title: "Photographie de Portrait",
        copy: "Capteurs haute résolution et éclairage avancé pour des portraits éclatants même en basse lumière.",
      },
      {
        number: "02",
        icon: Sparkles,
        title: "Design Ultra-Fin",
        copy: "Une silhouette raffinée, des finitions texturées haut de gamme et une légèreté exceptionnelle en main.",
      },
      {
        number: "03",
        icon: ShieldCheck,
        title: "Performance & Sérénité",
        copy: "Un processeur véloce et la fiabilité du réseau de distribution et garantie officielle STI en Algérie.",
      },
    ],
    detailImage: VIVO_ASSETS.v70feDetails || VIVO_ASSETS.vSeries || VIVO_ASSETS.camera,
    detailTitle: "Chaque détail,",
    detailAccent: "sa propre lumière.",
    detailDescription:
      "Le V70 FE est conçu pour celles et ceux qui exigent l'excellence esthétique et des clichés mémorables au quotidien.",
    detailPoints: [
      "Optique portrait professionnelle",
      "Garantie officielle constructeur via STI",
      "Support et réseau agréé à travers l'Algérie",
    ],
  },
  y05: {
    slug: "y05",
    name: "vivo Y05",
    series: "Y Series",
    seriesSlug: "y-series",
    eyebrow: "Y Series · vivo Y05",
    title: "Simplement",
    accent: "vivo.",
    heroDescription:
      "Un smartphone accessible, autonome et fluide pensé pour répondre aux usages essentiels avec fiabilité.",
    heroImage: VIVO_ASSETS.y05Hero,
    heroCaptionName: "vivo Y05",
    heroCaptionDesc: "Autonomie fiable · Simplicité au quotidien",
    trustText: "Distribution officielle STI · Garantie officielle en Algérie",
    introTitle: "L'essentiel,",
    introAccent: "sans compromis.",
    introDescription:
      "Le vivo Y05 allie ergonomie, autonomie renforcée et simplicité d'utilisation pour vous accompagner au quotidien.",
    pillars: [
      {
        number: "01",
        icon: BatteryCharging,
        title: "Grande Autonomie",
        copy: "Une batterie performante pour garder le contact sans vous soucier de la recharge.",
      },
      {
        number: "02",
        icon: Smartphone,
        title: "Interface Fluide",
        copy: "Une navigation intuitive et réactive pensée pour un usage confortable et sans friction.",
      },
      {
        number: "03",
        icon: ShieldCheck,
        title: "Fiabilité Locale",
        copy: "Distribué officiellement par STI avec garantie et support dédié en Algérie.",
      },
    ],
    detailImage: VIVO_ASSETS.y05Details,
    detailTitle: "Une approche",
    detailAccent: "directe et claire.",
    detailDescription:
      "Le Y05 se concentre sur l'essentiel : une grande fiabilité, un affichage net et un service après-vente réactif.",
    detailPoints: [
      "Rapport qualité-prix optimal",
      "Disponibilité dans tout le réseau STI",
      "Accompagnement et garantie locale",
    ],
  },
};

export const VIVO_SERIES_DATA: Record<string, VivoSeriesDetail> = {
  "y-series": {
    slug: "y-series",
    name: "Y Series",
    eyebrow: "Collection · vivo Y Series",
    title: "La technologie",
    accent: "pour tous les jours.",
    heroDescription:
      "Découvrez les modèles Y Series actuellement mis en avant par vivo Algérie, avec une lecture simple, une grande autonomie et un accompagnement local STI.",
    heroImage: VIVO_ASSETS.ySeriesHero,
    heroCaptionName: "vivo Y Series",
    heroCaptionDesc: "Autonomie · Accessibilité · Fiabilité",
    trustText: "Distribution officielle STI · Modèles certifiés en Algérie",
    primaryCtaText: "Découvrir Y21D",
    primaryProductSlug: "y21d",
    introTitle: "Deux façons",
    introAccent: "de vivre Vivo.",
    introDescription:
      "La Y Series rassemble des modèles conçus pour des usages différents, avec une même envie : rendre la technologie plus accessible, plus claire et plus proche.",
    pillars: [
      {
        number: "01",
        icon: BatteryCharging,
        title: "Autonomie longue durée",
        copy: "Des batteries haute capacité pensées pour vous accompagner toute la journée sans compromis.",
      },
      {
        number: "02",
        icon: Sparkles,
        title: "Écran immersif & Design fin",
        copy: "Une prise en main légère et agréable avec un affichage fluide pour vos contenus quotidiens.",
      },
      {
        number: "03",
        icon: ShieldCheck,
        title: "Garantie & Réseau STI",
        copy: "Tous les smartphones de la Série Y bénéficient du support officiel et de la garantie certifiée en Algérie.",
      },
    ],
    models: [
      {
        number: "01",
        slug: "y21d",
        name: "vivo Y21D",
        phrase: "Le quotidien, en mieux.",
        copy: "Une expérience vivo pensée pour accompagner vos journées avec simplicité, style et confiance.",
        image: VIVO_ASSETS.y21dHero,
        alt: "Le vivo Y21D présenté en studio",
        state: "Page détail disponible",
        cta: "Découvrir Y21D",
      },
      {
        number: "02",
        slug: "y05",
        name: "vivo Y05",
        phrase: "Simplement vivo.",
        copy: "Un modèle Y Series à découvrir avec une présentation claire et une autonomie durable en Algérie.",
        image: VIVO_ASSETS.y05Hero,
        alt: "Le vivo Y05 présenté en studio",
        state: "Page détail disponible",
        cta: "Découvrir Y05",
      },
    ],
    ctaTitle: "Le bon modèle,",
    ctaAccent: "au bon moment.",
    ctaDescription:
      "Vous souhaitez connaître les modèles de la Série Y disponibles près de chez vous ? Notre équipe vous oriente avec précision.",
  },
  "v-series": {
    slug: "v-series",
    name: "V Series",
    eyebrow: "Collection · vivo V Series",
    title: "Votre lumière",
    accent: "en signature.",
    heroDescription:
      "Explorez la Série V de vivo : une alliance unique entre photographie de portrait de studio, design ultra-fin et élégance en Algérie.",
    heroImage: VIVO_ASSETS.vSeries || VIVO_ASSETS.v70fe,
    heroCaptionName: "vivo V Series",
    heroCaptionDesc: "Portraits studio · Design premium",
    trustText: "Distribution officielle STI · Garantie & SAV certifié en Algérie",
    primaryCtaText: "Découvrir V70 FE",
    primaryProductSlug: "v70fe",
    introTitle: "L'art du",
    introAccent: "portrait.",
    introDescription:
      "La V Series incarne la finesse esthétique et l'expertise photographique de vivo, révélant chaque émotion et chaque détail de vos moments précieux.",
    pillars: [
      {
        number: "01",
        icon: Camera,
        title: "Portrait Studio Aura Light",
        copy: "Système d'éclairage intelligent et traitement d'image professionnel pour des visages sublimés.",
      },
      {
        number: "02",
        icon: Sparkles,
        title: "Design Ultra-Mince",
        copy: "Des lignes épurées et des matériaux raffinés offrant une prise en main soignée et luxueuse.",
      },
      {
        number: "03",
        icon: ShieldCheck,
        title: "Distribution & Garantie STI",
        copy: "Accompagnement officiel STI avec réseau de techniciens agréés et service après-vente dédié.",
      },
    ],
    models: [
      {
        number: "01",
        slug: "v70fe",
        name: "vivo V70 FE",
        phrase: "Portraits d’exception · Design premium",
        copy: "Le smartphone phare de la série V avec capteur haute précision et finition haut de gamme.",
        image: VIVO_ASSETS.v70feHero,
        alt: "Le vivo V70 FE présenté en studio",
        state: "Page détail disponible",
        cta: "Découvrir V70 FE",
      },
    ],
    ctaTitle: "Révélez votre",
    ctaAccent: "lumière.",
    ctaDescription:
      "Intéressé par la Série V ? Contactez l'équipe vivo Algérie pour connaître la disponibilité des modèles et coloris.",
  },
};

export function getSeriesData(seriesSlug: string): VivoSeriesDetail | undefined {
  const clean = seriesSlug.toLowerCase();
  return (
    VIVO_SERIES_DATA[clean] ||
    Object.values(VIVO_SERIES_DATA).find(
      (s) => s.slug.toLowerCase() === clean || s.name.toLowerCase().replace(/\s+/g, "-").includes(clean)
    )
  );
}

export function getProductData(productSlug: string): VivoProductDetail | undefined {
  const clean = productSlug.toLowerCase();
  return (
    VIVO_PRODUCTS_DATA[clean] ||
    Object.values(VIVO_PRODUCTS_DATA).find(
      (p) => p.slug.toLowerCase() === clean || p.name.toLowerCase().replace(/\s+/g, "-").includes(clean)
    )
  );
}
