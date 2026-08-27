"use client";

import { motion } from "framer-motion";
import { useTranslations } from '@/app/[locale]/use-translations';

export default function Timeline() {
  const t = useTranslations();
  const timelineT = t.aboutPage.timeline;

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
            {timelineT.badge}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            {timelineT.title}
          </h2>
        </motion.div>

        {/* Desktop — Horizontal */}
        <div className="hidden lg:block">
          <div className="relative max-w-4xl mx-auto">
            {/* Line */}
            <div className="absolute left-[12.5%] right-[12.5%] top-[38px] h-[2px] bg-gradient-to-r from-red-primary/20 via-red-primary/40 to-red-primary/20" />

            <div className="flex justify-between">
              {timelineT.milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex flex-col items-center text-center px-2"
                >
                  {/* Dot */}
                  <div className="relative z-10 mb-6 flex h-[76px] w-[76px] items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-md">
                    <span className="text-lg font-extrabold text-red-primary" style={{ fontFamily: "var(--font-display)" }}>
                      {m.year}
                    </span>
                  </div>
                  <h3 className="mb-2 text-base font-bold text-gray-900 text-center" style={{ fontFamily: "var(--font-display)" }}>
                    {m.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-500 text-center">
                    {m.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile — Vertical */}
        <div className="lg:hidden">
          <div className="relative ml-4 rtl:ml-0 rtl:mr-4 border-l-2 rtl:border-l-0 rtl:border-r-2 border-red-primary/20 pl-8 rtl:pl-0 rtl:pr-8">
            {timelineT.milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative mb-10 last:mb-0"
              >
                {/* Dot */}
                <div className="absolute -left-[42px] rtl:-left-auto rtl:-right-[42px] flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm">
                  <span className="text-xs font-extrabold text-red-primary">{m.year}</span>
                </div>
                <h3 className="mb-1 text-base font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                  {m.title}
                </h3>
                <p className="text-sm text-gray-500">{m.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
