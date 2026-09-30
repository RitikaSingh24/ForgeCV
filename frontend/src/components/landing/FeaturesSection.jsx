import React from "react";
import { motion } from "framer-motion";
import { Gauge, AlertTriangle, Key, Sparkles, Layers, Download } from "lucide-react";
import Card from "@/components/ui/Card";

export function FeaturesSection() {
  const features = [
    {
      icon: Gauge,
      title: "ATS Score Breakdown",
      description: "Get an instant 0-100 score across 5 key criteria: Formatting, Keywords, Impact, Clarity, and Completeness.",
    },
    {
      icon: AlertTriangle,
      title: "Critical Flaw Surface",
      description: "Automatically detect formatting mistakes, passive action verbs, missing metrics, and section gaps.",
    },
    {
      icon: Key,
      title: "Keyword Gap Analysis",
      description: "Compare your resume against target job descriptions to identify key missing technical keywords.",
    },
    {
      icon: Sparkles,
      title: "AI Bullet Rewrites",
      description: "Generate high-impact, quantified bullet point improvements powered by Gemini 2.5 Flash.",
    },
    {
      icon: Layers,
      title: "Version Diff Stack",
      description: "Compare V1 vs V2 side-by-side to track score increases and bullet point changes in real time.",
    },
    {
      icon: Download,
      title: "Clean PDF Export",
      description: "Download polished, single-column ATS-formatted PDFs optimized for recruiter applicant tracking systems.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-surface/50 border-y border-border/60">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-display font-bold uppercase tracking-wider text-accent">
            Comprehensive Resume Suite
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
            Everything you need to land interviews.
          </h2>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            Stop guessing why recruiters aren't calling back. Turn your resume into a targeted interview magnet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card hoverable className="p-6 h-full flex flex-col justify-between space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-soft text-accent flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-lg text-ink">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
