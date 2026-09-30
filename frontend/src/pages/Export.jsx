import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Download, ArrowLeft, FileText, CheckCircle } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import VersionSwitcher from "@/components/resume/VersionSwitcher";
import { ResumeDocument } from "@/components/export/ResumeDocument";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { useResumeDetail } from "@/hooks/useResumes";

export function Export() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useResumeDetail(id);
  const [activeVersionId, setActiveVersionId] = useState(null);

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

        <PDFDownloadLink
          document={<ResumeDocument parsedSections={parsedSections} title={resume.title} />}
          fileName={sanitizedFilename}
        >
          {({ loading }) => (
            <Button variant="primary" size="md" loading={loading} className="w-full sm:w-auto">
              <Download className="w-4 h-4" />
              {loading ? "Generating PDF..." : "Download PDF Resume"}
            </Button>
          )}
        </PDFDownloadLink>
      </Card>

      {/* Desktop Live PDF Preview Viewer */}
      <div className="hidden md:block w-full h-[700px] rounded-3xl overflow-hidden border border-border shadow-lg bg-surface">
        <PDFViewer width="100%" height="100%" className="border-none">
          <ResumeDocument parsedSections={parsedSections} title={resume.title} />
        </PDFViewer>
      </div>

      {/* Mobile Card Preview Fallback */}
      <div className="md:hidden">
        <Card className="p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-base text-ink">PDF Document Ready</h3>
          <p className="text-xs text-ink-muted leading-relaxed">
            Live PDF iframe preview is hidden on smaller touch screens for optimal performance. Click the download button above to retrieve your document.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default Export;
