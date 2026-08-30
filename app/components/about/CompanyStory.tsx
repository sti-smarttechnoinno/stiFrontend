"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "../../hooks";
import Image from "next/image";
import { useTranslations } from '@/app/[locale]/use-translations';

export default function CompanyStory() {
  const { ref, visible } = useScrollReveal();
  const t = useTranslations();
  const storyT = t.aboutPage.story;

  return (
    <section className="py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid gap-12 lg:grid-cols-2 items-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Left — Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl w-full h-[280px] sm:h-[400px] lg:h-[500px]">
              <Image
                src="/assets/hero.webp"
                alt="STI office and team"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={95}
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-3xl bg-red-primary/5 -z-10" />
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-3xl bg-red-primary/8 -z-10" />
          </div>

          {/* Right — Content */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary"
            >
              {storyT.badge}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 text-3xl font-extrabold text-gray-900 lg:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {storyT.title}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 text-gray-500 leading-relaxed"
            >
              <p>{storyT.p1}</p>
              <p>{storyT.p2}</p>
              <p>{storyT.p3}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
