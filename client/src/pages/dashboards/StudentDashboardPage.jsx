import DashboardActionGrid from '../../components/ui/DashboardActionGrid.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

function StudentDashboardPage() {
  const actions = [
    {
      eyebrow: 'Overview',
      title: 'My Profile',
      description: 'Keep your academic and personal profile up to date so the platform can match you with the right alumni.',
      to: '/student/profile'
    },
    {
      eyebrow: 'Network',
      title: 'Search Alumni',
      description: 'Discover verified alumni from your institute and explore profiles, roles, and skills.',
      to: '/student/alumni-search'
    },
    {
      eyebrow: 'Network',
      title: 'My Connections',
      description: 'Track the connection requests you have sent and see who has responded.',
      to: '/student/connections'
    },
    {
      eyebrow: 'Network',
      title: 'My Guidance Requests',
      description: 'Monitor mentorship, referral, and career guidance requests in one place.',
      to: '/student/guidance-requests'
    },
    {
      eyebrow: 'Campus',
      title: 'Opportunities',
      description: 'Browse approved internships, jobs, scholarships, and project openings for your institute.',
      to: '/student/opportunities'
    },
    {
      eyebrow: 'Campus',
      title: 'Announcements',
      description: 'Stay updated with active institute notices that are relevant to students.',
      to: '/student/announcements'
    },
    {
      eyebrow: 'Campus',
      title: 'Events',
      description: 'Check upcoming sessions, talks, and networking events open to students.',
      to: '/student/events'
    }
  ];

  return (
    <div>
      <PageHeader
        eyebrow="STUDENT"
        title="Student dashboard"
        description="Use this workspace to build your profile, explore alumni, and stay on top of opportunities and institute updates."
      />
      <DashboardActionGrid actions={actions} />
    </div>
  );
}

export default StudentDashboardPage;
