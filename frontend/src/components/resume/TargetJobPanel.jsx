import React from "react";
import { Briefcase } from "lucide-react";
import Card from "@/components/ui/Card";

export function TargetJobPanel({
  targetRole,
  setTargetRole,
  jobDescription,
  setJobDescription,
  disabled = false,
  jdError = null,
}) {
  const jdLength = (jobDescription || "").trim().length;

  return (
    <Card className="p-6 bg-surface border-border flex flex-col justify-between space-y-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-ink font-display font-bold text-sm">
          <Briefcase className="w-4 h-4 text-accent" />
          <span>Target job (optional)</span>
        </div>

        {/* Target Role Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink-muted block">
            Target Role / Job Title
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Frontend Developer"
            disabled={disabled}
            className="w-full rounded-2xl border border-border bg-surface-2 px-3.5 py-2.5 min-h-[44px] text-xs text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-accent"
          />
        </div>

        {/* Job Description Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-muted">
            <label>Job Description (optional)</label>
            <span
              className={`text-[10px] ${
                jdError ? "text-rose-600 font-bold" : "text-ink-muted/70"
              }`}
            >
              {jdLength} / 8000
            </span>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={4}
            maxLength={8000}
            disabled={disabled}
            placeholder="Paste the target job description here to generate a tailored ATS match report, missing JD keywords, and custom bullet rewrites..."
            className={`w-full rounded-2xl border bg-surface-2 p-3 text-xs text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-accent resize-none ${
              jdError ? "border-rose-400 bg-rose-50/20" : "border-border"
            }`}
          />
          {jdError && (
            <p className="text-[11px] font-semibold text-rose-600 pt-0.5">
              {jdError}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default TargetJobPanel;
