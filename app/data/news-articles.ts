export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  heroImage: string;
  gallery?: { src: string; caption: string }[];
  author: string;
  authorRole: string;
  authorBio: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  tags: string[];
  featured?: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const FALLBACK_NEWS_ITEMS: any[] = [
  {
    id: 1,
    slug: "sti-expands-distribution",
    category: "Official Announcements",
    author: "STI Team",
    author_role: "Smart Technologie Innovation",
    author_bio: "Équipe de communication officielle de SARL Smart Technologie Innovation.",
    published_at: "20 Mai 2026",
    reading_time: "5 min de lecture",
    status: "Published",
    featured: true,
    hero_image: "/assets/hero.png",
    translations: {
      fr: {
        title: "STI Étend ses Services de Distribution à Travers l'Algérie",
        excerpt: "SARL Smart Technologie Innovation continue de renforcer ses capacités logistiques et commerciales pour approvisionner les 58 wilayas en produits officiels Ooredoo.",
        content: `## Une présence renforcée sur les 58 wilayas\n\nSARL Smart Technologie Innovation (STI), distributeur officiel Ooredoo en Algérie, franchit une nouvelle étape stratégique dans le déploiement de ses opérations de distribution.\n\nGrâce à des investissements ciblés dans sa flotte logistique et des plateformes de gestion modernes, STI garantit aux détaillants, grossistes et entreprises partenaires un approvisionnement continu en cartes SIM prépayées et crédits de recharge mobile.\n\n### Disponibilité permanente et sécurité des flux\n\nNotre engagement repose sur trois piliers fondamentaux :\n- Approvisionnement sécurisé 100% officiel Ooredoo\n- Délais de livraison réduits grâce à nos centres régionaux de Sétif et Alger\n- Tarification de gros compétitive garantissant la rentabilité des commerçants partenaires\n\n## Un accompagnement B2B sur mesure\n\nLes équipes commerciales de STI accompagnent quotidiennement des milliers de points de vente à travers le pays pour les aider à développer leur activité et optimiser leur rotation de stock.`,
        tags: ["Distribution", "Ooredoo", "Algérie", "Partenariat"],
      },
      en: {
        title: "STI Expands Distribution Services Across Algeria",
        excerpt: "SARL Smart Technologie Innovation continues strengthening its logistical and commercial capabilities to supply all 58 provinces with official Ooredoo products.",
        content: `## A Stronger Presence Across All 58 Provinces\n\nSARL Smart Technologie Innovation (STI), the official Ooredoo distributor in Algeria, marks another milestone in expanding its nationwide telecom distribution operations.\n\nThrough targeted investments in supply chain logistics and digital order management, STI provides retailers, wholesalers, and enterprise partners with dependable access to prepaid SIM cards and mobile recharge credit.\n\n### Constant Availability and Secure Supply Chain\n\nOur commitment is centered on three main principles:\n- 100% authentic, certified Ooredoo product sourcing\n- Expedited delivery times via our regional distribution hubs in Setif and Algiers\n- Highly competitive wholesale pricing maximizing retail profitability\n\n## Dedicated B2B Partner Support\n\nOur account managers actively assist thousands of partner retail stores across Algeria with tailored replenishment solutions and ongoing operational support.`,
        tags: ["Distribution", "Ooredoo", "Algeria", "Partnership"],
      },
      ar: {
        title: "شركة STI توسع شبكة خدمات التوزيع عبر كامل التراب الوطني في الجزائر",
        excerpt: "تواصل شركة سمارت تكنولوجي إنوفايشن (STI) تعزيز قدراتها اللوجستية والتجارية لتزويد الـ 58 ولاية بمنتجات أوريدو الرسمية المعتمدة.",
        content: `## حضور معزز يغطي كافة الولايات الـ 58\n\nتخطو شركة سمارت تكنولوجي إنوفايشن (STI)، الموزع الرسمي لشركة Ooredoo في الجزائر، خطوة استراتيجية جديدة لتوسيع عمليات التوزيع على المستوى الوطني.\n\nبفضل الاستثمار المستمر في أسطول النقل ومنظومات إدارة الطلبيات المتطورة، تضمن الشركة للمحلات والموزعين بالجملة توفراً مستمراً وموثوقاً لشرائح SIM ورصيد الشحن.\n\n### وفرة مستمرة وأمان عالي لسلاسل التوريد\n\nيرتكز التزامنا على ثلاثة مبادئ رئيسية :\n- منتجات أوريدو أصلية ورسمية 100% معتمدة\n- سرعة فائقة في التسليم عبر مراكزنا المركزية في سطيف والجزائر العاصمة\n- أسعار جملة تنافسية تضمن هوامش ربح ممتازة لشركائنا\n\n## دعم تجاري ومرافقة مخصصة للمحلات\n\nيواكب فريقنا التجاري آلاف نقاط البيع المعتمدة يومياً عبر كامل القطر الجزائري لتطوير مبيعاتهم وتلبية احتياجات زبائنهم.`,
        tags: ["التوزيع", "أوريدو", "الجزائر", "الشراكة"],
      },
    },
  },
  {
    id: 2,
    slug: "ooredoo-sim-recharge-solutions",
    category: "Product Updates",
    author: "STI Team",
    author_role: "Smart Technologie Innovation",
    author_bio: "Équipe de communication officielle de SARL Smart Technologie Innovation.",
    published_at: "15 Mai 2026",
    reading_time: "4 min de lecture",
    status: "Published",
    featured: false,
    hero_image: "/assets/hero.png",
    translations: {
      fr: {
        title: "Nouvelles Solutions de Recharge & Cartes SIM Ooredoo pour les Détaillants",
        excerpt: "Découvrez nos offres d'approvisionnement en gros conçues pour simplifier la gestion des stocks de télécoms pour les commerçants.",
        content: `## Des formules d'approvisionnement flexibles\n\nSTI met à disposition des revendeurs des solutions adaptées à leurs volumes de vente avec des conditions avantageuses.\n\n### Avantages pour votre commerce\n- Activation immédiate des cartes SIM\n- Recharges disponibles sous tous les formats\n- Support technique et commercial réactif`,
        tags: ["Recharge", "SIM", "Ooredoo", "Grossistes"],
      },
      en: {
        title: "New Ooredoo Mobile Recharge & SIM Card Solutions for Retailers",
        excerpt: "Discover our wholesale supply solutions designed to simplify telecom inventory management for merchants.",
        content: `## Flexible Supply Programs\n\nSTI provides retailers with wholesale solutions tailored to their sales volume under advantageous terms.\n\n### Advantages for Your Business\n- Instant SIM card activation\n- Mobile recharge vouchers in all denominations\n- Responsive technical and commercial assistance`,
        tags: ["Recharge", "SIM", "Ooredoo", "Wholesale"],
      },
      ar: {
        title: "حلول جديدة لشحن الرصيد وبطاقات SIM أوريدو للتجار ونقاط البيع",
        excerpt: "تعرف على عروض التزويد بالجملة المصممة لتسهيل إدارة مخزون الاتصالات لأصحاب المحلات ونقاط البيع.",
        content: `## صيغ تزويد مرنة وتنافسية\n\nتوفر شركة STI للمحلات والتجار حلولاً مرنة تتوافق مع مختلف أحجام المبيعات وبأفضل الشروط التجارية.\n\n### مزايا خاصة بنشاطك التجاري\n- تفعيل فوري لشرائح الهاتف\n- بطاقات تعبئة رصيد بجميع الفئات\n- دعم فني ومرافقة مستمرة`,
        tags: ["شحن_الرصيد", "شرائح", "أوريدو", "الجملة"],
      },
    },
  },
  {
    id: 3,
    slug: "partner-network-growth-58-wilayas",
    category: "Network Growth",
    author: "STI Team",
    author_role: "Smart Technologie Innovation",
    author_bio: "Équipe de communication officielle de SARL Smart Technologie Innovation.",
    published_at: "10 Mai 2026",
    reading_time: "4 min de lecture",
    status: "Published",
    featured: false,
    hero_image: "/assets/hero.png",
    translations: {
      fr: {
        title: "Croissance du Réseau Partenaires STI sur les 58 Wilayas",
        excerpt: "Plus de 1 200 partenaires commerciaux font désormais confiance à STI pour leur approvisionnement régulier en télécoms.",
        content: `## Un réseau en pleine expansion\n\nNotre maillage national s'étend chaque mois pour offrir une proximité optimale à nos partenaires distributeurs.\n\n### Pourquoi rejoindre le réseau STI ?\n- Garantie de stocks permanents\n- Suivi personnalisé des commandes\n- Tarifs réservés aux professionnels`,
        tags: ["Réseau", "Partenariat", "Croissance"],
      },
      en: {
        title: "STI Partner Network Growth Across 58 Provinces",
        excerpt: "Over 1,200 commercial partners now rely on STI for their regular telecom supplies.",
        content: `## Rapidly Growing Distribution Network\n\nOur nationwide footprint expands every month to provide optimal proximity to our retail partners.\n\n### Why Join the STI Network?\n- Guaranteed continuous inventory\n- Personalized order tracking\n- Exclusive professional wholesale rates`,
        tags: ["Network", "Partnership", "Growth"],
      },
      ar: {
        title: "نمو متواصل لشبكة شركاء STI عبر الولايات الـ 58",
        excerpt: "أكثر من 1,200 شريك تجاري يعتمدون الآن على STI للتزود المنتظم بمنتجات الاتصالات.",
        content: `## شبكة توزيع واسعة وفي نمو دائم\n\nتتسع شبكتنا الوطنية شهراً بعد شهر لتقديم أفضل خدمة وقرب لشركائنا الموزعين.\n\n### لماذا تنضم إلى شبكة STI؟\n- ضمان توفر دائم للمخزون\n- متابعة دقيقة وتسهيلات للطلبيات\n- أسعار حصرية خاصة بالمحترفين`,
        tags: ["شبكة_التوزيع", "شراكة", "الجزائر"],
      },
    },
  },
];

export const newsArticles: NewsArticle[] = FALLBACK_NEWS_ITEMS.map((item) =>
  convertApiItemToNewsArticle(item, "fr")
);

export function localizeCategory(categoryRaw: string = "", locale: string = "en", categoriesList?: any[]): string {
  const loc = (locale as "en" | "ar" | "fr") || "en";
  const cleanCat = (categoryRaw || "").trim().toLowerCase();

  if (Array.isArray(categoriesList) && categoriesList.length > 0) {
    const match = categoriesList.find((c) => {
      const id = (c.id || "").toLowerCase();
      const en = (c.translations?.en || "").toLowerCase();
      const fr = (c.translations?.fr || "").toLowerCase();
      const ar = (c.translations?.ar || "").toLowerCase();
      return (
        id === cleanCat ||
        en === cleanCat ||
        fr === cleanCat ||
        ar === cleanCat ||
        id.replace(/[-_]/g, " ") === cleanCat.replace(/[-_]/g, " ")
      );
    });
    if (match?.translations?.[loc]) {
      return match.translations[loc];
    }
  }

  const KNOWN_MAP: Record<string, { en: string; fr: string; ar: string }> = {
    "company news": { en: "Company News", fr: "Actualités de l'entreprise", ar: "أخبار الشركة" },
    "company-news": { en: "Company News", fr: "Actualités de l'entreprise", ar: "أخبار الشركة" },
    "company_news": { en: "Company News", fr: "Actualités de l'entreprise", ar: "أخبار الشركة" },
    "product update": { en: "Product Update", fr: "Nouveautés Produits", ar: "تحديثات المنتجات" },
    "product updates": { en: "Product Updates", fr: "Nouveautés Produits", ar: "تحديثات المنتجات" },
    "product-update": { en: "Product Update", fr: "Nouveautés Produits", ar: "تحديثات المنتجات" },
    "official announcements": { en: "Official Announcements", fr: "Annonces officielles", ar: "إعلانات رسمية" },
    "announcements": { en: "Announcements", fr: "Annonces", ar: "إعلانات" },
    "partnership": { en: "Partnership", fr: "Partenariats", ar: "الشراكات" },
    "partnerships": { en: "Partnerships", fr: "Partenariats", ar: "الشراكات" },
    "wholesale promotions": { en: "Wholesale Promotions", fr: "Promotions de gros", ar: "العروض الترويجية بالجملة" },
    "wholesale-promotions": { en: "Wholesale Promotions", fr: "Promotions de gros", ar: "العروض الترويجية بالجملة" },
    "network growth": { en: "Network Growth", fr: "Développement du Réseau", ar: "توسع الشبكة" },
    "network-growth": { en: "Network Growth", fr: "Développement du Réseau", ar: "توسع الشبكة" },
    "partner insights": { en: "Partner Insights", fr: "Conseils Partenaires", ar: "نصائح الشركاء" },
    "partner-insights": { en: "Partner Insights", fr: "Conseils Partenaires", ar: "نصائح الشركاء" },
  };

  if (KNOWN_MAP[cleanCat]?.[loc]) {
    return KNOWN_MAP[cleanCat][loc];
  }

  return categoryRaw || (loc === "ar" ? "أخبار الشركة" : loc === "fr" ? "Actualités de l'entreprise" : "Company News");
}

export function convertApiItemToNewsArticle(item: any, locale: string = "en", categoriesList?: any[]): NewsArticle {
  const loc = (locale as "en" | "ar" | "fr") || "en";
  const tr = item?.translations?.[loc] || item?.translations?.en || item?.translations?.fr || item?.translations?.ar || {};
  const title = tr.title || item?.title || item?.slug || "Untitled Article";
  const excerpt = tr.excerpt || item?.excerpt || "";
  const content = tr.content || item?.content || "";
  const tags = Array.isArray(tr.tags) && tr.tags.length > 0 ? tr.tags : Array.isArray(item?.tags) ? item.tags : ["STI", "News"];
  const heroImageRaw = item?.hero_image || item?.heroImage;
  const heroImage = heroImageRaw && typeof heroImageRaw === "string" && heroImageRaw.trim() !== "" ? heroImageRaw : "/assets/hero.png";

  const defaultAuthor = loc === "ar" ? "فريق الاتصال STI" : loc === "fr" ? "Équipe de Communication STI" : "STI Communications Team";
  const defaultRole = loc === "ar" ? "سمارت تكنولوجي إنوفايشن" : loc === "fr" ? "SARL Smart Technologie Innovation" : "Smart Technologie Innovation";
  const defaultBio = loc === "ar" ? "فريق الاتصال والإعلام الرسمي لشركة SARL Smart Technologie Innovation." : loc === "fr" ? "Équipe de communication officielle de SARL Smart Technologie Innovation." : "Official communications team at SARL Smart Technologie Innovation.";

  const author = tr.author || (item?.author && !item.author.toLowerCase().includes("sti") ? item.author : defaultAuthor);
  const authorRole = tr.authorRole || tr.author_role || (item?.author_role && !item.author_role.toLowerCase().includes("smart") ? item.author_role : defaultRole);
  const authorBio = tr.authorBio || tr.author_bio || (item?.author_bio && !item.author_bio.toLowerCase().includes("official") && !item.author_bio.toLowerCase().includes("officielle") && !item.author_bio.includes("الرسمي") ? item.author_bio : defaultBio);

  const rawCategory = tr.category || item?.category || "Company News";
  const category = localizeCategory(rawCategory, loc, categoriesList);

  return {
    id: String(item.id || "1"),
    title,
    slug: item.slug || "article",
    category,
    excerpt,
    content,
    heroImage,
    author,
    authorRole,
    authorBio,
    publishedAt: item.published_at || item.publishedAt || "May 20, 2026",
    readingTime: item.reading_time || item.readingTime || "3 min read",
    tags,
    featured: item.featured || false,
    seo: {
      title: `${title} | STI News`,
      description: excerpt || title,
      keywords: tags,
    },
  };
}

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.slug === slug);
}

export function getRelatedArticles(currentSlug: string, count = 3): NewsArticle[] {
  return newsArticles
    .filter((a) => a.slug !== currentSlug)
    .slice(0, count);
}

export function getAdjacentArticles(slug: string) {
  const index = newsArticles.findIndex((a) => a.slug === slug);
  const prev = index > 0 ? newsArticles[index - 1] : null;
  const next = index < newsArticles.length - 1 ? newsArticles[index + 1] : null;
  return { prev, next };
}
