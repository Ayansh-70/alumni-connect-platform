import { useEffect, useMemo, useState, useRef } from 'react';
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
        { label: 'Manage Students', to: '/institute-admin/students', icon: UsersIcon },
        { label: 'Manage Alumni', to: '/institute-admin/alumni', icon: CommunityIcon },
        { label: 'Create Student', to: '/institute-admin/students/create', icon: PlusCircleIcon },
        { label: 'Create Alumni', to: '/institute-admin/alumni/create', icon: PlusCircleIcon }
      ]
    },
    {
      label: 'Approvals',
      items: [
        { label: 'Alumni Verification', to: '/institute-admin/alumni-verification', icon: CheckBadgeIcon },
        { label: 'Opportunity Approvals', to: '/institute-admin/opportunities', icon: BriefcaseIcon }
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
        { label: 'Connection Requests', to: '/alumni/connection-requests', icon: LinkIcon },
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
  
  // Custom futuristic states
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchInputRef = useRef(null);
  const hubRef = useRef(null);

  // Sync theme class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close menus on page navigation
  useEffect(() => {
    setIsHubOpen(false);
    setIsProfileOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsHubOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsHubOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when hub opens
  useEffect(() => {
    if (isHubOpen) {
      setSelectedIndex(0);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isHubOpen]);

  const navigationGroups = useMemo(() => (user ? NAVIGATION_BY_ROLE[user.role] || [] : []), [user]);
  const flatNavigation = useMemo(
    () => navigationGroups.flatMap((group) => group.items.map((item) => ({ ...item, groupLabel: group.label }))),
    [navigationGroups]
  );

  const filteredNavigation = useMemo(() => {
    if (!searchQuery) return flatNavigation;
    return flatNavigation.filter(
      (item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.groupLabel.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [flatNavigation, searchQuery]);

  // Keyboard navigation inside search hub
  const handleHubKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredNavigation.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredNavigation.length) % filteredNavigation.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredNavigation[selectedIndex]) {
        navigate(filteredNavigation[selectedIndex].to);
        setIsHubOpen(false);
      }
    }
  };

  const currentPage = useMemo(() => {
    const exactMatch = flatNavigation.find((item) => item.to === location.pathname);

    if (exactMatch) {
      return {
        title: exactMatch.label,
        description: `Browse ${exactMatch.groupLabel.toLowerCase()} tools for your role.`
      };
    }

    const detailMatch = DETAIL_ROUTE_META.find((item) => item.match(location.pathname));
    return detailMatch || { title: 'Workspace', description: 'Manage your institute network with role-based tools.' };
  }, [flatNavigation, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Public Layout
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_45%,#f8fafc_100%)] dark:bg-[linear-gradient(180deg,#0a0e1a_0%,#0f172a_50%,#090d16_100%)] transition-colors duration-300">
        <header className="border-b border-white/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-brand-600/20">
                AC
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-700 dark:text-brand-400">AlumniConnect</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Institute Network</p>
              </div>
            </Link>

            <div className="flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Link to="/" className="rounded-full px-4 py-2 transition hover:bg-white/40 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white">
                Home
              </Link>
              <Link
                to="/institutes/register"
                className="hidden rounded-full px-4 py-2 transition hover:bg-white/40 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white sm:inline-flex"
              >
                Register Institute
              </Link>
              
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm transition"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </button>

              <Link
                to="/login"
                className="rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2.5 text-white font-semibold shadow-lg shadow-brand-600/20 transition hover:scale-[1.03] active:scale-[0.97]"
              >
                Sign In
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
          <Outlet />
        </main>
      </div>
    );
  }

  // Active Icon for Command Orb
  const activeIcon = () => {
    const currentItem = flatNavigation.find((item) => item.to === location.pathname);
    const Icon = currentItem?.icon || GridIcon;
    return <Icon />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-24">
      {/* Top Floating Status Island */}
      <div className="fixed top-6 right-6 z-40 flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-900/70 border border-white/40 dark:border-slate-800/40 backdrop-blur-xl px-4 py-2.5 rounded-full shadow-xl shadow-slate-900/5 dark:shadow-black/25">
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/50 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-400 border border-brand-100 dark:border-brand-900/30">
            {currentPage.title}
          </span>

          {/* Theme switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* Notifications bell */}
          <Link
            to="/notifications"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Notifications"
          >
            <BellIcon />
            {unreadNotificationCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-rose-600 shadow-md shadow-rose-600/30" />
            ) : null}
          </Link>

          {/* Profile Trigger button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((current) => !current)}
              aria-expanded={isProfileOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-800 text-sm font-semibold text-white transition hover:scale-105"
            >
              {getInitials(user.name)}
            </button>

            {/* Profile Dropdown panel */}
            {isProfileOpen ? (
              <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 rounded-3xl border border-white/50 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 p-3 border border-slate-100 dark:border-slate-800">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
                  <p className="mt-2 inline-block text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-400">
                    {user.role}
                  </p>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to={getDashboardPathForRole(user.role)}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/30 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-brand-400 transition"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-rose-600 hover:bg-rose-700 px-3 py-2 text-xs font-semibold text-white transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pt-24 animate-fadeIn">
        {/* Dynamic Back-to-Dashboard breadcrumb navigation */}
        {isAuthenticated && user && !location.pathname.endsWith('/dashboard') && location.pathname !== '/' && (
          <div className="mb-8 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <Link
                to={getDashboardPathForRole(user.role)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-100 dark:hover:border-brand-900/40 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-sm active:scale-95 hover:shadow"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Dashboard</span>
              </Link>
              <span className="text-slate-300 dark:text-slate-800 font-light">/</span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {currentPage.title}
              </span>
            </div>
          </div>
        )}
        <Outlet />
      </main>

      {/* Floating Command Orb (Bottom Center) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          type="button"
          onClick={() => setIsHubOpen(true)}
          className="orb-pulse-effect relative flex items-center gap-3 px-6 py-3.5 rounded-full bg-gradient-to-tr from-brand-600 via-brand-700 to-indigo-600 text-white shadow-2xl shadow-brand-600/35 hover:shadow-brand-600/50 cursor-pointer select-none transition-all duration-300 hover:scale-105 active:scale-95 group"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
            {activeIcon()}
          </span>
          <span className="text-sm font-extrabold uppercase tracking-[0.2em]">Menu</span>
          <span className="hidden md:inline-flex text-[0.65rem] font-bold px-2 py-0.5 bg-black/25 rounded-md border border-white/10 select-none">
            Ctrl+K
          </span>
        </button>
      </div>

      {/* Bento-Hub Fullscreen Glassmorphic Overlay */}
      {isHubOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl transition-all duration-300">
          <div
            ref={hubRef}
            className="max-w-4xl w-full bg-white/80 dark:bg-slate-900/80 border border-white/30 dark:border-slate-800/40 rounded-[2.5rem] p-6 md:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Hub Header & Search Input */}
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <SearchIcon />
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleHubKeyDown}
                placeholder="Type a navigation shortcut or action..."
                className="field-control pl-12 pr-20 bg-white/60 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 w-full text-lg focus:ring-4 focus:ring-brand-500/20"
              />
              <button
                type="button"
                onClick={() => setIsHubOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Hub Content */}
            <div className="flex-1 overflow-y-auto pr-1">
              {searchQuery ? (
                /* Search Results View */
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 mb-3 px-1">
                    Matching Shortcuts ({filteredNavigation.length})
                  </p>
                  {filteredNavigation.length > 0 ? (
                    filteredNavigation.map((item, index) => {
                      const Icon = item.icon;
                      const isSelected = index === selectedIndex;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsHubOpen(false)}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            isSelected
                              ? 'bg-brand-600 text-white border-brand-500 shadow-lg shadow-brand-600/10'
                              : 'bg-white/40 dark:bg-slate-950/30 border-slate-100 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-950/70 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${isSelected ? 'bg-white/20' : 'bg-brand-50 dark:bg-slate-900 text-brand-600 dark:text-brand-400'}`}>
                              <Icon />
                            </span>
                            <div>
                              <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{item.label}</p>
                              <p className={`text-xs ${isSelected ? 'text-brand-100' : 'text-slate-400 dark:text-slate-500'}`}>{item.groupLabel}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] px-2 py-0.5 bg-black/25 rounded-md">
                              Enter to Go
                            </span>
                          )}
                        </Link>
                      );
                    })
                  ) : (
                    <div className="empty-state text-center py-10">
                      <p className="text-slate-500">No navigation shortcuts matched your query.</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Organized Bento Grid Menu View */
                <div className="grid gap-6 md:grid-cols-2">
                  {navigationGroups.map((group) => (
                    <div key={group.label} className="p-5 rounded-[2rem] bg-white/40 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40 backdrop-blur-md">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-700 dark:text-brand-400 border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                        {group.label}
                      </h3>
                      <div className="grid gap-2">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.to;
                          return (
                            <NavLink
                              key={item.to}
                              to={item.to}
                              onClick={() => setIsHubOpen(false)}
                              className={`group flex items-center gap-3.5 p-3 rounded-xl transition ${
                                isActive
                                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/10'
                                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-950/60 hover:text-slate-950 dark:hover:text-white'
                              }`}
                            >
                              <span className={`flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-105 ${
                                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 group-hover:text-brand-600'
                              }`}>
                                <Icon />
                              </span>
                              <span className="text-xs font-bold uppercase tracking-[0.1em]">{item.label}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hub Footer */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-5 mt-5 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 dark:bg-slate-800 text-sm font-bold text-white shadow-lg">
                  {getInitials(user.name)}
                </span>
                <div>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 tracking-wider">{user.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-2xl bg-rose-600 hover:bg-rose-700 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:scale-105 active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
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
    className: 'h-[1.1rem] w-[1.1rem]',
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
