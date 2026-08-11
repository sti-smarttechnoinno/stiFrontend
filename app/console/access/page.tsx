"use client";

import { Plus, ShieldCheck, Edit, Trash2 } from "lucide-react";

const roles = [
  {
    name: "Super Admin",
    description: "Full access to all features and settings",
    users: 1,
    permissions: ["View", "Create", "Edit", "Delete", "Publish", "Manage Applications", "Manage Messages", "Manage Quotes", "Manage Settings"],
  },
  {
    name: "Content Manager",
    description: "Manage website content, solutions, and products",
    users: 1,
    permissions: ["View", "Create", "Edit", "Delete", "Publish"],
  },
  {
    name: "Recruitment Manager",
    description: "Manage job offers and candidate applications",
    users: 1,
    permissions: ["View", "Create", "Edit", "Delete", "Manage Applications"],
  },
  {
    name: "Sales Manager",
    description: "Manage quote requests and business inquiries",
    users: 1,
    permissions: ["View", "Edit", "Manage Quotes", "Manage Messages"],
  },
  {
    name: "Viewer",
    description: "Read-only access to dashboard and reports",
    users: 1,
    permissions: ["View"],
  },
];

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
          <p className="text-sm text-gray-500 mt-1">Manage user roles and permissions.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D71920] text-white text-sm font-semibold rounded-lg hover:bg-[#B81419] transition-colors">
          <Plus size={16} />
          Add Role
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div key={role.name} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <ShieldCheck size={20} className="text-[#D71920]" />
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit size={14} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">{role.name}</h3>
            <p className="text-xs text-gray-500 mb-4">{role.description}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-400">{role.users} user</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {role.permissions.map((perm) => (
                <span key={perm} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">
                  {perm}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}