import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getDashboardPathForRole } from '../../utils/auth.js';
import { LayoutDashboard, Shield, Users, Building, PlusCircle, CheckCircle, Briefcase, Megaphone, Calendar, User, Search, Link2, Compass, Bell, X, Menu, PanelLeft, Sun, Moon } from 'lucide-react';

const NAVIGATION_BY_ROLE = {
  SUPER_ADMIN: [
    {
      label: 'Overview',
      items: [{ label: 'Dashboard', to: '/super-admin/dashboard', icon: LayoutDashboard }]
    },
    {
      label: 'Platform',
      items: [{ label: 'Institute Requests', to: '/super-admin/institute-requests', icon: Shield }]
    }
  ],
  INSTITUTE_ADMIN: [
    {
      label: 'Overview',
      items: [{ label: 'Dashboard', to: '/institute-admin/dashboard', icon: LayoutDashboard }]
    },
    {
      label: 'People',
      items: [
        { label: 'Students', to: '/institute-admin/students', icon: Users },
        { label: 'Alumni', to: '/institute-admin/alumni', icon: Building },
        { label: 'Create Student', to: '/institute-admin/students/create', icon: PlusCircle },
        { label: 'Create Alumni', to: '/institute-admin/alumni/create', icon: PlusCircle }
      ]
    },
    {
      label: 'Approvals',
      items: [
        { label: 'Alumni Verification', to: '/institute-admin/alumni-verification', icon: CheckCircle },
        { label: 'Opportunities', to: '/institute-admin/opportunities', icon: Briefcase }
      ]
    },
    {
      label: 'Broadcasts',
      items: [
        { label: 'Announcements', to: '/institute-admin/announcements', icon: Megaphone },
        { label: 'Events', to: '/institute-admin/events', icon: Calendar }
      ]
    }
  ],
  STUDENT: [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
        { label: 'My Profile', to: '/student/profile', icon: User }
      ]
    },
    {
      label: 'Network',
      items: [
        { label: 'Search Alumni', to: '/student/alumni-search', icon: Search },
        { label: 'Connections', to: '/student/connections', icon: Link2 },
        { label: 'Guidance Requests', to: '/student/guidance-requests', icon: Compass }
      ]
    },
    {
      label: 'Campus',
      items: [
        { label: 'Opportunities', to: '/student/opportunities', icon: Briefcase },
        { label: 'Announcements', to: '/student/announcements', icon: Megaphone },
        { label: 'Events', to: '/student/events', icon: Calendar }
      ]
    }
  ],
  ALUMNI: [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', to: '/alumni/dashboard', icon: LayoutDashboard },
        { label: 'My Profile', to: '/alumni/profile', icon: User }
      ]
    },
    {
      label: 'Requests',
      items: [
        { label: 'Connections', to: '/alumni/connection-requests', icon: Link2 },
        { label: 'Guidance Requests', to: '/alumni/guidance-requests', icon: Compass }
      ]
    },
    {
      label: 'Sharing',
      items: [
        { label: 'My Opportunities', to: '/alumni/opportunities', icon: Briefcase },
        { label: 'Post Opportunity', to: '/alumni/opportunities/create', icon: PlusCircle }
      ]
    },
    {
      label: 'Campus',
      items: [
        { label: 'Announcements', to: '/alumni/announcements', icon: Megaphone },
        { label: 'Events', to: '/alumni/events', icon: Calendar }
      ]
    }
  ]
};

const DETAIL_ROUTE_META = [
  {
    match: (pathname) => /^\/student\/alumni\/[^/]+$/.test(pathname),
    title: 'Alumni Details',
    description: 'Review verified alumni information and outreach options.'
  },
  {
    match: (pathname) => /^\/student\/opportunities\/[^/]+$/.test(pathname),
    title: 'Opportunity Details',
    description: 'Review the full scope, deadline, and application path.'
  },
  {
    match: (pathname) => pathname === '/notifications',
    title: 'Notifications',
    description: 'Track automated updates across the platform.'
  }
];

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, unreadNotificationCount, user, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setIsMobileNavOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const navigationGroups = useMemo(() => (user ? NAVIGATION_BY_ROLE[user.role] || [] : []), [user]);
  const flatNavigation = useMemo(
    () => navigationGroups.flatMap((group) => group.items.map((item) => ({ ...item, groupLabel: group.label }))),
    [navigationGroups]
  );

  const currentPage = useMemo(() => {
    const exactMatch = flatNavigation.find((item) => item.to === location.pathname);

    if (exactMatch) {
      return {
        title: exactMatch.label,
        description: exactMatch.groupLabel
      };
    }

    const detailMatch = DETAIL_ROUTE_META.find((item) => item.match(location.pathname));
    return detailMatch || { title: 'Workspace', description: 'Institute network' };
  }, [flatNavigation, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  if (!isAuthenticated || !user) {
    const isLoginPage = location.pathname === '/login';

    return (
      <div className="min-h-screen bg-bg-base text-text-primary">
        {isLoginPage ? null : (
          <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
              <Link to="/" className="flex items-center gap-3">
                <LogoMark />
                <div>
                  <p className="text-body font-bold tracking-tight text-text-primary">AlumniConnect</p>
                  <p className="text-caption text-text-secondary">Institute Network</p>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <Link to="/" className="btn-secondary border-transparent bg-transparent hover:bg-bg-secondary px-3 py-2">
                  Home
                </Link>
                <Link
                  to="/register-institute"
                  className="hidden btn-secondary border-transparent bg-transparent hover:bg-bg-secondary px-3 py-2 sm:inline-flex"
                >
                  Register
                </Link>
                <button type="button" onClick={toggleTheme} className="btn-secondary h-9 w-9 p-0 border-transparent bg-transparent hover:bg-bg-secondary" aria-label="Toggle theme">
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </button>
                <Link to="/login" className="btn-primary ml-2">
                  Sign In
                </Link>
              </div>
            </nav>
          </header>
        )}

        <main className={isLoginPage ? '' : 'mx-auto max-w-6xl px-4 py-10 lg:px-6'}>
          <Outlet />
        </main>
      </div>
    );
  }

  const sidebar = (
    <Sidebar
      groups={navigationGroups}
      isCollapsed={isCollapsed}
      onToggle={() => setIsCollapsed((current) => !current)}
      user={user}
    />
  );

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <aside className={`fixed inset-y-0 left-0 z-40 hidden lg:block ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {sidebar}
      </aside>

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-sidebar/40 backdrop-blur-sm" onClick={() => setIsMobileNavOpen(false)} aria-label="Close navigation" />
          <aside className="relative h-full w-[min(20rem,85vw)] shadow-level-2">
            <Sidebar groups={navigationGroups} isCollapsed={false} onToggle={() => setIsMobileNavOpen(false)} user={user} isMobile />
          </aside>
        </div>
      ) : null}

      <div className={isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}>
        <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-4">
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:bg-bg-secondary lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <p className="truncate text-body font-semibold text-text-primary">{currentPage.title}</p>
                <p className="truncate text-caption text-text-secondary">{currentPage.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" onClick={toggleTheme} className="btn-secondary h-9 w-9 p-0 rounded-full border-transparent bg-transparent hover:bg-bg-secondary" aria-label="Toggle theme">
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>

              <Link to="/notifications" className="relative btn-secondary h-9 w-9 p-0 rounded-full border-transparent bg-transparent hover:bg-bg-secondary" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                {unreadNotificationCount > 0 ? (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger ring-2 ring-surface"></span>
                ) : null}
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((current) => !current)}
                  className="flex items-center gap-2 rounded-full border border-border bg-surface p-1 pr-3 hover:bg-bg-secondary transition-colors"
                  aria-expanded={isProfileOpen}
                >
                  <Avatar name={user.name} />
                  <span className="hidden max-w-32 truncate text-button font-medium text-text-primary sm:inline">{user.name}</span>
                </button>

                {isProfileOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] w-64 rounded-xl border border-border bg-surface p-2 shadow-level-2">
                    <div className="flex items-center gap-3 rounded-lg bg-bg-secondary p-3 mb-2">
                      <Avatar name={user.name} />
                      <div className="min-w-0">
                        <p className="truncate text-body font-bold text-text-primary">{user.name}</p>
                        <p className="truncate text-caption text-text-secondary">{user.email}</p>
                        <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-wider text-primary">{user.role}</p>
                      </div>
                    </div>
                    <div className="grid gap-1">
                      <Link to={getDashboardPathForRole(user.role)} className="btn-secondary justify-start px-3 py-2 border-transparent bg-transparent shadow-none hover:bg-bg-secondary w-full">
                        Dashboard
                      </Link>
                      <button type="button" onClick={handleLogout} className="btn-secondary justify-start px-3 py-2 border-transparent bg-transparent shadow-none text-danger hover:bg-danger/10 w-full">
                        Logout
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Sidebar({ groups, isCollapsed, onToggle, user, isMobile = false }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-slate-300">
      <div className="flex h-16 items-center justify-between gap-3 px-4 border-b border-slate-800">
        <Link to={getDashboardPathForRole(user.role)} className="flex min-w-0 items-center gap-3">
          <LogoMark />
          {!isCollapsed ? (
            <div className="min-w-0">
              <p className="truncate text-body font-bold tracking-tight text-white">AlumniConnect</p>
            </div>
          ) : null}
        </Link>
        <button type="button" onClick={onToggle} className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-hover text-slate-400 hover:text-white transition-colors" aria-label={isMobile ? 'Close navigation' : 'Collapse navigation'}>
          {isMobile ? <X className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6">
        {groups.map((group) => (
          <div key={group.label} className="mb-6">
            {!isCollapsed ? (
              <p className="mb-2 px-3 text-[0.7rem] font-semibold uppercase tracking-wider text-slate-500">
                {group.label}
              </p>
            ) : null}
            <div className="grid gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    title={isCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-md px-3 py-2 text-button font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-slate-400 hover:bg-sidebar-hover hover:text-white'
                      } ${isCollapsed ? 'justify-center' : ''}`
                    }
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                    {!isCollapsed ? <span className="truncate">{item.label}</span> : null}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className={`flex items-center gap-3 rounded-md bg-sidebar-hover p-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <Avatar name={user.name} />
          {!isCollapsed ? (
            <div className="min-w-0">
              <p className="truncate text-caption font-medium text-white">{user.name}</p>
              <p className="truncate text-badge text-slate-400">{user.role}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white shadow-sm">
      AC
    </span>
  );
}

function Avatar({ name }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-badge font-bold text-slate-900">
      {getInitials(name)}
    </span>
  );
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'AC';
}

export default AppLayout;
