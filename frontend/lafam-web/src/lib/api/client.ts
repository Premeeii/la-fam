import axios from 'axios';
import Cookies from 'js-cookie';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = Cookies.get('refresh_token');
        const refreshResponse = await apiClient.post('/api/auth/refresh', { refreshToken });
        if (refreshResponse.data?.accessToken) {
            Cookies.set('access_token', refreshResponse.data.accessToken, { expires: 1 });
        }
        return apiClient(error.config);
      } catch {
        Cookies.remove('access_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
