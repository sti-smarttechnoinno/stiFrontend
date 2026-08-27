"use client";

import { motion } from "framer-motion";
import { ClipboardList, FileText, BadgeDollarSign, Handshake } from "lucide-react";
import { useTranslations } from '@/app/[locale]/use-translations';

const stepIcons = [ClipboardList, FileText, BadgeDollarSign, Handshake];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function QuoteProcess() {
  const t = useTranslations();
  const processT = t.quote.process;

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {processT.badge}
          </span>
          <h2
            className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {processT.title}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-500">
            {processT.subtitle}
          </p>
        </motion.div>

        {/* Process Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-red-primary/30 to-transparent" />

          {/* Connecting Line - Mobile */}
          <div className="lg:hidden absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-red-primary/30 to-transparent" />

          {processT.steps.map((step, index) => {
            const IconComponent = stepIcons[index] || ClipboardList;
            return (
              <motion.div
                key={step.title}
                variants={cardVariants}
                className="relative group"
              >
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
                  {/* Number Badge */}
                  <div className="absolute -top-5 left-8 rtl:left-auto rtl:right-8 w-10 h-10 bg-red-primary rounded-full flex items-center justify-center shadow-lg shadow-red-primary/25">
                    <span className="text-sm font-bold text-white">{step.number || `0${index + 1}`}</span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-red-primary/10 rounded-2xl flex items-center justify-center mb-6 mt-4 transition-colors duration-300 group-hover:bg-red-primary/15">
                    <IconComponent size={28} className="text-red-primary" />
                  </div>

                  {/* Content */}
                  <h3
                    className="text-lg font-bold text-gray-900 mb-3"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}