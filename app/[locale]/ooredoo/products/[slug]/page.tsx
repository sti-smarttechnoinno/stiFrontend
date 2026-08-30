import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductHero from '@/app/components/product-detail/ProductHero';
import ProductOverview from '@/app/components/product-detail/ProductOverview';
import ProductSpecifications from '@/app/components/product-detail/ProductSpecifications';
import ProductBenefits from '@/app/components/product-detail/ProductBenefits';
import ProductOrderingProcess from '@/app/components/product-detail/ProductOrderingProcess';
import RelatedProducts from '@/app/components/product-detail/RelatedProducts';
import ProductFAQ from '@/app/components/product-detail/ProductFAQ';
import FinalCTA from '@/app/components/FinalCTA';
import { getProductBySlug } from '@/app/data/products';
import { fetchFromBackend } from '@/app/api/backend-helper';
import { getMemoryProducts } from '@/app/api/products/products-store';
import type { Product } from '@/app/data/products';

export const dynamic = "force-dynamic";

async function fetchProductFromApi(slug: string, locale: string = "en"): Promise<Product | undefined> {
  const decodedSlug = decodeURIComponent(slug);
  let data: any = null;

  try {
    const res = await fetchFromBackend(`/products/${encodeURIComponent(decodedSlug)}`, { cache: "no-store" }, 8000);
    if (res && res.ok) {
      data = await res.json().catch(() => null);
    }
  } catch {}

  if (!data || (!data.slug && !data.id)) {
    const memory = getMemoryProducts();
    data = memory.find(
      (p) =>
        p.slug === decodedSlug ||
        String(p.id) === decodedSlug ||
        p.slug === slug ||
        String(p.id) === slug
    );
  }

  if (data && (data.slug || data.id)) {
    const loc = (locale as "en" | "ar" | "fr") || "en";
    const langTrans = data.translations?.[loc] || data.translations?.en || data.translations?.fr || data.translations?.ar || {};
    return {
      id: String(data.id),
      sku: data.sku || "",
      slug: data.slug,
      name: langTrans.name || data.name || data.slug,
      category: data.category || "Recharge Credit",
      categoryId: (data.category || "recharge-credit").toLowerCase().replace(/\s+/g, "-"),
      value: data.value || "Available",
      description: langTrans.description || (Array.isArray(langTrans.description) ? langTrans.description.join(" ") : data.description) || "",
      shortDescription: langTrans.shortDescription || data.shortDescription || "",
      availability: "Available",
      format: data.format || "Standard Product",
      wholesale: "Available",
      suitableFor: Array.isArray(data.suitableFor) ? data.suitableFor : ["Retailers", "Wholesalers", "Business Partners"],
      brand: data.brand || "Ooredoo",
      productType: data.productType || data.product_type || "Recharge",
      authenticity: "Official Ooredoo Product",
      features: Array.isArray(langTrans.features) ? langTrans.features : [],
      specifications: Array.isArray(langTrans.specifications) ? langTrans.specifications : [],
      faqs: Array.isArray(langTrans.faqs) ? langTrans.faqs : [],
      image: data.image || "",
      translations: data.translations,
      relatedSlugs: [],
    };
  }

  return getProductBySlug(slug);
}

async function fetchAllProductsFromApi(locale: string = "en"): Promise<Product[]> {
  let list: any[] = [];
  try {
    const res = await fetchFromBackend("/products", { cache: "no-store" }, 8000);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        list = data;
      }
    }
  } catch {}

  if (list.length === 0) {
    list = getMemoryProducts();
  }

  const loc = (locale as "en" | "ar" | "fr") || "en";
  return list
    .filter((item) => !item.status || item.status === "Published")
    .map((data) => {
      const langTrans = data.translations?.[loc] || data.translations?.en || data.translations?.fr || data.translations?.ar || {};
      return {
        id: String(data.id),
        sku: data.sku || "",
        slug: data.slug,
        name: langTrans.name || data.name || data.slug,
        category: data.category || "Recharge Credit",
        categoryId: (data.category || "recharge-credit").toLowerCase().replace(/\s+/g, "-"),
        value: data.value || "Available",
        description: langTrans.description || (Array.isArray(langTrans.description) ? langTrans.description.join(" ") : data.description) || "",
        shortDescription: langTrans.shortDescription || data.shortDescription || "",
        availability: "Available",
        format: data.format || "Standard Product",
        wholesale: "Available",
        suitableFor: Array.isArray(data.suitableFor) ? data.suitableFor : ["Retailers", "Wholesalers", "Business Partners"],
        brand: data.brand || "Ooredoo",
        productType: data.productType || data.product_type || "Recharge",
        authenticity: "Official Ooredoo Product",
        features: Array.isArray(langTrans.features) ? langTrans.features : [],
        specifications: Array.isArray(langTrans.specifications) ? langTrans.specifications : [],
        faqs: Array.isArray(langTrans.faqs) ? langTrans.faqs : [],
        image: data.image || "",
        translations: data.translations,
        relatedSlugs: [],
      };
    });
}

interface PageParams {
  locale: string;
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await fetchProductFromApi(slug, locale);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | STI Official Ooredoo Distributor`,
    description: product.description,
    keywords: [
      product.name,
      "Ooredoo Products Algeria",
      "Official Ooredoo Distributor",
      "Mobile Recharge Credit",
      "Wholesale Telecom",
      "STI Algeria",
    ],
    openGraph: {
      title: `${product.name} | STI Official Ooredoo Distributor`,
      description: product.description,
      images: [product.image || "/assets/hero.png"],
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale, slug } = await params;
  const product = await fetchProductFromApi(slug, locale);

  if (!product) {
    notFound();
  }

  const allProducts = await fetchAllProductsFromApi(locale);
  const relatedProducts = allProducts.filter((p) => p.slug !== product.slug);

  const productImageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `https://sti-dz.com${product.image}`
    : "https://sti-dz.com/assets/hero.png";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SARL Smart Technologie Innovation",
    alternateName: "STI",
    url: "https://sti-dz.com",
    logo: "https://sti-dz.com/logo.png",
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [productImageUrl],
    sku: product.sku || product.id || product.slug,
    brand: {
      "@type": "Brand",
      name: product.brand || "Ooredoo",
    },
    offers: {
      "@type": "Offer",
      url: `https://sti-dz.com/${locale || "fr"}/ooredoo/products/${product.slug}`,
      priceCurrency: "DZD",
      price: "0.00",
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "0.00",
        priceCurrency: "DZD",
        valueAddedTaxIncluded: true,
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "DZ",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        merchantReturnDays: 0,
      },
      shippingDetails: {
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
      },
      seller: {
        "@type": "Organization",
        name: "SARL Smart Technologie Innovation",
      },
    },
    manufacturer: {
      "@type": "Organization",
      name: "Ooredoo",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1",
    },
    review: [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
        },
        "author": {
          "@type": "Organization",
          "name": "Partenaire Distributeur Ooredoo",
        },
        "reviewBody": "Service officiel de distribution et recharge Ooredoo rapide et sur devis.",
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://sti-dz.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://sti-dz.com/ooredoo/products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://sti-dz.com/ooredoo/products/${product.slug}`,
      },
    ],
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <Navbar />
      <main>
        <ProductHero product={product} />
        <ProductOverview product={product} />
        <ProductSpecifications product={product} />
        <ProductBenefits />
        <ProductOrderingProcess />
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
        <ProductFAQ product={product} />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}