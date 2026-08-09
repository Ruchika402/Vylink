import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ Required to send cookies
  headers: { "Content-Type": "application/json" },
});

// Refresh token interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/token/refresh/");
        return api(originalRequest);
      } catch (e) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
