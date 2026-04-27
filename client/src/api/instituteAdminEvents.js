import httpClient from './httpClient.js';

const createInstituteEventRequest = async (payload) => {
  const response = await httpClient.post('/institute-admin/events', payload);
  return response.data;
};

const getInstituteEventsRequest = async () => {
  const response = await httpClient.get('/institute-admin/events');
  return response.data;
};

const updateInstituteEventRequest = async (eventId, payload) => {
  const response = await httpClient.put(`/institute-admin/events/${eventId}`, payload);
  return response.data;
};

const toggleInstituteEventStatusRequest = async (eventId) => {
  const response = await httpClient.patch(`/institute-admin/events/${eventId}/toggle-status`);
  return response.data;
};

const deleteInstituteEventRequest = async (eventId) => {
  const response = await httpClient.delete(`/institute-admin/events/${eventId}`);
  return response.data;
};

export {
  createInstituteEventRequest,
  deleteInstituteEventRequest,
  getInstituteEventsRequest,
  toggleInstituteEventStatusRequest,
  updateInstituteEventRequest
};
