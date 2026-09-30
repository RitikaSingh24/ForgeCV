import React from "react";
import { Wrench } from "lucide-react";
import Card from "@/components/ui/Card";

export function Placeholder({ title = "Coming Soon", description = "This feature is under active development." }) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-accent-soft text-accent flex items-center justify-center">
          <Wrench className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
        <p className="text-sm text-ink-muted max-w-md">{description}</p>
      </Card>
    </div>
  );
}

export default Placeholder;
