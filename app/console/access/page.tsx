"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  ShieldCheck,
  Edit,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  CheckSquare,
  Square,
  Lock,
} from "lucide-react";
import { ALL_PERMISSIONS, type RoleItem } from "../../types/roles";
import type { MemberItem } from '@/app/api/members/route';
import { useAuth } from "../../hooks/useAuth";

export default function RolesPage() {
  const { hasPermission } = useAuth();
  const canManageAccess = hasPermission("access:manage");

  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, usersRes] = await Promise.all([
        fetch("/api/roles"),
        fetch("/api/users"),
      ]);

      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        setRoles(Array.isArray(rolesData) ? rolesData : []);
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setMembers(Array.isArray(usersData) ? usersData : []);
      }
    } catch (err) {
      console.error("Failed to load roles/members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingRole(null);
    setFormData({
      name: "",
      description: "",
      permissions: ["dashboard:view"],
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (role: RoleItem) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions || [],
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleTogglePermission = (permId: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permId);
      const updated = exists
        ? prev.permissions.filter((p) => p !== permId)
        : [...prev.permissions, permId];
      return { ...prev, permissions: updated };
    });
  };

  const handleToggleCategory = (category: string) => {
    const catPermIds = ALL_PERMISSIONS.filter((p) => p.category === category).map((p) => p.id);
    const allSelected = catPermIds.every((id) => formData.permissions.includes(id));

    setFormData((prev) => {
      let updated: string[];
      if (allSelected) {
        updated = prev.permissions.filter((id) => !catPermIds.includes(id));
      } else {
        const combined = new Set([...prev.permissions, ...catPermIds]);
        updated = Array.from(combined);
      }
      return { ...prev, permissions: updated };
    });
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Role name is required.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const method = editingRole ? "PUT" : "POST";
      const payload = editingRole ? { id: editingRole.id, ...formData } : formData;

      const res = await fetch("/api/roles", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setModalOpen(false);
        fetchData();
      } else {
        setFormError(result.error || "Failed to save role.");
      }
    } catch (err) {
      setFormError("Network error. Please try saving again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async (role: RoleItem) => {
    if (role.isSystem) {
      alert("System roles cannot be deleted.");
      return;
    }

    if (!confirm(`Are you sure you want to delete the "${role.name}" role?`)) return;

    try {
      const res = await fetch(`/api/roles?id=${role.id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete role.");
      }
    } catch (err) {
      console.error("Delete role error:", err);
    }
  };

  // Group permissions by category for modal checklist
  const categories = Array.from(new Set(ALL_PERMISSIONS.map((p) => p.category)));

  const getUserCountForRole = (role: RoleItem) => {
    if (!Array.isArray(members)) return 0;
    return members.filter(
      (m) =>
        (m.roleId && role.id && m.roleId === role.id) ||
        (m.roleName && role.name && m.roleName.toLowerCase() === role.name.toLowerCase())
    ).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Roles & Permission Matrix
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure access control policies, system roles, and module permissions.
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

          {canManageAccess && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-primary text-white text-xs font-bold rounded-xl hover:bg-red-primary/90 transition-all shadow-xs cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Custom Role</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Configured Roles</div>
          <div className="text-2xl font-extrabold text-gray-900 mt-1" style={{ fontFamily: "var(--font-display)" }}>
            {roles.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">System Roles</div>
          <div className="text-2xl font-extrabold text-blue-700 mt-1" style={{ fontFamily: "var(--font-display)" }}>
            {roles.filter((r) => r.isSystem).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Custom Roles</div>
          <div className="text-2xl font-extrabold text-purple-700 mt-1" style={{ fontFamily: "var(--font-display)" }}>
            {roles.filter((r) => !r.isSystem).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Assigned Users</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1" style={{ fontFamily: "var(--font-display)" }}>
            {members.length}
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      {loading ? (
        <div className="py-16 text-center text-gray-400 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-gray-100">
          <Loader2 size={24} className="animate-spin text-red-primary" />
          <span className="text-xs font-semibold">Loading access roles...</span>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {roles.map((role) => {
            const userCount = getUserCountForRole(role);

            return (
              <div
                key={role.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-red-primary/10 rounded-xl flex items-center justify-center shrink-0 text-red-primary">
                      <ShieldCheck size={20} />
                    </div>
                    {canManageAccess && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(role)}
                          title="Edit Role Permissions"
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                        >
                          <Edit size={15} />
                        </button>
                        {!role.isSystem && (
                          <button
                            onClick={() => handleDeleteRole(role)}
                            title="Delete Role"
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Header Title & Badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className="text-base font-extrabold text-gray-900"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {role.name}
                    </h3>
                    {role.isSystem && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                        <Lock size={10} />
                        System
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-2">
                    {role.description || "No description provided."}
                  </p>

                  <div className="text-xs text-gray-400 font-semibold mb-3">
                    Assigned: <span className="text-gray-900 font-bold">{userCount} user{userCount === 1 ? "" : "s"}</span>
                  </div>

                  {/* Granted Permissions Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {(role.permissions || []).map((permId) => {
                      const foundPerm = ALL_PERMISSIONS.find((p) => p.id === permId);
                      return (
                        <span
                          key={permId}
                          className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-700 text-[10px] font-medium rounded-md"
                        >
                          {foundPerm ? foundPerm.label : permId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Role Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-primary/10 text-red-primary flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3
                    className="font-extrabold text-gray-900 text-base"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {editingRole ? `Edit Role: ${editingRole.name}` : "Create New Custom Role"}
                  </h3>
                  <p className="text-xs text-gray-500">Configure permission access levels for this role.</p>
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
            <form onSubmit={handleSaveRole} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold">
                  {formError}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={editingRole?.isSystem}
                    placeholder="e.g. Regional Support Manager"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Role Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief summary of role responsibilities..."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary"
                  />
                </div>
              </div>

              {/* Permissions Category Matrix */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700">
                    Module Permissions Matrix ({formData.permissions.length} selected)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        permissions: ALL_PERMISSIONS.map((p) => p.id),
                      })
                    }
                    className="text-xs text-red-primary font-bold hover:underline cursor-pointer"
                  >
                    Select All Permissions
                  </button>
                </div>

                <div className="space-y-4">
                  {categories.map((category) => {
                    const catPerms = ALL_PERMISSIONS.filter((p) => p.category === category);
                    const catPermIds = catPerms.map((p) => p.id);
                    const allCatSelected = catPermIds.every((id) => formData.permissions.includes(id));

                    return (
                      <div key={category} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                          <span className="font-bold text-gray-900 text-xs uppercase tracking-wider">{category}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleCategory(category)}
                            className="text-[11px] font-semibold text-gray-500 hover:text-red-primary cursor-pointer flex items-center gap-1"
                          >
                            {allCatSelected ? <CheckSquare size={13} className="text-red-primary" /> : <Square size={13} />}
                            <span>{allCatSelected ? "Deselect Section" : "Select Section"}</span>
                          </button>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 pt-1">
                          {catPerms.map((perm) => {
                            const isChecked = formData.permissions.includes(perm.id);
                            return (
                              <label
                                key={perm.id}
                                className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-white transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleTogglePermission(perm.id)}
                                  className="w-4 h-4 rounded border-gray-300 text-red-primary focus:ring-red-primary/20 accent-[#C8102E]"
                                />
                                <span className="text-xs font-semibold text-gray-700">{perm.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
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
                  <span>{editingRole ? "Update Role" : "Create Role"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}