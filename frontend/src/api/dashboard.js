import apiClient from "./client";

export const dashboardApi = {
  get: async () => {
    const res = await apiClient.get("/dashboard");
    return res.data;
  },
};

export default dashboardApi;
