import { useQuery } from "@tanstack/react-query";
import analyticsApi from "@/api/analytics";

export function useAnalytics() {
  const insightsQuery = useQuery({
    queryKey: ["insights"],
    queryFn: analyticsApi.insights,
  });

  const versionsQuery = useQuery({
    queryKey: ["versions"],
    queryFn: analyticsApi.versions,
  });

  const historyQuery = useQuery({
    queryKey: ["history"],
    queryFn: analyticsApi.history,
  });

  return {
    insights: insightsQuery.data,
    isLoadingInsights: insightsQuery.isLoading,

    versions: versionsQuery.data || [],
    isLoadingVersions: versionsQuery.isLoading,

    history: historyQuery.data || [],
    isLoadingHistory: historyQuery.isLoading,
  };
}

export default useAnalytics;
