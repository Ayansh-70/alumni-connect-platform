import httpClient from './httpClient.js';

const createInstituteAnnouncementRequest = async (payload) => {
  const response = await httpClient.post('/institute-admin/announcements', payload);
  return response.data;
};

const getInstituteAnnouncementsRequest = async () => {
  const response = await httpClient.get('/institute-admin/announcements');
  return response.data;
};

const updateInstituteAnnouncementRequest = async (announcementId, payload) => {
  const response = await httpClient.put(`/institute-admin/announcements/${announcementId}`, payload);
  return response.data;
};

const toggleInstituteAnnouncementStatusRequest = async (announcementId) => {
  const response = await httpClient.patch(`/institute-admin/announcements/${announcementId}/toggle-status`);
  return response.data;
};

const deleteInstituteAnnouncementRequest = async (announcementId) => {
  const response = await httpClient.delete(`/institute-admin/announcements/${announcementId}`);
  return response.data;
};

export {
  createInstituteAnnouncementRequest,
  deleteInstituteAnnouncementRequest,
  getInstituteAnnouncementsRequest,
  toggleInstituteAnnouncementStatusRequest,
  updateInstituteAnnouncementRequest
};
