import React from "react";

export function ScoreBreakdown({ items = [] }) {
  if (!items || items.length === 0) return null;

  const getBarColor = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-ink font-display">{item.label}</span>
            <span className="text-ink-muted tabular-nums font-bold">
              {item.score} / {item.max || 100}
            </span>
          </div>
          <div className="h-2.5 w-full bg-surface-2 rounded-full overflow-hidden p-0.5 border border-border/40">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(item.score)}`}
              style={{ width: `${Math.min(100, item.score)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ScoreBreakdown;
