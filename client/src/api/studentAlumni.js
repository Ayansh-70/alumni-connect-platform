import httpClient from './httpClient.js';

const searchStudentAlumniRequest = async (params = {}) => {
  const response = await httpClient.get('/student/alumni/search', { params });
  return response.data;
};

const getStudentAlumniDetailRequest = async (alumniId) => {
  const response = await httpClient.get(`/student/alumni/${alumniId}`);
  return response.data;
};

export { getStudentAlumniDetailRequest, searchStudentAlumniRequest };
