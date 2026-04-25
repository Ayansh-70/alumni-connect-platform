import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';

function SuperAdminDashboardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="SUPER_ADMIN"
        title="Super admin dashboard"
        description="Review institute onboarding requests and manage platform approvals from one place."
      />

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Institute approvals</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Open the institute requests queue to approve pending registrations or reject requests with a reason.
        </p>
        <Link
          to="/super-admin/institute-requests"
          className="mt-4 inline-flex rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900"
        >
          View institute requests
        </Link>
      </div>
    </div>
  );
}

export default SuperAdminDashboardPage;
