import DashboardActionGrid from '../../components/ui/DashboardActionGrid.jsx';
import DashboardMetricGrid from '../../components/ui/DashboardMetricGrid.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

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
  const metrics = [
    { label: 'People', value: '04', caption: 'Tools' },
    { label: 'Approvals', value: '02', caption: 'Queues' },
    { label: 'Broadcasts', value: '02', caption: 'Channels' },
    { label: 'Institute', value: 'One', caption: 'Scoped' }
  ];

  return (
    <div>
      <PageHeader
        eyebrow="INSTITUTE_ADMIN"
        title="Institute admin dashboard"
        description="Oversee people, approvals, and institute-wide communication from one organized workspace."
      />
      <DashboardMetricGrid metrics={metrics} />
      <DashboardActionGrid actions={actions} />
    </div>
  );
}

export default InstituteAdminDashboardPage;
