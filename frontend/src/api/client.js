import axios from "axios";

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  url = url.trim().replace(/\/+$/, "");
  if (!url.endsWith("/api")) {
    url += "/api";
  }
  return url;
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  timeout: 60000,
});

apiClient.interceptors.response.use(
  (response) => {
    // Return full response data (which contains { statusCode, data, message, success })
    return response.data;
  },
  (error) => {
    const normalizedError = {
      message:
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred. Please try again.",
      code: error.response?.data?.code || "API_ERROR",
      status: error.response?.status || 500,
      errors: error.response?.data?.errors || [],
    };
    return Promise.reject(normalizedError);
  }
);

export default apiClient;
