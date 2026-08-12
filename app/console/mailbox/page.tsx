"use client";

import { useState, useEffect } from "react";
import { Search, Eye, Mail, Phone, Trash2, X, Building, Calendar, MessageSquare, Tag } from "lucide-react";

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
  Unread: "bg-blue-50 text-blue-700 border-blue-200 font-bold",
  Read: "bg-gray-100 text-gray-600 border-gray-200",
  Replied: "bg-green-50 text-green-700 border-green-200",
  Archived: "bg-amber-50 text-amber-700 border-amber-200",
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mailbox & Contact Inquiries</h1>
          <p className="text-sm text-gray-500 mt-1">View and respond to messages submitted via website Contact forms.</p>
        </div>
        <button
          onClick={fetchMessages}
          className="self-start sm:self-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Refresh Mailbox
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-xs">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, or subject..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
            />
          </div>
          <select
            value={selectedStatus || ""}
            onChange={(e) => setSelectedStatus(e.target.value || null)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 cursor-pointer"
          >
            <option value="">All Statuses ({messages.length})</option>
            {Object.keys(statusColors).map((status) => (
              <option key={status} value={status}>
                {status} ({messages.filter((m) => m.status === status).length})
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Sender</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact Details</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date Received</th>
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
                      <span>Loading contact messages...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No contact form messages found.
                  </td>
                </tr>
              ) : (
                filtered.map((msg) => (
                  <tr key={msg.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${msg.status === "Unread" ? "bg-red-primary/[0.02]" : ""}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-red-primary/10 text-red-primary rounded-full flex items-center justify-center shrink-0 font-bold text-xs">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className={`font-semibold ${msg.status === "Unread" ? "text-gray-900 font-bold" : "text-gray-800"}`}>
                            {msg.name}
                          </div>
                          {msg.company_name && <div className="text-xs text-gray-400 flex items-center gap-1"><Building size={10} />{msg.company_name}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5"><Mail size={12} className="text-gray-400" />{msg.email}</div>
                        <div className="flex items-center gap-1.5"><Phone size={12} className="text-gray-400" />{msg.phone}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{msg.subject}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {msg.date || (msg.created_at ? new Date(msg.created_at).toLocaleDateString("en-US") : "Recent")}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={msg.status || "Unread"}
                        onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs border ${statusColors[msg.status] || statusColors.Unread} focus:outline-none cursor-pointer`}
                      >
                        {Object.keys(statusColors).map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openMessageModal(msg)}
                          title="View Message"
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          title="Delete Message"
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveModalMsg(null)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="w-12 h-12 bg-red-primary/10 text-red-primary rounded-2xl flex items-center justify-center font-bold text-lg">
                {activeModalMsg.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{activeModalMsg.name}</h3>
                <p className="text-xs text-gray-400">{activeModalMsg.subject}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl text-xs text-gray-700 border border-gray-100">
              <div><span className="font-bold text-gray-900">Email Address:</span> <a href={`mailto:${activeModalMsg.email}`} className="text-blue-600 hover:underline">{activeModalMsg.email}</a></div>
              <div><span className="font-bold text-gray-900">Phone Number:</span> <a href={`tel:${activeModalMsg.phone}`} className="text-blue-600 hover:underline">{activeModalMsg.phone}</a></div>
              {activeModalMsg.company_name && <div><span className="font-bold text-gray-900">Company Name:</span> {activeModalMsg.company_name}</div>}
              <div><span className="font-bold text-gray-900">Date Received:</span> {activeModalMsg.date || "Recent"}</div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <MessageSquare size={14} /> Message Content
              </h4>
              <div className="p-5 bg-gray-50 rounded-2xl text-sm text-gray-800 border border-gray-100 leading-relaxed whitespace-pre-wrap">
                {activeModalMsg.message}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Status:</span>
                <select
                  value={activeModalMsg.status || "Unread"}
                  onChange={(e) => {
                    handleStatusChange(activeModalMsg.id, e.target.value);
                    setActiveModalMsg({ ...activeModalMsg, status: e.target.value });
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusColors[activeModalMsg.status] || statusColors.Unread} cursor-pointer`}
                >
                  {Object.keys(statusColors).map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${activeModalMsg.email}?subject=RE: ${encodeURIComponent(activeModalMsg.subject)}`}
                  className="px-4 py-2 bg-red-primary text-white rounded-xl text-xs font-semibold hover:bg-red-primary/90 transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail size={14} /> Reply via Email
                </a>
                <button
                  onClick={() => setActiveModalMsg(null)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
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