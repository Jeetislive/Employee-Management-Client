import axios from "axios";
import { getCookie, setCookie } from "../utils/cookieUtil";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // console.log(backendUrl);
const axiosInstance = axios.create({
  baseURL: backendUrl, // Replace with your backend
  withCredentials: true, // Send cookies (refresh token, etc.)
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("aToken");

    if (accessToken && config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Token Refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie("rToken");

        const res = await axios.post(
          "http://localhost:3000/auth/refresh-token",
          { refreshToken },
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        // Store new token in cookie
        setCookie("accessToken", newAccessToken, 1); // expires in 1 day

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Session expired. Logging out.");
        window.location.href = "/login"; // Optional redirect
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
