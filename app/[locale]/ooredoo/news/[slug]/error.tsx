"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NewsDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("News detail page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-primary border border-red-100">
            <AlertTriangle size={28} />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-sm text-gray-500">
            We couldn&apos;t load this article. Please try again.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-gray-400 font-mono">Error: {error.digest}</p>
          )}
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-red-primary text-white text-xs font-bold hover:bg-red-primary/90 transition-all"
          >
            Try again
          </button>
          <Link
            href="/en/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-bold hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={14} />
            Back to News
          </Link>
        </div>
      </div>
    </div>
  );
}
