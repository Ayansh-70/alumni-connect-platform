import DashboardActionGrid from '../../components/ui/DashboardActionGrid.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

function SuperAdminDashboardPage() {
  const actions = [
    {
      eyebrow: 'Approvals',
      title: 'Institute Requests',
      description: 'Review new institute onboarding submissions and approve or reject them with clear outcomes.',
      to: '/super-admin/institute-requests'
    }
  ];

  return (
    <div>
      <PageHeader
        eyebrow="SUPER_ADMIN"
        title="Super admin dashboard"
        description="Review institute onboarding requests and manage platform approvals from one place."
      />
      <DashboardActionGrid actions={actions} />
    </div>
  );
}

export default SuperAdminDashboardPage;
