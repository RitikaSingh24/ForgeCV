import React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, hoverable = false, ...props }) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-surface border border-border p-6 shadow-[0_4px_20px_-2px_rgba(28,25,23,0.04)] transition-all duration-200",
        hoverable && "hover:shadow-[0_12px_32px_-4px_rgba(226,98,43,0.12)] hover:-translate-y-0.5 hover:border-accent/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
