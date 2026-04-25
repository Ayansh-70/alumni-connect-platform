import axios from 'axios';

const getStoredToken = () => localStorage.getItem('authToken');

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
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

    error.userMessage =
      apiMessage || error.message || 'Something went wrong while contacting the server.';

    return Promise.reject(error);
  }
);

export default httpClient;
