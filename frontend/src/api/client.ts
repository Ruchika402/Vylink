import axios from "axios";
import toast from "react-hot-toast";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  timeout: 10000, // ✅ Wait max 10 seconds before giving up
});

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

api.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrftoken");
  if (csrfToken && config.method !== "get") {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ✅ Handle rate limiting (429)
    if (error.response?.status === 429) {
      toast.error("Too many requests. Please wait a moment.");
      return Promise.reject(error);
    }

    // ✅ Handle unauthorized (401)
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/token/refresh/");
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default api;