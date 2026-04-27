import httpClient from './httpClient.js';

const getAlumniGuidanceRequestsRequest = async () => {
  const response = await httpClient.get('/alumni/guidance-requests');
  return response.data;
};

const getAlumniGuidanceRequestByIdRequest = async (requestId) => {
  const response = await httpClient.get(`/alumni/guidance-requests/${requestId}`);
  return response.data;
};

const acceptAlumniGuidanceRequest = async (requestId, responseMessage = '') => {
  const response = await httpClient.patch(`/alumni/guidance-requests/${requestId}/accept`, {
    responseMessage
  });
  return response.data;
};

const rejectAlumniGuidanceRequest = async (requestId, responseMessage = '') => {
  const response = await httpClient.patch(`/alumni/guidance-requests/${requestId}/reject`, {
    responseMessage
  });
  return response.data;
};

const completeAlumniGuidanceRequest = async (requestId, responseMessage = '') => {
  const response = await httpClient.patch(`/alumni/guidance-requests/${requestId}/complete`, {
    responseMessage
  });
  return response.data;
};

export {
  acceptAlumniGuidanceRequest,
  completeAlumniGuidanceRequest,
  getAlumniGuidanceRequestByIdRequest,
  getAlumniGuidanceRequestsRequest,
  rejectAlumniGuidanceRequest
};
