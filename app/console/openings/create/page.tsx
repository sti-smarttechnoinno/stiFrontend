"use client";

import JobForm from "../../../components/admin/openings/JobForm";

export default function CreateJobPage() {
  return (
    <div className="space-y-6">
      <JobForm isEditing={false} />
    </div>
  );
}
