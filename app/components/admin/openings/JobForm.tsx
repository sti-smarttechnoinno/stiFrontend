"use client";

import { useState, FormEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Globe2,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  FileText,
  Loader2,
} from "lucide-react";

export interface JobLanguageContent {
  title: string;
  description: string;
  department: string;
  location: string;
  experience: string;
  salary: string;
}

export interface MultilingualJobFormValues {
  slug: string;
  type: string;
  status: "Published" | "Draft";
  translations: {
    en: JobLanguageContent;
    ar: JobLanguageContent;
    fr: JobLanguageContent;
  };
}

const languages = [
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
] as const;

type SupportedLang = (typeof languages)[number]["code"];

const employmentTypes = [
  { value: "Full-time", en: "Full-time", ar: "دوام كامل (Full-time)", fr: "Temps plein (Full-time)" },
  { value: "Part-time", en: "Part-time", ar: "دوام جزئي (Part-time)", fr: "Temps partiel (Part-time)" },
  { value: "Contract", en: "Contract", ar: "عقد عمل (Contract)", fr: "Contrat (Contract)" },
];

interface JobFormProps {
  initialValues?: any;
  isEditing?: boolean;
  jobId?: string | number;
}

export default function JobForm({
  initialValues,
  isEditing = false,
  jobId,
}: JobFormProps) {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState<SupportedLang>("en");

  const [formData, setFormData] = useState<MultilingualJobFormValues>({
    slug: initialValues?.slug || "",
    type: initialValues?.type || "Full-time",
    status: initialValues?.status || "Published",
    translations: {
      en: {
        title: initialValues?.translations?.en?.title || initialValues?.title || "",
        description: initialValues?.translations?.en?.description || initialValues?.description || "",
        department: initialValues?.translations?.en?.department || initialValues?.department || "",
        location: initialValues?.translations?.en?.location || initialValues?.location || "",
        experience: initialValues?.translations?.en?.experience || initialValues?.experience || "2-4 years",
        salary: initialValues?.translations?.en?.salary || initialValues?.salary || "Competitive",
      },
      ar: {
        title: initialValues?.translations?.ar?.title || "",
        description: initialValues?.translations?.ar?.description || "",
        department: initialValues?.translations?.ar?.department || "",
        location: initialValues?.translations?.ar?.location || "",
        experience: initialValues?.translations?.ar?.experience || "2-4 سنوات",
        salary: initialValues?.translations?.ar?.salary || "راتب تنافسي",
      },
      fr: {
        title: initialValues?.translations?.fr?.title || "",
        description: initialValues?.translations?.fr?.description || "",
        department: initialValues?.translations?.fr?.department || "",
        location: initialValues?.translations?.fr?.location || "",
        experience: initialValues?.translations?.fr?.experience || "2-4 ans",
        salary: initialValues?.translations?.fr?.salary || "Compétitif",
      },
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const langContent = formData.translations[currentLang];
  const isRTL = currentLang === "ar";

  const updateLangContent = (updater: (prev: JobLanguageContent) => JobLanguageContent) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [currentLang]: updater(prev.translations[currentLang]),
      },
    }));
  };

  const handleTitleChange = (val: string) => {
    updateLangContent((prev) => ({ ...prev, title: val }));
    if (fieldErrors[`title_${currentLang}`]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[`title_${currentLang}`];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.translations.en.title.trim()) {
      errors.title_en = "English title is required (as fallback)";
    }
    if (!formData.translations.en.description.trim()) {
      errors.description_en = "English description is required (as fallback)";
    }
    if (!formData.translations.en.department.trim()) {
      errors.department_en = "English department is required (as fallback)";
    }
    if (!formData.translations.en.location.trim()) {
      errors.location_en = "English location is required (as fallback)";
    }

    // Check other locales if they have values but are partially empty
    const otherLocales: ("ar" | "fr")[] = ["ar", "fr"];
    for (const loc of otherLocales) {
      const tVal = formData.translations[loc];
      if ((tVal.title.trim() && !tVal.description.trim()) || (!tVal.title.trim() && tVal.description.trim())) {
        if (!tVal.title.trim()) {
          errors[`title_${loc}`] = `${loc.toUpperCase()} title is required when description is set`;
        }
        if (!tVal.description.trim()) {
          errors[`description_${loc}`] = `${loc.toUpperCase()} description is required when title is set`;
        }
      }
    }

    setFieldErrors(errors);

    if (errors.title_en || errors.description_en || errors.department_en || errors.location_en) {
      setCurrentLang("en");
    } else {
      // Switch to the first other tab that has errors
      for (const loc of otherLocales) {
        if (errors[`title_${loc}`] || errors[`description_${loc}`]) {
          setCurrentLang(loc);
          break;
        }
      }
    }

    return Object.keys(errors).length === 0;
  };

  const isFormValid = true;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const url = isEditing && jobId ? `/api/jobs/${jobId}` : "/api/jobs";
      const method = isEditing && jobId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: formData.slug || formData.translations.en.title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"),
          type: formData.type,
          status: formData.status,
          department: formData.translations.en.department,
          location: formData.translations.en.location,
          experience: formData.translations.en.experience,
          salary: formData.translations.en.salary,
          translations: formData.translations,
          title: formData.translations.en.title,
          description: formData.translations.en.description,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => {
          router.push("/console/openings");
        }, 1200);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          setServerError(data.errors.join(". "));
        } else {
          setServerError(data.error || "Something went wrong. Please try again.");
        }
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
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
            href="/console/openings"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                {isEditing ? "Edit Job Offer" : "Create New Job Offer"}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                formData.status === "Published" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-600"
              }`}>
                {formData.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEditing ? `Editing job ID: ${jobId}` : "Configure job details & multilingual translations for EN, AR, FR"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/console/openings"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-red-primary px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-red-primary/90 hover:shadow-lg hover:shadow-red-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 size={16} />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{isEditing ? "Update Job Offer" : "Publish Job Offer"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">Save failed</p>
            <p className="mt-0.5">{serverError}</p>
          </div>
        </div>
      )}

      {/* Language Switcher Bar */}
      <div className="bg-slate-900 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-2">
          <Globe2 size={20} className="text-red-400" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-200">
              Multilingual Job Translation Language
            </div>
            <div className="text-[11px] text-gray-400">
              Select language tab to translate job title &amp; description.
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

      {/* Active Language Banner */}
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

      {/* Job Details - Shared Fields */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-6">
        <div className="border-b border-gray-100 pb-4 mb-4">
          <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Job Details
          </h2>
          <p className="text-xs text-gray-500">Shared fields visible across all languages.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title (per language) */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Job Title ({currentLang.toUpperCase()}) *
            </label>
            <input
              type="text"
              required
              dir={isRTL ? "rtl" : "ltr"}
              value={langContent.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={
                currentLang === "ar"
                  ? "مثال: ممثل مبيعات"
                  : currentLang === "fr"
                  ? "ex: Représentant Commercial"
                  : "e.g. Sales Representative"
              }
              className={`w-full h-11 px-4 rounded-xl border text-xs font-medium text-gray-900 outline-none ${
                fieldErrors[`title_${currentLang}`]
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10"
              }`}
            />
            {fieldErrors[`title_${currentLang}`] && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />
                {fieldErrors[`title_${currentLang}`]}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "Published" | "Draft" })}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none bg-white"
            >
              <option value="Published">Published (Visible on Careers Page)</option>
              <option value="Draft">Draft (Hidden)</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              <Building2 size={12} className="text-gray-400" /> Department ({currentLang.toUpperCase()}) *
            </label>
            <input
              type="text"
              required
              dir={isRTL ? "rtl" : "ltr"}
              value={langContent.department}
              onChange={(e) => {
                updateLangContent((prev) => ({ ...prev, department: e.target.value }));
                if (fieldErrors[`department_${currentLang}`]) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next[`department_${currentLang}`];
                    return next;
                  });
                }
              }}
              placeholder={
                currentLang === "ar"
                  ? "مثال: المبيعات"
                  : currentLang === "fr"
                  ? "ex: Ventes"
                  : "e.g. Sales"
              }
              className={`w-full h-11 px-4 rounded-xl border text-xs font-medium text-gray-900 outline-none ${
                fieldErrors[`department_${currentLang}`]
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10"
              }`}
            />
            {fieldErrors[`department_${currentLang}`] && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />
                {fieldErrors[`department_${currentLang}`]}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              <MapPin size={12} className="text-gray-400" /> Location ({currentLang.toUpperCase()}) *
            </label>
            <input
              type="text"
              required
              dir={isRTL ? "rtl" : "ltr"}
              value={langContent.location}
              onChange={(e) => {
                updateLangContent((prev) => ({ ...prev, location: e.target.value }));
                if (fieldErrors[`location_${currentLang}`]) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next[`location_${currentLang}`];
                    return next;
                  });
                }
              }}
              placeholder={
                currentLang === "ar"
                  ? "مثال: الجزائر العاصمة"
                  : currentLang === "fr"
                  ? "ex: Alger"
                  : "e.g. Algiers"
              }
              className={`w-full h-11 px-4 rounded-xl border text-xs font-medium text-gray-900 outline-none ${
                fieldErrors[`location_${currentLang}`]
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10"
              }`}
            />
            {fieldErrors[`location_${currentLang}`] && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />
                {fieldErrors[`location_${currentLang}`]}
              </p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              <Briefcase size={12} className="text-gray-400" /> Employment Type *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none bg-white"
            >
              {employmentTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t[currentLang]}
                </option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              <Clock size={12} className="text-gray-400" /> Experience Level ({currentLang.toUpperCase()})
            </label>
            <input
              type="text"
              value={langContent.experience}
              onChange={(e) => updateLangContent((prev) => ({ ...prev, experience: e.target.value }))}
              placeholder={
                currentLang === "ar"
                  ? "مثال: 2-4 سنوات"
                  : currentLang === "fr"
                  ? "ex: 2-4 ans"
                  : "e.g. 2-4 years"
              }
              className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              <DollarSign size={12} className="text-gray-400" /> Salary / Compensation ({currentLang.toUpperCase()})
            </label>
            <input
              type="text"
              value={langContent.salary}
              onChange={(e) => updateLangContent((prev) => ({ ...prev, salary: e.target.value }))}
              placeholder={
                currentLang === "ar"
                  ? "مثال: راتب تنافسي"
                  : currentLang === "fr"
                  ? "ex: Compétitif / Négociable"
                  : "e.g. Competitive"
              }
              className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Translated Content */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-6">
        <div className="border-b border-gray-100 pb-4 mb-4">
          <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Job Description ({currentLang.toUpperCase()})
          </h2>
          <p className="text-xs text-gray-500">Describe the role, responsibilities, and requirements.</p>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            <FileText size={12} className="text-gray-400" /> Description ({currentLang.toUpperCase()})
          </label>
          <textarea
            rows={8}
            required
            dir={isRTL ? "rtl" : "ltr"}
            value={langContent.description}
            onChange={(e) => {
              updateLangContent((prev) => ({ ...prev, description: e.target.value }));
              if (fieldErrors[`description_${currentLang}`]) {
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next[`description_${currentLang}`];
                  return next;
                });
              }
            }}
            placeholder={
              currentLang === "ar"
                ? "وصف الوظيفة والمسؤوليات والمهام المطلوبة..."
                : currentLang === "fr"
                ? "Décrivez le rôle, les responsabilités et les missions du candidat..."
                : "Describe the role, responsibilities, and what the candidate will be doing..."
            }
            className={`w-full p-4 rounded-xl border text-xs font-medium text-gray-900 leading-relaxed outline-none ${
              fieldErrors[`description_${currentLang}`]
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-200 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10"
            }`}
          />
          {fieldErrors[`description_${currentLang}`] && (
            <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle size={11} />
              {fieldErrors[`description_${currentLang}`]}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
