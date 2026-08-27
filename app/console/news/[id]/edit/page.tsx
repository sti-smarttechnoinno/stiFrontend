"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NewsForm, { MultilingualNewsFormValues } from '@/app/components/admin/news/NewsForm';
import { Loader2 } from "lucide-react";

export default function EditNewsPage() {
  const params = useParams();
  const id = params?.id ? String(params.id) : "1";
  const [newsData, setNewsData] = useState<MultilingualNewsFormValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/news/${id}`);
        if (res.ok) {
          const data = await res.json();
          setNewsData(data);
        }
      } catch (err) {
        console.error("Failed to load news article from API", err);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-2 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-red-primary" />
        <span className="text-xs font-semibold">Loading news article from DB...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NewsForm isEditing={true} newsId={id} initialValues={newsData || undefined} />
    </div>
  );
}
