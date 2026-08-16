import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ProductHero from "../../../components/product-detail/ProductHero";
import ProductOverview from "../../../components/product-detail/ProductOverview";
import ProductSpecifications from "../../../components/product-detail/ProductSpecifications";
import ProductBenefits from "../../../components/product-detail/ProductBenefits";
import ProductOrderingProcess from "../../../components/product-detail/ProductOrderingProcess";
import RelatedProducts from "../../../components/product-detail/RelatedProducts";
import ProductFAQ from "../../../components/product-detail/ProductFAQ";
import FinalCTA from "../../../components/FinalCTA";
import { getProductBySlug, getRelatedProducts, getAllProductSlugs } from "../../../data/products";
import type { Product } from "../../../data/products";

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://127.0.0.1:8000/api";
const LOCALES = ["en", "fr", "ar"];

async function fetchProductFromApi(slug: string): Promise<Product | undefined> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${BACKEND_API_URL}/products/${slug}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data && (data.slug || data.id)) {
        const enTrans = data.translations?.en || {};
        return {
          id: String(data.id),
          sku: data.sku || "",
          slug: data.slug,
          name: enTrans.name || data.name || data.slug,
          category: data.category || "Recharge Credit",
          categoryId: "recharge-credit",
          value: data.value || "Available",
          description: enTrans.description || data.description || "",
          shortDescription: enTrans.shortDescription || data.shortDescription || "",
          availability: "Available",
          format: "Standard Product",
          wholesale: "Available",
          suitableFor: ["Retailers", "Wholesalers", "Business Partners"],
          brand: data.brand || "Ooredoo",
          productType: data.productType || data.product_type || "Recharge",
          authenticity: "Official Ooredoo Product",
          features: Array.isArray(enTrans.features) ? enTrans.features : [],
          specifications: Array.isArray(enTrans.specifications) ? enTrans.specifications : [],
          faqs: Array.isArray(enTrans.faqs) ? enTrans.faqs : [],
          image: data.image || "",
          translations: data.translations,
          relatedSlugs: ["ooredoo-prepaid-sim-card", "recharge-credit", "recharge-credit-delivery-ticket"].filter((s) => s !== data.slug),
        };
      }
    }
  } catch {}

  return getProductBySlug(slug);
}

interface PageParams {
  locale: string;
  slug: string;
}

export async function generateStaticParams() {
  const slugs = getAllProductSlugs();
  return LOCALES.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductFromApi(slug);

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
  const product = await fetchProductFromApi(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);

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
      url: `https://sti-dz.com/${locale || "fr"}/products/${product.slug}`,
      priceCurrency: "DZD",
      price: "0.00",
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
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
        item: "https://sti-dz.com/products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://sti-dz.com/products/${product.slug}`,
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