"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Download,
  Mail,
  Phone,
  X,
  FileText,
  MapPin,
  ExternalLink,
  RefreshCw,
  Loader2,
  Trash2,
  Briefcase,
  User,
  GraduationCap,
  Globe,
  DollarSign,
  Calendar,
} from "lucide-react";

const LinkedinIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

export interface FileAttachment {
  name: string;
  url: string;
}

export interface ApplicationSubmission {
  id: number | string;
  candidate_name?: string;
  candidate?: string;
  position: string;
  email: string;
  phone: string;
  city?: string;
  nationality?: string;
  experience?: string;
  education?: string;
  linkedin?: string;
  portfolio?: string;
  salary?: string;
  availability?: string;
  message?: string;
  cv_file?: FileAttachment | string | null;
  cover_file?: FileAttachment | string | null;
  cert_file?: FileAttachment | string | null;
  submitted?: string;
  created_at?: string;
  status: string;
}

const statusColors: Record<string, string> = {
  New: "bg-blue-50 text-blue-700 border-blue-200 font-semibold",
  Reviewing: "bg-amber-50 text-amber-700 border-amber-200 font-semibold",
  Shortlisted: "bg-purple-50 text-purple-700 border-purple-200 font-semibold",
  Interview: "bg-orange-50 text-orange-700 border-orange-200 font-semibold",
  Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold",
  Rejected: "bg-gray-100 text-gray-700 border-gray-200 font-semibold",
};

function parseAttachment(fileData: any, defaultLabel: string) {
  if (!fileData) return null;

  let name = "";
  let url = "";

  if (typeof fileData === "object" && fileData !== null) {
    name = fileData.name || defaultLabel;
    url = fileData.url || "";
  } else if (typeof fileData === "string") {
    const trimmed = fileData.trim();
    if (trimmed.startsWith("data:")) {
      url = trimmed;
      name = `${defaultLabel}.pdf`;
    } else if (trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === "object" && parsed !== null) {
          name = parsed.name || defaultLabel;
          url = parsed.url || (typeof parsed === "string" && parsed.startsWith("data:") ? parsed : "");
        } else {
          name = trimmed;
        }
      } catch {
        name = trimmed;
      }
    } else if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      url = trimmed;
      name = trimmed.split("/").pop() || defaultLabel;
    } else {
      name = trimmed;
    }
  }

  return { name: name || defaultLabel, url };
}

function handleDownloadAttachment(fileData: any, label: string, candidateName?: string) {
  const att = parseAttachment(fileData, label);
  if (!att) return;

  const rawName = att.name || `${candidateName ? candidateName.replace(/\s+/g, "_") + "_" : ""}${label}.pdf`;
  const fileName = rawName.includes(".") ? rawName : `${rawName}.pdf`;
  const url = att.url;

  // 1. Handle Base64 Data URL
  if (url && url.startsWith("data:")) {
    try {
      const arr = url.split(",");
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "application/pdf";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 300);
      return;
    } catch (err) {
      console.error("Base64 download error:", err);
    }
  }

  // 2. Handle Regular HTTP / Server URL
  if (url) {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // 3. Fallback: If filename string is present without Base64 URL, create downloadable document
  const content = `SARL STI Candidate Attachment Document\nCandidate: ${candidateName || "N/A"}\nDocument Name: ${fileName}\nDocument Type: ${label}`;
  const blob = new Blob([content], { type: "text/plain" });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName.endsWith(".pdf") || fileName.endsWith(".docx") || fileName.endsWith(".txt") ? fileName : `${fileName}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 300);
}

export default function ApplicationsPage() {
  const [submissions, setSubmissions] = useState<ApplicationSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalApp, setActiveModalApp] = useState<ApplicationSubmission | null>(null);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setSubmissions(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleStatusChange = async (id: number | string, newStatus: string) => {
    try {
      const res = await fetch("/api/submissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((app) => (String(app.id) === String(id) ? { ...app, status: newStatus } : app))
        );
        if (activeModalApp && String(activeModalApp.id) === String(id)) {
          setActiveModalApp((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this job application?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/submissions?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSubmissions((prev) => prev.filter((app) => String(app.id) !== String(id)));
        if (activeModalApp && String(activeModalApp.id) === String(id)) {
          setActiveModalApp(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete application:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = submissions.filter((app) => {
    const candidateName = app.candidate_name || app.candidate || "";
    const matchesSearch =
      candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.position || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.city || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus ? app.status === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  const totalCount = submissions.length;
  const newCount = submissions.filter((s) => s.status === "New").length;
  const reviewingCount = submissions.filter((s) => s.status === "Reviewing" || s.status === "Shortlisted").length;
  const acceptedCount = submissions.filter((s) => s.status === "Accepted" || s.status === "Interview").length;

  const renderAttachmentCard = (label: string, fileData: any, candidateName?: string) => {
    const att = parseAttachment(fileData, label);
    if (!att) return null;

    return (
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-red-primary/10 text-red-primary flex items-center justify-center shrink-0">
            <FileText size={18} />
          </div>
          <div className="truncate">
            <div className="font-bold text-gray-900 truncate">{att.name}</div>
            <div className="text-[10px] text-gray-400 font-semibold">{label} Document</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleDownloadAttachment(fileData, label, candidateName)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-primary text-white text-xs font-bold rounded-xl hover:bg-red-primary/90 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Download size={13} />
          <span>Download</span>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Job Applications (CVs)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review, evaluate, and download candidate application attachments.
          </p>
        </div>
        <button
          onClick={fetchSubmissions}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-red-primary" : ""} />
          <span>Refresh Applications</span>
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Applications</div>
          <div className="text-2xl font-extrabold text-gray-900 mt-1" style={{ fontFamily: "var(--font-display)" }}>{totalCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">New</div>
          <div className="text-2xl font-extrabold text-blue-700 mt-1" style={{ fontFamily: "var(--font-display)" }}>{newCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600">In Review</div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1" style={{ fontFamily: "var(--font-display)" }}>{reviewingCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Accepted / Interview</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1" style={{ fontFamily: "var(--font-display)" }}>{acceptedCount}</div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate name, position, or email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary bg-white"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={selectedStatus || ""}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary cursor-pointer"
            >
              <option value="">All Statuses ({submissions.length})</option>
              {Object.keys(statusColors).map((status) => (
                <option key={status} value={status}>
                  {status} ({submissions.filter((s) => s.status === status).length})
                </option>
              ))}
            </select>
            {selectedStatus && (
              <button
                onClick={() => setSelectedStatus(null)}
                className="text-xs text-gray-500 hover:text-red-primary font-semibold underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Submissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">Candidate</th>
                <th className="py-3.5 px-4 font-bold">Target Position</th>
                <th className="py-3.5 px-4 font-bold">Contact Details</th>
                <th className="py-3.5 px-4 font-bold">City / Location</th>
                <th className="py-3.5 px-4 font-bold">Submitted Date</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 size={24} className="animate-spin text-red-primary" />
                      <span className="text-xs font-semibold">Loading applications...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <FileText size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-bold text-gray-800 text-sm">No applications found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {searchQuery || selectedStatus
                        ? "Try clearing search or status filters."
                        : "Job candidate applications will appear here when submitted."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const candidateName = app.candidate_name || app.candidate || "Unknown Candidate";
                  const primaryFile = app.cv_file || app.cover_file || app.cert_file;

                  return (
                    <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-red-primary/10 text-red-primary rounded-xl flex items-center justify-center shrink-0 font-bold text-xs">
                            {candidateName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{candidateName}</div>
                            {app.experience && (
                              <div className="text-xs text-gray-400 font-medium">{app.experience} exp.</div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-primary/10 text-red-primary">
                          {app.position}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <a
                            href={`mailto:${app.email}`}
                            className="text-gray-600 hover:text-red-primary flex items-center gap-1 transition-colors font-medium"
                          >
                            <Mail size={12} className="text-gray-400 shrink-0" />
                            <span className="truncate max-w-[180px]">{app.email}</span>
                          </a>
                          <a
                            href={`tel:${app.phone}`}
                            className="text-gray-600 hover:text-red-primary flex items-center gap-1 transition-colors font-medium"
                          >
                            <Phone size={12} className="text-gray-400 shrink-0" />
                            <span>{app.phone}</span>
                          </a>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 font-medium">
                        {app.city || app.nationality || "Algeria"}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                        {app.submitted ||
                          (app.created_at
                            ? new Date(app.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recent")}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={app.status || "New"}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-colors ${
                            statusColors[app.status] || "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {Object.keys(statusColors).map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {primaryFile && (
                            <button
                              onClick={() => handleDownloadAttachment(primaryFile, "CV", candidateName)}
                              title="Download Candidate CV / Document"
                              className="p-2 rounded-xl bg-red-primary/10 text-red-primary hover:bg-red-primary hover:text-white transition-colors cursor-pointer"
                            >
                              <Download size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => setActiveModalApp(app)}
                            title="View Application Details"
                            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(app.id)}
                            disabled={deletingId === app.id}
                            title="Delete Application"
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Application Modal */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-primary/10 text-red-primary flex items-center justify-center font-bold text-sm">
                  {(activeModalApp.candidate_name || activeModalApp.candidate || "C").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3
                    className="font-extrabold text-gray-900 text-base"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {activeModalApp.candidate_name || activeModalApp.candidate}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="font-bold text-red-primary">{activeModalApp.position}</span>
                    <span>•</span>
                    <span>Submitted {activeModalApp.submitted || "Recently"}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveModalApp(null)}
                className="p-2 rounded-xl hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Status & Quick Action Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">Application Status:</span>
                  <select
                    value={activeModalApp.status}
                    onChange={(e) => handleStatusChange(activeModalApp.id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none ${
                      statusColors[activeModalApp.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {Object.keys(statusColors).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${activeModalApp.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-primary text-white text-xs font-bold rounded-xl hover:bg-red-primary/90 transition-all shadow-xs"
                  >
                    <Mail size={14} />
                    <span>Email Candidate</span>
                  </a>
                  <a
                    href={`tel:${activeModalApp.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all shadow-xs"
                  >
                    <Phone size={14} />
                    <span>Call Candidate</span>
                  </a>
                </div>
              </div>

              {/* Personal Details */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Personal Details
                </h4>
                <div className="grid sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
                  <div>
                    <span className="text-[11px] text-gray-400 block font-semibold">Email</span>
                    <p className="font-bold text-gray-900 mt-0.5">{activeModalApp.email}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block font-semibold">Phone</span>
                    <p className="font-bold text-gray-900 mt-0.5">{activeModalApp.phone}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block font-semibold">City / Nationality</span>
                    <p className="font-bold text-gray-900 mt-0.5">
                      {activeModalApp.city || "N/A"} {activeModalApp.nationality ? `(${activeModalApp.nationality})` : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Background & Qualifications */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Background & Qualifications
                </h4>
                <div className="grid sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
                  <div>
                    <span className="text-[11px] text-gray-400 block font-semibold">Years of Experience</span>
                    <p className="font-bold text-gray-900 mt-0.5">{activeModalApp.experience || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block font-semibold">Education</span>
                    <p className="font-bold text-gray-900 mt-0.5">{activeModalApp.education || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block font-semibold">Salary Expectation</span>
                    <p className="font-bold text-gray-900 mt-0.5">{activeModalApp.salary || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block font-semibold">Availability / Notice</span>
                    <p className="font-bold text-gray-900 mt-0.5">{activeModalApp.availability || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Online Profiles */}
              {(activeModalApp.linkedin || activeModalApp.portfolio) && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Online Profiles & Portfolios
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {activeModalApp.linkedin && (
                      <a
                        href={activeModalApp.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        <LinkedinIcon size={14} />
                        <span>LinkedIn Profile</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {activeModalApp.portfolio && (
                      <a
                        href={activeModalApp.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 text-gray-800 border border-gray-200 text-xs font-bold hover:bg-gray-200 transition-colors"
                      >
                        <Globe size={14} />
                        <span>Portfolio / Website</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Uploaded Attachments */}
              {(activeModalApp.cv_file || activeModalApp.cover_file || activeModalApp.cert_file) && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Uploaded Documents
                  </h4>
                  <div className="space-y-2">
                    {renderAttachmentCard("Curriculum Vitae (CV)", activeModalApp.cv_file, activeModalApp.candidate_name || activeModalApp.candidate)}
                    {renderAttachmentCard("Cover Letter", activeModalApp.cover_file, activeModalApp.candidate_name || activeModalApp.candidate)}
                    {renderAttachmentCard("Certificates", activeModalApp.cert_file, activeModalApp.candidate_name || activeModalApp.candidate)}
                  </div>
                </div>
              )}

              {/* Candidate Message */}
              {activeModalApp.message && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Candidate Cover Note
                  </h4>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-gray-800 italic leading-relaxed text-xs">
                    "{activeModalApp.message}"
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <button
                onClick={() => handleDelete(activeModalApp.id)}
                className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete Application</span>
              </button>
              <button
                onClick={() => setActiveModalApp(null)}
                className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}