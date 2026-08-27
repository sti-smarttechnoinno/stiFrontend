"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Smartphone, Building2, Zap, Wallet, ShieldCheck, Headphones, Users, Package } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from '@/app/[locale]/use-translations';
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import { selectAllSolutions, selectSolutionsLoading, setSolutions, setSolutionsLoading } from "../../lib/store/features/solutionsSlice";

const iconMap: Record<string, React.ReactNode> = {
  Wallet: <Wallet size={24} />,
  Zap: <Zap size={24} />,
  ShieldCheck: <ShieldCheck size={24} />,
  Smartphone: <Smartphone size={24} />,
  Building2: <Building2 size={24} />,
  Headphones: <Headphones size={24} />,
  Users: <Users size={24} />,
  Package: <Package size={24} />,
};

const defaultIcons = [
  <Smartphone key="1" size={24} />,
  <Zap key="2" size={24} />,
  <Building2 key="3" size={24} />,
  <Wallet key="4" size={24} />,
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function SolutionsGrid() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const dispatch = useAppDispatch();
  const apiSolutions = useAppSelector(selectAllSolutions);
  const loading = useAppSelector(selectSolutionsLoading);

  useEffect(() => {
    // If store is empty, fetch once and populate Redux
    if (apiSolutions.length === 0) {
      async function fetchApiSolutions() {
        try {
          dispatch(setSolutionsLoading(true));
          const res = await fetch("/api/solutions");
          if (res.ok) {
            const data = await res.json();
            const publishedOnly = Array.isArray(data)
              ? data.filter((s) => !s.status || s.status === "Published")
              : [];
            dispatch(setSolutions(publishedOnly));
          }
        } catch {
        } finally {
          dispatch(setSolutionsLoading(false));
        }
      }
      fetchApiSolutions();
    }
  }, [apiSolutions.length, dispatch]);

  const gridT = t.solutionsPage?.grid || {
    badge: "Our Solutions",
    title: "Reliable Distribution Solutions",
    subtitle: "Professional distribution solutions designed for retailers, wholesalers, and business partners across Algeria.",
    learn_more: "Learn More",
  };

  const displayItems = apiSolutions.map((sol) => {
    const langData = sol.translations?.[currentLocale] || sol.translations?.en;
    const title = langData?.shortName || langData?.name || sol.slug;
    const description = langData?.description?.[0] || langData?.name || "Official STI Ooredoo Distribution Solution";
    return {
      slug: sol.slug,
      title,
      description,
      icon: iconMap[sol.slug] || null,
    };
  });

  return (
    <section id="solutions-grid" className="py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-[700px] text-center mb-16"
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {gridT.badge}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            {gridT.title}
          </h2>
          <p className="text-gray-500 leading-relaxed">
            {gridT.subtitle}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col h-[280px] animate-pulse"
              >
                <div className="mb-5 h-14 w-14 rounded-2xl bg-gray-100" />
                <div className="mb-3 h-5 w-3/5 rounded bg-gray-200" />
                <div className="space-y-2 mb-6 flex-1">
                  <div className="h-3.5 w-full rounded bg-gray-100" />
                  <div className="h-3.5 w-5/6 rounded bg-gray-100" />
                  <div className="h-3.5 w-4/6 rounded bg-gray-100" />
                </div>
                <div className="mt-auto h-4 w-28 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {displayItems.map((s, idx) => (
              <motion.article
                key={s.slug || s.title}
                variants={item}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(200,16,46,0.08)] hover:-translate-y-1 flex flex-col h-full"
              >
                {/* Red accent line */}
                <div className="absolute left-0 top-0 h-[3px] w-0 bg-red-primary transition-all duration-500 group-hover:w-full" />

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-primary/8 text-red-primary transition-colors group-hover:bg-red-primary group-hover:text-white">
                  {s.icon || defaultIcons[idx % defaultIcons.length]}
                </div>

                <Link href={`/${currentLocale}/ooredoo/solutions/${s.slug}`} className="hover:text-red-primary transition-colors">
                  <h3 className="mb-3 text-lg font-bold text-gray-900 transition-colors group-hover:text-red-primary" style={{ fontFamily: "var(--font-display)" }}>
                    {s.title}
                  </h3>
                </Link>

                <p
                  className="mb-6 text-sm leading-relaxed text-gray-500 line-clamp-3 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {s.description}
                </p>

                <Link
                  href={`/${currentLocale}/ooredoo/solutions/${s.slug}`}
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-red-primary transition-colors hover:text-red-accent"
                >
                  {gridT.learn_more || "Learn More"}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
