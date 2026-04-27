import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getDashboardPathForRole } from '../../utils/auth.js';

function AppLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, unreadNotificationCount, user, logout } = useAuth();

  const navItems = [
    { label: 'Home', to: '/' },
    ...(isAuthenticated && user
      ? [
          { label: 'My Dashboard', to: getDashboardPathForRole(user.role) },
          { label: 'Notifications', to: '/notifications', count: unreadNotificationCount }
        ]
      : [{ label: 'Login', to: '/login' }]),
    ...(user?.role === 'SUPER_ADMIN'
      ? [{ label: 'Institute Requests', to: '/super-admin/institute-requests' }]
      : []),
    ...(user?.role === 'INSTITUTE_ADMIN'
      ? [
          { label: 'Manage Students', to: '/institute-admin/students' },
          { label: 'Manage Alumni', to: '/institute-admin/alumni' },
          { label: 'Alumni Verification', to: '/institute-admin/alumni-verification' },
          { label: 'Opportunity Approvals', to: '/institute-admin/opportunities' },
          { label: 'Announcements', to: '/institute-admin/announcements' },
          { label: 'Events', to: '/institute-admin/events' },
          { label: 'Create Student', to: '/institute-admin/students/create' },
          { label: 'Create Alumni', to: '/institute-admin/alumni/create' }
        ]
      : []),
    ...(user?.role === 'STUDENT'
      ? [
          { label: 'My Profile', to: '/student/profile' },
          { label: 'Search Alumni', to: '/student/alumni-search' },
          { label: 'My Connections', to: '/student/connections' },
          { label: 'My Guidance Requests', to: '/student/guidance-requests' },
          { label: 'Opportunities', to: '/student/opportunities' },
          { label: 'Announcements', to: '/student/announcements' },
          { label: 'Events', to: '/student/events' }
        ]
      : []),
    ...(user?.role === 'ALUMNI'
      ? [
          { label: 'My Profile', to: '/alumni/profile' },
          { label: 'Connection Requests', to: '/alumni/connection-requests' },
          { label: 'Guidance Requests', to: '/alumni/guidance-requests' },
          { label: 'My Opportunities', to: '/alumni/opportunities' },
          { label: 'Post Opportunity', to: '/alumni/opportunities/create' },
          { label: 'Announcements', to: '/alumni/announcements' },
          { label: 'Events', to: '/alumni/events' }
        ]
      : []),
    { label: 'Register Institute', to: '/institutes/register' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <Link to="/" className="text-lg font-semibold text-slate-950">
            AlumniConnect Institute Network
          </Link>
          <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-600">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="rounded-md px-3 py-2 hover:bg-slate-100">
                <span className="inline-flex items-center gap-2">
                  <span>{item.label}</span>
                  {item.count ? (
                    <span className="rounded-full bg-brand-700 px-2 py-0.5 text-xs font-semibold text-white">
                      {item.count}
                    </span>
                  ) : null}
                </span>
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-left hover:bg-slate-100"
              >
                Logout
              </button>
            ) : null}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
