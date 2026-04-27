import httpClient from './httpClient.js';

const getAlumniConnectionRequestsRequest = async () => {
  const response = await httpClient.get('/alumni/connections/requests');
  return response.data;
};

const acceptAlumniConnectionRequest = async (requestId) => {
  const response = await httpClient.patch(`/alumni/connections/${requestId}/accept`);
  return response.data;
};

const rejectAlumniConnectionRequest = async (requestId) => {
  const response = await httpClient.patch(`/alumni/connections/${requestId}/reject`);
  return response.data;
};

export { acceptAlumniConnectionRequest, getAlumniConnectionRequestsRequest, rejectAlumniConnectionRequest };
