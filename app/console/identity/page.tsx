"use client";

import { useEffect, useState } from "react";
import { Save, Users, Award, Plus, Trash2, Edit2, Upload, CheckCircle2, UserCheck, X, Link as LinkIcon } from "lucide-react";
import type { TeamMember } from "../../api/team/route";

export default function CompanyPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Modal / Form state for Add/Edit Member
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState<"en" | "ar" | "fr">("en");

  // English fields
  const [nameEn, setNameEn] = useState("");
  const [positionEn, setPositionEn] = useState("");

  // Arabic fields
  const [nameAr, setNameAr] = useState("");
  const [positionAr, setPositionAr] = useState("");

  // French fields
  const [nameFr, setNameFr] = useState("");
  const [positionFr, setPositionFr] = useState("");

  const [formImage, setFormImage] = useState("");
  const [formLinkedin, setFormLinkedin] = useState("");

  // Statistics
  const [wilayas, setWilayas] = useState("");
  const [partners, setPartners] = useState("");
  const [responseTime, setResponseTime] = useState("");
  const [productsCount, setProductsCount] = useState("");

  useEffect(() => {
    // 1. Fetch team members from /api/team
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMembers(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load team from API", err);
      });

    // 2. Fetch Statistics from /api/preferences
    fetch("/api/preferences")
      .then((res) => res.json())
      .then((data) => {
        if (data.statistics) {
          setWilayas(data.statistics.provincesServed || "");
          setPartners(data.statistics.businessPartners || "");
          setResponseTime(data.statistics.averageResponse || "");
          setProductsCount(data.statistics.officialProducts || "");
        }
      })
      .catch(() => {});
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setActiveTab("en");
    setNameEn(""); setPositionEn("");
    setNameAr(""); setPositionAr("");
    setNameFr(""); setPositionFr("");
    setFormImage("");
    setFormLinkedin("");
    setModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setActiveTab("en");

    const tr = member.translations || {};
    setNameEn(tr.en?.name || member.name || "");
    setPositionEn(tr.en?.position || member.position || "");

    setNameAr(tr.ar?.name || "");
    setPositionAr(tr.ar?.position || "");

    setNameFr(tr.fr?.name || "");
    setPositionFr(tr.fr?.position || "");

    setFormImage(member.image || "");
    setFormLinkedin(member.linkedin || "");
    setModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveMemberForm = () => {
    const mainName = nameEn || nameAr || nameFr;
    const mainPosition = positionEn || positionAr || positionFr;

    if (!mainName || !mainPosition) {
      alert("Please fill in at least Name and Position in English or Arabic.");
      return;
    }

    const initials = mainName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const cleanLinkedin = formLinkedin.trim();

    const memberData: TeamMember = {
      id: editingMember ? editingMember.id : Date.now().toString(),
      name: mainName,
      position: mainPosition,
      initials,
      image: formImage,
      linkedin: cleanLinkedin,
      translations: {
        en: { name: nameEn || mainName, position: positionEn || mainPosition },
        ar: { name: nameAr || nameEn, position: positionAr || positionEn },
        fr: { name: nameFr || nameEn, position: positionFr || positionEn },
      },
    };

    if (editingMember) {
      setMembers((prev) => prev.map((m) => (m.id === editingMember.id ? memberData : m)));
    } else {
      setMembers((prev) => [...prev, memberData]);
    }

    setModalOpen(false);
  };

  const deleteMember = (id: string) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      // 1. Save team members to API
      const teamRes = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(members),
      });

      if (teamRes.ok) {
        const teamData = await teamRes.json();
        if (Array.isArray(teamData) && teamData.length > 0) {
          setMembers(teamData);
        } else if (teamData && teamData.members && Array.isArray(teamData.members) && teamData.members.length > 0) {
          setMembers(teamData.members);
        }
      }

      // 2. Fetch current preferences, merge, and POST updated statistics
      let currentPrefs = {};
      try {
        const prefRes = await fetch("/api/preferences");
        if (prefRes.ok) {
          currentPrefs = await prefRes.json();
        }
      } catch {}

      const statisticsPayload = {
        provincesServed: wilayas,
        businessPartners: partners,
        averageResponse: responseTime,
        officialProducts: productsCount,
      };

      const updatedPrefs = {
        ...currentPrefs,
        statistics: statisticsPayload,
      };

      await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPrefs),
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving company data:", err);
      alert("Error saving company data.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Company Leadership &amp; Team
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage multilingual team members and company key statistics displayed on the website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Plus size={16} /> Add Team Member
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-primary text-white text-xs font-bold rounded-xl hover:bg-red-primary/90 transition-all hover:shadow-lg hover:shadow-red-primary/20 disabled:opacity-60"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 size={16} /> Saved!
              </>
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members List (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                <Users size={18} className="text-red-primary" />
                Our Team Members ({members.length})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Multilingual EN / AR / FR information &amp; LinkedIn profile management.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-primary/10 text-red-primary hover:bg-red-primary hover:text-white text-xs font-bold rounded-lg transition-colors"
            >
              <Plus size={14} /> Add New
            </button>
          </div>

          {members.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <UserCheck size={36} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs font-medium">No team members added yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {members.map((m) => {
                const hasLinkedin = m.linkedin && m.linkedin.trim() !== "" && m.linkedin !== "#";

                return (
                  <div key={m.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center gap-3.5 relative group">
                    {m.image ? (
                      <img src={m.image} alt={m.name} className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-200" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-primary to-red-accent text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {m.initials || m.name[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0 pr-12">
                      <h3 className="text-xs font-bold text-gray-900 truncate">{m.name}</h3>
                      <div className="text-[11px] font-semibold text-red-primary truncate">{m.position}</div>
                      
                      <div className="mt-1 flex items-center gap-2 text-[10px] font-medium">
                        {hasLinkedin ? (
                          <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                            <LinkIcon size={10} /> LinkedIn Connected
                          </span>
                        ) : (
                          <span className="text-gray-400">No LinkedIn (Icon Hidden)</span>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(m)}
                        title="Edit Member"
                        className="p-1 text-gray-400 hover:text-gray-900 rounded hover:bg-white"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteMember(m.id)}
                        title="Delete Member"
                        className="p-1 text-gray-400 hover:text-red-primary rounded hover:bg-white"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Key Statistics */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
              <Award size={18} className="text-red-primary" />
              Company Statistics
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Key figures displayed on website home and quote pages.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Provinces Covered</label>
              <input
                type="text"
                value={wilayas}
                onChange={(e) => setWilayas(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:border-red-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Active Business Partners</label>
              <input
                type="text"
                value={partners}
                onChange={(e) => setPartners(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:border-red-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Response Time</label>
              <input
                type="text"
                value={responseTime}
                onChange={(e) => setResponseTime(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:border-red-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Product Availability</label>
              <input
                type="text"
                value={productsCount}
                onChange={(e) => setProductsCount(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:border-red-primary outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Member Multilingual Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-100 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {editingMember ? "Edit Team Member" : "Add Team Member"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {/* Language Selector Tabs */}
            <div className="flex border-b border-gray-100 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("en")}
                className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors ${
                  activeTab === "en" ? "bg-red-primary/10 text-red-primary border-b-2 border-red-primary" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                🇬🇧 English (EN)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ar")}
                className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors ${
                  activeTab === "ar" ? "bg-red-primary/10 text-red-primary border-b-2 border-red-primary" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                🇸🇦 العربية (AR)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("fr")}
                className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors ${
                  activeTab === "fr" ? "bg-red-primary/10 text-red-primary border-b-2 border-red-primary" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                🇫🇷 Français (FR)
              </button>
            </div>

            {/* Language Content Forms */}
            {activeTab === "en" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name (English) *</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Karim Benali"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Position / Role (English) *</label>
                  <input
                    type="text"
                    value={positionEn}
                    onChange={(e) => setPositionEn(e.target.value)}
                    placeholder="e.g. General Manager &amp; Founder"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
                  />
                </div>
              </div>
            )}

            {activeTab === "ar" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكامل (بالعربية)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: كريم بن علي"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">المنصب / المسمى الوظيفي (بالعربية)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={positionAr}
                    onChange={(e) => setPositionAr(e.target.value)}
                    placeholder="مثال: المدير العام والمؤسس"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
                  />
                </div>
              </div>
            )}

            {activeTab === "fr" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nom Complet (Français)</label>
                  <input
                    type="text"
                    value={nameFr}
                    onChange={(e) => setNameFr(e.target.value)}
                    placeholder="ex: Karim Benali"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Poste / Rôle (Français)</label>
                  <input
                    type="text"
                    value={positionFr}
                    onChange={(e) => setPositionFr(e.target.value)}
                    placeholder="ex: Directeur Général &amp; Fondateur"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
                  />
                </div>
              </div>
            )}

            {/* Shared Image & Optional LinkedIn URL */}
            <div className="pt-3 border-t border-gray-100 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  LinkedIn URL (Optional - Leave empty to hide LinkedIn icon)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formLinkedin}
                    onChange={(e) => setFormLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username (or leave blank to hide)"
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
                  />
                  <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Profile Photo Upload (Optional)</label>
                <div className="flex items-center gap-3">
                  {formImage ? (
                    <img src={formImage} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-bold">
                      {(nameEn || "T")[0]}
                    </div>
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors">
                    <Upload size={14} /> Upload Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveMemberForm}
                className="px-5 py-2 bg-red-primary text-white text-xs font-bold rounded-xl hover:bg-red-primary/90"
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}