import React from "react";
import { Check, Plus } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export function KeywordChips({ present = [], missing = [] }) {
  return (
    <div className="space-y-6">
      {/* Present Keywords */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <h3 className="font-display font-bold text-sm text-ink">
            Detected ATS Keywords ({present.length})
          </h3>
        </div>
        {present.length === 0 ? (
          <p className="text-xs text-ink-muted">No key technical terms detected yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {present.map((kw, idx) => (
              <Badge key={idx} variant="accent" icon={Check}>
                {kw}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Missing Keywords */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <h3 className="font-display font-bold text-sm text-ink">
            Recommended Missing Keywords ({missing.length})
          </h3>
        </div>
        {missing.length === 0 ? (
          <p className="text-xs text-ink-muted">Great job! All target role keywords appear to be present.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {missing.map((kw, idx) => (
              <Badge key={idx} variant="warning" icon={Plus}>
                {kw}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default KeywordChips;
