import React from "react";
import { cn } from "@/lib/utils";

export function IconButton({ icon: Icon, label, className, variant = "ghost", size = "md", ...props }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const variantClasses = {
    ghost: "text-ink-muted hover:text-ink hover:bg-surface-2",
    surface: "bg-surface border border-border text-ink hover:bg-surface-2 hover:border-accent/20",
    accent: "bg-accent-soft text-accent hover:bg-accent hover:text-white",
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}

export default IconButton;
