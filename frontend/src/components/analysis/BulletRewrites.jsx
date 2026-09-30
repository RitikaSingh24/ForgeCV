import React, { useState } from "react";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export function BulletRewrites({ rewrites = [], onApplyRewrites, isRewriting = false }) {
  const [selectedIds, setSelectedIds] = useState([]);

  if (!rewrites || rewrites.length === 0) {
    return (
      <Card className="p-8 text-center text-xs text-ink-muted">
        No bullet rewrites available. Run an ATS analysis to generate AI bullet improvements.
      </Card>
    );
  }

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === rewrites.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rewrites.map((r) => r.id));
    }
  };

  const handleApply = () => {
    if (selectedIds.length > 0 && onApplyRewrites) {
      onApplyRewrites(selectedIds);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={selectedIds.length === rewrites.length && rewrites.length > 0}
            onChange={selectAll}
            label={`Select all (${selectedIds.length} of ${rewrites.length} selected)`}
          />
        </div>

        <Button
          onClick={handleApply}
          disabled={selectedIds.length === 0 || isRewriting}
          loading={isRewriting}
          variant="primary"
          size="sm"
        >
          <Sparkles className="w-4 h-4" />
          Apply Selected ({selectedIds.length}) & Create Next Version →
        </Button>
      </div>

      {/* Rewrites Cards */}
      <div className="space-y-4">
        {rewrites.map((rw) => {
          const isSelected = selectedIds.includes(rw.id);

          return (
            <div
              key={rw.id}
              onClick={() => toggleSelect(rw.id)}
              className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-surface border-accent ring-2 ring-accent/20 shadow-md"
                  : "bg-surface border-border hover:border-accent/40"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleSelect(rw.id)}
                  />
                  <Badge variant="accent">{rw.section || "Experience"}</Badge>
                </div>
                <span className="text-[11px] text-ink-muted italic font-serif">
                  {rw.reason}
                </span>
              </div>

              {/* Original vs Improved comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-3">
                {/* Original */}
                <div className="p-3.5 rounded-2xl bg-surface-2/60 border border-border/50 text-ink-muted space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 block">
                    Original Bullet:
                  </span>
                  <p className="leading-relaxed font-sans">{rw.original}</p>
                </div>

                {/* Improved */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block">
                      AI Improved Bullet:
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <p className="leading-relaxed font-sans font-medium">{rw.improved}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BulletRewrites;
