import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Clock,
  Settings,
  MoreHorizontal,
  Layers,
  LogOut,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AILogo from "./AILogo";
import { useAuth } from "@/context/AuthContext";

export function Sidebar() {
  const [hovered, setHovered] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const mainNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Resumes", href: "/resumes", icon: FileText },
    { label: "Insights", href: "/insights", icon: BarChart3 },
    { label: "History", href: "/history", icon: Clock },
  ];

  const secondaryNavItems = [
    { label: "Versions", href: "/versions", icon: Layers },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop Collapsed Rail / Hover-Expand Sidebar (lg+) */}
      <motion.aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={false}
        animate={{ width: hovered ? 256 : 80 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="hidden lg:flex flex-col justify-between fixed top-0 left-0 bottom-0 z-40 bg-surface border-r border-border p-4 shadow-sm"
      >
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-start px-2 overflow-hidden h-10">
            <AILogo showText={hovered} />
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1.5">
            {mainNavItems.concat(secondaryNavItems).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3.5 px-3 py-3 rounded-2xl transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? "bg-accent-soft text-accent-strong font-semibold shadow-xs"
                      : "text-ink-muted hover:text-ink hover:bg-surface-2"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <AnimatePresence>
                    {hovered && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="truncate font-display"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout button */}
        <div className="pt-4 border-t border-border">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl text-ink-muted hover:text-danger hover:bg-rose-50 transition-colors text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {hovered && <span className="font-display truncate">Sign out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation Bar (below lg) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border px-3 py-2 flex items-center justify-around shadow-lg">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
                isActive ? "text-accent font-semibold" : "text-ink-muted hover:text-ink"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-display">{item.label}</span>
            </NavLink>
          );
        })}

        {/* Mobile "More" Drawer Button */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-ink-muted hover:text-ink cursor-pointer"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-display">More</span>
        </button>
      </nav>

      {/* Mobile Slide-over Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="w-4/5 max-w-xs bg-surface h-full p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <AILogo />
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 rounded-full text-ink-muted hover:text-ink"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium ${
                          isActive
                            ? "bg-accent-soft text-accent-strong font-semibold"
                            : "text-ink-muted hover:text-ink hover:bg-surface-2"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-display">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-danger hover:bg-rose-50 transition-colors text-sm font-medium cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-display">Sign out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
