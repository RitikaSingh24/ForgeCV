import React from "react";

export function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-ink-muted mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default PageHeader;
