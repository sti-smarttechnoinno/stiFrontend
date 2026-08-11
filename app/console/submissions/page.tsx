"use client";

import { useState } from "react";
import { Search, Eye, Download, Mail, Phone, ChevronDown } from "lucide-react";

const applications = [
  { id: 1, candidate: "Ahmed Benali", position: "Sales Representative", email: "ahmed@email.com", phone: "+213 555 123 456", submitted: "May 20, 2026", status: "New" },
  { id: 2, candidate: "Fatima Zerrouki", position: "Distribution Coordinator", email: "fatima@email.com", phone: "+213 555 234 567", submitted: "May 19, 2026", status: "Reviewing" },
  { id: 3, candidate: "Youcef Amrani", position: "Warehouse Assistant", email: "youcef@email.com", phone: "+213 555 345 678", submitted: "May 18, 2026", status: "Shortlisted" },
  { id: 4, candidate: "Amina Khelifi", position: "Customer Support Agent", email: "amina@email.com", phone: "+213 555 456 789", submitted: "May 17, 2026", status: "Interview" },
  { id: 5, candidate: "Karim Boudiaf", position: "Marketing Executive", email: "karim@email.com", phone: "+213 555 567 890", submitted: "May 16, 2026", status: "Accepted" },
  { id: 6, candidate: "Nadia Touati", position: "Administrative Assistant", email: "nadia@email.com", phone: "+213 555 678 901", submitted: "May 15, 2026", status: "Rejected" },
];

const statusColors: Record<string, string> = {
  New: "bg-blue-50 text-blue-700",
  Reviewing: "bg-yellow-50 text-yellow-700",
  Shortlisted: "bg-purple-50 text-purple-700",
  Interview: "bg-orange-50 text-orange-700",
  Accepted: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",
};

export default function ApplicationsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filtered = selectedStatus
    ? applications.filter((a) => a.status === selectedStatus)
    : applications;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applications (CVs)</h1>
        <p className="text-sm text-gray-500 mt-1">Review and manage candidate applications.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
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
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Candidate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Position</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Submitted</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#D71920] rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">{app.candidate.charAt(0)}</span>
                      </div>
                      <div className="font-medium text-gray-900">{app.candidate}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{app.position}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 text-gray-500">
                      <span className="flex items-center gap-1"><Mail size={12} />{app.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{app.submitted}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                        <Download size={16} />
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