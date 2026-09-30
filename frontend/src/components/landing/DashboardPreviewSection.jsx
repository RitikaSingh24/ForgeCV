import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { TrendingUp, Layers, CheckCircle } from "lucide-react";

export function DashboardPreviewSection() {
  return (
    <section className="py-20 bg-surface-2/40 border-t border-border/60">
      <div className="max-w-7xl mx-auto px-6 space-y-12 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-display font-bold uppercase tracking-wider text-accent">
            Powerful User Dashboard
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
            Track every iteration in one place.
          </h2>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            Monitor score evolution trends, version stacks, and missing keywords in your clean light dashboard.
          </p>
        </div>

        {/* Dashboard Composite Mockup */}
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-2xl max-w-5xl mx-auto text-left space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-accent text-white font-bold flex items-center justify-center font-display">
                F
              </div>
              <span className="font-display font-bold text-ink text-sm">ForgeCV Dashboard</span>
            </div>
            <Badge variant="success" icon={CheckCircle}>System Active</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 bg-surface-2/50">
              <span className="text-xs font-bold text-ink-muted uppercase">Highest ATS Score</span>
              <div className="text-3xl font-extrabold text-ink font-display mt-2">88%</div>
            </Card>

            <Card className="p-5 bg-surface-2/50">
              <span className="text-xs font-bold text-ink-muted uppercase">Score Improvement</span>
              <div className="text-3xl font-extrabold text-accent font-display mt-2">+24 pts</div>
            </Card>

            <Card className="p-5 bg-surface-2/50">
              <span className="text-xs font-bold text-ink-muted uppercase">Active Versions</span>
              <div className="text-3xl font-extrabold text-ink font-display mt-2">V3 Stacked</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreviewSection;
