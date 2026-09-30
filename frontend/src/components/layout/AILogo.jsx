import React from "react";
import { Link } from "react-router-dom";

export function AILogo({ className = "", showText = true }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 group ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E2622B] to-[#B8431A] text-white flex items-center justify-center font-display font-bold text-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      {showText && (
        <span className="font-display text-xl font-bold tracking-tight text-ink">
          Forge<span className="text-accent">CV</span>
        </span>
      )}
    </Link>
  );
}

export default AILogo;
