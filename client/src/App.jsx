import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import AlumniDashboardPage from './pages/dashboards/AlumniDashboardPage.jsx';
import InstituteAdminDashboardPage from './pages/dashboards/InstituteAdminDashboardPage.jsx';
import StudentDashboardPage from './pages/dashboards/StudentDashboardPage.jsx';
import SuperAdminDashboardPage from './pages/dashboards/SuperAdminDashboardPage.jsx';
import InstituteRegisterPage from './pages/public/InstituteRegisterPage.jsx';
import LandingPage from './pages/public/LandingPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="institutes/register" element={<InstituteRegisterPage />} />
        <Route path="dashboard/super-admin" element={<SuperAdminDashboardPage />} />
        <Route path="dashboard/institute-admin" element={<InstituteAdminDashboardPage />} />
        <Route path="dashboard/student" element={<StudentDashboardPage />} />
        <Route path="dashboard/alumni" element={<AlumniDashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
