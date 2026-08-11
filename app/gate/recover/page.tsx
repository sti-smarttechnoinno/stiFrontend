"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setIsLoading(false);
  }

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6">
      {/* Subtle decorative red dotted patterns */}
      <div
        className="fixed top-0 left-0 w-64 h-64 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #D71920 1.5px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #D71920 1.5px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[480px]"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_2px_40px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="px-10 py-12 sm:px-12">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#D71920] rounded-xl flex items-center justify-center shadow-lg shadow-[#D71920]/20">
                <span className="text-white text-xs font-black tracking-wider">STI</span>
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                  STI Admin
                </p>
              </div>
            </div>

            {sent ? (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h2
                  className="text-[26px] font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Check your email
                </h2>
                <p className="text-[14px] text-gray-500 leading-relaxed mb-8">
                  We&apos;ve sent password reset instructions to{" "}
                  <span className="font-medium text-gray-700">{email}</span>.
                  Please check your inbox.
                </p>
                <Link
                  href="/gate"
                  className="inline-flex items-center gap-2 text-[14px] font-medium text-[#D71920] hover:text-[#B81419] transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to Sign In
                </Link>
              </motion.div>
            ) : (
              /* Form State */
              <>
                <div className="text-center mb-8">
                  <h2
                    className="text-[26px] font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Reset your password
                  </h2>
                  <p className="text-[14px] text-gray-500">
                    Enter your email address and we&apos;ll send you instructions to reset your password.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700"
                  >
                    <ShieldCheck size={16} className="shrink-0" />
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="reset-email"
                      className="block text-[13px] font-medium text-gray-700 mb-1.5"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        id="reset-email"
                        type="email"
                        autoComplete="email"
                        placeholder="admin@sti-dz.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError("");
                        }}
                        className="w-full h-[52px] rounded-[10px] border border-gray-300 bg-white pl-10 pr-4 text-[14px] text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#D71920] focus:ring-[0_0_0_3px_rgba(215,25,32,0.08)]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full h-[52px] items-center justify-center gap-2 rounded-[10px] bg-[#D71920] text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#B81419] hover:shadow-lg hover:shadow-[#D71920]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    href="/gate"
                    className="inline-flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Back to Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[12px] text-gray-400">
            © 2026 STI - Smart Technologie Innovation. All rights reserved.
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Official{" "}
            <span className="text-[#D71920] font-semibold">Ooredoo</span>{" "}
            Distributor in Algeria
          </p>
        </div>
      </motion.div>
    </div>
  );
}
