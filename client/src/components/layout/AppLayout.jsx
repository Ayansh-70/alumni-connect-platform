import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getDashboardPathForRole } from '../../utils/auth.js';

const NAVIGATION_BY_ROLE = {
  SUPER_ADMIN: [
    {
      label: 'Overview',
      items: [{ label: 'Dashboard', to: '/super-admin/dashboard', icon: GridIcon }]
    },
    {
      label: 'Platform',
      items: [{ label: 'Institute Requests', to: '/super-admin/institute-requests', icon: ShieldIcon }]
    }
  ],
  INSTITUTE_ADMIN: [
    {
      label: 'Overview',
      items: [{ label: 'Dashboard', to: '/institute-admin/dashboard', icon: GridIcon }]
    },
    {
      label: 'People',
      items: [
        { label: 'Students', to: '/institute-admin/students', icon: UsersIcon },
        { label: 'Alumni', to: '/institute-admin/alumni', icon: CommunityIcon },
        { label: 'Create Student', to: '/institute-admin/students/create', icon: PlusCircleIcon },
        { label: 'Create Alumni', to: '/institute-admin/alumni/create', icon: PlusCircleIcon }
      ]
    },
    {
      label: 'Approvals',
      items: [
        { label: 'Alumni Verification', to: '/institute-admin/alumni-verification', icon: CheckBadgeIcon },
        { label: 'Opportunities', to: '/institute-admin/opportunities', icon: BriefcaseIcon }
      ]
    },
    {
      label: 'Broadcasts',
      items: [
        { label: 'Announcements', to: '/institute-admin/announcements', icon: SpeakerIcon },
        { label: 'Events', to: '/institute-admin/events', icon: CalendarIcon }
      ]
    }
  ],
  STUDENT: [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', to: '/student/dashboard', icon: GridIcon },
        { label: 'My Profile', to: '/student/profile', icon: ProfileIcon }
      ]
    },
    {
      label: 'Network',
      items: [
        { label: 'Search Alumni', to: '/student/alumni-search', icon: SearchIcon },
        { label: 'Connections', to: '/student/connections', icon: LinkIcon },
        { label: 'Guidance Requests', to: '/student/guidance-requests', icon: CompassIcon }
      ]
    },
    {
      label: 'Campus',
      items: [
        { label: 'Opportunities', to: '/student/opportunities', icon: BriefcaseIcon },
        { label: 'Announcements', to: '/student/announcements', icon: SpeakerIcon },
        { label: 'Events', to: '/student/events', icon: CalendarIcon }
      ]
    }
  ],
  ALUMNI: [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', to: '/alumni/dashboard', icon: GridIcon },
        { label: 'My Profile', to: '/alumni/profile', icon: ProfileIcon }
      ]
    },
    {
      label: 'Requests',
      items: [
        { label: 'Connections', to: '/alumni/connection-requests', icon: LinkIcon },
        { label: 'Guidance Requests', to: '/alumni/guidance-requests', icon: CompassIcon }
      ]
    },
    {
      label: 'Sharing',
      items: [
        { label: 'My Opportunities', to: '/alumni/opportunities', icon: BriefcaseIcon },
        { label: 'Post Opportunity', to: '/alumni/opportunities/create', icon: PlusCircleIcon }
      ]
    },
    {
      label: 'Campus',
      items: [
        { label: 'Announcements', to: '/alumni/announcements', icon: SpeakerIcon },
        { label: 'Events', to: '/alumni/events', icon: CalendarIcon }
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
      <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        {isLoginPage ? null : (
          <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/75">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
              <Link to="/" className="flex items-center gap-3">
                <LogoMark />
                <div>
                  <p className="text-sm font-black tracking-tight text-slate-950 dark:text-white">AlumniConnect</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Institute Network</p>
                </div>
              </Link>

              <div className="flex items-center gap-2 text-sm font-semibold">
                <Link to="/" className="rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900">
                  Home
                </Link>
                <Link
                  to="/institutes/register"
                  className="hidden rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 sm:inline-flex"
                >
                  Register
                </Link>
                <button type="button" onClick={toggleTheme} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" aria-label="Toggle theme">
                  {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>
                <Link to="/login" className="btn-primary px-4 py-2.5">
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
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(180deg,#f8fafc_0%,#eaf1ff_52%,#f8fafc_100%)] dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_50%,#020617_100%)]" />

      <aside className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80 lg:block ${isCollapsed ? 'w-24' : 'w-72'}`}>
        {sidebar}
      </aside>

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsMobileNavOpen(false)} aria-label="Close navigation" />
          <aside className="relative h-full w-[min(22rem,88vw)] border-r border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <Sidebar groups={navigationGroups} isCollapsed={false} onToggle={() => setIsMobileNavOpen(false)} user={user} isMobile />
          </aside>
        </div>
      ) : null}

      <div className={isCollapsed ? 'lg:pl-24' : 'lg:pl-72'}>
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
          <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 lg:hidden"
                aria-label="Open navigation"
              >
                <MenuIcon />
              </button>
              <div className="min-w-0">
                <p className="truncate text-lg font-black tracking-tight text-slate-950 dark:text-white">{currentPage.title}</p>
                <p className="truncate text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{currentPage.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={toggleTheme} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Toggle theme">
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </button>

              <Link to="/notifications" className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Notifications">
                <BellIcon />
                {unreadNotificationCount > 0 ? (
                  <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-600 px-1.5 py-0.5 text-center text-[0.65rem] font-black text-white shadow-lg shadow-rose-600/25">
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </span>
                ) : null}
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((current) => !current)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                  aria-expanded={isProfileOpen}
                >
                  <Avatar name={user.name} />
                  <span className="hidden max-w-32 truncate text-xs font-bold text-slate-700 dark:text-slate-200 sm:inline">{user.name}</span>
                </button>

                {isProfileOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] w-72 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950/60">
                      <Avatar name={user.name} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{user.name}</p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                        <p className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-brand-700 dark:text-brand-400">{user.role}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2">
                      <Link to={getDashboardPathForRole(user.role)} className="btn-secondary justify-center py-2.5">
                        Dashboard
                      </Link>
                      <button type="button" onClick={handleLogout} className="btn-danger justify-center py-2.5">
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
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-between gap-3 px-4">
        <Link to={getDashboardPathForRole(user.role)} className="flex min-w-0 items-center gap-3">
          <LogoMark />
          {!isCollapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-black tracking-tight text-slate-950 dark:text-white">AlumniConnect</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">Institute Network</p>
            </div>
          ) : null}
        </Link>
        <button type="button" onClick={onToggle} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" aria-label={isMobile ? 'Close navigation' : 'Collapse navigation'}>
          {isMobile ? <CloseIcon /> : <PanelIcon />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            {!isCollapsed ? (
              <p className="mb-2 px-3 text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
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
                    title={isCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                        isActive
                          ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/10 dark:bg-white dark:text-slate-950'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'
                      } ${isCollapsed ? 'justify-center' : ''}`
                    }
                  >
                    <Icon />
                    {!isCollapsed ? <span className="truncate">{item.label}</span> : null}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200/70 p-4 dark:border-slate-800/80">
        <div className={`flex items-center gap-3 rounded-2xl bg-slate-100/80 p-3 dark:bg-slate-900/70 ${isCollapsed ? 'justify-center' : ''}`}>
          <Avatar name={user.name} />
          {!isCollapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{user.name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-slate-950 text-sm font-black text-white shadow-lg shadow-brand-700/20">
      AC
    </span>
  );
}

function Avatar({ name }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white shadow-sm dark:bg-white dark:text-slate-950">
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

function iconProps() {
  return {
    className: 'h-[1.1rem] w-[1.1rem] shrink-0',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2.2',
    viewBox: '0 0 24 24'
  };
}

function GridIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 3l7 3v5c0 4.5-2.7 7.9-7 10-4.3-2.1-7-5.5-7-10V6l7-3z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9.5 11A3.5 3.5 0 109.5 4a3.5 3.5 0 000 7zM20 21v-2a4 4 0 00-3-3.87M16.5 4.13a3.5 3.5 0 010 6.74" />
    </svg>
  );
}

function CommunityIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M8 12a3 3 0 100-6 3 3 0 000 6zM16 13a4 4 0 00-4 4v1h8v-1a4 4 0 00-4-4zM17 6a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM5 14a3 3 0 00-3 3v1h5" />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 8v8M8 12h8" />
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M9 12l2 2 4-4M12 3l2.5 2.5L18 6l-.5 3.5L20 12l-2.5 2.5L18 18l-3.5.5L12 21l-2.5-2.5L6 18l.5-3.5L4 12l2.5-2.5L6 6l3.5-.5L12 3z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M9 6V4h6v2M3 9h18v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM3 9l2-3h14l2 3" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M5 11h4l5-4v10l-5-4H5zM17 9.5a4 4 0 010 5M19.5 7a7 7 0 010 10" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M8 3v3M16 3v3M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM5 21a7 7 0 0114 0" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M10 13a5 5 0 007.07 0l1.41-1.41a5 5 0 10-7.07-7.07L10 6M14 11a5 5 0 00-7.07 0L5.5 12.41a5 5 0 007.07 7.07L14 18" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M6 8a6 6 0 1112 0c0 6 2 7 2 7H4s2-1 2-7M10 19a2 2 0 004 0" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function PanelIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 5h16v14H4zM9 5v14" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

export default AppLayout;
