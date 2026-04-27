import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';

function AlumniDashboardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="ALUMNI"
        title="Alumni dashboard"
        description="Manage your alumni profile and track its verification status before mentorship and referral features are added."
      />

      <div className="flex flex-wrap gap-3">
        <Link
          to="/alumni/profile"
          className="inline-flex rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900"
        >
          My Profile
        </Link>
        <Link
          to="/alumni/connection-requests"
          className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Connection Requests
        </Link>
        <Link
          to="/alumni/guidance-requests"
          className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Guidance Requests
        </Link>
        <Link
          to="/alumni/opportunities"
          className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          My Opportunities
        </Link>
        <Link
          to="/alumni/opportunities/create"
          className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Post Opportunity
        </Link>
        <Link
          to="/alumni/announcements"
          className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Announcements
        </Link>
        <Link
          to="/alumni/events"
          className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Events
        </Link>
      </div>
    </div>
  );
}

export default AlumniDashboardPage;
