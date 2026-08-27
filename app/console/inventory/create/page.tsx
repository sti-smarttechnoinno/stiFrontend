"use client";

import ProductForm from '@/app/components/admin/products/ProductForm';

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <ProductForm isEditing={false} />
    </div>
  );
}
