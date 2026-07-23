import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/routing/ProtectedRoute.jsx';
import RoleRoute from './components/routing/RoleRoute.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import AlumniAnnouncementsPage from './pages/alumni/AlumniAnnouncementsPage.jsx';
import AlumniConnectionRequestsPage from './pages/alumni/AlumniConnectionRequestsPage.jsx';
import AlumniEventsPage from './pages/alumni/AlumniEventsPage.jsx';
import AlumniGuidanceRequestsPage from './pages/alumni/AlumniGuidanceRequestsPage.jsx';
import AlumniOpportunitiesPage from './pages/alumni/AlumniOpportunitiesPage.jsx';
import CreateOpportunityPage from './pages/alumni/CreateOpportunityPage.jsx';
import AnnouncementsPage from './pages/instituteAdmin/AnnouncementsPage.jsx';
import AlumniDashboardPage from './pages/dashboards/AlumniDashboardPage.jsx';
import InstituteAdminDashboardPage from './pages/dashboards/InstituteAdminDashboardPage.jsx';
import StudentDashboardPage from './pages/dashboards/StudentDashboardPage.jsx';
import SuperAdminDashboardPage from './pages/dashboards/SuperAdminDashboardPage.jsx';
import AlumniProfilePage from './pages/alumni/AlumniProfilePage.jsx';
import AlumniPage from './pages/instituteAdmin/AlumniPage.jsx';
import AlumniVerificationPage from './pages/instituteAdmin/AlumniVerificationPage.jsx';
import EventsPage from './pages/instituteAdmin/EventsPage.jsx';
import OpportunityApprovalsPage from './pages/instituteAdmin/OpportunityApprovalsPage.jsx';
import CreateAlumniPage from './pages/instituteAdmin/CreateAlumniPage.jsx';
import CreateStudentPage from './pages/instituteAdmin/CreateStudentPage.jsx';
import StudentsPage from './pages/instituteAdmin/StudentsPage.jsx';
import InstituteRegisterPage from './pages/public/InstituteRegisterPage.jsx';
import LandingPage from './pages/public/LandingPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import NotFoundPage from './pages/public/NotFoundPage.jsx';
import StudentAlumniDetailPage from './pages/student/StudentAlumniDetailPage.jsx';
import StudentAlumniSearchPage from './pages/student/StudentAlumniSearchPage.jsx';
import StudentAnnouncementsPage from './pages/student/StudentAnnouncementsPage.jsx';
import StudentConnectionsPage from './pages/student/StudentConnectionsPage.jsx';
import StudentEventsPage from './pages/student/StudentEventsPage.jsx';
import StudentGuidanceRequestsPage from './pages/student/StudentGuidanceRequestsPage.jsx';
import StudentOpportunityDetailPage from './pages/student/StudentOpportunityDetailPage.jsx';
import StudentOpportunitiesPage from './pages/student/StudentOpportunitiesPage.jsx';
import StudentProfilePage from './pages/student/StudentProfilePage.jsx';
import InstituteRequestsPage from './pages/superAdmin/InstituteRequestsPage.jsx';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/public/ResetPasswordPage.jsx';
import ForcePasswordChangePage from './pages/public/ForcePasswordChangePage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register-institute" element={<InstituteRegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="force-password-change" element={<ForcePasswordChangePage />} />
          <Route path="notifications" element={<NotificationsPage />} />

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
            <Route path="institute-admin/announcements" element={<AnnouncementsPage />} />
            <Route path="institute-admin/events" element={<EventsPage />} />
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
            <Route path="student/announcements" element={<StudentAnnouncementsPage />} />
            <Route path="student/events" element={<StudentEventsPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['ALUMNI']} />}>
            <Route path="alumni/dashboard" element={<AlumniDashboardPage />} />
            <Route path="alumni/profile" element={<AlumniProfilePage />} />
            <Route path="alumni/connection-requests" element={<AlumniConnectionRequestsPage />} />
            <Route path="alumni/guidance-requests" element={<AlumniGuidanceRequestsPage />} />
            <Route path="alumni/opportunities" element={<AlumniOpportunitiesPage />} />
            <Route path="alumni/opportunities/create" element={<CreateOpportunityPage />} />
            <Route path="alumni/announcements" element={<AlumniAnnouncementsPage />} />
            <Route path="alumni/events" element={<AlumniEventsPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
