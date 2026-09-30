import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export function KeepSharpCard() {
  return (
    <div className="rounded-3xl bg-accent-soft/70 border border-accent/20 p-6 flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface text-accent-strong text-[11px] font-display font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Resume Optimization Tip
        </div>
        <h3 className="font-display font-bold text-lg text-ink">
          Keep your ATS score sharp!
        </h3>
        <p className="text-xs text-ink-muted leading-relaxed">
          Updating your resume every 2-4 weeks or before applying to new job roles can boost interview response rates by up to 40%.
        </p>
      </div>

      <Link to="/resumes">
        <Button variant="primary" size="sm" className="w-full">
          Upload New Version <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}

export default KeepSharpCard;
