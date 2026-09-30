import React from "react";
import { Link } from "react-router-dom";
import AILogo from "@/components/layout/AILogo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <AILogo />

        <div className="flex items-center gap-6 text-xs text-ink-muted font-medium">
          <a href="#features" className="hover:text-ink">Features</a>
          <a href="#how-it-works" className="hover:text-ink">How It Works</a>
          <Link to="/login" className="hover:text-ink">Sign in</Link>
          <Link to="/register" className="hover:text-ink">Register</Link>
        </div>

        <div className="text-xs text-ink-muted">
          © {new Date().getFullYear()} ForgeCV. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
