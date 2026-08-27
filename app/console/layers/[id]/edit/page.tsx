"use client";

import { use, useEffect, useState } from "react";
import SolutionForm, { MultilingualSolutionFormValues } from '@/app/components/admin/solutions/SolutionForm';
import { Loader2 } from "lucide-react";

interface EditSolutionPageProps {
  params: Promise<{ id: string }>;
}

export default function EditSolutionPage({ params }: EditSolutionPageProps) {
  const { id } = use(params);
  const [solutionData, setSolutionData] = useState<MultilingualSolutionFormValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSolution() {
      try {
        const res = await fetch(`/api/solutions/${id}`);
        if (res.ok) {
          const data = await res.json();
          setSolutionData(data);
        }
      } catch (err) {
        console.error("Failed to load solution layer from API", err);
      } finally {
        setLoading(false);
      }
    }
    loadSolution();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-2 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-red-primary" />
        <span className="text-xs font-semibold">Loading Solution Layer from DB...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SolutionForm initialValues={solutionData || undefined} isEditing={true} solutionId={id} />
    </div>
  );
}
