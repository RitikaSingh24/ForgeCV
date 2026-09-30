import React from "react";
import { Link } from "react-router-dom";
import { Layers, Sparkles, ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export function VersionStack({ versions = [] }) {
  if (!versions || versions.length === 0) {
    return (
      <Card className="p-6 text-center text-xs text-ink-muted">
        No version history available yet.
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent" /> Recent Version Stack
        </h3>
        <Link to="/versions" className="text-xs font-semibold text-accent hover:underline">
          View all →
        </Link>
      </div>

      <div className="space-y-2.5">
        {versions.map((v) => (
          <Link
            key={v._id}
            to={`/resumes/${v.resumeId}`}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-2/60 border border-border/50 hover:bg-surface-2 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
                {v.sourceType === "rewrite" ? <Sparkles className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-ink truncate">
                  {v.resumeTitle} ({v.label})
                </p>
                <p className="text-[11px] text-ink-muted">{formatDate(v.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge variant={v.score >= 80 ? "success" : v.score >= 60 ? "warning" : "neutral"}>
                {v.score !== null && v.score !== undefined ? `${v.score} ATS` : "Pending"}
              </Badge>
              <ChevronRight className="w-4 h-4 text-ink-muted group-hover:text-accent transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export default VersionStack;
