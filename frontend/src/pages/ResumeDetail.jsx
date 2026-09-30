import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sparkles, Download, RefreshCw, Briefcase, FileText } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import VersionSwitcher from "@/components/resume/VersionSwitcher";
import DiffView from "@/components/resume/DiffView";
import AtsGauge from "@/components/dashboard/AtsGauge";
import ScoreBreakdown from "@/components/analysis/ScoreBreakdown";
import IssuesList from "@/components/analysis/IssuesList";
import StrengthsList from "@/components/analysis/StrengthsList";
import KeywordChips from "@/components/analysis/KeywordChips";
import BulletRewrites from "@/components/analysis/BulletRewrites";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Tabs from "@/components/ui/Tabs";
import Skeleton from "@/components/ui/Skeleton";
import { useResumeDetail } from "@/hooks/useResumes";
import resumesApi from "@/api/resumes";

export function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, analyze, isAnalyzing, rewrite, isRewriting } = useResumeDetail(id);

  const [activeVersionId, setActiveVersionId] = useState(null);
  const [activeTab, setActiveTab] = useState("issues");
  const [targetRole, setTargetRole] = useState("General Software Engineer");
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
    try {
      await analyze({ versionId: activeVersionId, targetRole });
      setShowRoleInput(false);
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
    { id: "keywords", label: "Keywords" },
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
              onClick={() => navigate(`/resumes/${id}/export`)}
              variant="secondary"
              size="sm"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button
              onClick={() => setShowRoleInput(!showRoleInput)}
              variant="primary"
              size="sm"
              loading={isAnalyzing}
            >
              <Sparkles className="w-4 h-4" />
              {analysis ? "Re-analyze ATS" : "Run ATS Analysis"}
            </Button>
          </div>
        }
      />

      {/* Target Role Input bar */}
      {showRoleInput && (
        <Card className="p-4 bg-surface border-accent/30 shadow-md">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Input
              icon={Briefcase}
              placeholder="Target job role (e.g. Senior Frontend Engineer, Product Manager)"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleRunAnalysis}
              loading={isAnalyzing}
              variant="primary"
              className="w-full sm:w-auto"
            >
              Start Analysis →
            </Button>
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
          <div className="mt-4 space-y-1">
            <span className="text-xs font-bold text-ink-muted uppercase tracking-wider block">
              Gemini AI Evaluation
            </span>
            <p className="text-xs text-ink-muted">
              Target Role: <strong className="text-ink">{targetRole}</strong>
            </p>
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

        {activeTab === "issues" && <IssuesList issues={analysis?.issues} />}
        {activeTab === "strengths" && <StrengthsList strengths={analysis?.strengths} />}
        {activeTab === "keywords" && (
          <KeywordChips
            present={analysis?.keywordsPresent}
            missing={analysis?.keywordsMissing}
          />
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
