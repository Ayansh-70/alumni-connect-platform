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

      <Link
        to="/alumni/profile"
        className="inline-flex rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900"
      >
        My Profile
      </Link>
    </div>
  );
}

export default AlumniDashboardPage;
