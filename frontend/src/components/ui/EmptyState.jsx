import React from "react";
import { FileQuestion } from "lucide-react";
import { Button } from "./Button";

export function EmptyState({
  icon: Icon = FileQuestion,
  title = "No items found",
  description = "Get started by creating your first entry.",
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-border bg-surface/50 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-accent-soft text-accent flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-display text-lg font-bold text-ink mb-1">{title}</h3>
      <p className="text-sm text-ink-muted max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
