import httpClient from './httpClient.js';

const createAlumniOpportunityRequest = async (payload) => {
  const response = await httpClient.post('/alumni/opportunities', payload);
  return response.data;
};

const getAlumniOpportunitiesRequest = async () => {
  const response = await httpClient.get('/alumni/opportunities');
  return response.data;
};

const getAlumniOpportunityByIdRequest = async (opportunityId) => {
  const response = await httpClient.get(`/alumni/opportunities/${opportunityId}`);
  return response.data;
};

const updateAlumniOpportunityRequest = async (opportunityId, payload) => {
  const response = await httpClient.put(`/alumni/opportunities/${opportunityId}`, payload);
  return response.data;
};

const closeAlumniOpportunityRequest = async (opportunityId) => {
  const response = await httpClient.patch(`/alumni/opportunities/${opportunityId}/close`);
  return response.data;
};

export {
  closeAlumniOpportunityRequest,
  createAlumniOpportunityRequest,
  getAlumniOpportunitiesRequest,
  getAlumniOpportunityByIdRequest,
  updateAlumniOpportunityRequest
};
