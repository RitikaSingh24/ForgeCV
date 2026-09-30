import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/context/ThemeContext";
import { UIProvider } from "@/context/UIContext";
import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UIProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </UIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default AppProviders;
