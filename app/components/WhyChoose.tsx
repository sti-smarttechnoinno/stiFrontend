"use client";

import { ShieldCheck, Package, Truck, Percent, Handshake, Headphones } from "lucide-react";
import { useScrollReveal } from "../hooks";
import { useTranslations } from '@/app/[locale]/use-translations';

const icons = [<ShieldCheck size={24} />, <Package size={24} />, <Truck size={24} />, <Percent size={24} />, <Handshake size={24} />, <Headphones size={24} />];

function FeatureCard({ icon, title, description, index }: { icon: React.ReactNode; title: string; description: string; index: number }) {
  const { ref, visible } = useScrollReveal(0.2);

  return (
    <div
      ref={ref}
      className={`group transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(200,16,46,0.1)]">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-primary/20 text-red-primary transition-colors group-hover:bg-red-primary group-hover:text-white">
          {icon}
        </div>
        <h3 className="mb-3 text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function WhyChoose() {
  const { ref, visible } = useScrollReveal();
  const t = useTranslations();

  return (
    <section className="py-28 lg:py-36 bg-gray-900">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div
          ref={ref}
          className={`mb-16 text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-accent">
            {t.whyChoose.badge}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-white lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            {t.whyChoose.title}
          </h2>
          <p className="mx-auto max-w-xl text-gray-400">
            {t.whyChoose.subtitle}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.whyChoose.items.map((f, i) => (
            <FeatureCard key={f.title} icon={icons[i]} title={f.title} description={f.description} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
