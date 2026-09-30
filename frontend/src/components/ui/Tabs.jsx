import React from "react";
import { cn } from "@/lib/utils";

export function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn("inline-flex p-1 bg-surface-2 rounded-full border border-border", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-display font-semibold transition-all duration-200 cursor-pointer select-none",
              isActive
                ? "bg-surface text-ink shadow-sm shadow-black/5 border border-border/50"
                : "text-ink-muted hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
