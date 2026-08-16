"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Phone,
  Mail,
  Trash2,
  X,
  Building2,
  User,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileText,
  Send,
} from "lucide-react";

export interface QuoteRequestItem {
  id: number | string;
  business_name: string;
  contact_person: string;
  phone: string;
  email: string;
  business_type: string;
  products: string[];
  volume: string;
  contact_method: string;
  message: string;
  status: string; // Pending, Contacted, Quoted, Completed, Rejected
  created_at?: string;
  date?: string;
}

const statusColors: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Contacted: "bg-blue-50 text-blue-700 border-blue-200",
  Quoted: "bg-purple-50 text-purple-700 border-purple-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [activeModalQuote, setActiveModalQuote] = useState<QuoteRequestItem | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/requests");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setQuotes(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch quote requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleStatusChange = async (id: number | string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch("/api/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setQuotes((prev) =>
          prev.map((q) => (String(q.id) === String(id) ? { ...q, status: newStatus } : q))
        );
        if (activeModalQuote && String(activeModalQuote.id) === String(id)) {
          setActiveModalQuote((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!window.confirm("Are you sure you want to delete this quotation request?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/requests?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setQuotes((prev) => prev.filter((q) => String(q.id) !== String(id)));
        if (activeModalQuote && String(activeModalQuote.id) === String(id)) {
          setActiveModalQuote(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete quotation request:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    const matchesStatus = !selectedStatus || q.status === selectedStatus;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesStatus;

    const productsStr = Array.isArray(q.products) ? q.products.join(" ") : String(q.products || "");
    const matchesSearch =
      (q.business_name || "").toLowerCase().includes(query) ||
      (q.contact_person || "").toLowerCase().includes(query) ||
      (q.email || "").toLowerCase().includes(query) ||
      (q.phone || "").toLowerCase().includes(query) ||
      (q.business_type || "").toLowerCase().includes(query) ||
      productsStr.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const totalCount = quotes.length;
  const pendingCount = quotes.filter((q) => q.status === "Pending").length;
  const quotedCount = quotes.filter((q) => q.status === "Quoted").length;
  const completedCount = quotes.filter((q) => q.status === "Completed").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotation Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage, review, and track incoming partner quote submissions.
          </p>
        </div>
        <button
          onClick={fetchQuotes}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Requests</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{totalCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending Review</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{pendingCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Quoted</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">{quotedCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Completed</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{completedCount}</div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, person, email, product..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus || ""}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#D71920]/20"
            >
              <option value="">All Statuses</option>
              {Object.keys(statusColors).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {selectedStatus && (
              <button
                onClick={() => setSelectedStatus(null)}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Quotes Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/70 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Company / Business</th>
                <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                <th className="py-3.5 px-4 font-semibold">Business Type</th>
                <th className="py-3.5 px-4 font-semibold">Products Requested</th>
                <th className="py-3.5 px-4 font-semibold">Submitted</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#D71920]" />
                    <span>Loading quotation requests...</span>
                  </td>
                </tr>
              ) : filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <FileText size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-medium text-gray-700">No quotation requests found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {searchQuery || selectedStatus
                        ? "Try clearing search filters."
                        : "Quote submissions from the website will appear here."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => {
                  const productsList = Array.isArray(quote.products)
                    ? quote.products
                    : [quote.products].filter(Boolean);

                  return (
                    <tr key={quote.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-900">{quote.business_name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <User size={10} className="text-gray-400" />
                          <span>{quote.contact_person}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <a
                            href={`mailto:${quote.email}`}
                            className="text-gray-600 hover:text-[#D71920] flex items-center gap-1 transition-colors"
                          >
                            <Mail size={12} className="text-gray-400 shrink-0" />
                            <span className="truncate max-w-[180px]">{quote.email}</span>
                          </a>
                          <a
                            href={`tel:${quote.phone}`}
                            className="text-gray-600 hover:text-[#D71920] flex items-center gap-1 transition-colors"
                          >
                            <Phone size={12} className="text-gray-400 shrink-0" />
                            <span>{quote.phone}</span>
                          </a>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600">
                        <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-xs font-medium text-gray-700">
                          {quote.business_type || "Standard"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {productsList.length > 0 ? (
                            productsList.slice(0, 2).map((prod, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-[#D71920] border border-red-100"
                              >
                                {prod}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">Not specified</span>
                          )}
                          {productsList.length > 2 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              +{productsList.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                        {quote.date || "N/A"}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={quote.status}
                          onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-colors ${
                            statusColors[quote.status] || "bg-gray-50 text-gray-700 border-gray-200"
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
                          <button
                            onClick={() => setActiveModalQuote(quote)}
                            title="View Quote Details"
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(quote.id)}
                            disabled={deletingId === quote.id}
                            title="Delete Quote Request"
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
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

      {/* Quote Detail Modal */}
      {activeModalQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#D71920] flex items-center justify-center font-bold">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {activeModalQuote.business_name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span>Submitted {activeModalQuote.date || "recently"}</span>
                    <span>•</span>
                    <span className="font-medium text-gray-700">{activeModalQuote.business_type}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveModalQuote(null)}
                className="p-2 rounded-lg hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* Status & Quick Contact Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">Current Status:</span>
                  <select
                    value={activeModalQuote.status}
                    disabled={updatingStatus}
                    onChange={(e) => handleStatusChange(activeModalQuote.id, e.target.value)}
                    className={`text-xs font-bold px-3 py-1 rounded-full border cursor-pointer focus:outline-none ${
                      statusColors[activeModalQuote.status] || "bg-gray-100 text-gray-700"
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
                    href={`mailto:${activeModalQuote.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D71920] text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                  >
                    <Mail size={12} />
                    <span>Email Company</span>
                  </a>
                  <a
                    href={`tel:${activeModalQuote.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <Phone size={12} />
                    <span>Call</span>
                  </a>
                </div>
              </div>

              {/* Contact Details Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Contact Information
                </h4>
                <div className="grid sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div>
                    <span className="text-xs text-gray-500">Contact Person</span>
                    <p className="font-semibold text-gray-900 mt-0.5">{activeModalQuote.contact_person}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Preferred Contact Method</span>
                    <p className="font-semibold text-gray-900 mt-0.5">{activeModalQuote.contact_method || "Email"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Email Address</span>
                    <p className="font-semibold text-gray-900 mt-0.5">{activeModalQuote.email}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Phone Number</span>
                    <p className="font-semibold text-gray-900 mt-0.5">{activeModalQuote.phone}</p>
                  </div>
                </div>
              </div>

              {/* Products & Volume Request */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Quotation Details
                </h4>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                  <div>
                    <span className="text-xs text-gray-500 block mb-2">Requested Products & Solutions</span>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(activeModalQuote.products) && activeModalQuote.products.length > 0 ? (
                        activeModalQuote.products.map((p, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-red-50 text-[#D71920] border border-red-100"
                          >
                            <Package size={12} />
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs italic">No specific products selected</span>
                      )}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Estimated Monthly Volume</span>
                    <span className="font-semibold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md text-xs">
                      {activeModalQuote.volume || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Message / Notes */}
              {activeModalQuote.message && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Additional Notes / Message
                  </h4>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-gray-700 italic leading-relaxed">
                    "{activeModalQuote.message}"
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <button
                onClick={() => handleDelete(activeModalQuote.id)}
                className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-semibold hover:underline"
              >
                <Trash2 size={14} />
                <span>Delete Quote Request</span>
              </button>
              <button
                onClick={() => setActiveModalQuote(null)}
                className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors"
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