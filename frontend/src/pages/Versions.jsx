import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Layers, Sparkles, Upload, ChevronRight, Search, Trash2, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useResumes } from "@/hooks/useResumes";
import { formatDate } from "@/lib/utils";

export function Versions() {
  const { versions, isLoadingVersions } = useAnalytics();
  const { deleteResume } = useResumes();
  const [searchFilter, setSearchFilter] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDelete = (e, resumeId) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirmDeleteId === resumeId) {
      deleteResume(resumeId);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(resumeId);
      setTimeout(() => setConfirmDeleteId(null), 4000);
    }
  };

  if (isLoadingVersions) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 rounded-full" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-3xl" />
          <Skeleton className="h-20 w-full rounded-3xl" />
          <Skeleton className="h-20 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  const filteredVersions = (versions || []).filter(
    (v) =>
      v.resumeTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.label.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Version Stack"
        description="Filter and track all resume iterations across your uploads and AI bullet rewrite versions."
      />

      {/* Search Filter */}
      <div className="max-w-md">
        <Input
          icon={Search}
          placeholder="Filter versions by resume title or version (V1, V2)..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
        />
      </div>

      {filteredVersions.length === 0 ? (
        <EmptyState
          title="No versions found"
          description={
            searchFilter
              ? `No versions match "${searchFilter}".`
              : "Upload a resume to begin building your version stack."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVersions.map((v) => {
            const isRewrite = v.sourceType === "rewrite";
            const scoreVariant =
              v.score >= 80 ? "success" : v.score >= 60 ? "warning" : v.score !== null ? "danger" : "neutral";
            const isConfirming = confirmDeleteId === v.resumeId;

            return (
              <Card key={v._id} hoverable className="p-5">
                <Link to={`/resumes/${v.resumeId}`} className="block space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
                        {isRewrite ? <Sparkles className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-base text-ink">
                            {v.label}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-ink-muted px-2 py-0.5 rounded-full bg-surface-2 border border-border">
                            {v.sourceType}
                          </span>
                        </div>
                        <h4 className="text-xs text-ink-muted font-medium truncate max-w-xs">
                          {v.resumeTitle}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={scoreVariant}>
                        {v.score !== null && v.score !== undefined ? `${v.score} ATS` : "Pending"}
                      </Badge>
                      <button
                        onClick={(e) => handleDelete(e, v.resumeId)}
                        className={`p-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          isConfirming
                            ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                            : "text-ink-muted hover:text-danger hover:bg-surface-2"
                        }`}
                        title={isConfirming ? "Confirm delete resume" : "Delete resume history"}
                      >
                        {isConfirming ? (
                          <span className="flex items-center gap-1 text-[11px] px-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Delete?
                          </span>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs text-ink-muted">
                    <span>Created: {formatDate(v.createdAt)}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-accent group-hover:underline">
                      View details <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Versions;
