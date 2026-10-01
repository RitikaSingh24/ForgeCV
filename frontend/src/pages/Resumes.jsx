import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import UploadDropzone from "@/components/resume/UploadDropzone";
import TargetJobPanel from "@/components/resume/TargetJobPanel";
import { ResumeTableRow, ResumeCard } from "@/components/resume/ResumeRow";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { useResumes } from "@/hooks/useResumes";
import { useUI } from "@/context/UIContext";
import resumesApi from "@/api/resumes";

export function Resumes() {
  const { resumes, isLoading, deleteResume, refetch } = useResumes();
  const { showToast } = useUI();
  const navigate = useNavigate();

  const [stagedFile, setStagedFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [uploadedResumeId, setUploadedResumeId] = useState(null);
  const [uploadedVersionId, setUploadedVersionId] = useState(null);

  const [submitStage, setSubmitStage] = useState("idle"); // "idle" | "uploading" | "analyzing"

  const jdTrimmed = (jobDescription || "").trim();
  const jdError =
    jdTrimmed.length > 0 && jdTrimmed.length < 50
      ? "Job description must be at least 50 characters (or leave empty)"
      : null;

  const isRunning = submitStage !== "idle";
  const isAnalyzeDisabled = !stagedFile || isRunning || !!jdError;

  const handleFileSelect = (file) => {
    setStagedFile(file);
    setUploadedResumeId(null);
    setUploadedVersionId(null);
  };

  const handleAnalyze = async () => {
    if (isAnalyzeDisabled) return;

    let currentResumeId = uploadedResumeId;
    let currentVersionId = uploadedVersionId;

    try {
      if (!currentResumeId) {
        setSubmitStage("uploading");
        const uploadRes = await resumesApi.upload(stagedFile);
        const resumeObj = uploadRes?.data?.resume || uploadRes?.resume || uploadRes;
        const versionObj = uploadRes?.data?.initialVersion || uploadRes?.initialVersion;

        currentResumeId = resumeObj?._id || resumeObj?.id;
        currentVersionId = versionObj?._id || versionObj?.id;

        if (!currentResumeId) {
          throw new Error("Failed to upload resume file.");
        }

        setUploadedResumeId(currentResumeId);
        if (currentVersionId) setUploadedVersionId(currentVersionId);
      }

      setSubmitStage("analyzing");
      await resumesApi.analyze(currentResumeId, {
        versionId: currentVersionId || undefined,
        targetRole: targetRole.trim(),
        jobDescription: jobDescription.trim(),
      });

      showToast("Resume uploaded and analyzed successfully!", "success");
      refetch();
      navigate(`/resumes/${currentResumeId}`);
    } catch (err) {
      showToast(err.message || "Failed to analyze resume.", "error");
    } finally {
      setSubmitStage("idle");
    }
  };

  const buttonText =
    submitStage === "uploading"
      ? "Uploading..."
      : submitStage === "analyzing"
      ? "Analyzing..."
      : "Analyze Resume";

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Resumes"
        description="Upload your PDF resumes, run ATS analyses, and generate AI bullet improvements."
      />

      {/* Upload Dropzone & Target Job 2-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <UploadDropzone
          autoUpload={false}
          onFileSelect={handleFileSelect}
          selectedFile={stagedFile}
          disabled={isRunning}
        />

        <div className="flex flex-col justify-between space-y-4">
          <TargetJobPanel
            targetRole={targetRole}
            setTargetRole={setTargetRole}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            disabled={isRunning}
            jdError={jdError}
          />

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzeDisabled}
            loading={isRunning}
            variant="primary"
            className="w-full min-h-[44px] py-3 text-sm font-bold rounded-2xl shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            {buttonText}
          </Button>
        </div>
      </div>

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
            description="Select a PDF resume above to get your first ATS score."
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
                    <ResumeTableRow
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
                <ResumeCard
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
