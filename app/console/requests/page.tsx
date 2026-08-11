"use client";

import { useState } from "react";
import { Search, Eye, Phone, Mail, Trash2 } from "lucide-react";

const quotes = [
  { id: 1, company: "TechStore Algeria", name: "Ahmed Benali", email: "ahmed@techstore.dz", phone: "+213 555 123 456", solution: "Mobile Recharge Credit", date: "May 20, 2026", status: "Pending" },
  { id: 2, company: "Market Plus", name: "Fatima Zerrouki", email: "fatima@marketplus.dz", phone: "+213 555 234 567", solution: "Wholesale Solutions", date: "May 19, 2026", status: "Contacted" },
  { id: 3, company: "Retail Pro", name: "Youcef Amrani", email: "youcef@retailpro.dz", phone: "+213 555 345 678", solution: "Prepaid SIM Cards", date: "May 18, 2026", status: "Quoted" },
  { id: 4, company: "Connect DZ", name: "Amina Khelifi", email: "amina@connectdz.dz", phone: "+213 555 456 789", solution: "Partner Services", date: "May 17, 2026", status: "Completed" },
  { id: 5, company: "Mobile World", name: "Karim Boudiaf", email: "karim@mobileworld.dz", phone: "+213 555 567 890", solution: "Mobile Recharge Credit", date: "May 16, 2026", status: "Rejected" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-50 text-yellow-700",
  Contacted: "bg-blue-50 text-blue-700",
  Quoted: "bg-purple-50 text-purple-700",
  Completed: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",
};

export default function QuotesPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filtered = selectedStatus
    ? quotes.filter((q) => q.status === selectedStatus)
    : quotes;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quote Requests</h1>
        <p className="text-sm text-gray-500 mt-1">Manage business quotation requests from partners.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search quotes..."
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
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Company</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Solution</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((quote) => (
                <tr key={quote.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{quote.company}</div>
                    <div className="text-xs text-gray-500">{quote.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1 text-gray-500 text-xs">
                      <span className="flex items-center gap-1"><Mail size={10} />{quote.email}</span>
                      <span className="flex items-center gap-1"><Phone size={10} />{quote.phone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{quote.solution}</td>
                  <td className="py-3 px-4 text-gray-500">{quote.date}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[quote.status]}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                        <Eye size={16} />
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