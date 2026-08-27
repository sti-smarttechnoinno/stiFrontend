"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Smartphone, Headphones, Sparkles, ArrowRight } from "lucide-react";

const CARDS = [
  { icon: Smartphone, title: "Smartphones", text: "Des modèles innovants au design épuré et premium." },
  { icon: Sparkles, title: "Nouveautés", text: "Les dernières séries et innovations VIVO à découvrir." },
];

export function VivoSection() {
  const params = useParams();
  const currentLocale = (params?.locale as string) || "fr";

  return (
    <section id="produits-vivo" aria-labelledby="vivo-heading" className="py-20 sm:py-28 bg-gray-50/60">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-6 lg:px-8 lg:grid-cols-2 lg:gap-16">
        {/* Visual — first on desktop for editorial alternation */}
        <div className="relative order-last overflow-hidden rounded-[24px] border border-gray-200/80 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] lg:order-first">
          <Image
            src="/assets/vivo-smartphones.png"
            alt="Smartphones VIVO premium présentés sur un piédestal blanc avec accessoires"
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
        </div>

        {/* Text + cards */}
        <div>
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-[#5f8dff]">
            Production &amp; Distribution
          </span>
          <h2
            id="vivo-heading"
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            VIVO : smartphones et technologie mobile
          </h2>
          <p className="mt-4 max-w-md text-base text-gray-500 leading-relaxed">
            Découvrez les smartphones VIVO et les dernières innovations mobiles disponibles auprès de STI.
          </p>

          <ul className="mt-8 space-y-3.5">
            {CARDS.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4.5 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#5f8dff]/40 hover:shadow-[0_8px_32px_rgba(95,141,255,0.12)] hover:-translate-y-0.5"
              >
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5f8dff]/10 text-[#5f8dff] transition-colors group-hover:bg-[#5f8dff] group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3
                    className="text-base font-bold text-gray-900 transition-colors group-hover:text-[#5f8dff]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href={`/${currentLocale}/vivo`}
            className="group mt-9 inline-flex items-center gap-2 rounded-full bg-[#102039] px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-[#1a335a] hover:shadow-[0_8px_24px_rgba(16,32,57,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#102039]"
          >
            Explorer la gamme VIVO
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
