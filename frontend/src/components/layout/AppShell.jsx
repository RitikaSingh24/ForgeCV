import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CommandPalette from "./CommandPalette";

export function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col">
      <Sidebar />

      {/* Main content wrapper (offset by sidebar width on desktop lg:pl-20) */}
      <div className="flex-1 flex flex-col lg:pl-20 transition-all duration-300">
        <Topbar onOpenSearch={() => setSearchOpen(true)} />

        {/* Page Content area with bottom padding for mobile tabbar */}
        <main className="flex-1 p-4 sm:p-8 pb-24 lg:pb-12 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

export default AppShell;
