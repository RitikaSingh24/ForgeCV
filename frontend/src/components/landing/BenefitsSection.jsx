import React from "react";
import { CheckCircle2 } from "lucide-react";
import Card from "@/components/ui/Card";

export function BenefitsSection() {
  const benefits = [
    "Bypass recruiter ATS filters instantly",
    "Identify weak passive verbs and replace with strong metrics",
    "Tailor your resume for specific job titles in seconds",
    "Keep full control over your data with zero third-party selling",
    "Export ATS-friendly, clean single-column PDF documents",
    "Track version iterations from V1 to V5 with score diffs",
  ];

  return (
    <section id="benefits" className="py-20">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-display font-bold uppercase tracking-wider text-accent">
            Why Job Seekers Choose ForgeCV
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
            Designed to get you hired faster.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {benefits.map((b, idx) => (
            <Card key={idx} className="p-4 flex items-center gap-3.5 bg-surface">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-ink">{b}</span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
