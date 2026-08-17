"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Package, CheckCircle2, Tag, Loader2 } from "lucide-react";
import type { ApiProductItem } from "../../api/products/route";

export default function ProductsPage() {
  const [products, setProducts] = useState<ApiProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch {
      // Keep state as is
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product from backend.");
      }
    } catch {
      alert("Error communicating with server to delete product.");
    }
  };

  const filteredProducts = products.filter((p) => {
    const name = p.translations?.en?.name || p.slug;
    return (name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (p.category || "").toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Products Inventory
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage, organize, and inspect your Ooredoo catalog and business packages.
          </p>
        </div>
        <Link
          href="/console/inventory/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-primary text-white text-xs font-bold rounded-xl hover:bg-red-primary/90 transition-all hover:shadow-lg hover:shadow-red-primary/20"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by name or category..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-primary/10 focus:border-red-primary"
            />
          </div>

          <div className="text-xs font-bold text-gray-500">
            Total Products: <span className="text-red-primary font-bold">{filteredProducts.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="animate-spin text-red-primary" />
            <span className="text-xs font-semibold">Loading products from database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-700">
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Product Name (EN)</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Last Updated</th>
                  <th className="text-right py-3 px-4 font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const name = product.translations?.en?.name || product.slug;
                  return (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-primary border border-red-100">
                            <Package size={16} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{name}</div>
                            <div className="text-[10px] text-gray-400">SKU: {product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 font-mono text-[11px] font-medium border border-gray-200">
                          <Tag size={11} className="text-gray-400" />
                          {product.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            product.status === "Published"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          <CheckCircle2 size={12} />
                          {product.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                        {product.updated_at
                          ? new Date(product.updated_at).toLocaleDateString()
                          : "Recently"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/console/inventory/${product.id}/edit`}
                            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            title="Edit product"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete product"
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