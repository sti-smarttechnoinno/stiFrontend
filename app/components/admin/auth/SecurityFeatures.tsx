"use client";

import { ShieldCheck, ChartNoAxesCombined, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: ShieldCheck,
    label: "Secure",
    text: "Your data is always protected",
  },
  {
    icon: ChartNoAxesCombined,
    label: "Reliable",
    text: "High performance and uptime",
  },
  {
    icon: Users,
    label: "Manage",
    text: "Everything from one place",
  },
];

export default function SecurityFeatures() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="relative z-10 flex items-center gap-3 w-full"
    >
      {features.map((f) => (
        <div
          key={f.label}
          className="flex-1 flex items-center gap-2.5 px-3 py-3 rounded-xl border border-gray-100 bg-white/60"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D71920]/[0.06] text-[#D71920]">
            <f.icon size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-gray-900 leading-tight">{f.label}</p>
            <p className="text-[10px] text-gray-400 leading-tight truncate">{f.text}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
