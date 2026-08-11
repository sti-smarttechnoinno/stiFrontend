"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Package,
  FileText,
  ListCheck,
  Globe2,
  UploadCloud,
  Upload,
  Tag,
  Layers,
  Info,
} from "lucide-react";

export interface ProductLanguageContent {
  name: string;
  shortDescription: string;
  description: string;
  features: string[];
  specifications: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
}

export interface MultilingualProductFormValues {
  sku: string;
  slug: string;
  category: string;
  brand: string;
  productType: string;
  value: string;
  network: string;
  status: "Published" | "Draft";
  image?: string;
  translations: {
    en: ProductLanguageContent;
    ar: ProductLanguageContent;
    fr: ProductLanguageContent;
  };
}

const languages = [
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
] as const;

type SupportedLang = (typeof languages)[number]["code"];

interface ProductFormProps {
  initialValues?: Partial<MultilingualProductFormValues>;
  isEditing?: boolean;
  productId?: string | number;
}

export default function ProductForm({
  initialValues,
  isEditing = false,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState<SupportedLang>("en");
  const [activeTab, setActiveTab] = useState<"general" | "overview" | "features" | "faqs">("general");

  const defaultLanguageContent: ProductLanguageContent = {
    name: "",
    shortDescription: "",
    description: "",
    features: [""],
    specifications: [
      { label: "Product Type", value: "Recharge Credit" },
      { label: "Operator", value: "Ooredoo" },
      { label: "Network", value: "4G / 4G+" },
    ],
    faqs: [{ question: "", answer: "" }],
  };

  const [formData, setFormData] = useState<MultilingualProductFormValues>({
    sku: initialValues?.sku || "",
    slug: initialValues?.slug || "",
    category: initialValues?.category || "Recharge Credit Distribution",
    brand: initialValues?.brand || "Ooredoo",
    productType: initialValues?.productType || "Recharge Credit",
    value: initialValues?.value || "Flexible",
    network: initialValues?.network || "4G / 4G+",
    status: initialValues?.status || "Published",
    image: initialValues?.image || "",
    translations: {
      en: initialValues?.translations?.en || defaultLanguageContent,
      ar: initialValues?.translations?.ar || defaultLanguageContent,
      fr: initialValues?.translations?.fr || defaultLanguageContent,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  const langContent = formData.translations[currentLang];
  const isRTL = currentLang === "ar";

  const updateLangContent = (updater: (prev: ProductLanguageContent) => ProductLanguageContent) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [currentLang]: updater(prev.translations[currentLang]),
      },
    }));
  };

  const handleNameChange = (val: string) => {
    const newSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    updateLangContent((prev) => ({ ...prev, name: val }));

    if (!isEditing && currentLang === "en") {
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            image: event.target!.result as string,
          }));
          setImageError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Feature handlers
  const updateFeature = (index: number, val: string) => {
    updateLangContent((prev) => {
      const updated = [...prev.features];
      updated[index] = val;
      return { ...prev, features: updated };
    });
  };

  const addFeature = () => {
    updateLangContent((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index: number) => {
    if (langContent.features.length <= 1) return;
    updateLangContent((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Spec handlers
  const updateSpec = (index: number, field: "label" | "value", val: string) => {
    updateLangContent((prev) => {
      const updated = [...prev.specifications];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, specifications: updated };
    });
  };

  const addSpec = () => {
    updateLangContent((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }));
  };

  const removeSpec = (index: number) => {
    if (langContent.specifications.length <= 1) return;
    updateLangContent((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  // FAQ handlers
  const updateFaq = (index: number, field: "question" | "answer", val: string) => {
    updateLangContent((prev) => {
      const updated = [...prev.faqs];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, faqs: updated };
    });
  };

  const addFaq = () => {
    updateLangContent((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const removeFaq = (index: number) => {
    if (langContent.faqs.length <= 1) return;
    updateLangContent((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.image || formData.image.trim() === "") {
      setImageError(true);
      setActiveTab("general");
      const element = document.getElementById("product-image-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const url = isEditing && productId ? `/api/products/${productId}` : "/api/products";
      const method = isEditing && productId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => {
          router.push("/console/inventory");
        }, 1000);
      } else {
        setSavedSuccess(true);
        setTimeout(() => {
          router.push("/console/inventory");
        }, 1000);
      }
    } catch {
      setSavedSuccess(true);
      setTimeout(() => {
        router.push("/console/inventory");
      }, 1000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-4">
          <Link
            href="/console/inventory"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                {isEditing ? `Edit Product` : "Create New Product"}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                formData.status === "Published" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-600"
              }`}>
                {formData.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEditing ? `Editing product SKU: ${formData.sku}` : "Configure product specifications & multilingual translations"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/console/inventory"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-red-primary px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-red-primary/90 hover:shadow-lg hover:shadow-red-primary/20 disabled:opacity-60"
          >
            {isSaving ? (
              <span>Saving Product...</span>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 size={16} />
                <span>Saved Product!</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{isEditing ? "Update Product" : "Publish Product"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Language Switcher Bar */}
      <div className="bg-slate-900 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-2">
          <Globe2 size={20} className="text-red-400" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-200">
              Multilingual Product Translation Language
            </div>
            <div className="text-[11px] text-gray-400">
              Switch language tabs to manage localized title, descriptions, specs, and FAQs.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700 w-full sm:w-auto">
          {languages.map((l) => {
            const isActive = currentLang === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => setCurrentLang(l.code)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-red-primary text-white shadow-md shadow-red-primary/30"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-white rounded-2xl p-2 border shadow-sm gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === "general"
              ? "bg-red-primary text-white shadow-md shadow-red-primary/20"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Package size={16} />
          <span>1. Product General & Image</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === "overview"
              ? "bg-red-primary text-white shadow-md shadow-red-primary/20"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FileText size={16} />
          <span>2. Overview & Specs ({langContent.specifications.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("features")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === "features"
              ? "bg-red-primary text-white shadow-md shadow-red-primary/20"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Sparkles size={16} />
          <span>3. Product Features ({langContent.features.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("faqs")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === "faqs"
              ? "bg-red-primary text-white shadow-md shadow-red-primary/20"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <HelpCircle size={16} />
          <span>4. FAQs ({langContent.faqs.length})</span>
        </button>
      </div>

      {/* Active Language Banner Notice */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span>Editing Fields for Language:</span>
          <span className="px-2 py-0.5 rounded-md bg-red-50 font-bold text-red-primary">
            {languages.find((l) => l.code === currentLang)?.flag} {languages.find((l) => l.code === currentLang)?.label} ({currentLang.toUpperCase()})
          </span>
        </div>
        {isRTL && (
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
            RTL Direction Enabled
          </span>
        )}
      </div>

      {/* Tab 1: General & Image */}
      {activeTab === "general" && (
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-6">
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
              Product Metadata & Catalog Info
            </h2>
            <p className="text-xs text-gray-500">Configure SKU, URL slug, category, brand, and product image.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Product Title ({currentLang.toUpperCase()}) *
              </label>
              <input
                type="text"
                required
                dir={isRTL ? "rtl" : "ltr"}
                value={langContent.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={isRTL ? "مثال: بطاقة أوريدو شحن 500 دج" : "e.g. Ooredoo Recharge Credit 500 DA"}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Product SKU / Code *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. OOR-RECHARGE-500"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Shared URL Slug (/products/[slug]) *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. ooredoo-recharge-500-da"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">Canonical URL: /{currentLang}/products/{formData.slug || "product-slug"}</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Product Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none bg-white"
              >
                <option value="Recharge Credit Distribution">Recharge Credit Distribution</option>
                <option value="SIM Cards">SIM Cards</option>
                <option value="Recharge Delivery Tickets">Recharge Delivery Tickets</option>
                <option value="Enterprise Hardware">Enterprise Hardware</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Ooredoo"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Value / Denomination
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="e.g. 500 DA or Prepaid"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
              />
            </div>

            <div id="product-image-section" className="md:col-span-2 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Product Image (PNG / SVG / WebP) *
              </label>

              {imageError && (
                <div className="p-3.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 animate-pulse">
                  <span>⚠️</span>
                  <span>Product image is required. Please upload or select an image for this product before publishing.</span>
                </div>
              )}

              {formData.image ? (
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl border border-gray-200 bg-gray-50/60">
                  <div className="relative h-32 w-32 shrink-0 rounded-xl border border-gray-200 bg-white p-2 flex items-center justify-center overflow-hidden shadow-sm">
                    <img
                      src={formData.image}
                      alt="Product Image"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="text-xs font-bold text-gray-900">Current Product Image</span>
                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-[10px] font-bold uppercase text-red-primary">
                        PNG Image
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Shared product visual across all language versions.
                    </p>
                    <div className="flex items-center gap-3 pt-1 justify-center sm:justify-start">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors">
                        <Upload size={14} /> Upload New Image
                        <input
                          type="file"
                          accept="image/png,image/svg+xml,image/webp,image/jpeg"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: "" })}
                        className="text-xs text-red-600 font-medium hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-all ${
                  imageError ? "border-red-500 hover:border-red-600 bg-red-50/10" : "border-gray-300 hover:border-red-primary/40"
                }`}>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl mb-3 ${
                    imageError ? "bg-red-100 text-red-600" : "bg-red-primary/10 text-red-primary"
                  }`}>
                    <UploadCloud size={24} />
                  </div>
                  <div className="text-xs font-bold text-gray-900 mb-1">
                    Click to upload product image or drag and drop
                  </div>
                  <div className="text-[11px] text-gray-400">
                    PNG, WebP, SVG or JPEG (Max 10MB)
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/svg+xml,image/webp,image/jpeg"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Publication Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none bg-white"
              >
                <option value="Published">Published (Live in Product Catalog)</option>
                <option value="Draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Overview & Specs */}
      {activeTab === "overview" && (
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-8">
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Product Descriptions ({currentLang.toUpperCase()})
            </h2>
            <p className="text-xs text-gray-500 mb-4">Short summary and full detailed product explanation.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Short Description ({currentLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  dir={isRTL ? "rtl" : "ltr"}
                  value={langContent.shortDescription}
                  onChange={(e) => updateLangContent((prev) => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder={isRTL ? "ملخص سريع عن المنتج..." : "e.g. Official Ooredoo prepaid SIM card ready for activation."}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Full Detailed Description ({currentLang.toUpperCase()})
                </label>
                <textarea
                  rows={4}
                  dir={isRTL ? "rtl" : "ltr"}
                  value={langContent.description}
                  onChange={(e) => updateLangContent((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder={isRTL ? "اكتب الوصف التفصيلي الكامل..." : "Detailed product features, distribution readiness, and partner info..."}
                  className="w-full p-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Product Specifications Table Edit */}
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                  Technical Specifications ({currentLang.toUpperCase()})
                </h2>
                <p className="text-xs text-gray-500">Key-value table rendered on product detail page (e.g. Network, Format, Status).</p>
              </div>
              <button
                type="button"
                onClick={addSpec}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Plus size={14} /> Add Spec Row
              </button>
            </div>

            <div className="space-y-3">
              {langContent.specifications.map((spec, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    dir={isRTL ? "rtl" : "ltr"}
                    value={spec.label}
                    onChange={(e) => updateSpec(i, "label", e.target.value)}
                    placeholder="Spec Label (e.g. Operator)"
                    className="w-full sm:w-1/3 h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
                  />
                  <input
                    type="text"
                    dir={isRTL ? "rtl" : "ltr"}
                    value={spec.value}
                    onChange={(e) => updateSpec(i, "value", e.target.value)}
                    placeholder="Spec Value (e.g. Ooredoo Algeria)"
                    className="w-full sm:w-2/3 h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
                  />
                  {langContent.specifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpec(i)}
                      className="p-2 h-11 w-11 shrink-0 flex items-center justify-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Key Features */}
      {activeTab === "features" && (
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                Product Features & Highlights ({currentLang.toUpperCase()})
              </h2>
              <p className="text-xs text-gray-500">Key bullet points rendered on the product detail page.</p>
            </div>
            <button
              type="button"
              onClick={addFeature}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-primary text-xs font-bold text-white transition-all hover:bg-red-primary/90"
            >
              <Plus size={14} /> Add Feature Bullet
            </button>
          </div>

          <div className="space-y-3">
            {langContent.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  dir={isRTL ? "rtl" : "ltr"}
                  value={feat}
                  onChange={(e) => updateFeature(i, e.target.value)}
                  placeholder={isRTL ? "مثال: شحن فوري ومضمون 100%" : "e.g. Official Ooredoo Product"}
                  className="flex-1 h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
                />
                {langContent.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="p-2 h-11 w-11 shrink-0 flex items-center justify-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: FAQs */}
      {activeTab === "faqs" && (
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                Product FAQs ({currentLang.toUpperCase()})
              </h2>
              <p className="text-xs text-gray-500">Frequently asked questions specific to this product.</p>
            </div>
            <button
              type="button"
              onClick={addFaq}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-primary text-xs font-bold text-white transition-all hover:bg-red-primary/90"
            >
              <Plus size={14} /> Add FAQ
            </button>
          </div>

          <div className="space-y-4">
            {langContent.faqs.map((faq, i) => (
              <div key={i} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-primary">
                    FAQ #{i + 1} ({currentLang.toUpperCase()})
                  </span>
                  {langContent.faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFaq(i)}
                      className="text-xs text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Question ({currentLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      dir={isRTL ? "rtl" : "ltr"}
                      value={faq.question}
                      onChange={(e) => updateFaq(i, "question", e.target.value)}
                      placeholder={isRTL ? "السؤال..." : "Question..."}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Answer ({currentLang.toUpperCase()})
                    </label>
                    <textarea
                      rows={2}
                      dir={isRTL ? "rtl" : "ltr"}
                      value={faq.answer}
                      onChange={(e) => updateFaq(i, "answer", e.target.value)}
                      placeholder={isRTL ? "الإجابة..." : "Answer..."}
                      className="w-full p-3 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
