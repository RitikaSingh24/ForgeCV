import React from "react";
import { cn, getInitials } from "@/lib/utils";

export function Avatar({ name = "", src = "", size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "rounded-full bg-accent-soft text-accent-strong font-display font-semibold flex items-center justify-center border border-accent/20 shrink-0 select-none overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export default Avatar;
