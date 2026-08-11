"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import JobForm, { MultilingualJobFormValues } from "../../../../components/admin/openings/JobForm";
import { Loader2 } from "lucide-react";

export default function EditJobPage() {
  const params = useParams();
  const id = params?.id ? String(params.id) : "1";
  const [jobData, setJobData] = useState<MultilingualJobFormValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJob() {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setJobData(data);
        }
      } catch (err) {
        console.error("Failed to load job from API", err);
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-2 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-red-primary" />
        <span className="text-xs font-semibold">Loading job details from DB...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <JobForm isEditing={true} jobId={id} initialValues={jobData || undefined} />
    </div>
  );
}
