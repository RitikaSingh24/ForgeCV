import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Layers, Trash2, ChevronRight, AlertTriangle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

export function ResumeTableRow({ resume, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const score = resume.currentVersion?.score;
  const scoreVariant =
    score >= 80 ? "success" : score >= 60 ? "warning" : score !== null && score !== undefined ? "danger" : "neutral";

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirmDelete) {
      onDelete(resume._id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
    }
  };

  return (
    <tr className="border-b border-border/50 hover:bg-surface-2/40 transition-colors group">
      <td className="py-4 px-4 font-semibold text-ink">
        <Link to={`/resumes/${resume._id}`} className="flex items-center gap-3 group-hover:text-accent transition-colors">
          <div className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <span className="truncate max-w-xs">{resume.title}</span>
        </Link>
      </td>

      <td className="py-4 px-4">
        <Badge variant={scoreVariant}>
          {score !== null && score !== undefined ? `${score} ATS` : "Not Analyzed"}
        </Badge>
      </td>

      <td className="py-4 px-4 text-xs font-medium text-ink-muted">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-2 border border-border">
          <Layers className="w-3.5 h-3.5" />
          <span>{resume.versionsCount} version(s)</span>
        </div>
      </td>

      <td className="py-4 px-4 text-xs text-ink-muted">
        {formatDate(resume.updatedAt || resume.createdAt)}
      </td>

      <td className="py-4 px-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleDelete}
            className={`p-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              confirmDelete
                ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                : "text-ink-muted hover:text-danger hover:bg-surface-2"
            }`}
            title={confirmDelete ? "Click to confirm deletion" : "Delete resume"}
          >
            {confirmDelete ? (
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Confirm?
              </span>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
          <Link to={`/resumes/${resume._id}`}>
            <ChevronRight className="w-5 h-5 text-ink-muted group-hover:text-accent transition-colors" />
          </Link>
        </div>
      </td>
    </tr>
  );
}

export function ResumeCard({ resume, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const score = resume.currentVersion?.score;
  const scoreVariant =
    score >= 80 ? "success" : score >= 60 ? "warning" : score !== null && score !== undefined ? "danger" : "neutral";

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirmDelete) {
      onDelete(resume._id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
    }
  };

  return (
    <Card hoverable className="p-4">
      <Link to={`/resumes/${resume._id}`} className="block space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-ink truncate max-w-[200px]">
              {resume.title}
            </h3>
          </div>
          <Badge variant={scoreVariant}>
            {score !== null && score !== undefined ? `${score} ATS` : "Not Analyzed"}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-ink-muted border-t border-border/40 pt-2.5">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> {resume.versionsCount} versions
          </span>
          <span>{formatDate(resume.updatedAt)}</span>
        </div>
      </Link>

      <div className="flex justify-end pt-2 border-t border-border/30 mt-2">
        <button
          onClick={handleDelete}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
            confirmDelete
              ? "bg-rose-100 text-rose-700"
              : "text-ink-muted hover:text-danger"
          }`}
        >
          {confirmDelete ? "Confirm Delete?" : "Delete"}
        </button>
      </div>
    </Card>
  );
}

export default ResumeTableRow;
