import httpClient from './httpClient.js';

const getStudentOpportunitiesRequest = async () => {
  const response = await httpClient.get('/student/opportunities');
  return response.data;
};

const getStudentOpportunityByIdRequest = async (opportunityId) => {
  const response = await httpClient.get(`/student/opportunities/${opportunityId}`);
  return response.data;
};

export { getStudentOpportunitiesRequest, getStudentOpportunityByIdRequest };
