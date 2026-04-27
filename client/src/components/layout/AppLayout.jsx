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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const navigationGroups = user ? NAVIGATION_BY_ROLE[user.role] || [] : [];
  const flatNavigation = useMemo(
    () => navigationGroups.flatMap((group) => group.items.map((item) => ({ ...item, groupLabel: group.label }))),
    [navigationGroups]
  );

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

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_45%,#f8fafc_100%)]">
        <header className="border-b border-white/60 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-700 text-sm font-bold text-white shadow-lg shadow-brand-700/20">
                AC
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">AlumniConnect</p>
                <p className="text-sm text-slate-500">Institute Network</p>
              </div>
            </Link>

            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <Link to="/" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-slate-900">
                Home
              </Link>
              <Link to="/institutes/register" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-slate-900">
                Register Institute
              </Link>
              <Link
                to="/login"
                className="rounded-full bg-brand-700 px-4 py-2 text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-900"
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

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f9ff_0%,#f8fafc_38%,#eef2ff_100%)]">
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-80 max-w-[88vw] flex-col border-r border-white/60 bg-white/90 px-5 pb-5 pt-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition-transform duration-300 lg:static lg:z-auto lg:w-72 lg:translate-x-0 lg:shadow-none ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Link to={getDashboardPathForRole(user.role)} className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-base font-bold text-white shadow-lg shadow-brand-700/20">
              AC
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">AlumniConnect</p>
              <p className="text-sm text-slate-500">Institute Network</p>
            </div>
          </Link>

          <div className="mt-8 overflow-y-auto pr-1">
            {navigationGroups.map((group) => (
              <div key={group.label} className="mb-6">
                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {group.label}
                </p>
                <div className="space-y-1.5">
                  {group.items.map((item) => (
                    <SidebarNavLink key={item.to} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50/90 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                {getInitials(user.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="truncate text-xs uppercase tracking-[0.16em] text-slate-500">{user.role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 lg:hidden"
                >
                  <MenuIcon />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-brand-700 text-sm font-bold text-white shadow-lg shadow-brand-700/20 sm:flex">
                      AC
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-semibold text-slate-950">{currentPage.title}</p>
                      <p className="hidden truncate text-sm text-slate-500 sm:block">{currentPage.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/notifications"
                  aria-label="Notifications"
                  className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
                >
                  <BellIcon />
                  {unreadNotificationCount > 0 ? (
                    <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-[1.25rem] min-w-[1.25rem] items-center justify-center rounded-full bg-brand-700 px-1.5 text-[0.7rem] font-semibold text-white shadow-lg shadow-brand-700/25">
                      {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                    </span>
                  ) : null}
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((current) => !current)}
                    className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                      {getInitials(user.name)}
                    </span>
                    <span className="hidden text-left sm:block">
                      <span className="block text-sm font-semibold text-slate-900">{user.name}</span>
                      <span className="block text-xs uppercase tracking-[0.16em] text-slate-500">{user.role}</span>
                    </span>
                    <ChevronDownIcon />
                  </button>

                  {isProfileOpen ? (
                    <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-64 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="mt-1 truncate text-sm text-slate-500">{user.email}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-brand-700">{user.role}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function SidebarNavLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
          isActive
            ? 'bg-brand-700 text-white shadow-lg shadow-brand-700/20'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
        }`
      }
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-inset ring-current/10">
        <Icon />
      </span>
      <span>{item.label}</span>
    </NavLink>
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
    strokeWidth: '1.8',
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

function MenuIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default AppLayout;
