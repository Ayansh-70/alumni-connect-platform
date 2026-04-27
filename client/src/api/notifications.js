import httpClient from './httpClient.js';

const getNotificationsRequest = async () => {
  const response = await httpClient.get('/notifications');
  return response.data;
};

const getUnreadNotificationCountRequest = async () => {
  const response = await httpClient.get('/notifications/unread-count');
  return response.data;
};

const markNotificationAsReadRequest = async (notificationId) => {
  const response = await httpClient.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

const markAllNotificationsAsReadRequest = async () => {
  const response = await httpClient.patch('/notifications/read-all');
  return response.data;
};

const deleteNotificationRequest = async (notificationId) => {
  const response = await httpClient.delete(`/notifications/${notificationId}`);
  return response.data;
};

export {
  deleteNotificationRequest,
  getNotificationsRequest,
  getUnreadNotificationCountRequest,
  markAllNotificationsAsReadRequest,
  markNotificationAsReadRequest
};
