import httpClient from './httpClient.js';

const getPendingInstituteOpportunitiesRequest = async () => {
  const response = await httpClient.get('/institute-admin/opportunities/pending');
  return response.data;
};

const getInstituteOpportunitiesRequest = async () => {
  const response = await httpClient.get('/institute-admin/opportunities');
  return response.data;
};

const getInstituteOpportunityByIdRequest = async (opportunityId) => {
  const response = await httpClient.get(`/institute-admin/opportunities/${opportunityId}`);
  return response.data;
};

const approveInstituteOpportunityRequest = async (opportunityId) => {
  const response = await httpClient.patch(`/institute-admin/opportunities/${opportunityId}/approve`);
  return response.data;
};

const rejectInstituteOpportunityRequest = async (opportunityId, reason) => {
  const response = await httpClient.patch(`/institute-admin/opportunities/${opportunityId}/reject`, { reason });
  return response.data;
};

export {
  approveInstituteOpportunityRequest,
  getInstituteOpportunitiesRequest,
  getInstituteOpportunityByIdRequest,
  getPendingInstituteOpportunitiesRequest,
  rejectInstituteOpportunityRequest
};
