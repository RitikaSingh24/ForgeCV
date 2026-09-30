import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export function StatCard({ label, value, delta, icon: Icon, sparklineData = [] }) {
  const isPositive = delta > 0;
  const isNegative = delta < 0;

  return (
    <Card hoverable className="p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs font-display font-semibold text-ink-muted uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight tabular-nums">
          {value}
        </span>

        {delta !== undefined && delta !== null && (
          <Badge
            variant={isPositive ? "success" : isNegative ? "danger" : "neutral"}
            icon={isPositive ? TrendingUp : isNegative ? TrendingDown : Minus}
          >
            {isPositive ? `+${delta}` : delta}
          </Badge>
        )}
      </div>
    </Card>
  );
}

export default StatCard;
