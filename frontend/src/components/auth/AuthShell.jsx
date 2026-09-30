import React from "react";
import AILogo from "@/components/layout/AILogo";
import BrandCardMarquee from "./BrandCardMarquee";

export function AuthShell({ children, title, subtitle }) {
  return (
    <div className="min-h-screen w-full bg-bg flex flex-col lg:flex-row overflow-x-hidden">
      {/* Left Form Panel (Light background) */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 max-w-xl lg:max-w-none w-full mx-auto">
        <header className="mb-8">
          <AILogo />
        </header>

        <main className="w-full max-w-md mx-auto my-auto py-6">
          <div className="mb-8 space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-ink-muted leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </main>

        <footer className="mt-8 text-center sm:text-left text-xs text-ink-muted border-t border-border/60 pt-6">
          <p>© {new Date().getFullYear()} ForgeCV. All rights reserved.</p>
        </footer>
      </div>

      {/* Right Brand Gradient Panel (lg+ only) */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[#E2622B] via-[#B8431A] to-[#8C2C0B] p-12 lg:p-16 text-white flex-col justify-between overflow-hidden shadow-2xl rounded-l-[40px] m-3">
        {/* Subtle background blur circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-black/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-display font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            AI Resume Roaster & Sharpener
          </div>
        </div>

        {/* Middle Tagline */}
        <div className="relative z-10 max-w-lg space-y-4 my-auto py-8">
          <h2 className="font-serif italic text-4xl xl:text-5xl font-normal leading-[1.15] text-white tracking-tight">
            Your resume, intelligently sharpened.
          </h2>
          <p className="text-white/85 text-base sm:text-lg font-sans leading-relaxed">
            Drop your PDF, get an instant ATS score, surface hidden weaknesses, and generate bullet point rewrites — powered by Gemini AI.
          </p>

          {/* Marquee Floating Cards */}
          <BrandCardMarquee />
        </div>

        {/* Bottom footer text */}
        <div className="relative z-10 text-xs text-white/70">
          Trusted by engineers, designers, and tech leaders landing interviews at top tech companies.
        </div>
      </div>
    </div>
  );
}

export default AuthShell;
