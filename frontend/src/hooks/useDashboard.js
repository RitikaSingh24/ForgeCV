import { useQuery } from "@tanstack/react-query";
import dashboardApi from "@/api/dashboard";

export function useDashboard() {
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.get,
    staleTime: 1000 * 60 * 2, // 2 mins
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useDashboard;
