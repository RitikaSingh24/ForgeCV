import React from "react";
import { Star } from "lucide-react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";

export function TestimonialsSection() {
  const reviews = [
    {
      name: "Marcus Vance",
      role: "Senior Software Engineer",
      text: "ForgeCV pointed out 4 missing keyword density gaps that I had no idea about. My ATS score went from 62 to 88 and I landed 3 interviews the same week.",
    },
    {
      name: "Elena Rostova",
      role: "Product Designer",
      text: "The AI bullet rewrites were incredible. It automatically added metric placeholders that helped me quantify my design impact. Worth every second!",
    },
    {
      name: "David Chen",
      role: "DevOps Specialist",
      text: "I love the Version Stack diff view. Seeing V1 vs V3 side by side gave me full confidence before applying to top tech firms.",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-surface-2/40 border-t border-border/60">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-display font-bold uppercase tracking-wider text-accent">
            Wall of Love
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
            Loved by candidates worldwide.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <Card key={idx} className="p-6 flex flex-col justify-between space-y-4">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans italic">
                "{r.text}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                <Avatar name={r.name} size="sm" />
                <div>
                  <h4 className="font-display font-bold text-xs text-ink">{r.name}</h4>
                  <p className="text-[11px] text-ink-muted">{r.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
