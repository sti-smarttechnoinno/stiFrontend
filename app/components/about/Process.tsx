"use client";

import { motion } from "framer-motion";
import { MessageSquare, Search, Rocket, LifeBuoy } from "lucide-react";
import { useTranslations } from '@/app/[locale]/use-translations';

const stepIcons = [
  <MessageSquare key="1" size={22} />,
  <Search key="2" size={22} />,
  <Rocket key="3" size={22} />,
  <LifeBuoy key="4" size={22} />,
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Process() {
  const t = useTranslations();
  const procT = t.aboutPage.process;

  return (
    <section className="py-28 lg:py-36 bg-gray-50">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {procT.badge}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            {procT.title}
          </h2>
          <p className="mx-auto max-w-xl text-gray-500">
            {procT.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Timeline Connector Line */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-red-primary/20 via-red-primary/40 to-red-primary/20" />

          {procT.steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={item}
              className="relative flex flex-col items-center text-center z-10"
            >
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-100 bg-white text-red-primary shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                  {stepIcons[i % stepIcons.length]}
                </div>
                <span className="absolute -right-2 -top-2 rtl:-right-auto rtl:-left-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-primary text-[11px] font-bold text-white">
                  {step.num || `0${i + 1}`}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                {step.title}
              </h3>
              <p className="max-w-[220px] text-sm text-gray-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
