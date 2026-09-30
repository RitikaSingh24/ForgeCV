import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalytics } from "@/hooks/useAnalytics";
import { formatDate } from "@/lib/utils";

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const { history } = useAnalytics();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [lastSeen, setLastSeen] = useState(() => {
    return localStorage.getItem("last_seen_history") || "0";
  });

  const unreadCount = (history || []).filter(
    (item) => new Date(item.at).getTime() > Number(lastSeen)
  ).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setOpen(!open);
    if (!open) {
      const now = Date.now().toString();
      localStorage.setItem("last_seen_history", now);
      setLastSeen(now);
    }
  };

  const handleItemClick = (resumeId) => {
    setOpen(false);
    if (resumeId) {
      navigate(`/resumes/${resumeId}`);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleOpen}
        className="relative w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors focus:outline-none cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white font-display text-[10px] font-bold flex items-center justify-center border-2 border-surface">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-surface rounded-3xl border border-border shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-surface-2/40">
              <span className="font-display font-bold text-sm text-ink">Notifications & Activity</span>
              <span className="text-xs text-ink-muted">{history.length} events</span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-border/40 p-1">
              {history.length === 0 ? (
                <div className="p-6 text-center text-xs text-ink-muted">
                  No recent activity found.
                </div>
              ) : (
                history.slice(0, 8).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.resumeId)}
                    className="w-full p-3 text-left hover:bg-surface-2/60 transition-colors flex items-start gap-3 rounded-2xl cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0 mt-0.5">
                      {item.type === "analysis" ? (
                        <Sparkles className="w-4 h-4" />
                      ) : item.type === "rewrite" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-ink truncate">
                        {item.resumeTitle} ({item.versionLabel})
                      </p>
                      <p className="text-[11px] text-ink-muted truncate">
                        {item.type === "analysis"
                          ? `Analyzed (Score: ${item.score || "N/A"})`
                          : item.type === "rewrite"
                          ? `Created rewrite version ${item.versionLabel}`
                          : "Uploaded PDF resume"}
                      </p>
                      <span className="text-[10px] text-ink-muted/70 block mt-0.5">
                        {formatDate(item.at)}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationsPopover;
