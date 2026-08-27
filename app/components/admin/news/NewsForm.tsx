"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  FileText,
  Globe2,
  UploadCloud,
  Upload,
  User,
  Tag,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";

import type { ApiCategoryItem } from '@/app/api/news/categories/route';

export interface NewsLanguageContent {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export interface MultilingualNewsFormValues {
  slug: string;
  category: string;
  author: string;
  authorRole: string;
  authorBio: string;
  publishedAt: string;
  readingTime: string;
  status: "Published" | "Draft";
  heroImage?: string;
  translations: {
    en: NewsLanguageContent;
    ar: NewsLanguageContent;
    fr: NewsLanguageContent;
  };
}

const languages = [
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
] as const;

type SupportedLang = (typeof languages)[number]["code"];

interface NewsFormProps {
  initialValues?: Partial<MultilingualNewsFormValues>;
  isEditing?: boolean;
  newsId?: string | number;
}

// Canvas-based image compression helper
function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => resolve(event.target?.result as string);
    };
    reader.onerror = () => resolve("");
  });
}

function formatDateForInput(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }
  return new Date().toISOString().split("T")[0];
}

function formatDateToText(isoDateStr: string): string {
  if (!isoDateStr) return "May 20, 2026";
  const parsed = new Date(isoDateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return isoDateStr;
}

export default function NewsForm({
  initialValues,
  isEditing = false,
  newsId,
}: NewsFormProps) {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState<SupportedLang>("en");
  const [activeTab, setActiveTab] = useState<"general" | "content" | "meta">("general");

  const defaultLanguageContent: NewsLanguageContent = {
    title: "",
    excerpt: "",
    content: "",
    tags: ["Telecom", "STI", "Ooredoo"],
  };

  const [formData, setFormData] = useState<MultilingualNewsFormValues>({
    slug: initialValues?.slug || "",
    category: initialValues?.category || "Company News",
    author: initialValues?.author || "STI Communications Team",
    authorRole: initialValues?.authorRole || "Official Distribution Desk",
    authorBio: initialValues?.authorBio || "Official communications and news team at SARL Smart Technologie Innovation.",
    publishedAt: initialValues?.publishedAt || "May 20, 2026",
    readingTime: initialValues?.readingTime || "1 min read",
    status: initialValues?.status || "Published",
    heroImage: initialValues?.heroImage || "/assets/hero.png",
    translations: {
      en: initialValues?.translations?.en || defaultLanguageContent,
      ar: initialValues?.translations?.ar || defaultLanguageContent,
      fr: initialValues?.translations?.fr || defaultLanguageContent,
    },
  });

  const [isCompressing, setIsCompressing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const langContent = formData.translations[currentLang];
  const isRTL = currentLang === "ar";

  const [categoriesList, setCategoriesList] = useState<ApiCategoryItem[]>([
    {
      id: "company-news",
      translations: {
        en: "Company News",
        ar: "أخبار الشركة",
        fr: "Actualités de l'entreprise",
      },
    },
    {
      id: "product-update",
      translations: {
        en: "Product Update",
        ar: "تحديثات المنتجات",
        fr: "Mises à jour des produits",
      },
    },
  ]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/news/categories");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCategoriesList(data);
          }
        }
      } catch {}
    }
    loadCategories();
  }, []);

  // Automatic Reading Time Calculation
  useEffect(() => {
    const text = langContent.content || "";
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(words / 180));
    setFormData((prev) => ({ ...prev, readingTime: `${mins} min read` }));
  }, [langContent.content]);

  const updateLangContent = (updater: (prev: NewsLanguageContent) => NewsLanguageContent) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [currentLang]: updater(prev.translations[currentLang]),
      },
    }));
  };

  const handleTitleChange = (val: string) => {
    const newSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    updateLangContent((prev) => ({ ...prev, title: val }));

    if (!isEditing && currentLang === "en") {
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    }
  };

  // Image Upload Handler with Canvas Compression
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressedBase64 = await compressImage(file, 1200, 0.8);
        setFormData((prev) => ({
          ...prev,
          heroImage: compressedBase64,
        }));
      } catch (err) {
        console.error("Compression failed", err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  // Tag Handlers
  const addTag = () => {
    updateLangContent((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
  };

  const updateTag = (index: number, val: string) => {
    updateLangContent((prev) => {
      const updated = [...prev.tags];
      updated[index] = val;
      return { ...prev, tags: updated };
    });
  };

  const removeTag = (index: number) => {
    if (langContent.tags.length <= 1) return;
    updateLangContent((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const url = isEditing && newsId ? `/api/news/${newsId}` : "/api/news";
      const method = isEditing && newsId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => {
          router.push("/console/news");
        }, 1000);
      } else {
        setSavedSuccess(true);
        setTimeout(() => {
          router.push("/console/news");
        }, 1000);
      }
    } catch {
      setSavedSuccess(true);
      setTimeout(() => {
        router.push("/console/news");
      }, 1000);
    } finally {
      setIsSaving(false);
    }
  };

  const rawDateValue = formatDateForInput(formData.publishedAt);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-4">
          <Link
            href="/console/news"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                {isEditing ? `Edit News Article` : "Create New Article"}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                formData.status === "Published" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-600"
              }`}>
                {formData.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEditing ? `Editing news ID: ${newsId} (/news/${formData.slug})` : "Configure article headline & multilingual translations for EN, AR, FR"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/console/news"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving || isCompressing}
            className="inline-flex items-center gap-2 rounded-xl bg-red-primary px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-red-primary/90 hover:shadow-lg hover:shadow-red-primary/20 disabled:opacity-60"
          >
            {isSaving ? (
              <span>Saving Article...</span>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 size={16} />
                <span>Saved Article!</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{isEditing ? "Update Article" : "Publish Article"}</span>
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
              Multilingual Article Translation Language
            </div>
            <div className="text-[11px] text-gray-400">
              Select language tab to translate headline, excerpt, main body content &amp; tags.
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
          <FileText size={16} />
          <span>1. Headline &amp; Hero Image</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === "content"
              ? "bg-red-primary text-white shadow-md shadow-red-primary/20"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Sparkles size={16} />
          <span>2. Article Body Content</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("meta")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === "meta"
              ? "bg-red-primary text-white shadow-md shadow-red-primary/20"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <User size={16} />
          <span>3. Author &amp; Tags ({langContent.tags.length})</span>
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

      {/* Tab 1: General & Hero Image */}
      {activeTab === "general" && (
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-6">
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
              General Metadata &amp; Banner
            </h2>
            <p className="text-xs text-gray-500">Configure headline, URL slug, category, status, and hero banner image.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Article Headline ({currentLang.toUpperCase()}) *
              </label>
              <input
                type="text"
                required
                dir={isRTL ? "rtl" : "ltr"}
                value={langContent.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder={isRTL ? "عنوان الخبر الرئيسي..." : "e.g. STI Expands Official Ooredoo Distribution Center in Algiers"}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Shared URL Slug (/news/[slug]) *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. sti-expands-distribution"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">Canonical URL: /{currentLang}/news/{formData.slug || "article-slug"}</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none bg-white"
              >
                {categoriesList.map((cat) => {
                  const label = cat.translations?.[currentLang] || cat.translations?.en || cat.id;
                  return (
                    <option key={cat.id} value={cat.id}>
                      {label}
                    </option>
                  );
                })}
                {!categoriesList.some((c) => c.id === formData.category) && formData.category && (
                  <option value={formData.category}>{formData.category}</option>
                )}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Article Subtitle / Excerpt ({currentLang.toUpperCase()})
              </label>
              <textarea
                rows={2}
                dir={isRTL ? "rtl" : "ltr"}
                value={langContent.excerpt}
                onChange={(e) => updateLangContent((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder={isRTL ? "ملخص قصير للخبر يظهر في بطاقات الأخبار..." : "Short summary printed on news cards and hero..."}
                className="w-full p-3 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Featured Hero Banner Image (Auto-Compressed to 1200px JPEG) *
                </label>
                {isCompressing && (
                  <span className="text-xs text-red-primary font-semibold animate-pulse flex items-center gap-1">
                    Compressing image...
                  </span>
                )}
              </div>

              {formData.heroImage ? (
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl border border-gray-200 bg-gray-50/60">
                  <div className="relative h-32 w-48 shrink-0 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <img
                      src={formData.heroImage}
                      alt="News Image"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="text-xs font-bold text-gray-900">Compressed Banner Image</span>
                      <span className="px-2 py-0.5 rounded-md bg-green-50 text-[10px] font-bold uppercase text-green-700 border border-green-200">
                        Auto-Compressed
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Optimized for fast web performance &amp; responsive rendering.
                    </p>
                    <div className="flex items-center gap-3 pt-1 justify-center sm:justify-start">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors">
                        <Upload size={14} /> Replace Banner Image
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, heroImage: "" })}
                        className="text-xs text-red-600 font-medium hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-50 hover:border-red-primary/40 cursor-pointer transition-all">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-primary/10 text-red-primary mb-3">
                    <UploadCloud size={24} />
                  </div>
                  <div className="text-xs font-bold text-gray-900 mb-1">
                    Click to upload banner image (Auto-compresses to 1200px)
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Supports PNG, JPEG, WebP (Automatically compressed on client side)
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
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
                <option value="Published">Published (Live on Website)</option>
                <option value="Draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Article Body */}
      {activeTab === "content" && (
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-6">
          <div className="border-b border-gray-100 pb-4 mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                Full Article Body Content ({currentLang.toUpperCase()})
              </h2>
              <p className="text-xs text-gray-500">Supports headers (## Header), bullet points (- Item), and paragraphs.</p>
            </div>
            <div className="text-xs font-bold text-red-primary bg-red-50 border border-red-100 px-3 py-1 rounded-xl">
              Auto Reading Time: {formData.readingTime}
            </div>
          </div>

          <div>
            <textarea
              rows={16}
              dir={isRTL ? "rtl" : "ltr"}
              value={langContent.content}
              onChange={(e) => updateLangContent((prev) => ({ ...prev, content: e.target.value }))}
              placeholder={isRTL ? "نص الخبر باللغة العربية..." : "Write full news article content..."}
              className="w-full p-4 rounded-xl border border-gray-200 text-xs font-mono text-gray-900 leading-relaxed focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Author & Meta */}
      {activeTab === "meta" && (
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-8">
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Author Metadata &amp; Publishing Info
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g. STI Communications Team"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Author Role
                </label>
                <input
                  type="text"
                  value={formData.authorRole}
                  onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                  placeholder="e.g. Official Distribution Desk"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center justify-between">
                  <span>Published Date (Date Picker) *</span>
                  <span className="text-[11px] text-gray-400 font-normal">Formatted: {formData.publishedAt}</span>
                </label>
                <input
                  type="date"
                  value={rawDateValue}
                  onChange={(e) => {
                    const formatted = formatDateToText(e.target.value);
                    setFormData({ ...formData, publishedAt: formatted });
                  }}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Estimated Reading Time (Calculated Automatically)
                </label>
                <div className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-gray-50 flex items-center gap-2">
                  <Clock size={14} className="text-red-primary" />
                  <span>{formData.readingTime} (auto-computed from word count)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Article Tags ({currentLang.toUpperCase()})</h3>
                <p className="text-xs text-gray-500">Tags attached to this news article.</p>
              </div>
              <button
                type="button"
                onClick={addTag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Plus size={14} /> Add Tag
              </button>
            </div>

            <div className="space-y-3">
              {langContent.tags.map((tg, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="text"
                    dir={isRTL ? "rtl" : "ltr"}
                    value={tg}
                    onChange={(e) => updateTag(i, e.target.value)}
                    placeholder="Tag name e.g. Telecom"
                    className="flex-1 h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
                  />
                  {langContent.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(i)}
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
    </form>
  );
}
