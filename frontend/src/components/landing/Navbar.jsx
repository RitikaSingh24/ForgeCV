import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import AILogo from "@/components/layout/AILogo";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur-md border-b border-border/60 transition-all">
      <div className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between">
        <AILogo />

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-muted">
          <a href="#features" className="hover:text-ink transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-ink transition-colors">How It Works</a>
          <a href="#benefits" className="hover:text-ink transition-colors">Benefits</a>
          <a href="#testimonials" className="hover:text-ink transition-colors">Wall of Love</a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated && (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started Free →
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-ink-muted hover:text-ink rounded-full"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-ink">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#benefits" onClick={() => setMobileMenuOpen(false)}>Benefits</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Wall of Love</a>
          </nav>
          <div className="pt-4 border-t border-border flex flex-col gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  Go to Dashboard →
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full">Sign in</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Get Started Free →</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
