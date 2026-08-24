import axios from 'axios';
import Cookies from 'js-cookie';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('access_token'); //get access token from js-cookie
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; //attach token every request
  }
  return config;
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
        const refreshToken = Cookies.get('refresh_token'); //get refresh token
        const refreshResponse = await apiClient.post('/api/auth/refresh', {
          refreshToken,
        }); //refresh token
        const { accessToken, refreshToken: nextRefreshToken } = refreshResponse.data ?? {};
        if (!accessToken || !nextRefreshToken) {
          throw new Error('Refresh response is missing tokens');
        }

        Cookies.set('access_token', accessToken, { expires: 1 });
        Cookies.set('refresh_token', nextRefreshToken, { expires: 7 });
        return apiClient(error.config); //retry the request with new token
      } catch {
        Cookies.remove('access_token'); //remove access token when refresh token failed
        window.location.href = '/login'; //redirect to login page
      }
    }
    return Promise.reject(error); //reject the request
  },
);
