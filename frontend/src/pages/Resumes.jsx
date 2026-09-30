import React, { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import UploadDropzone from "@/components/resume/UploadDropzone";
import ResumeRow from "@/components/resume/ResumeRow";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { useResumes } from "@/hooks/useResumes";

export function Resumes() {
  const { resumes, isLoading, deleteResume, refetch } = useResumes();
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Resumes"
        description="Upload your PDF resumes, run ATS analyses, and generate AI bullet improvements."
      />

      {/* Upload Dropzone Container */}
      <Card className="p-6">
        <UploadDropzone onComplete={() => refetch()} />
      </Card>

      {/* Resumes List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">
            Uploaded Resumes ({resumes.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        ) : resumes.length === 0 ? (
          <EmptyState
            title="No resumes uploaded yet"
            description="Drag & drop a PDF resume into the dropzone above to get your first ATS score."
          />
        ) : (
          <div className="w-full overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto rounded-3xl border border-border bg-surface shadow-xs">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface-2/60 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                    <th className="py-3 px-4">Resume Title</th>
                    <th className="py-3 px-4">ATS Score</th>
                    <th className="py-3 px-4">Versions</th>
                    <th className="py-3 px-4">Last Updated</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {resumes.map((resume) => (
                    <ResumeRow
                      key={resume._id}
                      resume={resume}
                      onDelete={(id) => deleteResume(id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="sm:hidden space-y-3">
              {resumes.map((resume) => (
                <ResumeRow
                  key={resume._id}
                  resume={resume}
                  onDelete={(id) => deleteResume(id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Resumes;
