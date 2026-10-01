import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useResumes } from "@/hooks/useResumes";

export function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { resumes } = useResumes();

  const resumeItems = (resumes || []).map((r) => ({
    title: r.title,
    subtitle: `${r.versionsCount} version(s) • ATS ${r.currentVersion?.score || "N/A"}`,
    href: `/resumes/${r._id}`,
    icon: FileText,
    category: "Resumes",
  }));

  const filteredItems = resumeItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = (item) => {
    onClose();
    if (item?.href) {
      navigate(item.href);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-surface w-full h-full sm:h-auto sm:max-w-xl sm:rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Input Header */}
          <div className="p-4 border-b border-border flex items-center gap-3">
            <Search className="w-5 h-5 text-accent shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search uploaded resumes..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none text-ink placeholder:text-ink-muted/60 text-sm focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-1 text-ink-muted hover:text-ink transition-colors rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto max-h-[60vh] p-2 divide-y divide-border/30">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-ink-muted">
                No matching resumes found for "{query}".
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={`${item.category}-${item.title}-${idx}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full p-3 flex items-center justify-between rounded-2xl text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-accent-soft text-accent-strong border border-accent/20"
                        : "text-ink hover:bg-surface-2"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-accent text-white" : "bg-surface-2 text-ink-muted"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-semibold block truncate">
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="text-[11px] text-ink-muted block truncate">
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-surface-2 text-ink-muted border border-border">
                        {item.category}
                      </span>
                      <ChevronRight className="w-4 h-4 text-ink-muted" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default CommandPalette;
