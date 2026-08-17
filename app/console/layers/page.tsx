"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Layers, Loader2, CheckCircle2 } from "lucide-react";

interface SolutionItem {
  id: number;
  slug: string;
  status: string;
  image?: string;
  updated_at?: string;
  translations?: {
    en?: { name?: string; shortName?: string };
    ar?: { name?: string; shortName?: string };
    fr?: { name?: string; shortName?: string };
  };
}

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<SolutionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchSolutions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/solutions");
      if (res.ok) {
        const data = await res.json();
        setSolutions(data);
      }
    } catch {
      // Keep state as is
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this solution layer?")) return;
    setDeletingId(id);

    try {
      await fetch(`/api/solutions/${id}`, { method: "DELETE" });
      setSolutions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // Failed to delete
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSolutions = solutions.filter((sol) => {
    const title = sol.translations?.en?.name || sol.translations?.en?.shortName || sol.slug;
    return (title || "").toLowerCase().includes(searchTerm.toLowerCase()) || (sol.slug || "").toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Solution Layers
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage, edit, and create solution pages dynamically from backend database.
          </p>
        </div>
        <Link
          href="/console/layers/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-primary text-white text-xs font-bold rounded-xl hover:bg-red-primary/90 transition-all hover:shadow-lg hover:shadow-red-primary/20"
        >
          <Plus size={16} />
          Add Solution Layer
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search solutions by title or slug..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary"
            />
          </div>

          <div className="text-xs font-bold text-gray-500">
            Total Layers: <span className="text-red-primary font-bold">{filteredSolutions.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="animate-spin text-red-primary" />
            <span className="text-xs font-semibold">Loading solution layers from DB...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-700">
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Solution Title (EN)</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">URL Slug</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Last Updated</th>
                  <th className="text-right py-3 px-4 font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSolutions.map((solution) => {
                  const title = solution.translations?.en?.name || solution.translations?.en?.shortName || solution.slug;
                  return (
                    <tr key={solution.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-primary border border-red-100">
                            <Layers size={16} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{title}</div>
                            <div className="text-[10px] text-gray-400">ID #{solution.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">/solutions/{solution.slug}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            solution.status === "Published"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          <CheckCircle2 size={12} />
                          {solution.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                        {solution.updated_at
                          ? new Date(solution.updated_at).toLocaleDateString()
                          : "Recently"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/console/layers/${solution.id}/edit`}
                            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            title="Edit solution layer"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(solution.id)}
                            disabled={deletingId === solution.id}
                            className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Delete solution layer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}