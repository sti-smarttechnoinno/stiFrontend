"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, CardSim, FileCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "../../[locale]/use-translations";
import { products as initialStaticProducts } from "../../data/products";
import type { ApiProductItem } from "../../api/products/route";

function getProductIcon(category: string, type: string) {
  if (category.toLowerCase().includes("sim") || type.toLowerCase().includes("sim")) {
    return CardSim;
  }
  if (type.toLowerCase().includes("document") || category.toLowerCase().includes("ticket")) {
    return FileCheck;
  }
  return CreditCard;
}

interface DisplayProduct {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  productType: string;
  value: string;
  image?: string;
}

export default function FeaturedProductsGrid() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const [displayProducts, setDisplayProducts] = useState<DisplayProduct[]>(() => {
    return initialStaticProducts.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      shortDescription: p.shortDescription || p.description,
      category: p.category,
      productType: p.productType,
      value: p.value,
      image: (p as any).image,
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
            const mapped = published.map((s) => {
              const lang = s.translations?.[currentLocale] || s.translations?.en || {};
              const desc = lang.shortDescription || (Array.isArray(lang.description) ? lang.description[0] : (lang.description || ""));
              return {
                id: String(s.id),
                slug: s.slug,
                name: lang.name || s.slug,
                shortDescription: desc,
                category: s.category || "Recharge Credit",
                productType: s.productType || "Recharge",
                value: s.value || "Available",
                image: s.image,
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
  }, [currentLocale]);

  const featT = t.productsPage?.featured || {
    badge: "Featured Range",
    title: "Official Ooredoo Products Catalogue",
    subtitle: "High-demand mobile recharge credit denominations, prepaid SIM cards, and official delivery tickets.",
    cta_quote: "Request Quote",
    view_details: "View Details",
  };

  return (
    <section id="products-grid" className="py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {featT.badge}
          </span>
          <h2
            className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {featT.title}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-500">
            {featT.subtitle}
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product, i) => {
            const Icon = getProductIcon(product.category, product.productType);

            return (
              <motion.article
                key={product.slug || product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-7 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(200,16,46,0.08)] flex flex-col justify-between"
              >
                {/* Red top accent line on hover */}
                <div className="absolute left-0 top-0 h-[3px] w-0 bg-red-primary transition-all duration-500 group-hover:w-full" />

                <div>
                  {/* Top row: Image/Icon & Value badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-red-primary/10 rounded-xl flex items-center justify-center text-red-primary group-hover:bg-red-primary group-hover:text-white transition-colors duration-300 overflow-hidden p-1">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            const target = e.currentTarget;
                            const str = `${product.productType || ""} ${product.category || ""} ${product.slug || ""}`.toLowerCase();
                            if (str.includes("sim")) {
                              target.src = "/assets/mobile-recharge-credit.png";
                            } else if (str.includes("recharge") || str.includes("credit")) {
                              target.src = "/assets/wholesale-recharge.png";
                            } else {
                              target.src = "/assets/partner-services.png";
                            }
                          }}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Icon size={24} />
                      )}
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-900">
                      {product.value}
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/${currentLocale}/products/${product.slug}`}>
                    <h3
                      className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-primary transition-colors duration-300"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {product.name}
                    </h3>
                  </Link>

                  {/* Description */}
                  <p className="text-xs text-gray-500 leading-relaxed mb-6 line-clamp-3">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Bottom row: Actions */}
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3 mt-auto">
                  <Link
                    href={`/${currentLocale}/products/${product.slug}`}
                    className="flex items-center justify-center w-full py-2.5 rounded-full bg-red-primary text-white text-xs font-semibold shadow-md shadow-red-primary/10 transition-all duration-300 hover:bg-red-primary/95 hover:shadow-lg"
                  >
                    <span>{featT.view_details || "View Details"}</span>
                    <ArrowRight size={14} className="ml-1.5 rtl:mr-1.5 rtl:ml-0 rtl:rotate-180" />
                  </Link>
                  <Link
                    href={`/${currentLocale}/quote`}
                    className="flex items-center justify-center w-full py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 transition-all duration-300 hover:border-gray-300 hover:bg-gray-50"
                  >
                    <span>{featT.cta_quote || "Request Quote"}</span>
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}