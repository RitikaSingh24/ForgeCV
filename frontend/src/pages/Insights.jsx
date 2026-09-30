import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import ScoreEvolutionChart from "@/components/dashboard/ScoreEvolutionChart";
import ScoreBreakdown from "@/components/analysis/ScoreBreakdown";
import KeywordChips from "@/components/analysis/KeywordChips";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { useAnalytics } from "@/hooks/useAnalytics";

export function Insights() {
  const { insights, isLoadingInsights } = useAnalytics();

  if (isLoadingInsights) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 rounded-full" />
        <Skeleton className="h-64 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  const { scoreTrends = [], topIssues = [], missingKeywords = [], sectionAverages = [] } =
    insights || {};

  const isEmpty =
    scoreTrends.length === 0 &&
    topIssues.length === 0 &&
    missingKeywords.length === 0 &&
    sectionAverages.length === 0;

  if (isEmpty) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Insights & AI Analytics"
          description="Aggregate performance patterns, top recurring issues, and missing keyword frequency."
        />
        <EmptyState
          title="No analytics data available yet"
          description="Upload a PDF resume and run an ATS analysis to generate detailed insights."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Insights & AI Analytics"
        description="Aggregate performance patterns, top recurring issues, and missing keyword frequency across all your resumes."
      />

      {/* Score Trend Chart */}
      <Card className="p-6 space-y-4">
        <div>
          <h3 className="font-display font-bold text-base text-ink">
            Overall ATS Score Progression
          </h3>
          <p className="text-xs text-ink-muted">Historical scores across all uploaded resume versions</p>
        </div>
        <ScoreEvolutionChart data={scoreTrends} />
      </Card>

      {/* Section Averages + Top Recurring Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Averages */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-ink">
              Section Performance Averages
            </h3>
            <p className="text-xs text-ink-muted">Average score breakdown by evaluation category</p>
          </div>
          <ScoreBreakdown items={sectionAverages} />
        </Card>

        {/* Top Recurring Issues */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-ink">
              Top Recurring Issues ({topIssues.length})
            </h3>
            <p className="text-xs text-ink-muted">Most common flaws detected across your resumes</p>
          </div>

          <div className="space-y-3">
            {topIssues.length === 0 ? (
              <p className="text-xs text-ink-muted">No recurring issues detected!</p>
            ) : (
              topIssues.map((issue, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-surface-2/60 border border-border/50 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-xs text-ink truncate">
                      {issue.title}
                    </span>
                    <Badge variant={issue.severity === "high" ? "danger" : "warning"}>
                      {issue.count} occurrence(s)
                    </Badge>
                  </div>
                  <span className="text-[11px] text-ink-muted block">{issue.section}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Missing Keywords Frequency */}
      <KeywordChips present={[]} missing={missingKeywords.map((k) => k.keyword)} />
    </div>
  );
}

export default Insights;
