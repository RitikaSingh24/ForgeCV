import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import HeroDashboardPreview from "./HeroDashboardPreview";
import { useAuth } from "@/context/AuthContext";

export function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden text-center">
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-soft border border-accent/20 text-accent-strong text-xs font-display font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen AI Resume Roaster & ATS Optimizer</span>
        </div>

        {/* Main Title with Cormorant Garamond Italic Accent */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-ink tracking-tight leading-[1.1]">
          Your resume,{" "}
          <span className="font-serif italic font-normal text-accent block sm:inline">
            intelligently sharpened.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed font-sans">
          Drop your PDF, get an instant ATS score, surface hidden weaknesses, and apply AI bullet point rewrites — powered by Gemini AI.
        </p>

        {/* CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Go to My Dashboard <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Free Resume Check <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  See how it works
                </Button>
              </a>
            </>
          )}
        </div>

        {/* Social Proof */}
        <div className="pt-6 flex items-center justify-center gap-6 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Free to start
          </span>
          <span>•</span>
          <span>No credit card required</span>
          <span>•</span>
          <span>100% Privacy Preserved</span>
        </div>
      </div>

      {/* Hero Interactive Composition Preview */}
      <HeroDashboardPreview />
    </section>
  );
}

export default HeroSection;
