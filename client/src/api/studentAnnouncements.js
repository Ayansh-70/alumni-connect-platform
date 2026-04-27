import httpClient from './httpClient.js';

const getStudentAnnouncementsRequest = async () => {
  const response = await httpClient.get('/student/announcements');
  return response.data;
};

export { getStudentAnnouncementsRequest };
