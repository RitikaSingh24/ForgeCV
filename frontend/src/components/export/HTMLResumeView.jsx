import React from "react";

export function HTMLResumeView({ parsedSections = {}, title = "Resume" }) {
  const basics = parsedSections.basics || {};
  const summary = typeof parsedSections.summary === "string" ? parsedSections.summary : "";

  const safeArray = (val) => {
    if (Array.isArray(val)) return val.filter((item) => typeof item === "string" ? item.trim().length > 0 : Boolean(item));
    if (typeof val === "string" && val.trim().length > 0) return val.split(",").map((s) => s.trim()).filter(Boolean);
    return [];
  };

  const experience = Array.isArray(parsedSections.experience) ? parsedSections.experience : [];
  const projects = Array.isArray(parsedSections.projects) ? parsedSections.projects : [];
  const education = Array.isArray(parsedSections.education) ? parsedSections.education : [];
  const skills = safeArray(parsedSections.skills);
  const certifications = safeArray(parsedSections.certifications);
  const languages = safeArray(parsedSections.languages);

  return (
    <div
      id="printable-resume"
      className="w-full max-w-[800px] mx-auto bg-white text-stone-900 font-sans p-8 sm:p-12 shadow-sm rounded-2xl border border-stone-200 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none text-left"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* Header */}
      <header className="border-b-2 border-amber-800/80 pb-4 mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mb-1">
          {basics.name || "Candidate Name"}
        </h1>
        {basics.title && (
          <p className="text-sm font-medium text-amber-800 italic mb-2">
            {basics.title}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>• {basics.phone}</span>}
          {basics.location && <span>• {basics.location}</span>}
          {safeArray(basics.links).map((link, idx) => (
            <span key={idx}>• {link}</span>
          ))}
        </div>
      </header>

      {/* Summary */}
      {summary ? (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs text-stone-800 leading-relaxed">{summary}</p>
        </section>
      ) : null}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1 mb-3">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => {
              const bullets = safeArray(exp.bullets);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-xs font-bold text-stone-900">
                      {exp.role || "Role"} {exp.company ? <span className="font-normal text-stone-600">| {exp.company}</span> : ""}
                    </h3>
                    <span className="text-[11px] italic text-stone-500 shrink-0">
                      {exp.start || ""} {exp.end ? `- ${exp.end}` : ""}
                    </span>
                  </div>
                  {bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-stone-800">
                      {bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1 mb-3">
            Key Projects
          </h2>
          <div className="space-y-4">
            {projects.map((proj, idx) => {
              const techList = safeArray(proj.tech);
              const bullets = safeArray(proj.bullets);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-xs font-bold text-stone-900">
                      {proj.name || "Project"}
                    </h3>
                    {techList.length > 0 && (
                      <span className="text-[11px] italic text-stone-500">
                        Tech: {techList.join(", ")}
                      </span>
                    )}
                  </div>
                  {bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-stone-800">
                      {bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1 mb-2">
            Skills & Competencies
          </h2>
          <p className="text-xs text-stone-800 leading-relaxed font-medium">
            {skills.join("  •  ")}
          </p>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="flex items-baseline justify-between gap-2 text-xs">
                <span className="font-bold text-stone-900">
                  {edu.degree || "Degree"} {edu.school ? <span className="font-normal text-stone-600">- {edu.school}</span> : ""}
                </span>
                <span className="text-[11px] italic text-stone-500 shrink-0">
                  {edu.start || ""} {edu.end ? `- ${edu.end}` : ""}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages */}
      {(certifications.length > 0 || languages.length > 0) && (
        <section className="mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1 mb-2">
            Additional Information
          </h2>
          {certifications.length > 0 && (
            <p className="text-xs text-stone-800 mb-1">
              <span className="font-semibold">Certifications:</span> {certifications.join(", ")}
            </p>
          )}
          {languages.length > 0 && (
            <p className="text-xs text-stone-800">
              <span className="font-semibold">Languages:</span> {languages.join(", ")}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

export default HTMLResumeView;
