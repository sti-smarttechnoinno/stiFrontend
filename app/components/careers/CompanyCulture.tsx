"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, Users, Award, TrendingUp } from "lucide-react";

export default function CompanyCulture() {
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const [provincesCount, setProvincesCount] = useState("58");

  useEffect(() => {
    async function loadPrefs() {
      try {
        const res = await fetch("/api/preferences");
        if (res.ok) {
          const data = await res.json();
          if (data?.statistics?.provincesServed) {
            setProvincesCount(data.statistics.provincesServed);
          }
        }
      } catch {}
    }
    loadPrefs();
  }, []);

  const staticT = {
    en: {
      badge: "Company Culture",
      title: "Life at STI",
      description: "At STI, we believe our people are our greatest strength. We foster collaboration, continuous learning, and a culture of excellence while supporting our partners across Algeria.",
      provincesLabel: "Provinces Covered",
      expertVal: "Expert",
      teamLabel: "Professional Team",
      officialVal: "100%",
      officialLabel: "Official Distributor",
      growingVal: "Growing",
      presenceLabel: "Nationwide Presence",
    },
    ar: {
      badge: "ثقافة الشركة",
      title: "الحياة في STI",
      description: "في STI، نؤمن بأن فريق العمل هو قوتنا الحقيقية. نحن نشجع التعاون، التعلم المستمر، وثقافة التميز أثناء تقديم أفضل الخدمات لشركائنا عبر الجزائر.",
      provincesLabel: "ولاية مغطاة",
      expertVal: "خبرة عالية",
      teamLabel: "فريق عمل احترافي",
      officialVal: "100%",
      officialLabel: "موزع رسمي معتمد",
      growingVal: "نمو مستمر",
      presenceLabel: "تغطية وطنية شاملة",
    },
    fr: {
      badge: "Culture d'Entreprise",
      title: "La Vie chez STI",
      description: "Chez STI, nous croyons que nos collaborateurs sont notre plus grande force. Nous encourageons la collaboration, la formation continue et une culture d'excellence.",
      provincesLabel: "Wilayas Couvertes",
      expertVal: "Expert",
      teamLabel: "Équipe Professionnelle",
      officialVal: "100%",
      officialLabel: "Distributeur Officiel",
      growingVal: "En Croissance",
      presenceLabel: "Présence Nationale",
    },
  }[currentLocale] || {
    badge: "Company Culture",
    title: "Life at STI",
    description: "At STI, we believe our people are our greatest strength. We foster collaboration, continuous learning, and a culture of excellence while supporting our partners across Algeria.",
    provincesLabel: "Provinces Covered",
    expertVal: "Expert",
    teamLabel: "Professional Team",
    officialVal: "100%",
    officialLabel: "Official Distributor",
    growingVal: "Growing",
    presenceLabel: "Nationwide Presence",
  };

  const stats = [
    { icon: MapPin, value: provincesCount, label: staticT.provincesLabel },
    { icon: Users, value: staticT.expertVal, label: staticT.teamLabel },
    { icon: Award, value: staticT.officialVal, label: staticT.officialLabel },
    { icon: TrendingUp, value: staticT.growingVal, label: staticT.presenceLabel },
  ];

  return (
    <section className="py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-[650px] aspect-square mx-auto lg:mx-0">
              <Image
                src="/assets/company-culture.webp"
                alt="Life at STI - Company Culture"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
              {staticT.badge}
            </span>
            <h2
              className="mb-6 text-3xl font-extrabold text-gray-900 lg:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {staticT.title}
            </h2>
            <p className="text-gray-500 text-base lg:text-lg leading-relaxed mb-10">
              {staticT.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-primary/10 rounded-2xl flex items-center justify-center shrink-0 text-red-primary">
                    <stat.icon size={22} />
                  </div>
                  <div>
                    <div
                      className="text-xl font-extrabold text-gray-900"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}