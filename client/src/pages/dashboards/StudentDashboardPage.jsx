import { useState, useEffect } from 'react';
import DashboardActionGrid from '../../components/ui/DashboardActionGrid.jsx';
import DashboardMetricGrid from '../../components/ui/DashboardMetricGrid.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import { getStudentProfileRequest } from '../../api/studentProfiles.js';
import { searchStudentAlumniRequest } from '../../api/studentAlumni.js';
import { getStudentConnectionsRequest } from '../../api/studentConnections.js';
import { getStudentGuidanceRequestsRequest } from '../../api/studentGuidanceRequests.js';
import { getStudentOpportunitiesRequest } from '../../api/studentOpportunities.js';
import { getStudentAnnouncementsRequest } from '../../api/studentAnnouncements.js';
import { getStudentEventsRequest } from '../../api/studentEvents.js';

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
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const refreshDashboardStats = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [profileRes, alumniRes, connectionsRes, guidanceRes, oppsRes, announcementsRes, eventsRes] = await Promise.all([
        getStudentProfileRequest(),
        searchStudentAlumniRequest(),
        getStudentConnectionsRequest(),
        getStudentGuidanceRequestsRequest(),
        getStudentOpportunitiesRequest(),
        getStudentAnnouncementsRequest(),
        getStudentEventsRequest()
      ]);

      const profile = profileRes.data?.profile;
      const alumni = alumniRes.data?.alumni || [];
      const connections = connectionsRes.data?.requests || [];
      const guidance = guidanceRes.data?.requests || [];
      const opps = oppsRes.data?.opportunities || [];
      const announcements = announcementsRes.data?.announcements || [];
      const events = eventsRes.data?.events || [];

      setStats({
        profileActive: !!profile,
        networkActions: connections.length + guidance.length,
        campusUpdates: announcements.length + events.length + opps.length,
        verifiedAlumni: alumni.length
      });
    } catch (error) {
      if (error.response?.status !== 404) {
        setErrorMessage(error.userMessage || 'Unable to load dashboard statistics.');
      }
      setStats({ profileActive: false, networkActions: 0, campusUpdates: 0, verifiedAlumni: 0 });
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

  const getMetrics = () => {
    if (!stats) return [];
    return [
      { label: 'Profile', value: stats.profileActive ? 'Active' : 'Missing', caption: 'Status' },
      { label: 'Network', value: formatCount(stats.networkActions), caption: 'Actions' },
      { label: 'Campus', value: formatCount(stats.campusUpdates), caption: 'Updates' },
      { label: 'Visibility', value: formatCount(stats.verifiedAlumni), caption: 'Verified Alumni' }
    ];
  };

  const metrics = getMetrics();

  return (
    <div>
      <PageHeader
        eyebrow="STUDENT"
        title="Student dashboard"
        description="Use this workspace to build your profile, explore alumni, and stay on top of opportunities and institute updates."
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

export default StudentDashboardPage;
