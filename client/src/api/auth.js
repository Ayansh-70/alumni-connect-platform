import httpClient from './httpClient.js';

const loginRequest = async (credentials) => {
  const response = await httpClient.post('/auth/login', credentials);
  return response.data;
};

const getCurrentUserRequest = async () => {
  const response = await httpClient.get('/auth/me');
  return response.data;
};

export { getCurrentUserRequest, loginRequest };
