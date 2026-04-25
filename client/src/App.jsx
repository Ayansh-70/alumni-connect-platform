import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/routing/ProtectedRoute.jsx';
import RoleRoute from './components/routing/RoleRoute.jsx';
import AlumniDashboardPage from './pages/dashboards/AlumniDashboardPage.jsx';
import InstituteAdminDashboardPage from './pages/dashboards/InstituteAdminDashboardPage.jsx';
import StudentDashboardPage from './pages/dashboards/StudentDashboardPage.jsx';
import SuperAdminDashboardPage from './pages/dashboards/SuperAdminDashboardPage.jsx';
import InstituteRegisterPage from './pages/public/InstituteRegisterPage.jsx';
import LandingPage from './pages/public/LandingPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import InstituteRequestsPage from './pages/superAdmin/InstituteRequestsPage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="institutes/register" element={<InstituteRegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN']} />}>
            <Route path="super-admin/dashboard" element={<SuperAdminDashboardPage />} />
            <Route path="super-admin/institute-requests" element={<InstituteRequestsPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['INSTITUTE_ADMIN']} />}>
            <Route path="institute-admin/dashboard" element={<InstituteAdminDashboardPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['STUDENT']} />}>
            <Route path="student/dashboard" element={<StudentDashboardPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['ALUMNI']} />}>
            <Route path="alumni/dashboard" element={<AlumniDashboardPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
