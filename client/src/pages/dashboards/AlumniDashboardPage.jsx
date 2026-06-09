import DashboardActionGrid from '../../components/ui/DashboardActionGrid.jsx';
import DashboardMetricGrid from '../../components/ui/DashboardMetricGrid.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

function AlumniDashboardPage() {
  const actions = [
    {
      eyebrow: 'Overview',
      title: 'My Profile',
      description: 'Maintain your alumni profile and keep your institute verification status visible and current.',
      to: '/alumni/profile'
    },
    {
      eyebrow: 'Requests',
      title: 'Connection Requests',
      description: 'Review incoming student connection requests and decide who to connect with.',
      to: '/alumni/connection-requests'
    },
    {
      eyebrow: 'Requests',
      title: 'Guidance Requests',
      description: 'Respond to mentorship, referral, project, and career guidance requests from students.',
      to: '/alumni/guidance-requests'
    },
    {
      eyebrow: 'Sharing',
      title: 'My Opportunities',
      description: 'Track the status of opportunities you have shared and close listings when they are no longer active.',
      to: '/alumni/opportunities'
    },
    {
      eyebrow: 'Sharing',
      title: 'Post Opportunity',
      description: 'Publish new internships, jobs, scholarships, projects, and other openings for your institute.',
      to: '/alumni/opportunities/create'
    },
    {
      eyebrow: 'Campus',
      title: 'Announcements',
      description: 'Read institute updates that are relevant to alumni members.',
      to: '/alumni/announcements'
    },
    {
      eyebrow: 'Campus',
      title: 'Events',
      description: 'Stay informed about alumni talks, webinars, meetups, and networking sessions.',
      to: '/alumni/events'
    }
  ];
  const metrics = [
    { label: 'Profile', value: '01', caption: 'Verified' },
    { label: 'Requests', value: '02', caption: 'Queues' },
    { label: 'Sharing', value: '02', caption: 'Tools' },
    { label: 'Campus', value: '02', caption: 'Feeds' }
  ];

  return (
    <div>
      <PageHeader
        eyebrow="ALUMNI"
        title="Alumni dashboard"
        description="Manage your profile, respond to student outreach, and contribute opportunities and guidance from one polished hub."
      />
      <DashboardMetricGrid metrics={metrics} />
      <DashboardActionGrid actions={actions} />
    </div>
  );
}

export default AlumniDashboardPage;
