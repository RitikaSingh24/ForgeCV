import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export function DiffView({ diffData }) {
  if (!diffData) return null;

  const { fromLabel, toLabel, fromSections, toSections } = diffData;

  const sectionsToCompare = [
    { key: "summary", title: "Professional Summary" },
    { key: "experience", title: "Work Experience" },
    { key: "projects", title: "Projects" },
    { key: "skills", title: "Skills & Technical Expertise" },
  ];

  const formatSectionText = (sec, key) => {
    if (!sec) return [];
    if (key === "summary") return [sec.summary || "No summary provided."];
    if (key === "skills") return [(sec.skills || []).join(", ") || "No skills listed."];
    if (key === "experience") {
      return (sec.experience || []).flatMap((e) => [
        `[${e.company || "Company"}] ${e.role || "Role"} (${e.start} - ${e.end})`,
        ...(e.bullets || []).map((b) => `• ${b}`),
      ]);
    }
    if (key === "projects") {
      return (sec.projects || []).flatMap((p) => [
        `[${p.name || "Project"}] Tech: ${(p.tech || []).join(", ")}`,
        ...(p.bullets || []).map((b) => `• ${b}`),
      ]);
    }
    return [];
  };

  return (
    <div className="space-y-6">
      {/* Header comparison labels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="neutral">Original ({fromLabel})</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="accent">Rewritten / New ({toLabel})</Badge>
        </div>
      </div>

      {sectionsToCompare.map(({ key, title }) => {
        const fromLines = formatSectionText(fromSections, key);
        const toLines = formatSectionText(toSections, key);

        return (
          <Card key={key} className="p-6">
            <h3 className="font-display font-bold text-base text-ink mb-4 pb-2 border-b border-border">
              {title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {/* Left (From) */}
              <div className="space-y-2 bg-surface-2/60 p-4 rounded-2xl border border-border/60 overflow-x-auto">
                <span className="text-[10px] uppercase font-bold text-ink-muted block font-sans mb-2">
                  {fromLabel} Version
                </span>
                {fromLines.map((line, idx) => (
                  <p
                    key={idx}
                    className={`leading-relaxed p-1.5 rounded-lg ${
                      toLines.includes(line)
                        ? "text-ink-muted"
                        : "bg-rose-50 text-rose-800 border border-rose-200 line-through"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* Right (To) */}
              <div className="space-y-2 bg-surface-2/60 p-4 rounded-2xl border border-border/60 overflow-x-auto">
                <span className="text-[10px] uppercase font-bold text-accent font-sans block mb-2">
                  {toLabel} Version
                </span>
                {toLines.map((line, idx) => (
                  <p
                    key={idx}
                    className={`leading-relaxed p-1.5 rounded-lg ${
                      fromLines.includes(line)
                        ? "text-ink"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default DiffView;
