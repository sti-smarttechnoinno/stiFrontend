"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  ArrowRight,
  Inbox,
  RotateCcw,
  FileCheck2,
  Loader2,
} from "lucide-react";

interface Job {
  id: number | string;
  title: string;
  slug?: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  salary: string;
  status?: string;
  translations?: Record<string, any>;
}

const labels = {
  en: {
    badge: "Open Positions",
    title: "Current Opportunities",
    subtitle: "Explore exciting career opportunities across our departments and build your future with STI.",
    searchPlaceholder: "Search positions by title, department, or location...",
    allDepts: "All Departments",
    allLocs: "All Locations",
    allTypes: "All Types",
    noJobsTitle: "No Open Positions Right Now",
    noJobsSub: "We currently don't have any published job openings. However, we are always looking for great talent! Feel free to send us your spontaneous application below.",
    noMatchesTitle: "No Matching Positions Found",
    noMatchesSub: "We couldn't find any job listings matching your selected search or filter criteria.",
    resetFilters: "Reset Search Filters",
    spontaneousCta: "Submit Spontaneous Application",
    applyNow: "Apply Now",
    loadingText: "Loading positions...",
  },
  ar: {
    badge: "الوظائف المتاحة",
    title: "فرص العمل الحالية",
    subtitle: "استكشف فرص العمل المميزة عبر أقسامنا وابنِ مستقبلك المهني مع شركة STI.",
    searchPlaceholder: "البحث عن وظيفة حسب المسمى الوظيفي، القسم، أو الموقع...",
    allDepts: "جميع الأقسام",
    allLocs: "جميع المواقع",
    allTypes: "جميع أنواع التوظيف",
    noJobsTitle: "لا توجد وظائف شاغرة حالياً",
    noJobsSub: "ليس لدينا أي وظائف مفتوحة معلنة في الوقت الحالي. ومع ذلك، نحن نسعى دائماً لاستقطاب الكفاءات! يمكنك تقديم طلب توظيف عريض عبر النموذج أدناه.",
    noMatchesTitle: "لم يتم العثور على نتائج مطابقة",
    noMatchesSub: "لم نتمكن من العثور على أية وظائف تطابق معايير التصفية التي حددتها.",
    resetFilters: "إعادة ضبط التصفية",
    spontaneousCta: "تقديم طلب توظيف عريض",
    applyNow: "قدّم الآن",
    loadingText: "جاري تحميل الوظائف...",
  },
  fr: {
    badge: "Postes Ouverts",
    title: "Opportunités Actuelles",
    subtitle: "Explorez des opportunités de carrière stimulantes au sein de nos départements et construisez votre avenir avec STI.",
    searchPlaceholder: "Rechercher par titre, département ou localisation...",
    allDepts: "Tous les départements",
    allLocs: "Toutes les localisations",
    allTypes: "Tous les types de contrat",
    noJobsTitle: "Aucune offre de poste pour le moment",
    noJobsSub: "Nous n'avons actuellement aucun poste ouvert publié. Cependant, nous sommes toujours à la recherche de talents ! N'hésitez pas à nous envoyer votre candidature spontanée ci-dessous.",
    noMatchesTitle: "Aucun résultat trouvé",
    noMatchesSub: "Aucune offre de poste ne correspond à vos critères de recherche actuels.",
    resetFilters: "Réinitialiser les filtres",
    spontaneousCta: "Candidature spontanée",
    applyNow: "Postuler",
    loadingText: "Chargement des opportunités...",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function JobSearch() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";
  const t = labels[currentLocale] || labels.en;

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs?status=Published", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setJobs(data.filter((j: Job) => j.status === "Published" || !j.status));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  // Compute dynamic filters based on actual job offers in state
  const availableDepartments = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      const val = j.translations?.[currentLocale]?.department || j.translations?.en?.department || j.department;
      if (val) set.add(val);
    });
    return [t.allDepts, ...Array.from(set)];
  }, [jobs, currentLocale, t.allDepts]);

  const availableLocations = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      const val = j.translations?.[currentLocale]?.location || j.translations?.en?.location || j.location;
      if (val) set.add(val);
    });
    return [t.allLocs, ...Array.from(set)];
  }, [jobs, currentLocale, t.allLocs]);

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.type) set.add(j.type);
    });
    return [t.allTypes, ...Array.from(set)];
  }, [jobs, t.allTypes]);

  // Set default filter state when options load
  useEffect(() => {
    if (!department || !availableDepartments.includes(department)) {
      setDepartment(t.allDepts);
    }
    if (!location || !availableLocations.includes(location)) {
      setLocation(t.allLocs);
    }
    if (!type || !availableTypes.includes(type)) {
      setType(t.allTypes);
    }
  }, [availableDepartments, availableLocations, availableTypes, t]);

  const handleResetFilters = () => {
    setSearch("");
    setDepartment(t.allDepts);
    setLocation(t.allLocs);
    setType(t.allTypes);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const jobTranslations = job.translations || {};
      const localized = jobTranslations[currentLocale] || jobTranslations.en || {};
      const title = localized.title || job.title || "";
      const dept = localized.department || job.department || "";
      const loc = localized.location || job.location || "";

      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        title.toLowerCase().includes(query) ||
        dept.toLowerCase().includes(query) ||
        loc.toLowerCase().includes(query);

      const matchesDept =
        department === t.allDepts ||
        department === "All Departments" ||
        dept === department ||
        job.department === department;

      const matchesLoc =
        location === t.allLocs ||
        location === "All Locations" ||
        loc === location ||
        job.location === location;

      const matchesType =
        type === t.allTypes ||
        type === "All Types" ||
        job.type === type;

      return matchesSearch && matchesDept && matchesLoc && matchesType;
    });
  }, [jobs, currentLocale, search, department, location, type, t]);

  return (
    <section id="positions" className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {t.badge}
          </span>
          <h2
            className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.title}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-500 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Filters bar - rendered only when jobs exist */}
        {jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 rtl:right-4 rtl:left-auto" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 rtl:pr-12 rtl:pl-4 py-3.5 rounded-full border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary shadow-sm"
              />
            </div>

            {/* Dynamic Filters */}
            <div className="grid sm:grid-cols-3 gap-4">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="px-4 py-3 rounded-full border border-gray-200 text-xs font-medium text-gray-700 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
              >
                {availableDepartments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-4 py-3 rounded-full border border-gray-200 text-xs font-medium text-gray-700 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
              >
                {availableLocations.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="px-4 py-3 rounded-full border border-gray-200 text-xs font-medium text-gray-700 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
              >
                {availableTypes.map((tp) => (
                  <option key={tp} value={tp}>
                    {tp}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* Content & Feedback States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
            <Loader2 size={28} className="animate-spin text-red-primary" />
            <span className="text-xs font-semibold">{t.loadingText}</span>
          </div>
        ) : jobs.length === 0 ? (
          /* Empty Feedback when no jobs exist at all */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-gray-50/70 border border-gray-200/80 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-primary/10 text-red-primary flex items-center justify-center mx-auto mb-5 border border-red-primary/20">
              <Inbox size={28} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-display)" }}>
              {t.noJobsTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6">
              {t.noJobsSub}
            </p>
            <a
              href="#apply"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-primary text-white text-xs font-bold rounded-full hover:bg-red-primary/90 transition-all hover:shadow-lg hover:shadow-red-primary/20"
            >
              <FileCheck2 size={16} />
              <span>{t.spontaneousCta}</span>
            </a>
          </motion.div>
        ) : filteredJobs.length === 0 ? (
          /* Feedback when filter returned 0 matches */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-gray-50/70 border border-gray-200/80 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-200/60 text-gray-500 flex items-center justify-center mx-auto mb-5">
              <Search size={28} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-display)" }}>
              {t.noMatchesTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6">
              {t.noMatchesSub}
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-full hover:bg-gray-100 hover:text-gray-900 transition-all shadow-sm"
            >
              <RotateCcw size={14} />
              <span>{t.resetFilters}</span>
            </button>
          </motion.div>
        ) : (
          /* Job Cards Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            key={`${search}-${department}-${location}-${type}`}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredJobs.map((job) => {
              const jobDept = job.translations?.[currentLocale]?.department || job.translations?.en?.department || job.department;
              const jobTitle = job.translations?.[currentLocale]?.title || job.translations?.en?.title || job.title;
              const jobDesc = job.translations?.[currentLocale]?.description || job.translations?.en?.description || job.description;
              const jobLoc = job.translations?.[currentLocale]?.location || job.translations?.en?.location || job.location;
              const jobExp = job.translations?.[currentLocale]?.experience || job.translations?.en?.experience || job.experience;
              const jobSal = job.translations?.[currentLocale]?.salary || job.translations?.en?.salary || job.salary;

              return (
                <motion.div
                  key={job.id}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden bg-white rounded-3xl p-7 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(200,16,46,0.08)] flex flex-col justify-between"
                >
                  {/* Red top accent line on hover */}
                  <div className="absolute left-0 top-0 h-[3px] w-0 bg-red-primary transition-all duration-500 group-hover:w-full" />

                  <div>
                    {/* Department Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-primary/10 text-xs font-semibold text-red-primary mb-4">
                      <Briefcase size={12} />
                      {jobDept}
                    </div>

                    {/* Title */}
                    <h3
                      className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-primary transition-colors duration-300"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {jobTitle}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
                      {jobDesc}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{jobLoc}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase size={12} />
                        <span>{jobExp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Salary & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-xs font-bold text-green-600">{jobSal}</span>
                    <a
                      href="#apply"
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-primary transition-colors hover:text-red-accent"
                    >
                      <span>{t.applyNow}</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
