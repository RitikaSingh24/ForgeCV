import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AppShell from "@/components/layout/AppShell";
import Skeleton from "@/components/ui/Skeleton";

// Lazy-loaded page components
const Landing = lazy(() => import("@/pages/Landing"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const VerifyEmail = lazy(() => import("@/pages/VerifyEmail"));

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Resumes = lazy(() => import("@/pages/Resumes"));
const ResumeDetail = lazy(() => import("@/pages/ResumeDetail"));
const Export = lazy(() => import("@/pages/Export"));
const Insights = lazy(() => import("@/pages/Insights"));
const Versions = lazy(() => import("@/pages/Versions"));
const History = lazy(() => import("@/pages/History"));
const Settings = lazy(() => import("@/pages/Settings"));
const Placeholder = lazy(() => import("@/pages/Placeholder"));

function FullPageLoading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="h-12 w-12 rounded-2xl mx-auto" />
        <Skeleton className="h-6 w-48 mx-auto rounded-full" />
        <Skeleton className="h-4 w-64 mx-auto rounded-full" />
      </div>
    </div>
  );
}

function PageFallback() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-8 w-64 rounded-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-36 rounded-3xl" />
        <Skeleton className="h-36 rounded-3xl" />
        <Skeleton className="h-36 rounded-3xl" />
      </div>
      <Skeleton className="h-80 rounded-3xl" />
    </div>
  );
}

function ProtectedShell() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <FullPageLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppShell />
  );
}

function PublicAuthRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <FullPageLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              <PublicAuthRoute>
                <Login />
              </PublicAuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicAuthRoute>
                <Register />
              </PublicAuthRoute>
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Protected Dashboard App Routes */}
          <Route element={<ProtectedShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resumes" element={<Resumes />} />
            <Route path="/resumes/:id" element={<ResumeDetail />} />
            <Route path="/resumes/:id/export" element={<Export />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/versions" element={<Versions />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Placeholder title="404 - Page Not Found" description="The page you are looking for does not exist." />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
