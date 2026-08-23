"use client";

import { motion } from "framer-motion";
import { CreditCard, Tag, Package, Users, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Product } from "../../data/products";

export default function ProductOverview({ product }: { product: Product }) {
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const staticT = {
    en: {
      infoTitle: "Product Information",
      category: "Category",
      availability: "Availability",
      format: "Format",
      suitableFor: "Suitable For",
      wholesale: "Wholesale",
      available: "Available",
      requestQuote: "Request Quote",
    },
    ar: {
      infoTitle: "معلومات المنتج",
      category: "الفئة",
      availability: "التوفر",
      format: "الصيغة",
      suitableFor: "مناسب لـ",
      wholesale: "البيع بالجملة",
      available: "متوفر",
      requestQuote: "طلب عرض سعر",
    },
    fr: {
      infoTitle: "Informations sur le Produit",
      category: "Catégorie",
      availability: "Disponibilité",
      format: "Format",
      suitableFor: "Convient Pour",
      wholesale: "Vente en Gros",
      available: "Disponible",
      requestQuote: "Demander un Devis",
    },
  }[currentLocale] || {
    infoTitle: "Product Information",
    category: "Category",
    availability: "Availability",
    format: "Format",
    suitableFor: "Suitable For",
    wholesale: "Wholesale",
    available: "Available",
    requestQuote: "Request Quote",
  };

  const langTrans = product.translations?.[currentLocale] || product.translations?.en;
  const description = langTrans?.description || product.description;
  const shortDescription = langTrans?.shortDescription || product.shortDescription;

  const availLabel = product.availability === "Available" ? staticT.available : (product.availability || staticT.available);

  const translatedCategory = {
    "SIM Cards": { en: "SIM Cards", ar: "شرائح SIM", fr: "Cartes SIM" },
    "Recharge Credit Distribution": { en: "Recharge Credit Distribution", ar: "توزيع رصيد الشحن", fr: "Distribution de Crédit de Recharge" },
    "Recharge Delivery Tickets": { en: "Recharge Delivery Tickets", ar: "وصلات تسليم الشحن", fr: "Bons de Livraison" },
  }[product.category]?.[currentLocale] || product.category;

  const translatedFormat = {
    "Standard SIM Card": { en: "Standard SIM Card", ar: "شريحة SIM قياسية", fr: "Carte SIM Standard" },
    "Physical & Digital Recharge": { en: "Physical & Digital Recharge", ar: "شحن رقمي ورصيد بطاقات", fr: "Recharge Physique & Numérique" },
    "Official Document": { en: "Official Document", ar: "وثيقة رسمية معتمدة", fr: "Document Officiel" },
  }[product.format]?.[currentLocale] || (product.format || "Standard");

  const suitableForMap: Record<string, Record<string, string>> = {
    "Retailers": { en: "Retailers", ar: "تجار التجزئة", fr: "Détaillants" },
    "Wholesalers": { en: "Wholesalers", ar: "تجار الجملة", fr: "Grossistes" },
    "Business Partners": { en: "Business Partners", ar: "شركاء الأعمال", fr: "Partenaires Commerciales" },
    "Distributors": { en: "Distributors", ar: "الموزعين", fr: "Distributeurs" },
  };

  const translatedSuitableFor = Array.isArray(product.suitableFor)
    ? product.suitableFor.map((item) => suitableForMap[item]?.[currentLocale] || item).join(", ")
    : (typeof product.suitableFor === "string" ? (suitableForMap[product.suitableFor]?.[currentLocale] || product.suitableFor) : "");

  const rawDesc = description || shortDescription || "";
  const descParagraphs = typeof rawDesc === "string"
    ? rawDesc.split("\n\n").filter(Boolean)
    : Array.isArray(rawDesc)
    ? rawDesc
    : [];

  const mainDescription = descParagraphs.length > 0
    ? descParagraphs[0]
    : typeof rawDesc === "string"
    ? rawDesc
    : "";

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-gray-50">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left - Visual Showcase (Product Image from DB) - hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex items-center justify-center h-full min-h-[380px] sm:min-h-[440px]"
          >
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
                className="w-full h-auto max-h-[440px] object-contain drop-shadow-xl"
              />
            ) : (
              <div className="w-48 h-64 bg-red-primary rounded-3xl shadow-2xl shadow-red-primary/30 flex flex-col items-center justify-center text-center">
                <CreditCard size={48} className="text-white mb-3" />
                <span className="text-white text-3xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
                  {product.value}
                </span>
                <span className="text-white/80 text-xs font-bold tracking-widest uppercase mt-1">OOREDOO</span>
              </div>
            )}
          </motion.div>

          {/* Right - Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-8">
              <h2
                className="text-xl font-extrabold text-gray-900 mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {staticT.infoTitle}
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Tag size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{staticT.category}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{translatedCategory}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Package size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{staticT.availability}</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{availLabel}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{staticT.format}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{translatedFormat}</span>
                </div>

                {translatedSuitableFor && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-500">{staticT.suitableFor}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{translatedSuitableFor}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Package size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{staticT.wholesale}</span>
                  </div>
                  <span className="text-sm font-semibold text-red-primary">{product.wholesale === "Available" ? staticT.available : product.wholesale}</span>
                </div>
              </div>

              <Link
                href={`/${currentLocale}/quote`}
                className="flex items-center justify-center w-full py-3.5 rounded-full bg-red-primary text-white font-semibold shadow-lg shadow-red-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-red-primary/25"
              >
                {staticT.requestQuote}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}