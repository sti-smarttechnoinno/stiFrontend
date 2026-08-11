"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm, { MultilingualProductFormValues } from "../../../../components/admin/products/ProductForm";
import { Loader2 } from "lucide-react";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id ? String(params.id) : "1";
  const [productData, setProductData] = useState<MultilingualProductFormValues | null>(null);
  const [loading, setLoading] = useState(true);

  const initialMockValues = {
    sku: `OOR-PRODUCT-0${id}`,
    slug: "ooredoo-prepaid-sim-card",
    category: "SIM Cards",
    brand: "Ooredoo",
    productType: "SIM Card",
    value: "Prepaid",
    network: "4G / 4G+",
    status: "Published" as const,
    image: "/assets/recharge-card.png",
    translations: {
      en: {
        name: "Ooredoo Prepaid SIM Card",
        shortDescription: "Official Ooredoo prepaid SIM card ready for activation.",
        description: "Official Ooredoo prepaid SIM card ready for activation and distribution to retailers, wholesalers, and business partners across Algeria.",
        features: [
          "Official Ooredoo Product",
          "Ready for Activation",
          "Prepaid Service",
          "Wholesale & Retail Distribution"
        ],
        specifications: [
          { label: "Product Type", value: "SIM Card" },
          { label: "Operator", value: "Ooredoo" },
          { label: "Network", value: "4G / 4G+" }
        ],
        faqs: [
          {
            question: "Is this an official Ooredoo SIM Card?",
            answer: "Yes, this is an official Ooredoo product distributed directly by SARL Smart Technologie Innovation (STI)."
          }
        ]
      },
      ar: {
        name: "بطاقة أوريدو سيم مدفوعة مقدماً",
        shortDescription: "بطاقة أوريدو سيم رسمية جاهزة للتفعيل والتوزيع.",
        description: "شريحة هاتف أوريدو رسمية مخصصة للبيع والتوزيع عبر المحلات والتجار المعتمدين بالجزائر.",
        features: [
          "منتج أوريدو رسمي 100%",
          "جاهزة للتفعيل الفوري",
          "شريحة الدفع المسبق",
          "توزيع بالجملة والتجزئة"
        ],
        specifications: [
          { label: "نوع المنتج", value: "شريحة هاتف SIM" },
          { label: "المتعامل", value: "أوريدو الجزائر" },
          { label: "الشبكة", value: "4G / 4G+" }
        ],
        faqs: [
          {
            question: "هل الشريحة معتمدة ورسمية من أوريدو؟",
            answer: "نعم، جميع الشرائح الموزعة رسمية ومضمونة مباشرة عبر STI."
          }
        ]
      },
      fr: {
        name: "Carte SIM Prépayée Ooredoo",
        shortDescription: "Carte SIM prépayée officielle Ooredoo prête pour activation.",
        description: "Carte SIM prépayée officielle Ooredoo prête pour activation et distribution aux détaillants et grossistes en Algérie.",
        features: [
          "Produit Officiel Ooredoo",
          "Prête pour Activation",
          "Service Prépayé",
          "Distribution Grossiste & Détaillant"
        ],
        specifications: [
          { label: "Type de Produit", value: "Carte SIM" },
          { label: "Opérateur", value: "Ooredoo" },
          { label: "Réseau", value: "4G / 4G+" }
        ],
        faqs: [
          {
            question: "Est-ce une carte SIM officielle Ooredoo ?",
            answer: "Oui, produit 100% officiel distribué par STI."
          }
        ]
      }
    }
  };

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProductData(data);
        }
      } catch (err) {
        console.error("Failed to load product from API", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-2 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-red-primary" />
        <span className="text-xs font-semibold">Loading Product details from DB...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductForm isEditing={true} productId={id} initialValues={productData || initialMockValues} />
    </div>
  );
}
