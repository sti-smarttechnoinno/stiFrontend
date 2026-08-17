"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Briefcase,
  CheckCircle2,
  Loader2,
  MapPin,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";

interface Job {
  id: number | string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  salary: string;
  status: string;
  translations?: Record<string, any>;
}

const departments = ["Sales", "Distribution", "Warehouse", "Customer Support", "Marketing", "Administration"];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("All");
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const res = await fetch("/api/jobs", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setJobs(data);
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number | string) {
    if (!confirm("Are you sure you want to delete this job offer?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => String(j.id) !== String(id)));
      }
    } catch {
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleStatus(id: number | string, currentStatus: string) {
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (String(j.id) === String(id) ? { ...j, status: newStatus } : j))
        );
      }
    } catch {}
  }

  const filteredJobs = jobs.filter((job) => {
    const title = job.translations?.en?.title || job.title || "";
    const department = job.translations?.en?.department || job.department || "";
    const location = job.translations?.en?.location || job.location || "";
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !query ||
      (title || "").toLowerCase().includes(query) ||
      (department || "").toLowerCase().includes(query) ||
      (location || "").toLowerCase().includes(query);

    const matchesDept =
      selectedDeptFilter === "All" ||
      department === selectedDeptFilter ||
      job.department === selectedDeptFilter;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Job Offers Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create, edit, publish, and manage career opportunities for your team.
          </p>
        </div>

        <Link
          href="/console/openings/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-primary text-white text-xs font-bold rounded-xl hover:bg-red-primary/90 transition-all hover:shadow-lg hover:shadow-red-primary/20"
        >
          <Plus size={16} />
          Add Job Offer
        </Link>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
            <div className="relative max-w-sm w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs by title, department or location..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary"
              />
            </div>

            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:border-red-primary bg-white"
            >
              <option value="All">All Departments ({jobs.length})</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs font-bold text-gray-500 shrink-0">
            Total Jobs: <span className="text-red-primary font-bold">{filteredJobs.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="animate-spin text-red-primary" />
            <span className="text-xs font-semibold">Loading job offers from database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-700">
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Job Title</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Department</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Location</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Type</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-primary border border-red-100">
                          <Briefcase size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1 max-w-xs">{job.translations?.en?.title || job.title || "Untitled Job"}</div>
                          <div className="text-[10px] text-gray-400 font-mono">/careers#{job.slug || job.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 font-mono text-[11px] font-medium border border-gray-200">
                        {job.translations?.en?.department || job.department || "General"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-gray-500 text-[11px]">
                        <MapPin size={11} className="text-gray-400" />
                        {job.translations?.en?.location || job.location || "Algeria"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-gray-500 text-[11px]">
                        <Clock size={11} className="text-gray-400" />
                        {job.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          job.status === "Published"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        <CheckCircle2 size={12} />
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleStatus(job.id, job.status)}
                          className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          title={job.status === "Published" ? "Change to Draft" : "Change to Published"}
                        >
                          {job.status === "Published" ? <Eye size={14} /> : <EyeOff size={14} className="text-red-primary" />}
                        </button>
                        <Link
                          href={`/console/openings/${job.id}/edit`}
                          className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          title="Edit job offer"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id)}
                          disabled={deletingId === job.id}
                          className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete job offer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 text-xs">
                      No job offers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
