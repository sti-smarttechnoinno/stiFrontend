import Link from "next/link";
import { PackageOpen, ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 border border-gray-200">
            <PackageOpen size={28} />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Product not found</h1>
          <p className="text-sm text-gray-500">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
        <Link
          href="/en/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-bold hover:bg-gray-50 transition-all"
        >
          <ArrowLeft size={14} />
          Back to Products
        </Link>
      </div>
    </div>
  );
}
