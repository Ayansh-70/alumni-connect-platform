import httpClient from './httpClient.js';

const getPendingAlumniProfilesRequest = async () => {
  const response = await httpClient.get('/institute-admin/alumni-profiles/pending');
  return response.data;
};

const getInstituteAlumniProfilesRequest = async () => {
  const response = await httpClient.get('/institute-admin/alumni-profiles');
  return response.data;
};

const verifyAlumniProfileRequest = async (profileId) => {
  const response = await httpClient.patch(`/institute-admin/alumni-profiles/${profileId}/verify`);
  return response.data;
};

const rejectAlumniProfileRequest = async (profileId, reason) => {
  const response = await httpClient.patch(`/institute-admin/alumni-profiles/${profileId}/reject`, { reason });
  return response.data;
};

export {
  getInstituteAlumniProfilesRequest,
  getPendingAlumniProfilesRequest,
  rejectAlumniProfileRequest,
  verifyAlumniProfileRequest
};
