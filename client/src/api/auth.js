import httpClient from './httpClient.js';

const loginRequest = async (credentials) => {
  const response = await httpClient.post('/auth/login', credentials);
  return response.data;
};

const getCurrentUserRequest = async () => {
  const response = await httpClient.get('/auth/me');
  return response.data;
};

const forgotPasswordRequest = async (email) => {
  const response = await httpClient.post('/auth/forgot-password', { email });
  return response.data;
};

const resetPasswordRequest = async (token, password) => {
  const response = await httpClient.post(`/auth/reset-password/${token}`, { password });
  return response.data;
};

const changePasswordRequest = async (payload) => {
  const response = await httpClient.post('/auth/change-password', payload);
  return response.data;
};

export { changePasswordRequest, forgotPasswordRequest, getCurrentUserRequest, loginRequest, resetPasswordRequest };
