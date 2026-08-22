import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        await apiClient.post('/api/auth/refresh');
        return apiClient(error.config);
      } catch {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
