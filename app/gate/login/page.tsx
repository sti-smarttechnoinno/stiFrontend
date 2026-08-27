"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import LoginBranding from '@/app/components/admin/auth/LoginBranding';
import LoginForm from '@/app/components/admin/auth/LoginForm';

export default function AdminLoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) {
          router.replace("/console");
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 border-2 border-red-primary border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold text-gray-400">Loading Portal...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white hero-gradient flex items-center justify-center p-4 sm:p-6 lg:p-10">
      {/* Background pattern matching main site pages */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C8102E 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Soft gradient circles matching Hero page */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-red-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-red-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[1180px] z-10"
      >
        {/* Mobile Header Branding */}
        <div className="lg:hidden flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <Image
            src="/assets/logo.png"
            alt="STI"
            width={120}
            height={40}
            className="h-8 w-auto object-contain"
          />
          <span className="text-xs font-bold text-red-primary uppercase tracking-widest">
            Admin Portal
          </span>
        </div>

        {/* Card wrapper */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_40px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[640px]">
            {/* Left Branding Panel */}
            <div className="lg:w-[48%] relative">
              <LoginBranding />
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-[52%] flex flex-col bg-white">
              <LoginForm />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} SARL Smart Technologie Innovation. Official Ooredoo Distributor in Algeria.</p>
        </div>
      </motion.div>
    </div>
  );
}
