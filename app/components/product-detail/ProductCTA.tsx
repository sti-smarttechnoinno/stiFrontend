"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProductCTA() {
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";

  return (
    <section id="quote" className="py-20 sm:py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-red-primary rounded-3xl p-10 sm:p-14 lg:p-16 text-center relative overflow-hidden shadow-xl shadow-red-primary/20"
        >
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ready to Order Official Ooredoo Products?
            </h2>
            <p className="text-sm sm:text-base text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get competitive wholesale pricing and reliable product availability for your business across Algeria.
            </p>
            <Link
              href={`/${currentLocale}/ooredoo/quote`}
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-semibold text-red-primary transition-all duration-300 hover:shadow-xl hover:scale-[1.03]"
            >
              Request a Quote
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}