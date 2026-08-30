import type { Metadata } from "next";
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductsHero from '@/app/components/products/ProductsHero';
import ProductCategories from '@/app/components/products/ProductCategories';
import FeaturedProductsGrid from '@/app/components/products/FeaturedProductsGrid';
import BenefitsSection from '@/app/components/products/BenefitsSection';
import OrderingTimeline from '@/app/components/products/OrderingTimeline';
import ProductsFAQ from '@/app/components/products/ProductsFAQ';
import FinalCTA from '@/app/components/FinalCTA';

export const metadata: Metadata = {
  title: "Official Ooredoo Products | STI Algeria",
  description:
    "Browse official Ooredoo mobile recharge credit, prepaid SIM cards, and wholesale telecom products from SARL Smart Technologie Innovation (STI), an official Ooredoo distributor serving retailers and business partners across Algeria.",
  keywords: [
    "Ooredoo Products Algeria",
    "Official Ooredoo Distributor",
    "Mobile Recharge Credit",
    "Prepaid SIM Cards",
    "Wholesale Recharge",
    "Telecom Distribution Algeria",
    "Retail Partner Ooredoo",
    "STI Algeria",
    "Wholesale SIM Cards",
    "Official Telecom Products",
  ],
  openGraph: {
    title: "Official Ooredoo Products | STI Algeria",
    description:
      "Browse official Ooredoo mobile recharge credit, prepaid SIM cards, and wholesale telecom products from STI Algeria.",
    images: ["/assets/hero.webp"],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SARL Smart Technologie Innovation",
  alternateName: "STI",
  url: "https://sti.dz",
  logo: "https://sti.dz/logo.png",
  description:
    "Official Ooredoo distributor specializing in mobile recharge credit and prepaid SIM card distribution across Algeria.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "DZ",
  },
  sameAs: [],
};

const defaultMerchantReturnPolicy = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "DZ",
  returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
  merchantReturnDays: 0,
};

const defaultShippingDetails = {
  "@type": "OfferShippingDetails",
  shippingRate: {
    "@type": "MonetaryAmount",
    value: "0.00",
    currency: "DZD",
  },
  shippingDestination: {
    "@type": "DefinedRegion",
    addressCountry: "DZ",
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 0,
      maxValue: 1,
      "unitCode": "DAY",
    },
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 3,
      "unitCode": "DAY",
    },
  },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Official Ooredoo Products",
  description:
    "Complete range of genuine Ooredoo mobile recharge credit and prepaid SIM cards.",
  numberOfItems: 4,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Product",
        name: "Ooredoo Recharge 200 DA",
        description: "Official mobile recharge credit for prepaid subscribers.",
        image: ["https://sti.dz/assets/recharge-card.png"],
        brand: {
          "@type": "Brand",
          name: "Ooredoo",
        },
        offers: {
          "@type": "Offer",
          price: "200",
          priceCurrency: "DZD",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "200",
            priceCurrency: "DZD",
            valueAddedTaxIncluded: true,
          },
          hasMerchantReturnPolicy: defaultMerchantReturnPolicy,
          shippingDetails: defaultShippingDetails,
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Product",
        name: "Ooredoo Recharge 500 DA",
        description: "Official mobile recharge credit for prepaid subscribers.",
        image: ["https://sti.dz/assets/recharge-card.png"],
        brand: {
          "@type": "Brand",
          name: "Ooredoo",
        },
        offers: {
          "@type": "Offer",
          price: "500",
          priceCurrency: "DZD",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "500",
            priceCurrency: "DZD",
            valueAddedTaxIncluded: true,
          },
          hasMerchantReturnPolicy: defaultMerchantReturnPolicy,
          shippingDetails: defaultShippingDetails,
        },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Product",
        name: "Ooredoo Recharge 1000 DA",
        description: "Official mobile recharge credit for prepaid subscribers.",
        image: ["https://sti.dz/assets/recharge-card.png"],
        brand: {
          "@type": "Brand",
          name: "Ooredoo",
        },
        offers: {
          "@type": "Offer",
          price: "1000",
          priceCurrency: "DZD",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "1000",
            priceCurrency: "DZD",
            valueAddedTaxIncluded: true,
          },
          hasMerchantReturnPolicy: defaultMerchantReturnPolicy,
          shippingDetails: defaultShippingDetails,
        },
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Product",
        name: "Ooredoo Prepaid SIM",
        description: "Official prepaid SIM card ready for activation and resale.",
        image: ["https://sti.dz/assets/sim-card.png"],
        brand: {
          "@type": "Brand",
          name: "Ooredoo",
        },
        offers: {
          "@type": "Offer",
          price: "0.00",
          priceCurrency: "DZD",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "0.00",
            priceCurrency: "DZD",
            valueAddedTaxIncluded: true,
          },
          hasMerchantReturnPolicy: defaultMerchantReturnPolicy,
          shippingDetails: defaultShippingDetails,
        },
      },
    },
  ],
};

export default function ProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <Navbar />
      <main>
        <ProductsHero />
        <ProductCategories />
        <FeaturedProductsGrid />
        <BenefitsSection />
        <OrderingTimeline />
        <ProductsFAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}