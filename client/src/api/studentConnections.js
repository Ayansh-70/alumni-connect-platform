import httpClient from './httpClient.js';

const createStudentConnectionRequest = async (payload) => {
  const response = await httpClient.post('/student/connections/request', payload);
  return response.data;
};

const getStudentConnectionsRequest = async () => {
  const response = await httpClient.get('/student/connections');
  return response.data;
};

const getStudentConnectionByIdRequest = async (requestId) => {
  const response = await httpClient.get(`/student/connections/${requestId}`);
  return response.data;
};

export { createStudentConnectionRequest, getStudentConnectionByIdRequest, getStudentConnectionsRequest };
