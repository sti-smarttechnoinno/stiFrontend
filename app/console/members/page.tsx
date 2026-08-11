"use client";

import { Plus, Search, Edit, Trash2, ShieldCheck } from "lucide-react";

const users = [
  { id: 1, name: "Admin User", email: "admin@sti-dz.com", role: "Super Admin", status: "Active", lastLogin: "May 20, 2026" },
  { id: 2, name: "Content Manager", email: "content@sti-dz.com", role: "Content Manager", status: "Active", lastLogin: "May 19, 2026" },
  { id: 3, name: "HR Manager", email: "hr@sti-dz.com", role: "Recruitment Manager", status: "Active", lastLogin: "May 18, 2026" },
  { id: 4, name: "Sales Manager", email: "sales@sti-dz.com", role: "Sales Manager", status: "Active", lastLogin: "May 17, 2026" },
  { id: 5, name: "Viewer Account", email: "viewer@sti-dz.com", role: "Viewer", status: "Inactive", lastLogin: "May 10, 2026" },
];

const roleColors: Record<string, string> = {
  "Super Admin": "bg-red-50 text-red-700",
  "Content Manager": "bg-blue-50 text-blue-700",
  "Recruitment Manager": "bg-purple-50 text-purple-700",
  "Sales Manager": "bg-green-50 text-green-700",
  "Viewer": "bg-gray-100 text-gray-600",
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">Manage admin users and their access levels.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D71920] text-white text-sm font-semibold rounded-lg hover:bg-[#B81419] transition-colors">
          <Plus size={16} />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Login</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#D71920] rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                      <ShieldCheck size={12} />
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                        <Edit size={16} />
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