import apiClient from "./client";

export const analyticsApi = {
  insights: async () => {
    const res = await apiClient.get("/insights");
    return res.data;
  },
  versions: async () => {
    const res = await apiClient.get("/versions");
    return res.data;
  },
  history: async () => {
    const res = await apiClient.get("/history");
    return res.data;
  },
};

export default analyticsApi;
