import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function BrandCardMarquee() {
  return (
    <div className="relative w-full max-w-md space-y-4 pt-4">
      {/* Floating Card 1: Score Evolution */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: [0, -6, 0], opacity: 1 }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.6 },
        }}
        className="bg-surface/95 backdrop-blur-md rounded-3xl p-5 border border-white/20 shadow-xl shadow-black/10 text-ink"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent-soft text-accent flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="font-display text-xs font-bold text-ink-muted uppercase tracking-wider">
              Score Evolution
            </span>
          </div>
          <Badge variant="success" icon={CheckCircle2}>
            +24 pts overall
          </Badge>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-display text-3xl font-extrabold text-ink tracking-tight tabular-nums">
            +24
          </span>
          <span className="text-xs font-medium text-ink-muted">pts across V1 → V3</span>
        </div>

        {/* Mini Line Chart SVG */}
        <div className="relative h-16 w-full">
          <svg viewBox="0 0 300 60" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E2622B" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#E2622B" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 10 45 Q 80 40, 150 25 T 290 8 L 290 60 L 10 60 Z"
              fill="url(#scoreGrad)"
            />
            <path
              d="M 10 45 Q 80 40, 150 25 T 290 8"
              fill="none"
              stroke="#E2622B"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="10" cy="45" r="4" fill="#FFFFFF" stroke="#E2622B" strokeWidth="2" />
            <circle cx="150" cy="25" r="4" fill="#FFFFFF" stroke="#E2622B" strokeWidth="2" />
            <circle cx="290" cy="8" r="5" fill="#E2622B" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        </div>

        <div className="flex justify-between items-center text-[10px] font-bold text-ink-muted uppercase pt-1 border-t border-border/40">
          <span>V1 (58)</span>
          <span>V2 (72)</span>
          <span className="text-accent font-extrabold">V3 (82 ATS)</span>
        </div>
      </motion.div>

      {/* Floating Card 2: Critical Issues */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: [0, -8, 0], opacity: 1 }}
        transition={{
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          opacity: { duration: 0.6, delay: 0.2 },
        }}
        className="bg-surface/95 backdrop-blur-md rounded-3xl p-5 border border-white/20 shadow-xl shadow-black/10 text-ink"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <span className="font-display text-xs font-bold text-ink-muted uppercase tracking-wider">
              Critical Fixes Surfaced
            </span>
          </div>
          <Badge variant="danger">3 issues</Badge>
        </div>

        <ul className="space-y-2.5 text-xs">
          <li className="flex items-center justify-between p-2 rounded-xl bg-surface-2/60">
            <span className="font-medium text-ink">Missing quantified metric in bullets</span>
            <Badge variant="danger">High</Badge>
          </li>
          <li className="flex items-center justify-between p-2 rounded-xl bg-surface-2/60">
            <span className="font-medium text-ink">Passive action verbs used</span>
            <Badge variant="warning">Medium</Badge>
          </li>
          <li className="flex items-center justify-between p-2 rounded-xl bg-surface-2/60">
            <span className="font-medium text-ink">ATS keyword density low (React/Node)</span>
            <Badge variant="accent">AI Fixed</Badge>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}

export default BrandCardMarquee;
