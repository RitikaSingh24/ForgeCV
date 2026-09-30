import apiClient from "./client";

export const authApi = {
  register: async (data) => {
    const res = await apiClient.post("/auth/register", data);
    return res.data;
  },
  verifyOtp: async (data) => {
    const res = await apiClient.post("/auth/verify-otp", data);
    return res.data;
  },
  resendOtp: async (data) => {
    const res = await apiClient.post("/auth/resend-otp", data);
    return res.data;
  },
  login: async (data) => {
    const res = await apiClient.post("/auth/login", data);
    return res.data;
  },
  logout: async () => {
    const res = await apiClient.post("/auth/logout");
    return res.data;
  },
  me: async () => {
    const res = await apiClient.get("/auth/me");
    return res.data?.user;
  },
  updateProfile: async (data) => {
    const res = await apiClient.patch("/auth/profile", data);
    return res.data?.user;
  },
  changePassword: async (data) => {
    const res = await apiClient.patch("/auth/password", data);
    return res.data;
  },
};

export default authApi;
