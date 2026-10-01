import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function ScoreEvolutionChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-ink-muted bg-surface-2/40 rounded-2xl border border-dashed border-border">
        No score evolution history yet.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-surface border border-border p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-display font-bold text-ink">{d.label} Version</p>
          <p className="text-accent font-semibold tabular-nums">Score: {d.score} ATS</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 15, right: 25, left: -15, bottom: 5 }}>
          <defs>
            <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E2622B" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#E2622B" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            stroke="#78716C"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            padding={{ left: 40, right: 40 }}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#78716C"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#E2622B"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#scoreAreaGrad)"
            dot={{ r: 5, fill: "#E2622B", stroke: "#FFFFFF", strokeWidth: 2 }}
            activeDot={{ r: 7, fill: "#E2622B", stroke: "#FFFFFF", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ScoreEvolutionChart;
