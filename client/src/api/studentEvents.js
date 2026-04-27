import httpClient from './httpClient.js';

const getStudentEventsRequest = async () => {
  const response = await httpClient.get('/student/events');
  return response.data;
};

export { getStudentEventsRequest };
