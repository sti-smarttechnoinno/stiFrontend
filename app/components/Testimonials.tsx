"use client";

import { Star, Quote } from "lucide-react";
import { useScrollReveal } from "../hooks";
import { useTranslations } from '@/app/[locale]/use-translations';

function TestimonialCard({ review, index }: { review: string; index: number }) {
  const { ref, visible } = useScrollReveal(0.2);

  return (
    <article
      ref={ref}
      className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)] hover:-translate-y-1 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Quote size={32} className="mb-4 text-red-primary/20" />

      <div className="mb-4 flex gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
        ))}
      </div>

      <p className="text-sm leading-relaxed text-gray-700 font-medium">
        &ldquo;{review}&rdquo;
      </p>
    </article>
  );
}

export default function Testimonials() {
  const { ref, visible } = useScrollReveal();
  const t = useTranslations();

  return (
    <section className="py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div
          ref={ref}
          className={`mb-16 text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {t.testimonials.badge}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            {t.testimonials.title}
          </h2>
          <p className="mx-auto max-w-xl text-gray-500">
            {t.testimonials.subtitle}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {t.testimonials.items.map((item, i) => (
            <TestimonialCard key={i} review={item.review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
