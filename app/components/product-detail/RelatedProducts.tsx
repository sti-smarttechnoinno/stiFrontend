"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CreditCard } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from '@/app/[locale]/use-translations';
import type { Product } from '@/app/data/products';
import type { ApiProductItem } from '@/app/api/products/route';

interface RelatedProductsProps {
  products: Product[];
  currentSlug?: string;
}

export default function RelatedProducts({ products: initialProducts, currentSlug }: RelatedProductsProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const [displayProducts, setDisplayProducts] = useState<Array<{ slug: string; name: string; description: string }>>(() => {
    return (initialProducts ?? []).map((p) => ({
      slug: p.slug,
      name: p.name,
      description: p.shortDescription || p.description,
    }));
  });

  useEffect(() => {
    async function loadApiProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const apiData: ApiProductItem[] = await res.json();
          if (Array.isArray(apiData) && apiData.length > 0) {
            const published = apiData.filter((s) => !s.status || s.status === "Published");
            const filtered = currentSlug
              ? published.filter((s) => s.slug !== currentSlug)
              : published;

            const mapped = filtered.map((s) => {
              const lang = s.translations?.[currentLocale] || s.translations?.en || {};
              return {
                slug: s.slug,
                name: lang.name || s.slug,
                description: lang.shortDescription || (Array.isArray(lang.description) ? lang.description[0] : (lang.description || "")),
              };
            });

            if (mapped.length > 0) {
              setDisplayProducts(mapped);
            }
          }
        }
      } catch {}
    }

    loadApiProducts();
  }, [currentSlug, currentLocale]);

  if (!displayProducts || displayProducts.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-gray-50">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {t.productsPage?.featured?.badge || "Related"}
          </span>
          <h2
            className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-extrabold text-gray-900 lg:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.productsPage?.featured?.title || "Explore Related Products"}
          </h2>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-gray-500">
            {t.productsPage?.featured?.subtitle || "Discover other official Ooredoo recharge credit and SIM card options"}
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {displayProducts.map((product, i) => (
            <motion.article
              key={product.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(200,16,46,0.08)] flex flex-col h-full"
            >
              {/* Red accent line */}
              <div className="absolute left-0 top-0 h-[3px] w-0 bg-red-primary transition-all duration-500 group-hover:w-full" />

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-primary/10 text-red-primary transition-colors group-hover:bg-red-primary group-hover:text-white">
                <CreditCard size={24} />
              </div>

              <h3 className="mb-3 text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                {product.name}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-500 line-clamp-3">{product.description}</p>
              <Link
                href={`/${currentLocale}/ooredoo/products/${product.slug}`}
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-red-primary transition-colors hover:text-red-accent"
              >
                {t.productsPage?.featured?.view_details || t.services?.cta || "View Details"}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}