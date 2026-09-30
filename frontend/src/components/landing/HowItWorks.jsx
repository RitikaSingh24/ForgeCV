import React from "react";
import { Upload, Sparkles, CheckSquare, Download } from "lucide-react";
import Card from "@/components/ui/Card";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: Upload,
      title: "Upload PDF",
      description: "Drop your existing resume PDF. Our parser extracts text and sections securely.",
    },
    {
      num: "02",
      icon: Sparkles,
      title: "Run ATS Check",
      description: "Gemini AI evaluates format, keywords, and impact against your target job role.",
    },
    {
      num: "03",
      icon: CheckSquare,
      title: "Apply AI Fixes",
      description: "Select proposed bullet point rewrites to automatically create V2 with improved metrics.",
    },
    {
      num: "04",
      icon: Download,
      title: "Export & Apply",
      description: "Download your polished, single-column ATS resume PDF ready for applications.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-display font-bold uppercase tracking-wider text-accent">
            Simple 4-Step Process
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
            How ForgeCV works.
          </h2>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            From raw PDF to interview-ready resume in under 2 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Card key={idx} className="p-6 relative space-y-4">
                <span className="font-display font-extrabold text-4xl text-accent/20 absolute top-4 right-4 select-none">
                  {step.num}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-accent-soft text-accent flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-base text-ink">{step.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed">{step.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
