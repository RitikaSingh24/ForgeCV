import React from "react";
import { TrendingUp, Users, Award } from "lucide-react";

export function DarkPanel() {
  const stats = [
    { label: "Avg Score Increase", value: "+24 pts", icon: TrendingUp },
    { label: "Resumes Roasted", value: "10,000+", icon: Users },
    { label: "ATS Pass Rate", value: "98.4%", icon: Award },
  ];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="rounded-[36px] bg-gradient-to-br from-[#E2622B] via-[#B8431A] to-[#8C2C0B] p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
        {/* Background glow graphics */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="pt-6 md:pt-0 px-4 space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-white tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default DarkPanel;
