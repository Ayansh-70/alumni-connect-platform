import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/routing/ProtectedRoute.jsx';
import RoleRoute from './components/routing/RoleRoute.jsx';
import AlumniConnectionRequestsPage from './pages/alumni/AlumniConnectionRequestsPage.jsx';
import AlumniGuidanceRequestsPage from './pages/alumni/AlumniGuidanceRequestsPage.jsx';
import AlumniOpportunitiesPage from './pages/alumni/AlumniOpportunitiesPage.jsx';
import CreateOpportunityPage from './pages/alumni/CreateOpportunityPage.jsx';
import AlumniDashboardPage from './pages/dashboards/AlumniDashboardPage.jsx';
import InstituteAdminDashboardPage from './pages/dashboards/InstituteAdminDashboardPage.jsx';
import StudentDashboardPage from './pages/dashboards/StudentDashboardPage.jsx';
import SuperAdminDashboardPage from './pages/dashboards/SuperAdminDashboardPage.jsx';
import AlumniProfilePage from './pages/alumni/AlumniProfilePage.jsx';
import AlumniPage from './pages/instituteAdmin/AlumniPage.jsx';
import AlumniVerificationPage from './pages/instituteAdmin/AlumniVerificationPage.jsx';
import OpportunityApprovalsPage from './pages/instituteAdmin/OpportunityApprovalsPage.jsx';
import CreateAlumniPage from './pages/instituteAdmin/CreateAlumniPage.jsx';
import CreateStudentPage from './pages/instituteAdmin/CreateStudentPage.jsx';
import StudentsPage from './pages/instituteAdmin/StudentsPage.jsx';
import InstituteRegisterPage from './pages/public/InstituteRegisterPage.jsx';
import LandingPage from './pages/public/LandingPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import StudentAlumniDetailPage from './pages/student/StudentAlumniDetailPage.jsx';
import StudentAlumniSearchPage from './pages/student/StudentAlumniSearchPage.jsx';
import StudentConnectionsPage from './pages/student/StudentConnectionsPage.jsx';
import StudentGuidanceRequestsPage from './pages/student/StudentGuidanceRequestsPage.jsx';
import StudentOpportunityDetailPage from './pages/student/StudentOpportunityDetailPage.jsx';
import StudentOpportunitiesPage from './pages/student/StudentOpportunitiesPage.jsx';
import StudentProfilePage from './pages/student/StudentProfilePage.jsx';
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
            <Route path="institute-admin/students" element={<StudentsPage />} />
            <Route path="institute-admin/alumni" element={<AlumniPage />} />
            <Route path="institute-admin/students/create" element={<CreateStudentPage />} />
            <Route path="institute-admin/alumni/create" element={<CreateAlumniPage />} />
            <Route path="institute-admin/alumni-verification" element={<AlumniVerificationPage />} />
            <Route path="institute-admin/opportunities" element={<OpportunityApprovalsPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['STUDENT']} />}>
            <Route path="student/dashboard" element={<StudentDashboardPage />} />
            <Route path="student/profile" element={<StudentProfilePage />} />
            <Route path="student/alumni-search" element={<StudentAlumniSearchPage />} />
            <Route path="student/alumni/:id" element={<StudentAlumniDetailPage />} />
            <Route path="student/connections" element={<StudentConnectionsPage />} />
            <Route path="student/guidance-requests" element={<StudentGuidanceRequestsPage />} />
            <Route path="student/opportunities" element={<StudentOpportunitiesPage />} />
            <Route path="student/opportunities/:id" element={<StudentOpportunityDetailPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['ALUMNI']} />}>
            <Route path="alumni/dashboard" element={<AlumniDashboardPage />} />
            <Route path="alumni/profile" element={<AlumniProfilePage />} />
            <Route path="alumni/connection-requests" element={<AlumniConnectionRequestsPage />} />
            <Route path="alumni/guidance-requests" element={<AlumniGuidanceRequestsPage />} />
            <Route path="alumni/opportunities" element={<AlumniOpportunitiesPage />} />
            <Route path="alumni/opportunities/create" element={<CreateOpportunityPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
