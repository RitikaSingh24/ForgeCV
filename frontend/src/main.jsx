import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/context/ThemeContext";
import { UIProvider } from "@/context/UIContext";
import { AuthProvider } from "@/context/AuthContext";
import { AppRouter } from "@/routes";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UIProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </UIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
