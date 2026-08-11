"use client";

import { useState } from "react";
import { Search, Eye, Archive, Reply, Trash2 } from "lucide-react";

const messages = [
  { id: 1, name: "Mohamed Amine", email: "mohamed@email.com", subject: "Partnership Inquiry", date: "May 20, 2026", status: "Unread" },
  { id: 2, name: "Sara Boudiaf", email: "sara@email.com", subject: "Wholesale Pricing Request", date: "May 19, 2026", status: "Read" },
  { id: 3, name: "Omar Touati", email: "omar@email.com", subject: "Product Availability", date: "May 18, 2026", status: "Replied" },
  { id: 4, name: "Leila Khelifi", email: "leila@email.com", subject: "Distribution Partnership", date: "May 17, 2026", status: "Unread" },
  { id: 5, name: "Yacine Amrani", email: "yacine@email.com", subject: "Bulk Order Inquiry", date: "May 16, 2026", status: "Archived" },
];

const statusColors: Record<string, string> = {
  Unread: "bg-blue-50 text-blue-700",
  Read: "bg-gray-100 text-gray-600",
  Replied: "bg-green-50 text-green-700",
  Archived: "bg-gray-100 text-gray-500",
};

export default function MessagesPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filtered = selectedStatus
    ? messages.filter((m) => m.status === selectedStatus)
    : messages;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">View and respond to contact form messages.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
            />
          </div>
          <select
            value={selectedStatus || ""}
            onChange={(e) => setSelectedStatus(e.target.value || null)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#D71920]/20"
          >
            <option value="">All Statuses</option>
            {Object.keys(statusColors).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((msg) => (
                <tr key={msg.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{msg.name}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{msg.email}</td>
                  <td className="py-3 px-4 text-gray-500">{msg.subject}</td>
                  <td className="py-3 px-4 text-gray-500">{msg.date}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[msg.status]}`}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                        <Reply size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}