import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Sparkles, CheckCircle2, Calendar } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Tabs from "@/components/ui/Tabs";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { useAnalytics } from "@/hooks/useAnalytics";
import { formatDate } from "@/lib/utils";

export function History() {
  const { history, isLoadingHistory } = useAnalytics();
  const [filter, setFilter] = useState("all");

  if (isLoadingHistory) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 rounded-full" />
        <Skeleton className="h-10 w-80 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-3xl" />
          <Skeleton className="h-20 w-full rounded-3xl" />
          <Skeleton className="h-20 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  const filterTabs = [
    { id: "all", label: "All Activity" },
    { id: "upload", label: "Uploads" },
    { id: "analysis", label: "Analyses" },
    { id: "rewrite", label: "Rewrites" },
  ];

  const filteredHistory = (history || []).filter((item) => {
    if (filter === "all") return true;
    if (filter === "upload") return item.type === "upload";
    if (filter === "analysis") return item.type === "analysis";
    if (filter === "rewrite") return item.type === "rewrite";
    return true;
  });

  // Group events by day
  const groupedEvents = filteredHistory.reduce((acc, item) => {
    const dayKey = formatDate(item.at);
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(item);
    return acc;
  }, {});

  const getIcon = (type) => {
    if (type === "analysis") return <Sparkles className="w-4 h-4 text-amber-600" />;
    if (type === "rewrite") return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    return <FileText className="w-4 h-4 text-accent" />;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Activity History"
        description="Chronological timeline of all resume uploads, ATS analyses, and AI bullet rewrites."
      />

      <Tabs tabs={filterTabs} activeTab={filter} onChange={(t) => setFilter(t)} />

      {filteredHistory.length === 0 ? (
        <EmptyState
          title="No history recorded"
          description="Your activity timeline will appear here as you upload and analyze resumes."
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedEvents).map(([dayLabel, events]) => (
            <div key={dayLabel} className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted px-1">
                <Calendar className="w-4 h-4 text-accent" />
                <span>{dayLabel}</span>
              </div>

              <Card className="p-2 divide-y divide-border/40">
                {events.map((ev) => (
                  <Link
                    key={ev.id}
                    to={ev.resumeId ? `/resumes/${ev.resumeId}` : "#"}
                    className="p-3.5 flex items-start justify-between gap-4 hover:bg-surface-2/60 rounded-2xl transition-colors group"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-surface-2 border border-border flex items-center justify-center shrink-0 mt-0.5">
                        {getIcon(ev.type)}
                      </div>
                      <div className="truncate">
                        <p className="font-display font-semibold text-sm text-ink group-hover:text-accent transition-colors truncate">
                          {ev.resumeTitle} ({ev.versionLabel})
                        </p>
                        <p className="text-xs text-ink-muted truncate">
                          {ev.type === "analysis"
                            ? `ATS Analysis (Score: ${ev.score || "N/A"})`
                            : ev.type === "rewrite"
                            ? `Created AI rewrite version ${ev.versionLabel}`
                            : "Uploaded initial PDF resume"}
                        </p>
                      </div>
                    </div>

                    {ev.score !== null && ev.score !== undefined && (
                      <span className="text-xs font-bold text-accent px-2.5 py-1 rounded-full bg-accent-soft border border-accent/20 shrink-0 tabular-nums">
                        {ev.score} ATS
                      </span>
                    )}
                  </Link>
                ))}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
