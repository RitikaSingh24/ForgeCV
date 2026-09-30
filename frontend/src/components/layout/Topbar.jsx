import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Settings, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "@/components/ui/Avatar";
import NotificationsPopover from "./NotificationsPopover";
import { useAuth } from "@/context/AuthContext";

export function Topbar({ onOpenSearch }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Map route to page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return "Dashboard Overview";
    if (path.startsWith("/resumes/")) return "Resume Details";
    if (path.startsWith("/resumes")) return "My Resumes";
    if (path.startsWith("/insights")) return "Insights & AI Analytics";
    if (path.startsWith("/history")) return "Activity History";
    if (path.startsWith("/versions")) return "Version Stack";
    if (path.startsWith("/settings")) return "Account Settings";
    return "ForgeCV";
  };

  return (
    <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md border-b border-border px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Title */}
      <div className="flex items-center gap-4">
        <h1 className="font-display font-bold text-lg sm:text-xl text-ink tracking-tight truncate">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Search trigger button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-3 bg-surface border border-border hover:border-accent/30 text-ink-muted hover:text-ink px-3.5 py-2 rounded-full text-xs transition-all duration-200 cursor-pointer shadow-xs"
        >
          <Search className="w-4 h-4 text-accent" />
          <span className="hidden sm:inline font-medium">Search resumes...</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-surface-2 text-[10px] font-bold text-ink-muted border border-border">
            ⌘K
          </span>
        </button>

        {/* Notifications Popover */}
        <NotificationsPopover />

        {/* User Profile Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-2 transition-colors cursor-pointer focus:outline-none"
          >
            <Avatar name={user?.name || "User"} size="sm" />
            <ChevronDown className="w-4 h-4 text-ink-muted hidden sm:block" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-surface rounded-2xl border border-border shadow-xl z-50 overflow-hidden p-1.5"
              >
                <div className="p-3 border-b border-border/50">
                  <p className="font-display font-semibold text-xs text-ink truncate">{user?.name}</p>
                  <p className="text-[11px] text-ink-muted truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/settings");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink hover:bg-surface-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-ink-muted" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-danger hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
