"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Mail,
  Phone,
  Trash2,
  X,
  Building,
  Calendar,
  MessageSquare,
  RefreshCw,
  Loader2,
  Tag,
  User,
} from "lucide-react";

export interface ContactMessage {
  id: number | string;
  name: string;
  company_name?: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: string; // Unread, Read, Replied, Archived
  date?: string;
  created_at?: string;
}

const statusColors: Record<string, string> = {
  Unread: "bg-blue-50 text-blue-700 border-blue-200 font-semibold",
  Read: "bg-gray-100 text-gray-700 border-gray-200 font-semibold",
  Replied: "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold",
  Archived: "bg-amber-50 text-amber-700 border-amber-200 font-semibold",
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalMsg, setActiveModalMsg] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (id: number | string, newStatus: string) => {
    try {
      const res = await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) => (String(msg.id) === String(id) ? { ...msg, status: newStatus } : msg))
        );
      }
    } catch (err) {
      console.error("Failed to update message status:", err);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this contact message?")) return;

    try {
      const res = await fetch(`/api/messages?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => String(msg.id) !== String(id)));
        if (activeModalMsg && String(activeModalMsg.id) === String(id)) {
          setActiveModalMsg(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const openMessageModal = (msg: ContactMessage) => {
    setActiveModalMsg(msg);
    if (msg.status === "Unread") {
      handleStatusChange(msg.id, "Read");
    }
  };

  const filtered = messages.filter((msg) => {
    const senderName = msg.name || "";
    const matchesSearch =
      senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus ? msg.status === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => m.status === "Unread").length;
  const repliedCount = messages.filter((m) => m.status === "Replied").length;
  const readCount = messages.filter((m) => m.status === "Read").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Mailbox & Contact Inquiries
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            View and manage customer messages submitted via website Contact forms.
          </p>
        </div>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-red-primary" : ""} />
          <span>Refresh Mailbox</span>
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Messages</div>
          <div className="text-2xl font-extrabold text-gray-900 mt-1" style={{ fontFamily: "var(--font-display)" }}>{totalCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Unread</div>
          <div className="text-2xl font-extrabold text-blue-700 mt-1" style={{ fontFamily: "var(--font-display)" }}>{unreadCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Replied</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1" style={{ fontFamily: "var(--font-display)" }}>{repliedCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Read</div>
          <div className="text-2xl font-extrabold text-gray-700 mt-1" style={{ fontFamily: "var(--font-display)" }}>{readCount}</div>
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
              placeholder="Search sender, email, or subject..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary bg-white"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={selectedStatus || ""}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary cursor-pointer"
            >
              <option value="">All Statuses ({messages.length})</option>
              {Object.keys(statusColors).map((status) => (
                <option key={status} value={status}>
                  {status} ({messages.filter((m) => m.status === status).length})
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">Sender</th>
                <th className="py-3.5 px-4 font-bold">Contact Details</th>
                <th className="py-3.5 px-4 font-bold">Subject</th>
                <th className="py-3.5 px-4 font-bold">Date Received</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 size={24} className="animate-spin text-red-primary" />
                      <span className="text-xs font-semibold">Loading contact messages...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <MessageSquare size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-bold text-gray-800 text-sm">No contact form messages found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {searchQuery || selectedStatus
                        ? "Try clearing search or status filters."
                        : "Messages submitted via website Contact forms will appear here."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-gray-50/80 transition-colors ${
                      msg.status === "Unread" ? "bg-red-primary/[0.02]" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-red-primary/10 text-red-primary rounded-xl flex items-center justify-center shrink-0 font-bold text-xs">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div
                            className={`font-bold ${
                              msg.status === "Unread" ? "text-gray-900" : "text-gray-800"
                            }`}
                          >
                            {msg.name}
                          </div>
                          {msg.company_name && (
                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Building size={11} />
                              <span>{msg.company_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-xs text-gray-600">
                        <a
                          href={`mailto:${msg.email}`}
                          className="flex items-center gap-1.5 hover:text-red-primary transition-colors font-medium"
                        >
                          <Mail size={12} className="text-gray-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{msg.email}</span>
                        </a>
                        <a
                          href={`tel:${msg.phone}`}
                          className="flex items-center gap-1.5 hover:text-red-primary transition-colors font-medium"
                        >
                          <Phone size={12} className="text-gray-400 shrink-0" />
                          <span>{msg.phone}</span>
                        </a>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-800 font-semibold">{msg.subject}</td>

                    <td className="py-3.5 px-4 text-gray-500 text-xs whitespace-nowrap">
                      {msg.date ||
                        (msg.created_at
                          ? new Date(msg.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Recent")}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={msg.status || "Unread"}
                        onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          statusColors[msg.status] || statusColors.Unread
                        } focus:outline-none cursor-pointer transition-colors`}
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
                          onClick={() => openMessageModal(msg)}
                          title="View Message"
                          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          title="Delete Message"
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {activeModalMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-primary/10 text-red-primary flex items-center justify-center font-bold text-sm">
                  {activeModalMsg.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3
                    className="font-extrabold text-gray-900 text-base"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {activeModalMsg.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{activeModalMsg.subject}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalMsg(null)}
                className="p-2 rounded-xl hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="text-[11px] text-gray-400 block font-semibold">Email Address</span>
                  <a
                    href={`mailto:${activeModalMsg.email}`}
                    className="font-bold text-red-primary hover:underline mt-0.5 block"
                  >
                    {activeModalMsg.email}
                  </a>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 block font-semibold">Phone Number</span>
                  <a
                    href={`tel:${activeModalMsg.phone}`}
                    className="font-bold text-gray-900 hover:underline mt-0.5 block"
                  >
                    {activeModalMsg.phone}
                  </a>
                </div>
                {activeModalMsg.company_name && (
                  <div>
                    <span className="text-[11px] text-gray-400 block font-semibold">Company Name</span>
                    <p className="font-bold text-gray-900 mt-0.5">{activeModalMsg.company_name}</p>
                  </div>
                )}
                <div>
                  <span className="text-[11px] text-gray-400 block font-semibold">Date Received</span>
                  <p className="font-bold text-gray-900 mt-0.5">{activeModalMsg.date || "Recent"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <MessageSquare size={14} /> Message Content
                </h4>
                <div className="p-4 bg-gray-50 rounded-xl text-xs text-gray-800 border border-gray-100 leading-relaxed whitespace-pre-wrap">
                  {activeModalMsg.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-bold">Status:</span>
                <select
                  value={activeModalMsg.status || "Unread"}
                  onChange={(e) => {
                    handleStatusChange(activeModalMsg.id, e.target.value);
                    setActiveModalMsg({ ...activeModalMsg, status: e.target.value });
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    statusColors[activeModalMsg.status] || statusColors.Unread
                  } cursor-pointer focus:outline-none`}
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
                  href={`mailto:${activeModalMsg.email}?subject=RE: ${encodeURIComponent(
                    activeModalMsg.subject
                  )}`}
                  className="px-4 py-2 bg-red-primary text-white rounded-xl text-xs font-bold hover:bg-red-primary/90 transition-all shadow-xs inline-flex items-center gap-1.5"
                >
                  <Mail size={14} /> Reply via Email
                </a>
                <button
                  onClick={() => setActiveModalMsg(null)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}