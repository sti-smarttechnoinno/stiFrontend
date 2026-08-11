"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useTranslations } from "../../[locale]/use-translations";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Testimonials() {
  const t = useTranslations();
  const testT = t.testimonials;

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
            {testT.badge}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            {testT.title}
          </h2>
          <p className="mx-auto max-w-xl text-gray-500">
            {testT.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-3"
        >
          {testT.items.map((tItem, i) => (
            <motion.article
              key={i}
              variants={item}
              className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)] hover:-translate-y-1"
            >
              <Quote size={32} className="mb-4 text-red-primary/20" />
              <div className="mb-4 flex gap-0.5">
                {[0, 1, 2, 3, 4].map((starIndex) => (
                  <Star key={starIndex} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-gray-700 font-medium">
                &ldquo;{tItem.review}&rdquo;
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
