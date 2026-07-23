import { useState, useEffect } from 'react';
import { getInstitutesRequest, getInstituteRequestsRequest } from '../../api/institutes.js';
import DashboardActionGrid from '../../components/ui/DashboardActionGrid.jsx';
import DashboardMetricGrid from '../../components/ui/DashboardMetricGrid.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';

function SuperAdminDashboardPage() {
  const actions = [
    {
      eyebrow: 'Approvals',
      title: 'Institute Requests',
      description: 'Review new institute onboarding submissions and approve or reject them with clear outcomes.',
      to: '/super-admin/institute-requests'
    }
  ];
  const [stats, setStats] = useState({ institutes: 0, requests: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const refreshDashboardStats = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [institutesRes, requestsRes] = await Promise.all([
        getInstitutesRequest(),
        getInstituteRequestsRequest()
      ]);
      setStats({
        institutes: institutesRes.data?.institutes?.length || 0,
        requests: requestsRes.data?.institutes?.length || 0
      });
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to load dashboard statistics.');
      setStats({ institutes: 0, requests: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshDashboardStats();
  }, []);

  const formatCount = (count) => {
    if (errorMessage) return '--';
    if (count === 0) return '00';
    return count.toString().padStart(2, '0');
  };

  const metrics = [
    { label: 'Live Institutes', value: formatCount(stats.institutes), caption: 'Approved' },
    { label: 'Pending Requests', value: formatCount(stats.requests), caption: 'Awaiting Action' },
    { label: 'Network', value: errorMessage ? '--' : 'Active', caption: 'Status' }
  ];

  return (
    <div>
      <PageHeader
        eyebrow="SUPER_ADMIN"
        title="Super admin dashboard"
        description="Review institute onboarding requests and manage platform approvals from one place."
      />
      {errorMessage && (
        <div className="mb-6">
          <div className="alert-error" role="alert" aria-live="polite">
            {errorMessage}
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="py-12">
          <LoadingState message="Loading dashboard statistics..." />
        </div>
      ) : (
        <DashboardMetricGrid metrics={metrics} />
      )}
      <DashboardActionGrid actions={actions} />
    </div>
  );
}

export default SuperAdminDashboardPage;
