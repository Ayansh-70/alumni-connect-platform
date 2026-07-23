import { useState, useEffect } from 'react';
import DashboardActionGrid from '../../components/ui/DashboardActionGrid.jsx';
import DashboardMetricGrid from '../../components/ui/DashboardMetricGrid.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import { getAlumniProfileRequest } from '../../api/alumniProfiles.js';
import { getAlumniConnectionRequestsRequest } from '../../api/alumniConnections.js';
import { getAlumniGuidanceRequestsRequest } from '../../api/alumniGuidanceRequests.js';
import { getAlumniOpportunitiesRequest } from '../../api/alumniOpportunities.js';
import { getAlumniAnnouncementsRequest } from '../../api/alumniAnnouncements.js';
import { getAlumniEventsRequest } from '../../api/alumniEvents.js';

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
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const refreshDashboardStats = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [profileRes, connectionsRes, guidanceRes, oppsRes, announcementsRes, eventsRes] = await Promise.all([
        getAlumniProfileRequest(),
        getAlumniConnectionRequestsRequest(),
        getAlumniGuidanceRequestsRequest(),
        getAlumniOpportunitiesRequest(),
        getAlumniAnnouncementsRequest(),
        getAlumniEventsRequest()
      ]);

      const profile = profileRes.data?.profile;
      const connections = connectionsRes.data?.requests || [];
      const guidance = guidanceRes.data?.requests || [];
      const opps = oppsRes.data?.opportunities || [];
      const announcements = announcementsRes.data?.announcements || [];
      const events = eventsRes.data?.events || [];

      setStats({
        verificationStatus: profile?.verificationStatus || 'PENDING',
        pendingRequests: connections.filter(c => c.status === 'PENDING').length + guidance.filter(g => g.status === 'PENDING').length,
        opportunities: opps.length,
        campusUpdates: announcements.length + events.length
      });
    } catch (error) {
      if (error.response?.status !== 404) {
        setErrorMessage(error.userMessage || 'Unable to load dashboard statistics.');
      }
      setStats({ verificationStatus: 'PENDING', pendingRequests: 0, opportunities: 0, campusUpdates: 0 });
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
      { label: 'Profile', value: stats.verificationStatus, caption: 'Status' },
      { label: 'Pending Requests', value: formatCount(stats.pendingRequests), caption: 'Connections & Guidance' },
      { label: 'My Opportunities', value: formatCount(stats.opportunities), caption: 'Posted' },
      { label: 'Campus Updates', value: formatCount(stats.campusUpdates), caption: 'Announcements & Events' }
    ];
  };

  const metrics = getMetrics();

  return (
    <div>
      <PageHeader
        eyebrow="ALUMNI"
        title="Alumni dashboard"
        description="Manage your profile, respond to student outreach, and contribute opportunities and guidance from one polished hub."
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

export default AlumniDashboardPage;
