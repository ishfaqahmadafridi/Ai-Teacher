import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';


// Create a configured Axios instance
// Default to same-origin `/api` path so Vite proxy or production host can route requests.
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 180000,   // 3 minutes — Gemini can take 60-120s for long explanations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach authentication token or add custom headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle centralized error logging or token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Centralized error handling (e.g. redirect to login on 401)
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn('Unauthorized! Logging out user...');
        localStorage.removeItem('token');
        // Handle redirect or dispatch logout action here if needed
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
