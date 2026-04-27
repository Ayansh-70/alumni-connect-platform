import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';

function StudentDashboardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="STUDENT"
        title="Student dashboard"
        description="Manage your student profile now. Alumni discovery and networking workflows will build on this profile later."
      />

      <Link
        to="/student/profile"
        className="inline-flex rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900"
      >
        My Profile
      </Link>
    </div>
  );
}

export default StudentDashboardPage;
