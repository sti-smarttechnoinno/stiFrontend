"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldCheck, Users, Globe, Award } from "lucide-react";

export default function LoginBranding() {
  const highlights = [
    { icon: <ShieldCheck size={18} />, title: "Official Certification", desc: "Authorized Ooredoo distributor" },
    { icon: <Users size={18} />, title: "Enterprise Management", desc: "Comprehensive client operations" },
    { icon: <Globe size={18} />, title: "Nationwide Logistics", desc: "Coverage across all 58 Wilayas" },
    { icon: <Award size={18} />, title: "Encrypted Portal", desc: "Bank-grade administrative security" },
  ];

  return (
    <div className="relative flex flex-col justify-between h-full p-8 sm:p-10 lg:p-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-red-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: STI & Ooredoo Logos */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between gap-4 mb-8"
      >
        <Image
          src="/assets/logo.png"
          alt="STI - Smart Technologie Innovation"
          width={150}
          height={50}
          className="h-10 w-auto object-contain"
          priority
        />
        <Image
          src="/assets/ooredoo-logo.svg"
          alt="Ooredoo Logo"
          width={100}
          height={35}
          className="h-8 w-auto object-contain"
        />
      </motion.div>

      {/* Middle Welcome & Intro */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative z-10 my-auto py-6"
      >
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-primary mb-3">
          Admin Control Center
        </span>

        <h1
          className="text-3xl font-extrabold text-gray-900 mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Welcome Back to <span className="text-red-primary">STI</span>
        </h1>

        <p className="text-sm leading-relaxed text-gray-500 max-w-md mb-8">
          Access the internal management console to handle telecom distribution, inventory, business requests, and platform settings.
        </p>

        {/* Feature List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-primary/8 text-red-primary">
                {item.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                  {item.title}
                </div>
                <div className="text-[11px] text-gray-500 leading-tight mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer Branding Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative z-10 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400"
      >
        <span>SARL Smart Technologie Innovation</span>
        <span className="font-semibold text-gray-600">Algeria</span>
      </motion.div>
    </div>
  );
}
