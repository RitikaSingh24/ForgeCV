import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";
import Badge from "@/components/ui/Badge";

export function HeroDashboardPreview() {
  return (
    <div className="relative w-full max-w-4xl mx-auto mt-12 sm:mt-16">
      {/* Decorative Blur Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent-strong/10 to-amber-500/20 rounded-[40px] blur-3xl transform -rotate-1 scale-105 pointer-events-none" />

      {/* Main Framed Composition Container */}
      <div className="relative rounded-3xl bg-surface/90 backdrop-blur-md border border-border shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Mock Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono font-semibold text-ink-muted ml-2">forgecv.app/dashboard</span>
          </div>
          <Badge variant="accent" icon={Sparkles}>Gemini 2.5 Flash Connected</Badge>
        </div>

        {/* Mock Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1: Score */}
          <div className="p-5 rounded-2xl bg-surface-2/60 border border-border/60 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-ink-muted uppercase">ATS Score</span>
              <Badge variant="success">+24 pts</Badge>
            </div>
            <div className="text-4xl font-extrabold font-display text-ink tracking-tight tabular-nums">
              88<span className="text-sm font-normal text-ink-muted">/100</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> High recruiter visibility
            </p>
          </div>

          {/* Card 2: Trend Sparkline */}
          <div className="p-5 rounded-2xl bg-surface-2/60 border border-border/60 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-ink-muted uppercase">Score Evolution</span>
              <span className="text-xs text-accent font-bold">V1 → V3</span>
            </div>
            <div className="h-16 w-full pt-2">
              <svg viewBox="0 0 200 50" className="w-full h-full">
                <path
                  d="M 0 40 Q 50 35, 100 20 T 200 5"
                  fill="none"
                  stroke="#E2622B"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="200" cy="5" r="4" fill="#E2622B" />
              </svg>
            </div>
            <span className="text-[10px] text-ink-muted">3 iterations sharpened</span>
          </div>

          {/* Card 3: Issues */}
          <div className="p-5 rounded-2xl bg-surface-2/60 border border-border/60 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-ink-muted uppercase">AI Rewrites</span>
              <Badge variant="warning">3 Actionable</Badge>
            </div>
            <p className="text-xs text-ink line-clamp-2 leading-relaxed">
              "Quantified metric added: Increased API response speed by 35% using Redis caching..."
            </p>
            <span className="text-[10px] font-semibold text-accent mt-2">Applied to V3 →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroDashboardPreview;
