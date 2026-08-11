import type { ReactNode } from "react";

export interface SolutionData {
  slug: string;
  name: string;
  shortName: string;
  badge: string;
  title: string;
  description: string[];
  highlights?: string[];
  features: { icon: string; title: string; description: string }[];
  benefits: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  illustration: "recharge" | "sim" | "wholesale" | "retail" | "partnership" | "support";
}

export const solutions: SolutionData[] = [
  {
    slug: "mobile-recharge-credit",
    name: "Official Ooredoo Mobile Recharge Credit Distribution",
    shortName: "Mobile Recharge Credit",
    badge: "Mobile Recharge Credit",
    title: "Official Ooredoo Mobile Recharge Credit Distribution",
    description: [
      "Our commitment is to deliver authentic Ooredoo recharge credit through a trusted distribution network that helps businesses meet customer demand quickly and efficiently. With flexible purchasing options and dedicated support, STI is the preferred partner for businesses looking for dependable telecom product distribution.",
      "Whether you operate a local retail shop or manage a wholesale business, STI provides the products, service, and support you need to grow your business with confidence.",
    ],
    highlights: [
      "Official Ooredoo Recharge Credit",
      "Multiple Denominations Available",
      "Reliable Product Availability",
      "Professional Partner Support",
    ],
    features: [
      {
        icon: "Wallet",
        title: "Multiple Denominations",
        description: "Official Ooredoo recharge credit available in multiple values to meet the needs of every customer.",
      },
      {
        icon: "Zap",
        title: "Instant Availability",
        description: "Fast access to recharge credit with reliable stock availability for retailers and business partners.",
      },
      {
        icon: "ShieldCheck",
        title: "100% Genuine Products",
        description: "Authentic Ooredoo recharge products supplied through the official distribution channel.",
      },
      {
        icon: "TrendingUp",
        title: "Flexible Business Solutions",
        description: "Designed for retailers, wholesalers, and distributors requiring dependable telecom products.",
      },
    ],
    benefits: [
      {
        title: "Increase Sales",
        description: "Expand your product offering with one of Algeria's most trusted mobile recharge brands.",
      },
      {
        title: "Reliable Product Supply",
        description: "Maintain continuous stock availability and reduce product shortages.",
      },
      {
        title: "Competitive Wholesale Pricing",
        description: "Benefit from attractive pricing designed to improve your business profitability.",
      },
      {
        title: "Faster Customer Service",
        description: "Provide customers with immediate access to official Ooredoo recharge credit.",
      },
      {
        title: "Trusted Official Distributor",
        description: "Partner with an authorized Ooredoo distributor committed to quality and reliability.",
      },
      {
        title: "Dedicated Business Support",
        description: "Receive ongoing assistance from our experienced sales and customer support teams.",
      },
    ],
    faqs: [
      {
        question: "Are the recharge credits official Ooredoo products?",
        answer: "Yes. All recharge credit distributed by STI is 100% official and supplied through the authorized Ooredoo distribution network.",
      },
      {
        question: "What recharge denominations are available?",
        answer: "We offer Ooredoo recharge credit in multiple denominations to meet the needs of retailers, businesses, and end customers.",
      },
      {
        question: "Can businesses purchase recharge credit in bulk?",
        answer: "Yes. STI provides flexible wholesale purchasing options with competitive pricing for qualified retailers and business partners.",
      },
      {
        question: "How can I place an order?",
        answer: "You can place an order by contacting our sales team or your assigned business representative, who will assist you throughout the ordering process.",
      },
      {
        question: "Who can become an STI partner?",
        answer: "Retailers, wholesalers, distributors, and businesses operating in Algeria can apply to become an authorized STI business partner and benefit from official Ooredoo product distribution.",
      },
    ],
    illustration: "recharge",
  },
  {
    slug: "prepaid-sim-cards",
    name: "Official Ooredoo Prepaid SIM Card Distribution",
    shortName: "Prepaid SIM Cards",
    badge: "SIM Card Distribution",
    title: "Official Ooredoo Prepaid SIM Card Distribution",
    description: [
      "Our distribution services are designed to help retailers and authorized resellers meet customer demand with authentic Ooredoo SIM cards ready for activation. With competitive business solutions and dependable supply, STI is the trusted partner for businesses seeking official telecom products.",
      "Whether you're a neighborhood retailer, wholesale distributor, or business partner, STI delivers the products and support you need to grow your business with confidence.",
    ],
    highlights: [
      "Official Ooredoo Prepaid SIM Cards",
      "Ready for Customer Activation",
      "Reliable Product Availability",
      "Dedicated Business Support",
    ],
    features: [
      {
        icon: "Smartphone",
        title: "Official Ooredoo SIM Cards",
        description: "100% genuine Ooredoo prepaid SIM cards supplied through the official distribution network.",
      },
      {
        icon: "CheckCircle",
        title: "Ready for Activation",
        description: "SIM cards are prepared for fast customer registration and activation.",
      },
      {
        icon: "Package",
        title: "Reliable Product Availability",
        description: "Continuous stock management ensures retailers and partners always have access to official SIM cards.",
      },
      {
        icon: "Store",
        title: "Retail & Wholesale Supply",
        description: "Flexible purchasing options designed for retailers, wholesalers, and authorized business partners.",
      },
    ],
    benefits: [
      {
        title: "Official Products",
        description: "Offer your customers authentic Ooredoo prepaid SIM cards backed by an official distributor.",
      },
      {
        title: "Consistent Stock Availability",
        description: "Reduce shortages with a reliable supply of prepaid SIM cards throughout the year.",
      },
      {
        title: "Competitive Business Pricing",
        description: "Access attractive pricing designed to help retailers and wholesalers maximize profitability.",
      },
      {
        title: "Fast Order Processing",
        description: "Benefit from quick order confirmation and efficient product preparation.",
      },
      {
        title: "Trusted Distribution Partner",
        description: "Work with an authorized Ooredoo distributor committed to quality, reliability, and professional service.",
      },
      {
        title: "Dedicated Partner Support",
        description: "Receive ongoing assistance for orders, product availability, and business inquiries.",
      },
    ],
    faqs: [
      {
        question: "Are the SIM cards official Ooredoo products?",
        answer: "Yes. All SIM cards distributed by STI are 100% genuine Ooredoo prepaid SIM cards supplied through the official distribution network.",
      },
      {
        question: "Are the SIM cards ready for activation?",
        answer: "Yes. Our prepaid SIM cards are ready for customer registration and activation according to Ooredoo's requirements.",
      },
      {
        question: "Can businesses purchase SIM cards in bulk?",
        answer: "Yes. STI offers flexible wholesale purchasing options for retailers, wholesalers, and authorized business partners.",
      },
      {
        question: "How can I place an order?",
        answer: "Orders can be placed by contacting our sales team or your assigned business representative, who will assist you throughout the ordering process.",
      },
      {
        question: "Who can become an STI SIM card distribution partner?",
        answer: "Retailers, wholesalers, distributors, and businesses operating in Algeria can apply to become an authorized STI partner and benefit from official Ooredoo prepaid SIM card distribution.",
      },
    ],
    illustration: "sim",
  },
  {
    slug: "wholesale-recharge",
    name: "Wholesale Mobile Recharge & SIM Card Solutions",
    shortName: "Wholesale Solutions",
    badge: "Wholesale Solutions",
    title: "Wholesale Mobile Recharge & SIM Card Solutions",
    description: [
      "Whether you operate a retail network, manage multiple stores, or supply telecom products to your customers, STI offers flexible purchasing options tailored to your business requirements. Our commitment to quality, efficiency, and professional service makes us a trusted wholesale partner throughout Algeria.",
      "With dedicated business support and dependable supply, STI helps your business grow while ensuring uninterrupted access to official Ooredoo products.",
    ],
    highlights: [
      "Competitive Wholesale Pricing",
      "Bulk Mobile Recharge & SIM Cards",
      "Official Ooredoo Products",
      "Dedicated Business Support",
    ],
    features: [
      {
        icon: "Package",
        title: "Bulk Purchasing Options",
        description: "Purchase official Ooredoo mobile recharge credit and prepaid SIM cards in quantities that match your business needs.",
      },
      {
        icon: "TrendingUp",
        title: "Competitive Wholesale Pricing",
        description: "Benefit from attractive pricing designed to improve profitability for retailers, wholesalers, and distribution partners.",
      },
      {
        icon: "ShieldCheck",
        title: "Official Ooredoo Products",
        description: "Access 100% genuine Ooredoo recharge credit and prepaid SIM cards supplied through the official distribution channel.",
      },
      {
        icon: "Truck",
        title: "Reliable Product Availability",
        description: "Maintain continuous stock with a dependable wholesale supply of telecom products across Algeria.",
      },
    ],
    benefits: [
      {
        title: "Increase Profitability",
        description: "Take advantage of competitive wholesale pricing and improve your business margins.",
      },
      {
        title: "Reliable Stock Supply",
        description: "Ensure continuous availability of official Ooredoo products for your customers.",
      },
      {
        title: "Flexible Order Volumes",
        description: "Order according to your business needs, whether for small retail stores or large wholesale operations.",
      },
      {
        title: "Fast Order Processing",
        description: "Benefit from efficient order confirmation and quick product preparation.",
      },
      {
        title: "Trusted Official Distributor",
        description: "Work with an authorized Ooredoo distributor committed to product quality and reliable service.",
      },
      {
        title: "Dedicated Business Assistance",
        description: "Receive ongoing support for orders, product availability, and partnership development.",
      },
    ],
    faqs: [
      {
        question: "What products are available through the wholesale program?",
        answer: "Our wholesale program includes official Ooredoo mobile recharge credit in multiple denominations and genuine prepaid SIM cards.",
      },
      {
        question: "Is there a minimum order quantity?",
        answer: "Minimum order quantities may vary depending on the product and partnership agreement. Contact our sales team for more information.",
      },
      {
        question: "Do you offer competitive wholesale pricing?",
        answer: "Yes. STI provides attractive wholesale pricing designed to support retailers, wholesalers, and business partners.",
      },
      {
        question: "How can I become a wholesale partner?",
        answer: "Simply contact our sales team to discuss your business requirements. We'll guide you through the partnership process and help you get started.",
      },
      {
        question: "Who can purchase wholesale products?",
        answer: "Retailers, wholesalers, telecom resellers, and authorized business partners operating in Algeria are welcome to apply for STI's wholesale solutions.",
      },
    ],
    illustration: "wholesale",
  },
  {
    slug: "partner-services",
    name: "Dedicated Partner Services & Business Support",
    shortName: "Partner Services",
    badge: "Partner Services",
    title: "Dedicated Partner Services & Business Support",
    description: [
      "Our Partner Services are designed to simplify your daily operations by offering responsive customer support, efficient order management, and continuous access to official Ooredoo mobile recharge credit and prepaid SIM cards.",
      "Whether you're a new retailer or an established wholesale partner, STI is here to support your business with reliable products, personalized assistance, and a trusted partnership focused on long-term success.",
    ],
    highlights: [
      "Dedicated Business Support",
      "Reliable Product Availability",
      "Fast Order Assistance",
      "Long-Term Partnership",
    ],
    features: [
      {
        icon: "Headphones",
        title: "Dedicated Account Assistance",
        description: "Receive personalized support from our experienced team for all your business needs.",
      },
      {
        icon: "RefreshCw",
        title: "Fast Order Management",
        description: "Efficient processing and follow-up to ensure your orders are handled quickly and accurately.",
      },
      {
        icon: "Package",
        title: "Reliable Product Availability",
        description: "Continuous access to official Ooredoo mobile recharge credit and prepaid SIM cards.",
      },
      {
        icon: "Users",
        title: "Business Partnership Support",
        description: "Professional guidance to help retailers and wholesalers grow their business with confidence.",
      },
    ],
    benefits: [
      {
        title: "Responsive Customer Support",
        description: "Quick assistance for orders, product inquiries, and partnership requests.",
      },
      {
        title: "Simplified Order Process",
        description: "A streamlined ordering experience that saves time and improves efficiency.",
      },
      {
        title: "Reliable Supply",
        description: "Maintain consistent access to official Ooredoo products throughout the year.",
      },
      {
        title: "Long-Term Business Relationship",
        description: "Build a trusted partnership with an official Ooredoo distributor committed to your success.",
      },
      {
        title: "Professional Assistance",
        description: "Dedicated support from experienced professionals who understand your business needs.",
      },
      {
        title: "Business Growth",
        description: "Focus on serving your customers while STI ensures reliable product availability and continuous support.",
      },
    ],
    faqs: [
      {
        question: "What are STI Partner Services?",
        answer: "STI Partner Services provide dedicated business support, order assistance, and reliable access to official Ooredoo mobile recharge credit and prepaid SIM cards for retailers and wholesalers.",
      },
      {
        question: "Who can become an STI partner?",
        answer: "Retailers, wholesalers, telecom resellers, and businesses operating in Algeria can apply to become authorized STI partners.",
      },
      {
        question: "What support does STI provide to partners?",
        answer: "Our team assists with order management, product availability, business inquiries, and ongoing partnership support to help your business operate efficiently.",
      },
      {
        question: "How do I place an order?",
        answer: "Orders can be placed through your assigned sales representative or by contacting our sales team directly for assistance.",
      },
      {
        question: "Why should I partner with STI?",
        answer: "As an official Ooredoo distributor, STI offers authentic products, competitive business solutions, reliable product availability, and dedicated support to help your business grow successfully.",
      },
    ],
    illustration: "support",
  },
  {
    slug: "business-partnership",
    name: "Business Partnership Program",
    shortName: "Business Partnership",
    badge: "Official Ooredoo Distributor",
    title: "Business Partnership Program",
    description: [
      "STI\u2019s Business Partnership Program offers long-term, strategic partnerships with companies looking to distribute Ooredoo products across Algeria. We provide the infrastructure, support, and pricing to help your business grow.",
      "As an official Ooredoo distributor, we bring certified product access, reliable logistics, and dedicated account management to every partnership. Our goal is to build lasting relationships that drive mutual success.",
      "Whether you\u2019re an established distributor looking to add Ooredoo to your portfolio or a new entrant to the telecom market, our partnership program is designed to set you up for success."
    ],
    features: [
      { icon: "Users", title: "Strategic Partnership", description: "Long-term business relationships built on trust." },
      { icon: "Globe", title: "Nationwide Reach", description: "Distribution across all 58 Algerian provinces." },
      { icon: "TrendingUp", title: "Growth Support", description: "Tools and support to scale your business." },
      { icon: "ShieldCheck", title: "Official Certification", description: "Ooredoo certified distribution partner status." },
    ],
    benefits: [
      { title: "Business Growth", description: "Scale your operations with a proven product and partner." },
      { title: "Reliable Supply", description: "Guaranteed product availability for your network." },
      { title: "Competitive Margins", description: "Partnership pricing designed for profitability." },
      { title: "Dedicated Support", description: "Account management and business development assistance." },
      { title: "Brand Association", description: "Align with Ooredoo\u2019s trusted brand reputation." },
      { title: "Market Access", description: "Leverage our established distribution infrastructure." },
    ],
    faqs: [
      { question: "What does the partnership program include?", answer: "Partnerships include official Ooredoo product access, competitive wholesale pricing, dedicated account management, marketing support, and logistics infrastructure." },
      { question: "What are the partnership requirements?", answer: "Requirements vary based on partnership tier. Contact us to discuss your business and determine the best partnership structure." },
      { question: "Is there an exclusive territory option?", answer: "We offer exclusive and semi-exclusive distribution arrangements in certain regions. Contact us to discuss available territories." },
      { question: "How do I get started?", answer: "Simply reach out to our partnership team. We\u2019ll schedule a consultation to understand your goals and outline the best path forward." },
      { question: "What ongoing support is provided?", answer: "Partners receive ongoing account management, business development support, marketing assistance, and priority access to new products." },
    ],
    illustration: "partnership",
  },
  {
    slug: "customer-support",
    name: "Customer Support Services",
    shortName: "Customer Support",
    badge: "Official Ooredoo Distributor",
    title: "Customer Support Services",
    description: [
      "STI provides professional customer support services for all our distribution partners. From order assistance to technical guidance, our dedicated team ensures your business runs smoothly.",
      "Our support infrastructure includes phone, email, and online channels, with responsive service designed to resolve issues quickly and keep your operations on track.",
      "As an official Ooredoo distributor, we combine product expertise with dedicated partner support, ensuring you always have the assistance you need when you need it."
    ],
    features: [
      { icon: "Phone", title: "Phone Support", description: "Direct access to our support team by phone." },
      { icon: "Mail", title: "Email Support", description: "Detailed assistance via email for complex inquiries." },
      { icon: "MessageSquare", title: "Online Support", description: "Digital channels for quick questions and updates." },
      { icon: "Headphones", title: "Dedicated Team", description: "Specialized support staff for partner accounts." },
    ],
    benefits: [
      { title: "Quick Resolution", description: "Fast response times to keep your business moving." },
      { title: "Expert Guidance", description: "Knowledgeable team familiar with Ooredoo products." },
      { title: "Multiple Channels", description: "Reach us however works best for your business." },
      { title: "Proactive Assistance", description: "We reach out before issues become problems." },
      { title: "Business Hours Coverage", description: "Support during extended business hours, Mon-Sat." },
      { title: "Escalation Process", description: "Clear escalation path for complex issues." },
    ],
    faqs: [
      { question: "What are your support hours?", answer: "Our support team is available Monday through Saturday, 08:00 to 18:00. We also have emergency channels for urgent issues outside regular hours." },
      { question: "How quickly do you respond to inquiries?", answer: "We aim to respond to all inquiries within 2 hours during business hours. Urgent matters are prioritized and handled immediately." },
      { question: "What support channels are available?", answer: "We offer phone, email, and online support. Partners with dedicated accounts also have access to a direct account manager." },
      { question: "Can you help with order issues?", answer: "Yes, our support team handles all order-related inquiries including status checks, modifications, delivery tracking, and issue resolution." },
      { question: "Do you provide technical support?", answer: "Yes, our team can assist with product-related technical questions, activation issues, and general telecom guidance." },
    ],
    illustration: "support",
  },
];

export function getSolutionBySlug(slug: string): SolutionData | undefined {
  return solutions.find((s) => s.slug === slug);
}

export function getRelatedSolutions(currentSlug: string): SolutionData[] {
  return solutions.filter((s) => s.slug !== currentSlug).slice(0, 5);
}
