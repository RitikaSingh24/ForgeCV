import React from "react";
import { CheckCircle2 } from "lucide-react";
import Card from "@/components/ui/Card";

export function StrengthsList({ strengths = [] }) {
  if (!strengths || strengths.length === 0) {
    return (
      <Card className="p-8 text-center text-xs text-ink-muted">
        No strengths surfaced yet. Run an ATS analysis to evaluate resume strengths.
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {strengths.map((item) => (
        <div
          key={item.id}
          className="p-4 rounded-2xl bg-surface border border-emerald-200/60 shadow-xs flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-ink mb-0.5">{item.title}</h4>
            <p className="text-xs text-ink-muted leading-relaxed">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StrengthsList;
