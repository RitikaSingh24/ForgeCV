import React from "react";
import { Link } from "react-router-dom";
import { Clock, FileText, Sparkles, CheckCircle2 } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

export function ActivityFeed({ events = [] }) {
  if (!events || events.length === 0) {
    return (
      <Card className="p-6 text-center text-xs text-ink-muted">
        No recent activity logged yet.
      </Card>
    );
  }

  const getIcon = (type) => {
    if (type === "analysis") return <Sparkles className="w-4 h-4 text-amber-600" />;
    if (type === "rewrite") return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    return <FileText className="w-4 h-4 text-accent" />;
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent" /> Recent Activity
        </h3>
        <Link to="/history" className="text-xs font-semibold text-accent hover:underline">
          Full history →
        </Link>
      </div>

      <div className="space-y-3">
        {events.slice(0, 5).map((ev) => (
          <div key={ev.id} className="flex items-start gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-surface-2 border border-border flex items-center justify-center shrink-0 mt-0.5">
              {getIcon(ev.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink truncate">{ev.title}</p>
              <p className="text-[11px] text-ink-muted truncate">{ev.resumeTitle}</p>
            </div>
            <span className="text-[10px] text-ink-muted shrink-0">{formatDate(ev.at)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ActivityFeed;
