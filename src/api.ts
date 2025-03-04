import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token refresh mechanism
api.interceptors.response.use(
  (response) => response, // ✅ If response is successful, return it
  async (error) => {
    if (error.response?.status === 401 && error.response?.data?.code === "token_not_valid") {
      const refreshToken = localStorage.getItem("refresh_token");
      
      if (refreshToken) {
        try {
          // Request new access token using refresh token
          const refreshResponse = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
            refresh: refreshToken,
          });

          // Store new access token
          localStorage.setItem("access_token", refreshResponse.data.access);

          // Retry the failed request with new token
          error.config.headers["Authorization"] = `Bearer ${refreshResponse.data.access}`;
          return api.request(error.config);
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
          localStorage.clear();
          window.location.href = "/login"; // Redirect user to login page
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
