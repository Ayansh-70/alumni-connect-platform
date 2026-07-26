import axios from 'axios';
import { AUTH_STORAGE_KEY } from '../utils/auth.js';
import { validateClientEnv, getApiBaseUrl } from '../config/envValidator.js';

validateClientEnv();

const getStoredToken = () => localStorage.getItem(AUTH_STORAGE_KEY);

const httpClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

httpClient.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiMessage = error.response?.data?.message;
    const isNetworkError = !error.response;

    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    error.userMessage =
      apiMessage ||
      (isNetworkError
        ? 'Unable to reach the server. Check your connection and try again.'
        : error.response?.status === 401
          ? 'Your session has expired. Please sign in again.'
          : error.message || 'Something went wrong while contacting the server.');

    return Promise.reject(error);
  }
);

export default httpClient;
