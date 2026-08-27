"use client";

import { motion } from "framer-motion";
import { Award, Truck, Tag, Users } from "lucide-react";
import { useTranslations } from '@/app/[locale]/use-translations';

const advantageIcons = [Award, Truck, Tag, Users];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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

export default function PartnerAdvantages() {
  const t = useTranslations();
  const advT = t.quote.advantages;

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
            {advT.badge}
          </span>
          <h2
            className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {advT.title}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-500">
            {advT.subtitle}
          </p>
        </motion.div>

        {/* Advantages Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {advT.items.map((advantage, index) => {
            const IconComponent = advantageIcons[index] || Award;
            return (
              <motion.div
                key={advantage.title}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-200"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-red-primary/10 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-red-primary group-hover:shadow-lg group-hover:shadow-red-primary/25">
                  <IconComponent
                    size={28}
                    className="text-red-primary transition-colors duration-300 group-hover:text-white"
                  />
                </div>

                {/* Content */}
                <h3
                  className="text-lg font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {advantage.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {advantage.description}
                </p>

                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-2 h-2 bg-red-primary/20 rounded-full transition-all duration-300 group-hover:bg-red-primary/40 group-hover:scale-150" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}