import axios from "axios";
import toast from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// ✅ Flag to stop requests after 401
let isUnauthorized = false;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

// ✅ Request interceptor
api.interceptors.request.use(
  (config) => {
    if (isUnauthorized) {
      return Promise.reject({ message: "Unauthorized", cancelled: true });
    }

    const csrfToken = getCookie("csrftoken");
    if (csrfToken && config.method !== "get") {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Handle rate limiting (429)
    if (error.response?.status === 429) {
      toast.error("Too many requests. Please wait a moment.");
      return Promise.reject(error);
    }

    // ✅ Handle 401 — only show/redirect if user is on a protected route
if (error.response?.status === 401 && !isUnauthorized) {
  const publicPaths = ['/login', '/register', '/'];
  const isPublicRoute = publicPaths.includes(window.location.pathname);

  if (isPublicRoute) {
    // Expected 401 (not logged in yet, on a public page) — don't alarm the user
    return Promise.reject(error);
  }

  isUnauthorized = true;
  toast.error("Session expired. Please login again.");

  setTimeout(() => {
    window.location.href = "/login";
  }, 100);

  return Promise.reject(error);
}

    return Promise.reject(error);
  }
);

// ✅ Reset function for login
export const resetUnauthorizedFlag = () => {
  isUnauthorized = false;
};

export default api;