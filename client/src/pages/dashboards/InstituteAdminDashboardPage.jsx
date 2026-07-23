import { useState, useEffect } from 'react';
import DashboardActionGrid from '../../components/ui/DashboardActionGrid.jsx';
import DashboardMetricGrid from '../../components/ui/DashboardMetricGrid.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import { getInstituteAdminDashboardStatsRequest } from '../../api/instituteAdminDashboard.js';

function InstituteAdminDashboardPage() {
  const actions = [
    {
      eyebrow: 'People',
      title: 'Manage Students',
      description: 'View current student users and update their account status.',
      to: '/institute-admin/students'
    },
    {
      eyebrow: 'People',
      title: 'Manage Alumni',
      description: 'View current alumni users and update their account status.',
      to: '/institute-admin/alumni'
    },
    {
      eyebrow: 'People',
      title: 'Create Student',
      description: 'Create a new student account with a temporary password.',
      to: '/institute-admin/students/create'
    },
    {
      eyebrow: 'People',
      title: 'Create Alumni',
      description: 'Create a new alumni account with a temporary password.',
      to: '/institute-admin/alumni/create'
    },
    {
      eyebrow: 'Approvals',
      title: 'Alumni Verification',
      description: 'Review pending alumni profiles and verify or reject them for your institute.',
      to: '/institute-admin/alumni-verification'
    },
    {
      eyebrow: 'Approvals',
      title: 'Opportunity Approvals',
      description: 'Review pending opportunities posted by alumni and approve or reject them.',
      to: '/institute-admin/opportunities'
    },
    {
      eyebrow: 'Broadcasts',
      title: 'Announcements',
      description: 'Create and manage announcements for your institute audience.',
      to: '/institute-admin/announcements'
    },
    {
      eyebrow: 'Broadcasts',
      title: 'Events',
      description: 'Create and manage institute events for students and alumni.',
      to: '/institute-admin/events'
    }
  ];
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const refreshDashboardStats = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await getInstituteAdminDashboardStatsRequest();
      setStats(response.data);
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to load dashboard statistics.');
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshDashboardStats();
  }, []);

  const formatCount = (count) => {
    if (count === undefined || count === null) return '--';
    if (count === 0) return '00';
    return count.toString().padStart(2, '0');
  };

  const getMetrics = () => {
    if (errorMessage || !stats) {
      return [
        { label: 'People', value: '--', caption: 'Tools' },
        { label: 'Approvals', value: '--', caption: 'Queues' },
        { label: 'Broadcasts', value: '--', caption: 'Channels' },
        { label: 'Institute', value: '--', caption: 'Scoped' }
      ];
    }
    
    return [
      { 
        label: 'People', 
        value: formatCount(stats.people.students + stats.people.alumni), 
        caption: 'Tools' 
      },
      { 
        label: 'Approvals', 
        value: formatCount(stats.approvals.pendingAlumni + stats.approvals.pendingOpportunities), 
        caption: 'Queues' 
      },
      { 
        label: 'Broadcasts', 
        value: formatCount(stats.broadcasts.announcements + stats.broadcasts.events), 
        caption: 'Channels' 
      },
      { 
        label: 'Institute', 
        value: stats.institute.name, 
        caption: 'Scoped' 
      }
    ];
  };

  const metrics = getMetrics();

  return (
    <div>
      <PageHeader
        eyebrow="INSTITUTE_ADMIN"
        title="Institute admin dashboard"
        description="Oversee people, approvals, and institute-wide communication from one organized workspace."
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

export default InstituteAdminDashboardPage;
