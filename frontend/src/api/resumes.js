import apiClient from "./client";

export const resumesApi = {
  list: async () => {
    const res = await apiClient.get("/resumes");
    return res.data;
  },
  get: async (id) => {
    const res = await apiClient.get(`/resumes/${id}`);
    return res.data;
  },
  upload: async (file, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post("/resumes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return res.data;
  },
  remove: async (id) => {
    const res = await apiClient.delete(`/resumes/${id}`);
    return res.data;
  },
  analyze: async (id, payload = {}) => {
    const res = await apiClient.post(`/resumes/${id}/analyze`, payload);
    return res.data;
  },
  rewrite: async (id, payload) => {
    const res = await apiClient.post(`/resumes/${id}/rewrite`, payload);
    return res.data;
  },
  diff: async (id, from, to) => {
    const res = await apiClient.get(`/resumes/${id}/diff`, {
      params: { from, to },
    });
    return res.data;
  },
};

export default resumesApi;
