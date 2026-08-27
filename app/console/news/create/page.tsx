"use client";

import NewsForm from '@/app/components/admin/news/NewsForm';

export default function CreateNewsPage() {
  return (
    <div className="space-y-6">
      <NewsForm isEditing={false} />
    </div>
  );
}
