"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ShieldCheck,
  X,
  Loader2,
  RefreshCw,
  UserCheck,
  UserX,
  UserPlus,
  Mail,
  User as UserIcon,
  Key,
} from "lucide-react";
import type { UserItem } from '@/app/api/users/route';
import type { RoleItem } from "../../types/roles";
import { useAuth } from "../../hooks/useAuth";

const roleBadgeColors: Record<string, string> = {
  "Super Admin": "bg-red-50 text-red-700 border-red-200",
  "Content Manager": "bg-blue-50 text-blue-700 border-blue-200",
  "Recruitment Manager": "bg-purple-50 text-purple-700 border-purple-200",
  "Sales Manager": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Viewer": "bg-gray-100 text-gray-700 border-gray-200",
};

export default function UsersPage() {
  const { hasPermission } = useAuth();
  const canManageUsers = hasPermission("members:manage") || hasPermission("users:manage");

  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    roleId: "",
    roleName: "",
    status: "Active" as "Active" | "Inactive",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch("/api/users", { cache: "no-store" }),
        fetch("/api/roles", { cache: "no-store" }),
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        setRoles(rolesData);
      }
    } catch (err) {
      console.error("Failed to fetch users or roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    const defaultRole = roles[0] || { id: "viewer", name: "Viewer" };
    setEditingUser(null);
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      roleId: defaultRole.id,
      roleName: defaultRole.name,
      status: "Active",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email || "",
      password: "", // Optional on update
      roleId: user.roleId,
      roleName: user.roleName,
      status: user.status,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleRoleSelect = (roleId: string) => {
    const matched = roles.find((r) => r.id === roleId);
    setFormData((prev) => ({
      ...prev,
      roleId,
      roleName: matched ? matched.name : prev.roleName,
    }));
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim()) {
      setFormError("Name and username are required.");
      return;
    }

    if (!editingUser && !formData.password.trim()) {
      setFormError("Password is required for new user accounts.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const method = editingUser ? "PUT" : "POST";
      const payload = editingUser
        ? { id: editingUser.id, ...formData }
        : formData;

      const res = await fetch("/api/users", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setModalOpen(false);
        fetchData();
      } else {
        setFormError(result.error || "Failed to save user account.");
      }
    } catch (err) {
      setFormError("Network error. Please try saving again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (user.username === "admin") {
      alert("The default Super Admin account cannot be deleted.");
      return;
    }

    if (!confirm(`Are you sure you want to delete user account "${user.name}"?`)) return;

    try {
      const res = await fetch(`/api/users?id=${user.id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user.");
      }
    } catch (err) {
      console.error("Delete user error:", err);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.username || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole ? user.roleId === selectedRole || user.roleName === selectedRole : true;
    return matchesSearch && matchesRole;
  });

  const totalCount = users.length;
  const activeCount = users.filter((u) => u.status === "Active").length;
  const inactiveCount = users.filter((u) => u.status === "Inactive").length;
  const superAdminCount = users.filter((u) => u.roleId === "super_admin" || u.roleName === "Super Admin").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Admin User Accounts
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage admin users, login credentials, role permissions, and active status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-red-primary" : ""} />
            <span>Refresh</span>
          </button>

          {canManageUsers && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-primary text-white text-xs font-bold rounded-xl hover:bg-red-primary/90 transition-all shadow-xs cursor-pointer"
            >
              <UserPlus size={16} />
              <span>Add User</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total User Accounts</div>
          <div className="text-2xl font-extrabold text-gray-900 mt-1" style={{ fontFamily: "var(--font-display)" }}>
            {totalCount}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Active Accounts</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1" style={{ fontFamily: "var(--font-display)" }}>
            {activeCount}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Inactive Accounts</div>
          <div className="text-2xl font-extrabold text-gray-600 mt-1" style={{ fontFamily: "var(--font-display)" }}>
            {inactiveCount}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-red-600">Super Admins</div>
          <div className="text-2xl font-extrabold text-red-700 mt-1" style={{ fontFamily: "var(--font-display)" }}>
            {superAdminCount}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or username..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary bg-white"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={selectedRole || ""}
              onChange={(e) => setSelectedRole(e.target.value || null)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary cursor-pointer"
            >
              <option value="">All Roles ({roles.length})</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {selectedRole && (
              <button
                onClick={() => setSelectedRole(null)}
                className="text-xs text-gray-500 hover:text-red-primary font-semibold underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">User</th>
                <th className="py-3.5 px-4 font-bold">Username</th>
                <th className="py-3.5 px-4 font-bold">Assigned Role</th>
                <th className="py-3.5 px-4 font-bold">Account Status</th>
                <th className="py-3.5 px-4 font-bold">Last Activity</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 size={24} className="animate-spin text-red-primary" />
                      <span className="text-xs font-semibold">Loading user accounts...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <UserX size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-bold text-gray-800 text-sm">No users found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {searchQuery || selectedRole
                        ? "Try clearing search or role filters."
                        : "Click 'Add User' to create a new user account."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-red-primary/10 text-red-primary rounded-xl flex items-center justify-center shrink-0 font-bold text-xs">
                          {userItem.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{userItem.name}</div>
                          {userItem.email && (
                            <div className="text-xs text-gray-400 font-medium">{userItem.email}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-gray-700">
                      @{userItem.username}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          roleBadgeColors[userItem.roleName] || "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        <ShieldCheck size={12} />
                        {userItem.roleName}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          userItem.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {userItem.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                      {userItem.lastLogin || "Never"}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {canManageUsers && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(userItem)}
                            title="Edit User Account"
                            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(userItem)}
                            disabled={userItem.username === "admin"}
                            title={userItem.username === "admin" ? "Super Admin cannot be deleted" : "Delete User Account"}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-primary/10 text-red-primary flex items-center justify-center">
                  <UserCheck size={18} />
                </div>
                <div>
                  <h3
                    className="font-extrabold text-gray-900 text-base"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {editingUser ? `Edit User: ${editingUser.name}` : "Create New User Account"}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">Configure credentials and role permissions.</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveUser} className="p-6 space-y-4 text-xs overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ahmed Benali"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Username *
                </label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g. ahmedb"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. ahmed@sti-dz.com"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Password {editingUser ? "(Leave blank to keep)" : "*"}
                  </label>
                  <div className="relative">
                    <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Assign Role *
                  </label>
                  <select
                    value={formData.roleId}
                    onChange={(e) => handleRoleSelect(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary cursor-pointer"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Account Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-red-primary text-white text-xs font-bold rounded-xl hover:bg-red-primary/90 transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
                  <span>{editingUser ? "Update User" : "Create User"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}