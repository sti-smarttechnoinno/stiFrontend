"use client";

import { useEffect, useState } from "react";
import { Briefcase, Users, Handshake, MapPin, ThumbsUp } from "lucide-react";
import { useScrollReveal } from "../hooks";
import { useTranslations } from '@/app/[locale]/use-translations';

const icons = [<Briefcase size={24} key="b" />, <Users size={24} key="u" />, <Handshake size={24} key="h" />, <MapPin size={24} key="m" />, <ThumbsUp size={24} key="t" />];

function StatCard({ icon, title, label }: { icon: React.ReactNode; title: string; label: string }) {
  const { ref, visible } = useScrollReveal(0.3);

  return (
    <div
      ref={ref}
      className={`group flex flex-col items-center justify-start h-full rounded-2xl bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(200,16,46,0.08)] hover:-translate-y-1 text-center ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-primary/8 text-red-primary transition-colors group-hover:bg-red-primary group-hover:text-white shrink-0">
        {icon}
      </div>
      <div className="flex flex-col items-center justify-start flex-1 w-full space-y-2">
        <h3 className="text-base sm:text-lg font-extrabold text-gray-900 text-center leading-snug" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 text-center leading-relaxed">{label}</p>
      </div>
    </div>
  );
}

export default function Statistics() {
  const { ref, visible } = useScrollReveal();
  const t = useTranslations();

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
        console.error("Failed to load provinces count on homepage stats", err);
      }
    }
    loadProvinces();
  }, []);

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-gray-50">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div
          ref={ref}
          className={`mb-16 text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            {t.statistics.title}
          </h2>
          <p className="mx-auto max-w-xl text-gray-500">
            {t.statistics.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 items-stretch">
          {t.statistics.items.map((s, i) => {
            const formattedTitle = s.title.replace("58", provincesCount);
            return (
              <StatCard key={s.title} icon={icons[i]} title={formattedTitle} label={s.label} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
