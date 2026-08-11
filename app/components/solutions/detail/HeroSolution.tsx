"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "../../../[locale]/use-translations";

interface Props {
  badge: string;
  title: string;
  description: string[];
  highlights?: string[];
  illustration: "recharge" | "sim" | "wholesale" | "retail" | "partnership" | "support";
}

function Illustration({ type }: { type: Props["illustration"] }) {
  const configs: Record<string, React.ReactNode> = {
    recharge: (
      <svg viewBox="0 0 500 500" fill="none" className="w-full h-full" aria-hidden="true">
        <g opacity="0.08"><circle cx="250" cy="250" r="180" stroke="#D71920" strokeWidth="1" strokeDasharray="4 6" fill="none" /></g>
        <rect x="140" y="150" width="100" height="160" rx="14" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <rect x="152" y="168" width="30" height="22" rx="4" fill="#D71920" opacity="0.2" />
        <line x1="152" y1="210" x2="228" y2="210" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="152" y1="230" x2="210" y2="230" stroke="#E5E7EB" strokeWidth="0.5" />
        <text x="190" y="265" textAnchor="middle" fill="#D71920" fontSize="11" fontWeight="bold">OOREDOO</text>
        <text x="190" y="282" textAnchor="middle" fill="#6B7280" fontSize="8">RECHARGE</text>
        <rect x="270" y="170" width="100" height="70" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <rect x="282" y="182" width="30" height="10" rx="3" fill="#D71920" opacity="0.3" />
        <line x1="282" y1="205" x2="358" y2="205" stroke="#E5E7EB" strokeWidth="0.5" />
        <line x1="282" y1="218" x2="340" y2="218" stroke="#E5E7EB" strokeWidth="0.5" />
        <text x="320" y="235" textAnchor="middle" fill="#6B7280" fontSize="7">1000 DA</text>
        <rect x="270" y="260" width="100" height="70" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <rect x="282" y="272" width="30" height="10" rx="3" fill="#D71920" opacity="0.25" />
        <text x="320" y="325" textAnchor="middle" fill="#6B7280" fontSize="7">500 DA</text>
        <rect x="270" y="350" width="100" height="70" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <rect x="282" y="362" width="30" height="10" rx="3" fill="#D71920" opacity="0.2" />
        <text x="320" y="405" textAnchor="middle" fill="#6B7280" fontSize="7">200 DA</text>
        <g opacity="0.12">
          <circle cx="120" cy="350" r="30" stroke="#D71920" strokeWidth="1" strokeDasharray="3 5" fill="none" />
          <text x="120" y="355" textAnchor="middle" fill="#D71920" fontSize="8">DZ</text>
        </g>
        <circle cx="200" cy="420" r="2" fill="#D71920" opacity="0.2">
          <animate attributeName="opacity" values="0.1;0.35;0.1" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="380" cy="150" r="2" fill="#D71920" opacity="0.15">
          <animate attributeName="opacity" values="0.05;0.25;0.05" dur="4s" begin="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    sim: (
      <svg viewBox="0 0 500 500" fill="none" className="w-full h-full" aria-hidden="true">
        <g opacity="0.08"><circle cx="250" cy="250" r="180" stroke="#D71920" strokeWidth="1" strokeDasharray="4 6" fill="none" /></g>
        <g>
          <rect x="160" y="100" width="120" height="180" rx="16" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
          <rect x="172" y="118" width="36" height="28" rx="5" fill="#D71920" opacity="0.2" />
          <path d="M172 160 h96" stroke="#E5E7EB" strokeWidth="0.8" />
          <path d="M172 180 h96" stroke="#E5E7EB" strokeWidth="0.5" />
          <text x="220" y="215" textAnchor="middle" fill="#D71920" fontSize="12" fontWeight="bold">OOREDOO</text>
          <text x="220" y="235" textAnchor="middle" fill="#6B7280" fontSize="8">PREPAID SIM</text>
          <circle cx="252" cy="265" r="12" stroke="#D71920" strokeWidth="1" fill="none" opacity="0.3" />
          <text x="252" y="269" textAnchor="middle" fill="#D71920" fontSize="7">4G</text>
        </g>
        <g>
          <rect x="300" y="130" width="100" height="140" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
          <rect x="310" y="145" width="28" height="20" rx="4" fill="#D71920" opacity="0.15" />
          <text x="350" y="210" textAnchor="middle" fill="#6B7280" fontSize="7">MINI SIM</text>
        </g>
        <g>
          <rect x="100" y="320" width="100" height="140" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
          <rect x="110" y="335" width="28" height="20" rx="4" fill="#D71920" opacity="0.15" />
          <text x="150" y="400" textAnchor="middle" fill="#6B7280" fontSize="7">NANO SIM</text>
        </g>
        <g opacity="0.1">
          <rect x="230" y="340" width="140" height="100" rx="10" fill="#D71920" opacity="0.05" />
          <text x="300" y="395" textAnchor="middle" fill="#D71920" fontSize="9" fontWeight="bold">58 PROVINCES</text>
          <text x="300" y="415" textAnchor="middle" fill="#6B7280" fontSize="7">COVERAGE</text>
        </g>
        <circle cx="420" cy="300" r="2" fill="#D71920" opacity="0.2">
          <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    wholesale: (
      <svg viewBox="0 0 500 500" fill="none" className="w-full h-full" aria-hidden="true">
        <g opacity="0.08"><circle cx="250" cy="250" r="180" stroke="#D71920" strokeWidth="1" strokeDasharray="4 6" fill="none" /></g>
        <rect x="80" y="200" width="200" height="140" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <rect x="95" y="215" width="50" height="35" rx="4" fill="#D71920" opacity="0.08" />
        <rect x="155" y="215" width="50" height="35" rx="4" fill="#D71920" opacity="0.06" />
        <rect x="215" y="215" width="50" height="35" rx="4" fill="#D71920" opacity="0.08" />
        <rect x="95" y="260" width="50" height="35" rx="4" fill="#D71920" opacity="0.06" />
        <rect x="155" y="260" width="50" height="35" rx="4" fill="#D71920" opacity="0.08" />
        <rect x="215" y="260" width="50" height="35" rx="4" fill="#D71920" opacity="0.06" />
        <rect x="95" y="305" width="50" height="25" rx="4" fill="#D71920" opacity="0.04" />
        <rect x="155" y="305" width="50" height="25" rx="4" fill="#D71920" opacity="0.04" />
        <rect x="215" y="305" width="50" height="25" rx="4" fill="#D71920" opacity="0.04" />
        <rect x="320" y="240" width="120" height="80" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <path d="M340 260 L370 250 L400 265 L420 255" stroke="#D71920" strokeWidth="1.5" fill="none" opacity="0.3" />
        <rect x="340" y="285" width="30" height="15" rx="3" fill="#D71920" opacity="0.1" />
        <rect x="380" y="285" width="30" height="15" rx="3" fill="#D71920" opacity="0.08" />
        <rect x="340" y="310" width="70" height="2" rx="1" fill="#E5E7EB" />
        <rect x="340" y="318" width="50" height="2" rx="1" fill="#E5E7EB" />
      </svg>
    ),
    retail: (
      <svg viewBox="0 0 500 500" fill="none" className="w-full h-full" aria-hidden="true">
        <g opacity="0.08"><circle cx="250" cy="250" r="180" stroke="#D71920" strokeWidth="1" strokeDasharray="4 6" fill="none" /></g>
        <rect x="120" y="160" width="260" height="180" rx="14" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <path d="M120 210 L250 160 L380 210" stroke="#D71920" strokeWidth="1" fill="#D71920" opacity="0.05" />
        <rect x="150" y="230" width="60" height="80" rx="6" fill="#D71920" opacity="0.08" />
        <rect x="230" y="230" width="60" height="80" rx="6" fill="#D71920" opacity="0.06" />
        <rect x="310" y="230" width="40" height="80" rx="6" stroke="#E5E7EB" strokeWidth="1" />
        <circle cx="330" cy="270" r="4" fill="#D71920" opacity="0.3" />
      </svg>
    ),
    partnership: (
      <svg viewBox="0 0 500 500" fill="none" className="w-full h-full" aria-hidden="true">
        <g opacity="0.08"><circle cx="250" cy="250" r="180" stroke="#D71920" strokeWidth="1" strokeDasharray="4 6" fill="none" /></g>
        <rect x="120" y="180" width="120" height="140" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <rect x="260" y="180" width="120" height="140" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <path d="M220 250 H280" stroke="#D71920" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="250" cy="250" r="16" fill="#D71920" opacity="0.1" />
        <path d="M244 250 L256 250 M250 244 L250 256" stroke="#D71920" strokeWidth="1.5" />
      </svg>
    ),
    support: (
      <svg viewBox="0 0 500 500" fill="none" className="w-full h-full" aria-hidden="true">
        <g opacity="0.08"><circle cx="250" cy="250" r="180" stroke="#D71920" strokeWidth="1" strokeDasharray="4 6" fill="none" /></g>
        <circle cx="250" cy="230" r="70" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <path d="M210 230 C210 200 290 200 290 230 C290 250 250 250 250 270" stroke="#D71920" strokeWidth="2" fill="none" />
        <circle cx="250" cy="285" r="3" fill="#D71920" />
      </svg>
    ),
  };
  return configs[type] || configs.recharge;
}

export default function HeroSolution({ badge, title, description, highlights, illustration }: Props) {
  const pathname = usePathname();
  const t = useTranslations();
  const currentLocale = pathname.split("/")[1] || "en";

  const checklist = highlights && highlights.length > 0 ? highlights : [
    "Official Ooredoo Product Distribution",
    "Continuous Stock & Fast Processing",
    "58 Provinces Coverage across Algeria",
    "Dedicated Partner Support Team"
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32">
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D71920 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-label="Breadcrumb"
          className="mb-6 sm:mb-8"
        >
          <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <li>
              <Link href={`/${currentLocale}`} className="transition-colors hover:text-red-primary">
                {(t as any).solutionDetail?.home || t.nav?.home || "Home"}
              </Link>
            </li>
            <li>
              <ChevronRight size={12} />
            </li>
            <li>
              <Link href={`/${currentLocale}/solutions`} className="transition-colors hover:text-red-primary">
                {(t as any).solutionDetail?.solutions || t.nav?.solutions || "Solutions"}
              </Link>
            </li>
            <li>
              <ChevronRight size={12} />
            </li>
            <li className="text-gray-700 truncate max-w-[200px] sm:max-w-none">{title}</li>
          </ol>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="max-w-[600px] mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="mb-3 sm:mb-4 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
                {badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-5 sm:mb-6 text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.15] tracking-tight text-gray-900"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {description.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-base sm:text-lg leading-relaxed text-gray-600 ${
                    index > 0 ? "mt-4" : ""
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mb-8 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 sm:gap-x-8"
            >
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                  <Check size={16} className="shrink-0 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4"
            >
              <Link
                href={`/${currentLocale}/contact`}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-red-primary px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-red-primary/20 transition-all duration-300 hover:bg-red-primary/90 hover:shadow-xl hover:shadow-red-primary/25 hover:scale-[1.03]"
              >
                {(t as any).solutionDetail?.become_partner || "Become a Partner"}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Link>
              <Link
                href={`/${currentLocale}/contact`}
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-gray-200 bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md hover:scale-[1.03]"
              >
                {(t as any).solutionDetail?.contact_sales || "Contact Sales"}
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex items-center justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[500px] lg:max-w-[650px] aspect-square mx-auto lg:mx-0 lg:-ml-6">
              <Illustration type={illustration} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
