"use client";

import { useState, useEffect } from "react";
import { Search, Eye, Mail, Phone, X, Check, FileText, User, Briefcase, GraduationCap, MapPin, ExternalLink } from "lucide-react";

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
  cv_file?: string;
  cover_file?: string;
  cert_file?: string;
  submitted?: string;
  created_at?: string;
  status: string;
}

const statusColors: Record<string, string> = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Reviewing: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Shortlisted: "bg-purple-50 text-purple-700 border-purple-200",
  Interview: "bg-orange-50 text-orange-700 border-orange-200",
  Accepted: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function ApplicationsPage() {
  const [submissions, setSubmissions] = useState<ApplicationSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalApp, setActiveModalApp] = useState<ApplicationSubmission | null>(null);

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
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filtered = submissions.filter((app) => {
    const candidateName = app.candidate_name || app.candidate || "";
    const matchesSearch =
      candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus ? app.status === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications (CV Submissions)</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage candidate applications submitted via Careers portal.</p>
        </div>
        <button
          onClick={fetchSubmissions}
          className="self-start sm:self-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
        >
          Refresh Submissions
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, position, or email..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
            />
          </div>
          <select
            value={selectedStatus || ""}
            onChange={(e) => setSelectedStatus(e.target.value || null)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#D71920]/20"
          >
            <option value="">All Statuses ({submissions.length})</option>
            {Object.keys(statusColors).map((status) => (
              <option key={status} value={status}>
                {status} ({submissions.filter((s) => s.status === status).length})
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Candidate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Target Position</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Submitted Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-red-primary border-t-transparent rounded-full animate-spin" />
                      <span>Loading submissions...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No application submissions found.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const candidateName = app.candidate_name || app.candidate || "Applicant";
                  return (
                    <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#D71920] rounded-full flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">{candidateName.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{candidateName}</div>
                            {app.city && <div className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} />{app.city}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">{app.position}</td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5"><Mail size={12} className="text-gray-400" />{app.email}</div>
                          <div className="flex items-center gap-1.5"><Phone size={12} className="text-gray-400" />{app.phone}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {app.submitted || (app.created_at ? new Date(app.created_at).toLocaleDateString("en-US") : "Recent")}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={app.status || "New"}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[app.status] || statusColors.New} focus:outline-none cursor-pointer`}
                        >
                          {Object.keys(statusColors).map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setActiveModalApp(app)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
                        >
                          <Eye size={14} />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Details Modal */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveModalApp(null)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#D71920] rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                {(activeModalApp.candidate_name || activeModalApp.candidate || "A").charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">{activeModalApp.candidate_name || activeModalApp.candidate}</h3>
                <p className="text-sm font-semibold text-[#D71920]">{activeModalApp.position}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl text-xs text-gray-700 border border-gray-100">
              <div><span className="font-bold text-gray-900">Email:</span> {activeModalApp.email}</div>
              <div><span className="font-bold text-gray-900">Phone:</span> {activeModalApp.phone}</div>
              <div><span className="font-bold text-gray-900">City / Wilaya:</span> {activeModalApp.city || "N/A"}</div>
              <div><span className="font-bold text-gray-900">Nationality:</span> {activeModalApp.nationality || "N/A"}</div>
              <div><span className="font-bold text-gray-900">Experience:</span> {activeModalApp.experience || "N/A"}</div>
              <div><span className="font-bold text-gray-900">Education:</span> {activeModalApp.education || "N/A"}</div>
              <div><span className="font-bold text-gray-900">Expected Salary:</span> {activeModalApp.salary || "N/A"}</div>
              <div><span className="font-bold text-gray-900">Availability:</span> {activeModalApp.availability || "N/A"}</div>
            </div>

            {(activeModalApp.linkedin || activeModalApp.portfolio) && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Links & Portfolios</h4>
                <div className="flex flex-wrap gap-3">
                  {activeModalApp.linkedin && (
                    <a href={activeModalApp.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
                      <ExternalLink size={12} /> LinkedIn Profile
                    </a>
                  )}
                  {activeModalApp.portfolio && (
                    <a href={activeModalApp.portfolio} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
                      <ExternalLink size={12} /> Portfolio Website
                    </a>
                  )}
                </div>
              </div>
            )}

            {activeModalApp.message && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Cover Note / Additional Comments</h4>
                <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-700 italic border border-gray-100 leading-relaxed">
                  "{activeModalApp.message}"
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Attached Documents</h4>
              <div className="flex flex-wrap gap-3">
                {activeModalApp.cv_file ? (
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-xl text-xs font-semibold border border-red-100">
                    <FileText size={14} />
                    <span>CV: {activeModalApp.cv_file}</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">No CV file attached</span>
                )}
                {activeModalApp.cover_file && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200">
                    <FileText size={14} />
                    <span>Cover: {activeModalApp.cover_file}</span>
                  </div>
                )}
                {activeModalApp.cert_file && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200">
                    <FileText size={14} />
                    <span>Cert: {activeModalApp.cert_file}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Status:</span>
                <select
                  value={activeModalApp.status || "New"}
                  onChange={(e) => {
                    handleStatusChange(activeModalApp.id, e.target.value);
                    setActiveModalApp({ ...activeModalApp, status: e.target.value });
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusColors[activeModalApp.status] || statusColors.New}`}
                >
                  {Object.keys(statusColors).map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setActiveModalApp(null)}
                className="px-5 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors"
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