import DashboardActionGrid from '../../components/ui/DashboardActionGrid.jsx';
import DashboardMetricGrid from '../../components/ui/DashboardMetricGrid.jsx';
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
  const metrics = [
    { label: 'Scope', value: '01', caption: 'Platform' },
    { label: 'Priority', value: 'Live', caption: 'Approvals' },
    { label: 'Access', value: 'RBAC', caption: 'Secure' }
  ];

  return (
    <div>
      <PageHeader
        eyebrow="SUPER_ADMIN"
        title="Super admin dashboard"
        description="Review institute onboarding requests and manage platform approvals from one place."
      />
      <DashboardMetricGrid metrics={metrics} />
      <DashboardActionGrid actions={actions} />
    </div>
  );
}

export default SuperAdminDashboardPage;
