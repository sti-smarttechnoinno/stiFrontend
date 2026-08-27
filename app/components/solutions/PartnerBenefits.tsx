"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Rocket, Package, Users, Handshake } from "lucide-react";
import { useTranslations } from '@/app/[locale]/use-translations';

const benefitIcons = [
  <TrendingUp key="1" size={24} />,
  <ShieldCheck key="2" size={24} />,
  <Rocket key="3" size={24} />,
  <Package key="4" size={24} />,
  <Users key="5" size={24} />,
  <Handshake key="6" size={24} />,
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function PartnerBenefits() {
  const t = useTranslations();
  const benT = t.solutionsPage?.benefits || {
    badge: "Why Partner With Us",
    title: "Partner Benefits",
    subtitle: "Everything you need to scale your distribution network and grow your telecom business across Algeria.",
    items: [],
  };

  return (
    <section className="py-28 lg:py-36 bg-gray-900 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C8102E 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Soft gradient blur circles */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-red-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-[1320px] px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-accent">
            {benT.badge}
          </span>
          <h2
            className="mb-4 text-3xl font-extrabold text-white lg:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {benT.title}
          </h2>
          <p className="mx-auto max-w-xl text-gray-400">
            {benT.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {benT.items.map((b, idx) => (
            <motion.div
              key={b.title}
              variants={item}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 hover:border-red-primary/30 hover:shadow-[0_12px_40px_rgba(200,16,46,0.15)]"
            >
              {/* Top Accent Line */}
              <div className="absolute left-0 top-0 h-[3px] w-0 bg-gradient-to-r from-red-primary to-red-accent transition-all duration-500 group-hover:w-full" />

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-primary/15 text-red-primary transition-all duration-300 group-hover:bg-red-primary group-hover:text-white group-hover:scale-110">
                {benefitIcons[idx % benefitIcons.length]}
              </div>
              <h3
                className="mb-3 text-lg font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {b.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                {b.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
