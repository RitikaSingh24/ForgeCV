import React, { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export function IssuesList({ issues = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!issues || issues.length === 0) {
    return (
      <Card className="p-8 text-center text-xs text-ink-muted">
        No critical issues detected! Your resume passes primary ATS checks.
      </Card>
    );
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {issues.map((issue) => {
        const isExpanded = expandedId === issue.id;
        const severityVariant =
          issue.severity === "high" ? "danger" : issue.severity === "medium" ? "warning" : "neutral";

        return (
          <div
            key={issue.id}
            className="rounded-2xl border border-border bg-surface p-4 transition-all duration-150 hover:border-accent/30"
          >
            <div
              onClick={() => toggleExpand(issue.id)}
              className="flex items-start justify-between gap-3 cursor-pointer select-none"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant={severityVariant}>
                      {issue.severity.toUpperCase()}
                    </Badge>
                    {issue.section && (
                      <span className="text-[11px] font-semibold text-ink-muted px-2 py-0.5 rounded-full bg-surface-2 border border-border">
                        {issue.section}
                      </span>
                    )}
                  </div>
                  <h4 className="font-display font-bold text-sm text-ink">{issue.title}</h4>
                </div>
              </div>

              <button className="text-ink-muted hover:text-ink p-1">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-border/50 text-xs text-ink-muted leading-relaxed pl-11">
                {issue.detail}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default IssuesList;
