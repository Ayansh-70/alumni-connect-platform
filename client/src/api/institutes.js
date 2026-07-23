import httpClient from './httpClient.js';

const registerInstituteRequest = async (payload) => {
  const response = await httpClient.post('/institutes/register', payload);
  return response.data;
};

const getInstituteRequestsRequest = async () => {
  const response = await httpClient.get('/institutes/requests');
  return response.data;
};

const getInstitutesRequest = async () => {
  const response = await httpClient.get('/institutes');
  return response.data;
};

const approveInstituteRequest = async (instituteId) => {
  const response = await httpClient.patch(`/institutes/${instituteId}/approve`);
  return response.data;
};

const rejectInstituteRequest = async (instituteId, rejectionReason) => {
  const response = await httpClient.patch(`/institutes/${instituteId}/reject`, {
    rejectionReason
  });
  return response.data;
};

export {
  approveInstituteRequest,
  getInstituteRequestsRequest,
  getInstitutesRequest,
  registerInstituteRequest,
  rejectInstituteRequest
};
