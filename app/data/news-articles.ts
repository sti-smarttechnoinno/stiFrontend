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

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "STI Expands Distribution Services Across Algeria",
    slug: "sti-expands-distribution-services-across-algeria",
    category: "Company News",
    excerpt:
      "SARL Smart Technologie Innovation continues strengthening its distribution capabilities, ensuring reliable access to official Ooredoo recharge credit and prepaid SIM cards for retailers and business partners across Algeria.",
    content: `
## Strengthening Telecom Distribution Across Algeria

STI continues to expand its ability to serve retailers, wholesalers, and business partners with reliable access to official Ooredoo products. Our distribution network now spans an increasing number of provinces across Algeria, ensuring that partners receive consistent and timely supply.

Our focus remains on product availability, professional service, and efficient order management. By investing in logistics infrastructure and strengthening relationships with retail partners, STI is positioned as the go-to distributor for Ooredoo mobile recharge credit and prepaid SIM cards.

## Reliable Product Availability

One of STI's core commitments is ensuring continuous stock availability. Retailers and wholesalers depend on a steady supply of official Ooredoo recharge credit in multiple denominations and prepaid SIM cards to serve their customers effectively.

STI maintains robust inventory management processes that help prevent stock shortages and ensure products are always accessible when partners need them. This reliability is a cornerstone of our distribution model and a key reason why businesses across Algeria trust STI as their preferred Ooredoo distributor.

Our product range includes mobile recharge cards available in various denominations, prepaid SIM cards ready for activation, and welcome packs designed for new customers. Each product is sourced directly through official Ooredoo channels, guaranteeing authenticity and quality.

## Supporting Retail & Wholesale Partners

STI supports a growing network of retail and wholesale partners throughout Algeria. Our partner ecosystem includes small retail shops, large wholesale distributors, and everything in between. Each partner receives dedicated support to help them maximize their business potential.

Our partner services include flexible ordering processes, competitive wholesale pricing, and responsive customer support. We understand that each partner has unique requirements, which is why we offer tailored solutions designed to meet specific business needs.

## Business Growth & Distribution Excellence

STI's distribution model is built around helping partners grow their businesses. By providing reliable access to high-demand Ooredoo products and maintaining competitive pricing structures, we enable our partners to serve their customers effectively while building sustainable profitability.

Our nationwide distribution network ensures that products reach every corner of Algeria efficiently. From major urban centers to regional markets, STI's logistics infrastructure is designed for speed, reliability, and consistency.

Looking ahead, STI plans to further expand its distribution capabilities, strengthen its partner network, and continue delivering the high-quality service that has made it a trusted name in Algerian telecom distribution.
    `,
    heroImage: "/assets/hero.png",
    gallery: [
      { src: "/assets/hero.png", caption: "Modern distribution center ensuring product availability" },
      { src: "/assets/hero.png", caption: "Official Ooredoo recharge products and SIM cards" },
      { src: "/assets/hero.png", caption: "Ooredoo delivery vehicles for nationwide distribution" },
    ],
    author: "STI Team",
    authorRole: "Smart Technologie Innovation",
    authorBio:
      "Official Ooredoo distributor in Algeria, providing telecom distribution solutions and professional partner support.",
    publishedAt: "May 20, 2026",
    readingTime: "4 min read",
    tags: ["STI", "Ooredoo", "Telecom", "Algeria", "Distribution", "MobileRecharge", "SIMCards", "Partners"],
    featured: true,
    seo: {
      title: "STI Expands Distribution Services Across Algeria | STI News",
      description:
        "SARL Smart Technologie Innovation continues strengthening its distribution capabilities, ensuring retailers and business partners receive reliable access to official Ooredoo products across Algeria.",
      keywords: [
        "STI distribution Algeria",
        "Ooredoo distributor Algeria",
        "telecom distribution",
        "mobile recharge distribution",
        "SIM card distribution Algeria",
      ],
    },
  },
  {
    id: "2",
    title: "New Ooredoo Recharge Options Now Available",
    slug: "new-ooredoo-recharge-options-available",
    category: "Products",
    excerpt:
      "More recharge denominations are now available to help businesses satisfy customer needs across Algeria.",
    content: `
## Expanded Recharge Denominations

STI is pleased to announce the availability of new Ooredoo mobile recharge denominations. These additional options give retailers and wholesalers greater flexibility in meeting their customers' diverse needs.

The new denominations are designed to cater to a wider range of customer preferences, from budget-friendly options to higher-value recharge cards. This expansion ensures that retailers can offer the right product at the right price point.

## Meeting Market Demand

With the growing demand for mobile connectivity across Algeria, having diverse recharge options is essential for retailers. STI works closely with Ooredoo to ensure that the latest products are available through our distribution network promptly.

Our partners can now access the full range of denominations through their regular ordering process. Stock availability is maintained across our distribution network to ensure consistent access nationwide.
    `,
    heroImage: "/assets/hero.png",
    gallery: [
      { src: "/assets/hero.png", caption: "New Ooredoo recharge card denominations" },
      { src: "/assets/hero.png", caption: "Full product range for retail partners" },
      { src: "/assets/hero.png", caption: "Convenient wholesale ordering options" },
    ],
    author: "STI Team",
    authorRole: "Smart Technologie Innovation",
    authorBio:
      "Official Ooredoo distributor in Algeria, providing telecom distribution solutions and professional partner support.",
    publishedAt: "May 18, 2026",
    readingTime: "3 min read",
    tags: ["STI", "Ooredoo", "Recharge", "Products", "Algeria", "MobileRecharge"],
    seo: {
      title: "New Ooredoo Recharge Options Available | STI News",
      description:
        "Discover the latest Ooredoo mobile recharge denominations now available for wholesale purchase through STI.",
      keywords: [
        "Ooredoo recharge Algeria",
        "mobile recharge options",
        "wholesale recharge credit",
        "STI products",
      ],
    },
  },
  {
    id: "3",
    title: "Growing Our Retail Partner Network Nationwide",
    slug: "growing-our-retail-partner-network",
    category: "Partnership",
    excerpt:
      "STI welcomes new retail partners as we expand our distribution network across all 58 provinces of Algeria.",
    content: `
## Expanding Our Partner Ecosystem

STI continues to grow its retail partner network across Algeria. Our expanding ecosystem now includes hundreds of retail shops, wholesale distributors, and business partners spanning all 58 provinces.

This growth reflects the trust that businesses place in STI as their preferred Ooredoo distributor. By providing reliable product availability, competitive pricing, and dedicated support, we attract partners who value quality and professionalism.

## Benefits of Partnering with STI

Retail partners who join the STI network gain access to competitive wholesale pricing, reliable stock availability, and dedicated account support. Our partner program is designed to help businesses grow while providing excellent service to their customers.

New partners receive comprehensive onboarding, including product training, ordering process guidance, and ongoing support from our dedicated partner services team.
    `,
    heroImage: "/assets/hero.png",
    gallery: [
      { src: "/assets/hero.png", caption: "Growing network of retail partners" },
      { src: "/assets/hero.png", caption: "Partner onboarding and training" },
      { src: "/assets/hero.png", caption: "Nationwide retail coverage" },
    ],
    author: "STI Team",
    authorRole: "Smart Technologie Innovation",
    authorBio:
      "Official Ooredoo distributor in Algeria, providing telecom distribution solutions and professional partner support.",
    publishedAt: "May 15, 2026",
    readingTime: "3 min read",
    tags: ["STI", "Partners", "Retail", "Algeria", "Distribution", "Network"],
    seo: {
      title: "Growing Our Retail Partner Network | STI News",
      description:
        "STI welcomes new retail partners as we expand our distribution network across all 58 provinces of Algeria.",
      keywords: [
        "STI partners",
        "retail partner Algeria",
        "Ooredoo retail network",
        "telecom distribution partners",
      ],
    },
  },
  {
    id: "4",
    title: "Special Wholesale Offers for Retailers This Month",
    slug: "special-wholesale-offers-for-retailers",
    category: "Promotions",
    excerpt:
      "Take advantage of our exclusive wholesale pricing for retailers and business partners this month.",
    content: `
## Exclusive Wholesale Pricing

STI is offering special wholesale pricing for retailers and business partners throughout the month. These exclusive offers provide an excellent opportunity for partners to stock up on official Ooredoo products at competitive rates.

Our wholesale programs are designed to support businesses of all sizes, from small retail shops to large distribution networks. The special pricing applies to our full range of Ooredoo mobile recharge credit and prepaid SIM cards.

## How to Access These Offers

Existing partners can access these offers through their regular ordering channels. New partners interested in taking advantage of these wholesale rates are encouraged to contact our sales team to discuss partnership opportunities.
    `,
    heroImage: "/assets/hero.png",
    author: "STI Team",
    authorRole: "Smart Technologie Innovation",
    authorBio:
      "Official Ooredoo distributor in Algeria, providing telecom distribution solutions and professional partner support.",
    publishedAt: "May 12, 2026",
    readingTime: "2 min read",
    tags: ["STI", "Wholesale", "Promotions", "Retailers", "Algeria"],
    seo: {
      title: "Special Wholesale Offers for Retailers | STI News",
      description:
        "Exclusive wholesale pricing for retailers and business partners on official Ooredoo products through STI.",
      keywords: [
        "wholesale offers Algeria",
        "STI promotions",
        "Ooredoo wholesale pricing",
        "retailer offers",
      ],
    },
  },
  {
    id: "5",
    title: "Improving Product Availability Across Algeria",
    slug: "improving-product-availability-across-algeria",
    category: "Distribution",
    excerpt:
      "Our latest initiatives to ensure continuous stock supply and reliable product availability nationwide.",
    content: `
## Nationwide Stock Reliability

STI has implemented several initiatives to enhance product availability across Algeria. Our commitment to reliable stock supply ensures that retailers and wholesalers always have access to the Ooredoo products their customers demand.

These initiatives include expanded warehouse capacity, improved logistics coordination, and strengthened supplier relationships. Together, these improvements help maintain continuous product availability throughout our distribution network.

## Investment in Infrastructure

STI continues to invest in distribution infrastructure to support our growing partner network. From centralized warehousing to regional distribution points, our logistics setup is designed for efficiency and reliability.
    `,
    heroImage: "/assets/hero.png",
    gallery: [
      { src: "/assets/hero.png", caption: "Expanded warehouse facilities" },
      { src: "/assets/hero.png", caption: "Regional distribution centers" },
      { src: "/assets/hero.png", caption: "Efficient logistics network" },
    ],
    author: "STI Team",
    authorRole: "Smart Technologie Innovation",
    authorBio:
      "Official Ooredoo distributor in Algeria, providing telecom distribution solutions and professional partner support.",
    publishedAt: "May 10, 2026",
    readingTime: "3 min read",
    tags: ["STI", "Distribution", "Availability", "Algeria", "Logistics"],
    seo: {
      title: "Improving Product Availability Across Algeria | STI News",
      description:
        "STI's latest initiatives to ensure continuous stock supply and reliable product availability nationwide.",
      keywords: [
        "product availability Algeria",
        "STI distribution",
        "stock supply Algeria",
        "telecom logistics",
      ],
    },
  },
  {
    id: "6",
    title: "The Future of Mobile Recharge Distribution",
    slug: "future-of-mobile-recharge-distribution",
    category: "Industry",
    excerpt:
      "Industry insights on how digital transformation is reshaping telecom distribution in Algeria.",
    content: `
## Digital Transformation in Telecom

The telecom distribution landscape in Algeria is undergoing significant transformation. Digital technologies are reshaping how products reach consumers, creating new opportunities for distributors like STI to enhance efficiency and service quality.

From digital inventory management to automated ordering systems, technology is enabling faster, more accurate distribution processes. STI is at the forefront of adopting these innovations to better serve its partners.

## The Road Ahead

As Algeria's telecom market continues to evolve, STI remains committed to investing in technology, infrastructure, and people. Our goal is to lead the industry in distribution excellence while maintaining the personal, professional service that defines our approach.
    `,
    heroImage: "/assets/hero.png",
    author: "STI Team",
    authorRole: "Smart Technologie Innovation",
    authorBio:
      "Official Ooredoo distributor in Algeria, providing telecom distribution solutions and professional partner support.",
    publishedAt: "May 8, 2026",
    readingTime: "4 min read",
    tags: ["STI", "Industry", "Digital", "MobileRecharge", "Algeria", "Future"],
    seo: {
      title: "The Future of Mobile Recharge Distribution | STI News",
      description:
        "Industry insights on how digital transformation is reshaping telecom distribution in Algeria.",
      keywords: [
        "mobile recharge distribution",
        "telecom digital transformation",
        "Algeria telecom industry",
        "distribution future",
      ],
    },
  },
];

export function convertApiItemToNewsArticle(item: any, locale: string = "en"): NewsArticle {
  const loc = (locale as "en" | "ar" | "fr") || "en";
  const tr = item.translations?.[loc] || item.translations?.en || {};
  const title = tr.title || item.title || item.slug || "Untitled Article";
  const excerpt = tr.excerpt || item.excerpt || "";
  const content = tr.content || item.content || "";
  const tags = Array.isArray(tr.tags) ? tr.tags : Array.isArray(item.tags) ? item.tags : ["STI", "News"];

  return {
    id: String(item.id),
    title,
    slug: item.slug,
    category: item.category || "Company News",
    excerpt,
    content,
    heroImage: item.hero_image || item.heroImage || "/assets/hero.png",
    author: item.author || "STI Team",
    authorRole: item.author_role || item.authorRole || "Smart Technologie Innovation",
    authorBio: item.author_bio || item.authorBio || "Official communications team at SARL Smart Technologie Innovation.",
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
