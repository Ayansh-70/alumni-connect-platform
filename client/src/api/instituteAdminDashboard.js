import api from './httpClient.js';

export const getInstituteAdminDashboardStatsRequest = async () => {
  const response = await api.get('/institute-admin/dashboard/stats');
  return response.data;
};
