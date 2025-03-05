import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Add token to requests, but exclude Authorization for public endpoints like password reset
api.interceptors.request.use(
  (config) => {
    console.log("Request config:", config); // Add this line to see the config

    // Check if the request URL is for the password reset endpoint
    if (config.url && config.url.includes("/api/accounts/request-password-reset/")) {
      // Don't include Authorization for password reset requests
      delete config.headers.Authorization;
    } else {
      // Add the Authorization header for other requests if a token is available
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error); // Handle request errors
    return Promise.reject(error);
  }
);

export default api;
