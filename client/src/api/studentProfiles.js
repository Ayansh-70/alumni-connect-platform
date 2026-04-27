import httpClient from './httpClient.js';

const getStudentProfileRequest = async () => {
  const response = await httpClient.get('/student/profile');
  return response.data;
};

const saveStudentProfileRequest = async (payload) => {
  const response = await httpClient.put('/student/profile', payload);
  return response.data;
};

export { getStudentProfileRequest, saveStudentProfileRequest };
