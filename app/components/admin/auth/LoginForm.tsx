"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  function validate(): boolean {
    const errs: { username?: string; password?: string } = {};
    if (!username.trim()) {
      errs.username = "Please enter your username.";
    }
    if (!password) {
      errs.password = "Please enter your password.";
    } else if (password.length < 4) {
      errs.password = "Password must contain at least 4 characters.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email: username, password, rememberMe }),
      });
      if (!res.ok) {
        setError("Invalid username or password. Please try again.");
        setIsLoading(false);
        return;
      }
      router.push("/console");
    } catch {
      setError("Invalid username or password. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col justify-between h-full p-8 sm:p-10 lg:p-12 bg-white"
    >
      <div>
        {/* Header Block */}
        <div className="mb-8">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            Admin Sign In
          </span>
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sign in to <span className="text-red-primary">Console</span>
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your username and password to access the STI dashboard.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700"
          >
            <ShieldCheck size={18} className="shrink-0 text-red-primary" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
            >
              Username
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username)
                    setFieldErrors((p) => ({ ...p, username: undefined }));
                }}
                className={`w-full h-12 rounded-xl border bg-white pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all ${
                  fieldErrors.username
                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-gray-200 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10"
                }`}
              />
            </div>
            {fieldErrors.username && (
              <p className="mt-1.5 text-xs text-red-500">{fieldErrors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password)
                    setFieldErrors((p) => ({ ...p, password: undefined }));
                }}
                className={`w-full h-12 rounded-xl border bg-white pl-11 pr-11 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all ${
                  fieldErrors.password
                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-gray-200 focus:border-red-primary focus:ring-2 focus:ring-red-primary/10"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1.5 text-xs text-red-500">{fieldErrors.password}</p>
            )}
          </div>

          {/* Remember me */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-red-primary focus:ring-red-primary/20 accent-[#C8102E]"
              />
              <span className="text-xs text-gray-600">Remember me on this device</span>
            </label>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="group inline-flex w-full h-12 items-center justify-center gap-2 rounded-full bg-red-primary px-6 text-sm font-semibold text-white transition-all duration-250 hover:bg-red-primary/90 hover:shadow-lg hover:shadow-red-primary/25 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <span>© {new Date().getFullYear()} STI</span>
        <span>Official Ooredoo Distributor</span>
      </div>
    </motion.div>
  );
}
