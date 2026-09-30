import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function AtsGauge({ score = 0, size = "md" }) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score || 0)));

  const getColor = (s) => {
    if (s >= 80) return "#3F8F6B"; // success
    if (s >= 60) return "#D9A032"; // warning
    return "#C4423F"; // danger
  };

  const currentColor = getColor(normalizedScore);

  const data = [
    { name: "Score", value: normalizedScore },
    { name: "Remaining", value: 100 - normalizedScore },
  ];

  const dimensions = size === "lg" ? "h-48" : "h-36";

  return (
    <div className={`relative w-full ${dimensions} flex flex-col items-center justify-center`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="75%"
            startAngle={180}
            endAngle={0}
            innerRadius="65%"
            outerRadius="90%"
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell key="cell-0" fill={currentColor} />
            <Cell key="cell-1" fill="#F5EFE8" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Central Overlay Number */}
      <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight tabular-nums">
          {normalizedScore}
        </span>
        <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">
          ATS Score
        </span>
      </div>
    </div>
  );
}

export default AtsGauge;
