import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({ checked, onChange, label, className, id, ...props }) {
  const checkboxId = id || React.useId();

  return (
    <label htmlFor={checkboxId} className={cn("inline-flex items-center gap-3 cursor-pointer select-none group", className)}>
      <div
        className={cn(
          "w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-150",
          checked
            ? "bg-accent border-accent text-white shadow-sm"
            : "bg-surface border-border group-hover:border-accent/40"
        )}
      >
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
          {...props}
        />
        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
      {label && <span className="text-sm font-medium text-ink leading-none">{label}</span>}
    </label>
  );
}

export default Checkbox;
