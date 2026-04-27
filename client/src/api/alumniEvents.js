import httpClient from './httpClient.js';

const getAlumniEventsRequest = async () => {
  const response = await httpClient.get('/alumni/events');
  return response.data;
};

export { getAlumniEventsRequest };
