"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "../hooks";
import { useTranslations } from "../[locale]/use-translations";

interface DynamicProductItem {
  id: string | number;
  slug: string;
  category: string;
  productType: string;
  value: string;
  status?: string;
  image?: string;
  translations: {
    [key: string]: {
      name: string;
      shortDescription?: string;
      description?: string | string[];
      badge?: string;
    };
  };
}

// Fallback illustration selector based on productType
const getProductIllustration = (productType: string) => {
  const typeLower = productType?.toLowerCase() || "";
  if (typeLower.includes("sim")) {
    return "/assets/sim-card.png";
  }
  if (typeLower.includes("recharge") || typeLower.includes("credit")) {
    return "/assets/recharge-card.png";
  }
  return "/assets/delivery-ticket.png";
};

function ProductCard({
  image,
  title,
  description,
  index,
  ctaText,
  currentLocale,
  slug,
}: {
  image: string;
  title: string;
  description: string;
  index: number;
  ctaText: string;
  currentLocale: string;
  slug: string;
}) {
  const { ref, visible } = useScrollReveal(0.2);

  return (
    <article
      ref={ref}
      className={`group flex flex-col h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(200,16,46,0.08)] hover:-translate-y-1 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="relative overflow-hidden bg-gray-50 p-8 flex items-center justify-center h-48 border-b border-gray-50">
        <div className="absolute inset-0 bg-gradient-to-br from-red-primary/3 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <img
          src={image}
          alt={title}
          className="h-32 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="mb-2 text-base font-extrabold text-gray-900 leading-snug" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h3>
        <p className="mb-5 text-xs leading-relaxed text-gray-500 line-clamp-3">
          {description}
        </p>
        <Link
          href={`/${currentLocale}/products/${slug}`}
          className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-red-primary transition-colors hover:text-red-accent"
        >
          {ctaText}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

export default function Products() {
  const { ref, visible } = useScrollReveal();
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";

  const [products, setProducts] = useState<DynamicProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const published = data.filter((p) => !p.status || p.status === "Published");
            setProducts(published);
          }
        }
      } catch (err) {
        console.error("Failed to load products on homepage", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <section id="products" className="py-20 sm:py-28 lg:py-36 bg-gray-50">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div
          ref={ref}
          className={`mb-16 text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {t.products.badge}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            {t.products.title}
          </h2>
          <p className="mx-auto max-w-xl text-gray-500">
            {t.products.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-xs text-gray-400 font-semibold">Loading products...</span>
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => {
              const lang = p.translations?.[currentLocale] || p.translations?.en || {};
              const title = lang.name || p.slug;
              const desc = lang.shortDescription || (Array.isArray(lang.description) ? lang.description[0] : (lang.description || ""));
              const imageSrc = p.image || getProductIllustration(p.productType);
              
              return (
                <ProductCard
                  key={p.slug}
                  image={imageSrc}
                  title={title}
                  description={desc}
                  index={i}
                  ctaText={t.products.cta || "View Details"}
                  currentLocale={currentLocale}
                  slug={p.slug}
                />
              );
            })}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.products.items.map((p, i) => (
              <ProductCard
                key={p.title}
                image="/assets/sim-card.png"
                title={p.title}
                description={p.description}
                index={i}
                ctaText={t.products.cta}
                currentLocale={currentLocale}
                slug={i === 0 ? "ooredoo-prepaid-sim-card" : "recharge-credit"}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
