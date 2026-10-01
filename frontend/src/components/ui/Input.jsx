import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function Input({
  label,
  error,
  icon: Icon,
  type = "text",
  className,
  id,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-ink tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-ink-muted pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          id={inputId}
          type={actualType}
          className={cn(
            "w-full h-11 bg-surface border border-border text-ink rounded-full px-5 text-sm transition-all duration-200 placeholder:text-ink-muted/60 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 disabled:opacity-50 disabled:bg-surface-2",
            Icon && "pl-11",
            isPassword && "pr-11",
            error && "border-danger focus:border-danger focus:ring-danger/15",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-ink-muted hover:text-ink transition-colors p-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-danger font-medium pl-2">{error}</p>}
    </div>
  );
}

export default Input;
