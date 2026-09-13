import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestUrl = error.config?.url ?? '';
    const isAuthRequest = requestUrl.includes('/api/auth/') || requestUrl.startsWith('api/auth/');

    // A failed login must reach the form so it can show the invalid-credentials message.
    // Refreshing here would fail too and redirect the user before that message is displayed.
    if (isAuthRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !error.config._retry) {
      //check if token is expired
      error.config._retry = true;
      try {
        await apiClient.post('/api/auth/refresh'); //backend send new cookie
        return apiClient(error.config); // retry with new cookie
      } catch {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
