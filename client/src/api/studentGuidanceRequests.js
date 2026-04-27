import httpClient from './httpClient.js';

const createStudentGuidanceRequest = async (payload) => {
  const response = await httpClient.post('/student/guidance-requests', payload);
  return response.data;
};

const getStudentGuidanceRequestsRequest = async () => {
  const response = await httpClient.get('/student/guidance-requests');
  return response.data;
};

const getStudentGuidanceRequestByIdRequest = async (requestId) => {
  const response = await httpClient.get(`/student/guidance-requests/${requestId}`);
  return response.data;
};

const cancelStudentGuidanceRequest = async (requestId) => {
  const response = await httpClient.patch(`/student/guidance-requests/${requestId}/cancel`);
  return response.data;
};

export {
  cancelStudentGuidanceRequest,
  createStudentGuidanceRequest,
  getStudentGuidanceRequestByIdRequest,
  getStudentGuidanceRequestsRequest
};
