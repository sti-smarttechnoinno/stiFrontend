"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, Handshake, MapPin, ThumbsUp } from "lucide-react";
import { useTranslations } from "../../[locale]/use-translations";

const statIcons = [
  <Briefcase key="1" size={24} />,
  <Users key="2" size={24} />,
  <Handshake key="3" size={24} />,
  <MapPin key="4" size={24} />,
  <ThumbsUp key="5" size={24} />,
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Statistics() {
  const t = useTranslations();
  const statsT = t.statistics;
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
        console.error("Failed to load provinces count on about page stats", err);
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
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            {statsT.title}
          </h2>
          <p className="mx-auto max-w-xl text-gray-500">
            {statsT.subtitle}
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 items-stretch"
        >
          {statsT.items.map((s, idx) => {
            const formattedTitle = s.title.replace("58", provincesCount);
            return (
              <motion.div
                key={s.title}
                variants={item}
                className="group flex flex-col items-center justify-start h-full rounded-3xl bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(200,16,46,0.08)] hover:-translate-y-1 text-center"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-primary/8 text-red-primary transition-colors group-hover:bg-red-primary group-hover:text-white shrink-0">
                  {statIcons[idx % statIcons.length]}
                </div>
                <div className="flex flex-col items-center justify-start flex-1 w-full space-y-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 text-center leading-snug" style={{ fontFamily: "var(--font-display)" }}>
                    {formattedTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 text-center leading-relaxed">{s.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
