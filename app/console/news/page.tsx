"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
  CheckCircle2,
  Loader2,
  Calendar,
  FolderPlus,
  Tag,
  X,
  Globe2,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";
import type { ApiNewsItem } from "../../api/news/route";
import type { ApiCategoryItem } from "../../api/news/categories/route";

export default function NewsManagementPage() {
  const [articles, setArticles] = useState<ApiNewsItem[]>([]);
  const [categories, setCategories] = useState<ApiCategoryItem[]>([]);
  const [featuredId, setFeaturedId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  // Category Manager State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [catInputEn, setCatInputEn] = useState("");
  const [catInputAr, setCatInputAr] = useState("");
  const [catInputFr, setCatInputFr] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const [artRes, catRes, featRes] = await Promise.all([
        fetch("/api/news"),
        fetch("/api/news/categories"),
        fetch("/api/news/featured"),
      ]);

      if (artRes.ok) {
        const data = await artRes.json();
        setArticles(data);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }
      if (featRes.ok) {
        const featData = await featRes.json();
        setFeaturedId(featData.featuredId);
      }
    } catch {
      // Keep state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this news article?")) return;
    setDeletingId(id);

    try {
      await fetch(`/api/news/${id}`, { method: "DELETE" });
      setArticles((prev) => prev.filter((a) => String(a.id) !== String(id)));
    } catch {
      // Failed to delete
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (id: string | number, currentStatus: string) => {
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (String(a.id) === String(id) ? { ...a, status: newStatus } : a))
        );
      }
    } catch {}
  };

  const handleMakeFeatured = async (id: string | number) => {
    try {
      const res = await fetch("/api/news/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const data = await res.json();
        setFeaturedId(data.featuredId);
      }
    } catch {
      // Keep state
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catInputEn.trim() || !catInputAr.trim() || !catInputFr.trim()) return;
    setSavingCategory(true);

    try {
      const res = await fetch("/api/news/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          en: catInputEn.trim(),
          ar: catInputAr.trim(),
          fr: catInputFr.trim(),
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCategories(updated);
        setCatInputEn("");
        setCatInputAr("");
        setCatInputFr("");
      }
    } catch {
      // Keep state
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Articles under this category may have raw/incorrect keys.")) return;

    try {
      const res = await fetch(`/api/news/categories?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const updated = await res.json();
        setCategories(updated);
      }
    } catch {
      // Keep state
    }
  };

  // Helper to render category name in English
  const getCategoryName = (catIdOrName: string) => {
    const found = categories.find((c) => c.id === catIdOrName || c.translations.en === catIdOrName);
    return found ? found.translations.en : catIdOrName;
  };

  const filteredArticles = articles.filter((art) => {
    const title = art.translations?.en?.title || art.slug;
    const catNameEn = getCategoryName(art.category);
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      catNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === "All" || art.category === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            News &amp; Articles Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create, edit, localize, categorize, set featured content, and publish official announcements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <FolderPlus size={16} className="text-red-primary" />
            Manage Categories ({categories.length})
          </button>

          <Link
            href="/console/news/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-primary text-white text-xs font-bold rounded-xl hover:bg-red-primary/90 transition-all hover:shadow-lg hover:shadow-red-primary/20"
          >
            <Plus size={16} />
            Add News Article
          </Link>
        </div>
      </div>

      {/* Category Manager Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-50 text-red-primary">
                  <Tag size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Multilingual Category Manager</h3>
                  <p className="text-xs text-gray-500">Provide English, Arabic, and French translations when adding categories.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Globe2 size={14} className="text-red-primary" />
                Add New Multilingual Category
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">ENGLISH *</label>
                  <input
                    type="text"
                    required
                    value={catInputEn}
                    onChange={(e) => setCatInputEn(e.target.value)}
                    placeholder="e.g. Events"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium focus:border-red-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">العربية (RTL) *</label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={catInputAr}
                    onChange={(e) => setCatInputAr(e.target.value)}
                    placeholder="الفعاليات"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium focus:border-red-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">FRANÇAIS *</label>
                  <input
                    type="text"
                    required
                    value={catInputFr}
                    onChange={(e) => setCatInputFr(e.target.value)}
                    placeholder="Événements"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium focus:border-red-primary outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingCategory || !catInputEn.trim() || !catInputAr.trim() || !catInputFr.trim()}
                  className="px-4 py-2 rounded-lg bg-red-primary text-white text-xs font-bold hover:bg-red-primary/90 transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Category
                </button>
              </div>
            </form>

            {/* Categories List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Active Categories ({categories.length})
              </div>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-800"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-primary" />
                      <span className="font-bold text-gray-900">{cat.translations.en}</span>
                      <span className="text-[10px] text-gray-400">({cat.id})</span>
                    </div>
                    <div className="text-[10px] text-gray-400 flex items-center gap-2">
                      <span>AR: {cat.translations.ar}</span>
                      <span>•</span>
                      <span>FR: {cat.translations.fr}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
            <div className="relative max-w-sm w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search news by headline, category or slug..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:border-red-primary bg-white"
            >
              <option value="All">All Categories ({articles.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.translations.en}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs font-bold text-gray-500 shrink-0">
            Total Articles: <span className="text-red-primary font-bold">{filteredArticles.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="animate-spin text-red-primary" />
            <span className="text-xs font-semibold">Loading news articles from database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-700">
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Article Headline (EN)</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Featured</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Published Date</th>
                  <th className="text-right py-3 px-4 font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => {
                  const title = article.translations?.en?.title || article.slug;
                  const isFeatured = String(article.id) === String(featuredId);
                  return (
                    <tr key={article.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-primary border border-red-100">
                            <FileText size={16} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 line-clamp-1 max-w-xs sm:max-w-md">{title}</div>
                            <div className="text-[10px] text-gray-400 font-mono">/news/{article.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 font-mono text-[11px] font-medium border border-gray-200">
                          {getCategoryName(article.category)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            article.status === "Published"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          <CheckCircle2 size={12} />
                          {article.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleMakeFeatured(article.id)}
                          className="flex items-center justify-center"
                          title={isFeatured ? "Currently featured article" : "Click to set as featured article"}
                        >
                          <Star
                            size={16}
                            className={`transition-all duration-200 ${
                              isFeatured
                                ? "text-amber-500 fill-amber-500 scale-110 drop-shadow-sm"
                                : "text-gray-300 hover:text-amber-500 hover:scale-110"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} className="text-gray-400" />
                          {article.publishedAt || "Recently"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleVisibility(article.id, article.status)}
                            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            title={article.status === "Published" ? "Change to Draft" : "Change to Published"}
                          >
                            {article.status === "Published" ? <Eye size={14} /> : <EyeOff size={14} className="text-red-primary" />}
                          </button>
                          <Link
                            href={`/console/news/${article.id}/edit`}
                            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            title="Edit news article"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id)}
                            disabled={deletingId === article.id}
                            className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Delete news article"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
