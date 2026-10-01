import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { Download, ArrowLeft, FileText, Printer, Loader2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import VersionSwitcher from "@/components/resume/VersionSwitcher";
import { HTMLResumeView } from "@/components/export/HTMLResumeView";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { useResumeDetail } from "@/hooks/useResumes";

export function Export() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useResumeDetail(id);
  const [activeVersionId, setActiveVersionId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const resume = data?.resume;
  const versions = data?.versions || [];

  useEffect(() => {
    if (versions.length > 0 && !activeVersionId) {
      const current = versions.find((v) => v._id === resume?.currentVersionId) || versions[0];
      setActiveVersionId(current._id);
    }
  }, [versions, resume, activeVersionId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 rounded-full" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-[600px] w-full rounded-3xl" />
      </div>
    );
  }

  if (isError || !resume) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="font-display text-xl font-bold text-ink">Resume Not Found</h2>
        <Button onClick={() => navigate("/resumes")}>Back to Resumes</Button>
      </div>
    );
  }

  const activeVersion = versions.find((v) => v._id === activeVersionId) || versions[0];
  const parsedSections = activeVersion?.parsedSections || {};
  const candidateName = parsedSections.basics?.name || "Candidate";

  const sanitizedFilename = `${candidateName}_${resume.title}_${activeVersion?.label || "V1"}`
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .concat(".pdf");

  const handleDownloadPDF = async () => {
    const element = document.getElementById("printable-resume");
    if (!element) return;

    setIsGenerating(true);
    try {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: sanitizedFilename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Export PDF Document"
        description="Preview and download your ATS-formatted PDF resume."
        action={
          <Button onClick={() => navigate(`/resumes/${id}`)} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" /> Back to Resume Details
          </Button>
        }
      />

      {/* Version Selector Bar */}
      <VersionSwitcher
        versions={versions}
        activeVersionId={activeVersionId}
        onSelectVersion={(vId) => setActiveVersionId(vId)}
      />

      {/* Download Header Box */}
      <Card className="p-6 bg-surface border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-ink">
              Ready to Download ({activeVersion?.label})
            </h3>
            <p className="text-xs text-ink-muted">Filename: {sanitizedFilename}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            onClick={handlePrint}
            className="flex-1 sm:flex-none cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </Button>
          <Button
            variant="primary"
            size="md"
            loading={isGenerating}
            onClick={handleDownloadPDF}
            className="flex-1 sm:flex-none cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download PDF Resume
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Live PDF Preview Viewer */}
      <div className="w-full overflow-hidden p-2 sm:p-6 bg-surface-2/40 rounded-3xl border border-border">
        <HTMLResumeView parsedSections={parsedSections} title={resume.title} />
      </div>
    </div>
  );
}

export default Export;
