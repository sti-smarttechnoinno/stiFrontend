"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from '@/app/[locale]/use-translations';
import type { TeamMember } from '@/app/api/team/route';

const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Leadership() {
  const t = useTranslations();
  const leadT = t.aboutPage.leadership;
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTeamMembers(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching team members:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const displayMembers = teamMembers;

  return (
    <section className="py-24 lg:py-32 bg-gray-50/70">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {leadT.badge}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            {leadT.title}
          </h2>
          <p className="mx-auto max-w-xl text-gray-500">
            {leadT.subtitle}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayMembers.map((person, idx) => {
            const tr = person.translations?.[currentLocale];
            const name = tr?.name || person.name;
            const position = tr?.position || person.position;

            const initials =
              person.initials ||
              (name ? name.split(" ").map((n: string) => n[0]).join("").slice(0, 2) : "TM");

            const hasLinkedin = Boolean(person.linkedin && person.linkedin.trim() !== "" && person.linkedin !== "#");

            return (
              <article
                key={person.id || person.name || idx}
                className="group relative flex flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-red-primary/30 hover:shadow-[0_12px_36px_rgba(215,25,32,0.06)] hover:-translate-y-1"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {person.image ? (
                      <img
                        src={person.image}
                        alt={name}
                        className="h-14 w-14 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-primary/10 text-red-primary font-bold text-base shrink-0 border border-red-primary/20">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-gray-900 truncate" style={{ fontFamily: "var(--font-display)" }}>
                        {name}
                      </h3>
                      <div className="text-xs font-semibold text-red-primary truncate mt-0.5">{position}</div>
                    </div>
                  </div>

                  {hasLinkedin && (
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`LinkedIn profile of ${name}`}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400 transition-colors hover:bg-red-primary hover:text-white"
                    >
                      <LinkedinIcon />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
