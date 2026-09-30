import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-display text-xs font-semibold tracking-wide transition-colors",
  {
    variants: {
      variant: {
        neutral: "bg-surface-2 text-ink-muted border border-border",
        accent: "bg-accent-soft text-accent-strong border border-accent/20",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        warning: "bg-amber-50 text-amber-700 border border-amber-200",
        danger: "bg-rose-50 text-rose-700 border border-rose-200",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export function Badge({ children, variant, className, icon: Icon, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}

export default Badge;
