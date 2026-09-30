import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
  }, [dismissToast]);

  return (
    <UIContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}

      {/* Floating Toasts container */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence mode="sync">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </AnimatePresence>
      </div>
    </UIContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-accent shrink-0" />,
  };

  const bgClasses = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-950",
    error: "bg-rose-50 border-rose-200 text-rose-950",
    warning: "bg-amber-50 border-amber-200 text-amber-950",
    info: "bg-surface border-border text-ink shadow-lg shadow-black/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-md ${bgClasses[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="flex-1 pt-0.5 text-xs font-medium leading-relaxed">
        {toast.message}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-ink-muted hover:text-ink transition-colors p-0.5"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within UIProvider");
  return context;
};

export default UIProvider;
