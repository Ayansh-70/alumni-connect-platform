import httpClient from './httpClient.js';

const getAlumniProfileRequest = async () => {
  const response = await httpClient.get('/alumni/profile');
  return response.data;
};

const saveAlumniProfileRequest = async (payload) => {
  const response = await httpClient.put('/alumni/profile', payload);
  return response.data;
};

export { getAlumniProfileRequest, saveAlumniProfileRequest };
