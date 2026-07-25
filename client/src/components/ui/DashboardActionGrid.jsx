import { Link } from 'react-router-dom';

function DashboardActionGrid({ actions }) {
  // Helper to resolve card designs based on category/eyebrow
  const getCardStyle = (eyebrow, title, index) => {
    const key = (eyebrow || '').toLowerCase();
    
    // Default variations
    let spanClass = 'col-span-1';
    let gradientBorder = 'from-brand-600 to-indigo-500';
    let bgGlow = 'bg-brand-600/10 dark:bg-brand-600/5';
    let textGlow = 'text-brand-700 dark:text-brand-400';
    let iconBg = 'bg-brand-50 dark:bg-brand-950/50 border-brand-100 dark:border-brand-900/30';
    let iconSvg = <DefaultIcon />;

    // Dynamically expand high priority items
    if (index === 0 || title.includes('Search') || title.includes('Verification')) {
      spanClass = 'md:col-span-2';
    }

    if (key.includes('people') || title.includes('Manage')) {
      gradientBorder = 'from-sky-500 via-blue-500 to-indigo-500';
      bgGlow = 'bg-sky-500/10 dark:bg-sky-500/5';
      textGlow = 'text-sky-600 dark:text-sky-400';
      iconBg = 'bg-sky-50 dark:bg-sky-950/50 border-sky-100 dark:border-sky-900/30';
      iconSvg = <PeopleIcon />;
    } else if (key.includes('network') || title.includes('Connections') || title.includes('Search')) {
      gradientBorder = 'from-violet-500 to-fuchsia-500';
      bgGlow = 'bg-violet-500/10 dark:bg-violet-500/5';
      textGlow = 'text-violet-600 dark:text-violet-400';
      iconBg = 'bg-violet-50 dark:bg-violet-950/50 border-violet-100 dark:border-violet-900/30';
      iconSvg = <NetworkIcon />;
    } else if (key.includes('sharing') || title.includes('Opportunity') || title.includes('Opportunities')) {
      gradientBorder = 'from-emerald-500 to-teal-500';
      bgGlow = 'bg-emerald-500/10 dark:bg-emerald-500/5';
      textGlow = 'text-emerald-600 dark:text-emerald-400';
      iconBg = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-100 dark:border-emerald-900/30';
      iconSvg = <BriefcaseIcon />;
    } else if (key.includes('broadcast') || key.includes('campus') || title.includes('Announcements') || title.includes('Events')) {
      gradientBorder = 'from-amber-500 to-rose-500';
      bgGlow = 'bg-amber-500/10 dark:bg-amber-500/5';
      textGlow = 'text-amber-600 dark:text-amber-400';
      iconBg = 'bg-amber-50 dark:bg-amber-950/50 border-amber-100 dark:border-amber-900/30';
      iconSvg = <CalendarIcon />;
    } else if (key.includes('approval') || title.includes('Requests')) {
      gradientBorder = 'from-rose-500 to-pink-500';
      bgGlow = 'bg-rose-500/10 dark:bg-rose-500/5';
      textGlow = 'text-rose-600 dark:text-rose-400';
      iconBg = 'bg-rose-50 dark:bg-rose-950/50 border-rose-100 dark:border-rose-900/30';
      iconSvg = <ShieldIcon />;
    } else if (key.includes('overview') || title.includes('Profile')) {
      gradientBorder = 'from-brand-600 via-indigo-500 to-purple-500';
      bgGlow = 'bg-brand-600/10 dark:bg-brand-600/5';
      textGlow = 'text-brand-600 dark:text-brand-400';
      iconBg = 'bg-brand-50 dark:bg-brand-950/50 border-brand-100 dark:border-brand-900/30';
      iconSvg = <UserIcon />;
    }

    return { spanClass, gradientBorder, bgGlow, textGlow, iconBg, iconSvg };
  };

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {actions.map((action, index) => {
        const { spanClass, gradientBorder, bgGlow, textGlow, iconBg, iconSvg } = getCardStyle(
          action.eyebrow,
          action.title,
          index
        );

        return (
          <Link
            key={action.to}
            to={action.to}
            className={`group relative overflow-hidden rounded-[2rem] border border-white/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/70 dark:border-slate-800 dark:bg-slate-900/70 p-6 md:p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-500/10 dark:hover:shadow-brand-900/20 ${spanClass}`}
          >
            {/* Glowing Accent Top border */}
            <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${gradientBorder}`} />

            {/* Glowing Hover Background Blob */}
            <div className={`absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${bgGlow}`} />

            <div className="relative flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                    {action.eyebrow || 'Workspace'}
                  </span>
                  
                  {/* Category Styled Icon */}
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-110 ${iconBg} ${textGlow}`}>
                    {iconSvg}
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
                  {action.title}
                </h2>
                
                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                  {action.description}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className={`inline-flex items-center text-xs font-black uppercase tracking-[0.2em] ${textGlow}`}>
                  Launch
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true">
                    →
                  </span>
                </span>
                
                <span className="text-[0.65rem] font-bold text-slate-400/60 dark:text-slate-500/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-wider uppercase">
                  Explore Tools
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}

function iconProps() {
  return {
    className: 'h-5 w-5',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2.2',
    viewBox: '0 0 24 24'
  };
}

function DefaultIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.5 10.5l7 3.5M8.5 13.5l7-3.5" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default DashboardActionGrid;
