import httpClient from './httpClient.js';

const createStudentRequest = async (payload) => {
  const response = await httpClient.post('/institute-admin/users/students', payload);
  return response.data;
};

const createAlumniRequest = async (payload) => {
  const response = await httpClient.post('/institute-admin/users/alumni', payload);
  return response.data;
};

const getStudentsRequest = async (params = {}) => {
  const response = await httpClient.get('/institute-admin/users/students', { params });
  return response.data;
};

const getAlumniRequest = async (params = {}) => {
  const response = await httpClient.get('/institute-admin/users/alumni', { params });
  return response.data;
};

const updateInstituteUserStatusRequest = async (userId, status) => {
  const response = await httpClient.patch(`/institute-admin/users/${userId}/status`, { status });
  return response.data;
};

export {
  createAlumniRequest,
  createStudentRequest,
  getAlumniRequest,
  getStudentsRequest,
  updateInstituteUserStatusRequest
};
