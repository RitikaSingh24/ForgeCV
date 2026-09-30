import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export function CTASection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 text-center px-6">
      <div className="max-w-4xl mx-auto rounded-3xl bg-surface border border-border shadow-xl p-8 sm:p-14 space-y-6">
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          Ready to sharpen your resume?
        </h2>
        <p className="text-sm sm:text-base text-ink-muted max-w-xl mx-auto leading-relaxed">
          Upload your PDF right now and get a free ATS score report in under 60 seconds.
        </p>
        <div className="pt-2">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="primary" size="lg">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button variant="primary" size="lg">
                Get Started Free Now <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default CTASection;
