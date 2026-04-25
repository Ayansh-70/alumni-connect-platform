const AUTH_STORAGE_KEY = 'authToken';

const ROLE_DASHBOARD_MAP = {
  SUPER_ADMIN: '/super-admin/dashboard',
  INSTITUTE_ADMIN: '/institute-admin/dashboard',
  STUDENT: '/student/dashboard',
  ALUMNI: '/alumni/dashboard'
};

const getDashboardPathForRole = (role) => ROLE_DASHBOARD_MAP[role] || '/login';

export { AUTH_STORAGE_KEY, ROLE_DASHBOARD_MAP, getDashboardPathForRole };
