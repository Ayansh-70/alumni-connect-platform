import httpClient from './httpClient.js';

const getAlumniAnnouncementsRequest = async () => {
  const response = await httpClient.get('/alumni/announcements');
  return response.data;
};

export { getAlumniAnnouncementsRequest };
