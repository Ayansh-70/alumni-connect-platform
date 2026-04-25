import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getDashboardPathForRole } from '../../utils/auth.js';

function AppLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { label: 'Home', to: '/' },
    ...(isAuthenticated && user
      ? [{ label: 'My Dashboard', to: getDashboardPathForRole(user.role) }]
      : [{ label: 'Login', to: '/login' }]),
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
                {item.label}
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
