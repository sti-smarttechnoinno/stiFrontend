"use client";

import SolutionForm from "../../../components/admin/solutions/SolutionForm";

export default function CreateSolutionPage() {
  return (
    <div className="space-y-6">
      <SolutionForm isEditing={false} />
    </div>
  );
}
