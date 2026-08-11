"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Award, Globe, Building2 } from "lucide-react";
import { useTranslations } from "../../[locale]/use-translations";

const certIcons = [
  <ShieldCheck key="1" size={24} />,
  <Award key="2" size={24} />,
  <Globe key="3" size={24} />,
  <Building2 key="4" size={24} />,
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Partnership() {
  const t = useTranslations();
  const partT = t.aboutPage.partnership;

  const [provincesCount, setProvincesCount] = useState("58");

  useEffect(() => {
    async function loadProvinces() {
      try {
        const res = await fetch("/api/preferences");
        if (res.ok) {
          const data = await res.json();
          if (data.statistics?.provincesServed) {
            setProvincesCount(data.statistics.provincesServed);
          }
        }
      } catch (err) {
        console.error("Failed to load provinces count on partnership card", err);
      }
    }
    loadProvinces();
  }, []);

  return (
    <section className="py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {partT.badge}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            {partT.title}
          </h2>
          <p className="mx-auto max-w-xl text-gray-500">
            {partT.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {partT.items.map((cert, idx) => {
            const formattedTitle = cert.title.replace("58", provincesCount);
            const formattedDesc = cert.description.replace("58", provincesCount);
            return (
              <motion.div
                key={cert.title}
                variants={item}
                className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(200,16,46,0.08)] hover:-translate-y-1"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-primary/8 text-red-primary transition-colors group-hover:bg-red-primary group-hover:text-white">
                  {certIcons[idx % certIcons.length]}
                </div>
                <h3 className="mb-2 text-base font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                  {formattedTitle}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {formattedDesc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
