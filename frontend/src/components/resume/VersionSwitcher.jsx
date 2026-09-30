import React from "react";
import { Layers, Sparkles, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export function VersionSwitcher({ versions = [], activeVersionId, onSelectVersion }) {
  if (!versions || versions.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
      <span className="text-xs font-bold uppercase tracking-wider text-ink-muted shrink-0 mr-1 flex items-center gap-1">
        <Layers className="w-3.5 h-3.5" /> Versions:
      </span>

      {versions.map((v) => {
        const isActive = v._id === activeVersionId;
        const isRewrite = v.sourceType === "rewrite";

        return (
          <button
            key={v._id}
            onClick={() => onSelectVersion(v._id)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-semibold transition-all duration-200 shrink-0 border cursor-pointer",
              isActive
                ? "bg-accent text-white border-accent shadow-md shadow-orange-500/15"
                : "bg-surface text-ink border-border hover:bg-surface-2 hover:border-accent/30"
            )}
          >
            {isRewrite ? (
              <Sparkles className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-accent"}`} />
            ) : (
              <Upload className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-ink-muted"}`} />
            )}

            <span>{v.label}</span>

            {v.score !== null && v.score !== undefined && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-extrabold tabular-nums",
                  isActive ? "bg-white/20 text-white" : "bg-surface-2 text-ink-muted border border-border"
                )}
              >
                {v.score} ATS
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default VersionSwitcher;
