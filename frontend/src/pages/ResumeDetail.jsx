import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sparkles, Download, Briefcase, FileText, Trash2, AlertTriangle, Check, Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import VersionSwitcher from "@/components/resume/VersionSwitcher";
import DiffView from "@/components/resume/DiffView";
import AtsGauge from "@/components/dashboard/AtsGauge";
import ScoreBreakdown from "@/components/analysis/ScoreBreakdown";
import IssuesList from "@/components/analysis/IssuesList";
import StrengthsList from "@/components/analysis/StrengthsList";
import BulletRewrites from "@/components/analysis/BulletRewrites";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Tabs from "@/components/ui/Tabs";
import Skeleton from "@/components/ui/Skeleton";
import { useResumeDetail, useResumes } from "@/hooks/useResumes";
import resumesApi from "@/api/resumes";

export function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, analyze, isAnalyzing, rewrite, isRewriting } = useResumeDetail(id);
  const { deleteResume } = useResumes();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteResume = async () => {
    if (confirmDelete) {
      await deleteResume(id);
      navigate("/dashboard");
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
    }
  };

  const [activeVersionId, setActiveVersionId] = useState(null);
  const [activeTab, setActiveTab] = useState("issues");
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [diffData, setDiffData] = useState(null);
  const [loadingDiff, setLoadingDiff] = useState(false);

  const resume = data?.resume;
  const versions = data?.versions || [];

  // Set default active version to current or latest version
  useEffect(() => {
    if (versions.length > 0 && !activeVersionId) {
      const current = versions.find((v) => v._id === resume?.currentVersionId) || versions[0];
      setActiveVersionId(current._id);
    }
  }, [versions, resume, activeVersionId]);

  const activeVersion = versions.find((v) => v._id === activeVersionId) || versions[0];
  const analysis = activeVersion?.analysis;

  const hasJD = !!(analysis?.jobDescription && analysis.jobDescription.trim() !== "");

  // Fallback to "issues" tab if Keywords tab becomes hidden
  useEffect(() => {
    if (!hasJD && activeTab === "keywords") {
      setActiveTab("issues");
    }
  }, [hasJD, activeTab]);

  // Prefill targetRole and jobDescription from latest analysis
  useEffect(() => {
    if (analysis) {
      if (analysis.targetRole !== undefined) {
        setTargetRole(analysis.targetRole || "");
      }
      if (analysis.jobDescription !== undefined) {
        setJobDescription(analysis.jobDescription || "");
      }
    }
  }, [analysis]);

  const jdLength = (jobDescription || "").trim().length;
  const jdError = jdLength > 0 && jdLength < 50
    ? "Job description must be at least 50 characters (or leave empty)"
    : null;

  // Handle Diff fetch when Compare tab is selected
  useEffect(() => {
    if (activeTab === "compare" && versions.length >= 2 && activeVersionId) {
      const fromVersion = versions[versions.length - 1]; // oldest
      const toVersion = activeVersion;
      if (fromVersion && toVersion && fromVersion._id !== toVersion._id) {
        setLoadingDiff(true);
        resumesApi
          .diff(id, fromVersion._id, toVersion._id)
          .then((res) => setDiffData(res))
          .finally(() => setLoadingDiff(false));
      }
    }
  }, [activeTab, activeVersionId, versions, id, activeVersion]);

  const handleRunAnalysis = async () => {
    if (jdError || isAnalyzing) {
      if (jdError) setShowRoleInput(true);
      return;
    }
    try {
      await analyze({ versionId: activeVersionId, targetRole: targetRole.trim(), jobDescription: jobDescription.trim() });
    } catch (err) {
      // handled by hook toast
    }
  };

  const handleApplyRewrites = async (appliedRewriteIds) => {
    try {
      const result = await rewrite({
        versionId: activeVersionId,
        appliedRewriteIds,
      });
      if (result?.version?._id) {
        setActiveVersionId(result.version._id);
      }
    } catch (err) {
      // handled by hook toast
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72 rounded-full" />
        <Skeleton className="h-12 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 md:col-span-2 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !resume) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="font-display text-xl font-bold text-ink">Resume Not Found</h2>
        <p className="text-sm text-ink-muted">The requested resume does not exist or you do not have permission to view it.</p>
        <Button onClick={() => navigate("/resumes")}>Return to Resumes List</Button>
      </div>
    );
  }

  const tabOptions = [
    { id: "issues", label: `Issues (${analysis?.issues?.length || 0})` },
    { id: "strengths", label: `Strengths (${analysis?.strengths?.length || 0})` },
    ...(hasJD ? [{ id: "keywords", label: "Keywords" }] : []),
    { id: "rewrites", label: `AI Rewrites (${analysis?.bulletRewrites?.length || 0})` },
    ...(versions.length >= 2 ? [{ id: "compare", label: "Compare Versions" }] : []),
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title={resume.title}
        description={`Version ${activeVersion?.label || "V1"} • Uploaded ${new Date(activeVersion?.createdAt || Date.now()).toLocaleDateString()}`}
        action={
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRunAnalysis}
              variant="primary"
              size="sm"
              loading={isAnalyzing}
              disabled={isAnalyzing || !!jdError}
              className="min-h-[44px]"
            >
              <Sparkles className="w-4 h-4" />
              {analysis ? "Re-analyze ATS" : "Run ATS Analysis"}
            </Button>
            <Button
              onClick={() => setShowRoleInput(!showRoleInput)}
              variant="secondary"
              size="sm"
              className="min-h-[44px]"
            >
              <Briefcase className="w-4 h-4" />
              {showRoleInput ? "Hide Job Details" : "Edit Target Job"}
            </Button>
            <Button
              onClick={handleDeleteResume}
              variant="ghost"
              size="sm"
              className={`min-h-[44px] transition-colors ${
                confirmDelete
                  ? "bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold"
                  : "text-ink-muted hover:text-danger hover:bg-surface-2"
              }`}
              title={confirmDelete ? "Click again to confirm deletion" : "Delete resume"}
            >
              {confirmDelete ? (
                <>
                  <AlertTriangle className="w-4 h-4" /> Confirm Delete?
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" /> Delete
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* Target Job (optional) Collapsible Panel */}
      {showRoleInput && (
        <Card className="p-5 bg-surface border border-accent/30 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" />
              <h3 className="font-display font-bold text-sm text-ink">
                Target job (optional)
              </h3>
            </div>
            {analysis?.jobDescription && analysis.jobDescription.trim() !== "" && (
              <Badge variant="accent">Tailored to JD</Badge>
            )}
          </div>

          <div className="space-y-4">
            <Input
              label="Target Role / Job Title"
              placeholder="e.g. Senior Frontend Engineer, Product Manager"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="min-h-[44px]"
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-ink tracking-wide">
                  Job Description (optional)
                </label>
                <span className={`font-mono ${jdError ? "text-rose-600 font-bold" : "text-ink-muted"}`}>
                  {jobDescription.length} / 8000
                </span>
              </div>
              <textarea
                rows={5}
                placeholder="Paste the target job description here to generate a tailored ATS match report, missing JD keywords, and custom bullet rewrites..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                maxLength={8000}
                className={`w-full min-h-[110px] bg-surface border text-ink rounded-2xl p-4 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 placeholder:text-ink-muted/60 transition-all duration-200 ${
                  jdError ? "border-rose-400 bg-rose-50/20" : "border-border"
                }`}
              />
              {jdError && (
                <p className="text-[11px] font-semibold text-rose-600 pt-0.5">
                  {jdError}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleRunAnalysis}
                loading={isAnalyzing}
                disabled={isAnalyzing || !!jdError}
                variant="primary"
                className="w-full sm:w-auto min-h-[44px]"
              >
                <Sparkles className="w-4 h-4" />
                {jobDescription.trim() ? "Analyze against this job" : "Re-analyze ATS"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Version Switcher Bar */}
      <VersionSwitcher
        versions={versions}
        activeVersionId={activeVersionId}
        onSelectVersion={(vId) => setActiveVersionId(vId)}
      />

      {/* Top Overview: Gauge + Summary + Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gauge & Score */}
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <AtsGauge score={analysis?.atsScore || 0} size="lg" />
          <div className="mt-4 space-y-2">
            <span className="text-xs font-bold text-ink-muted uppercase tracking-wider block">
              Gemini AI Evaluation
            </span>
            <p className="text-xs text-ink-muted">
              Target Role: <strong className="text-ink">{targetRole || "General ATS Check"}</strong>
            </p>
            {analysis?.jobDescription && analysis.jobDescription.trim() !== "" && (
              <div className="pt-1">
                <Badge variant="accent">Tailored to JD</Badge>
              </div>
            )}
          </div>
        </Card>

        {/* Summary & Score Breakdown */}
        <Card className="p-6 lg:col-span-2 space-y-6">
          <div>
            <h3 className="font-display font-bold text-base text-ink mb-2">
              Executive AI Summary
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              {analysis?.summary ||
                "No analysis generated for this version yet. Click 'Run ATS Analysis' to evaluate ATS compliance and receive targeted bullet point rewrites."}
            </p>
          </div>

          {analysis?.scoreBreakdown && (
            <div>
              <h4 className="font-display font-semibold text-xs text-ink-muted uppercase tracking-wider mb-3">
                Criteria Breakdown
              </h4>
              <ScoreBreakdown items={analysis.scoreBreakdown} />
            </div>
          )}
        </Card>
      </div>

      {/* Detail Tabs */}
      <div className="space-y-6">
        <Tabs
          tabs={tabOptions}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId)}
        />

        {!hasJD && (
          <p className="text-xs text-ink-muted pt-1">
            Add a job description to see exact keyword matches.
          </p>
        )}

        {activeTab === "issues" && <IssuesList issues={analysis?.issues} />}
        {activeTab === "strengths" && <StrengthsList strengths={analysis?.strengths} />}
        {activeTab === "keywords" && hasJD && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-display font-bold text-sm text-ink">
                  Detected in your resume ({(analysis?.keywordsPresent || []).length})
                </h3>
              </div>
              {(analysis?.keywordsPresent || []).length === 0 ? (
                <p className="text-xs text-ink-muted">No keywords detected from the job description.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordsPresent.map((kw, idx) => (
                    <Badge key={idx} variant="accent" icon={Check}>
                      {kw}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="font-display font-bold text-sm text-ink">
                  Missing from the job description ({(analysis?.keywordsMissing || []).length})
                </h3>
              </div>
              {(analysis?.keywordsMissing || []).length === 0 ? (
                <p className="text-xs text-ink-muted">All key terms from the job description were found in your resume.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordsMissing.map((kw, idx) => (
                    <Badge key={idx} variant="warning" icon={Plus}>
                      {kw}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
        {activeTab === "rewrites" && (
          <BulletRewrites
            rewrites={analysis?.bulletRewrites}
            onApplyRewrites={handleApplyRewrites}
            isRewriting={isRewriting}
          />
        )}
        {activeTab === "compare" && (
          loadingDiff ? (
            <Skeleton className="h-96 rounded-3xl" />
          ) : (
            <DiffView diffData={diffData} />
          )
        )}
      </div>
    </div>
  );
}

export default ResumeDetail;
