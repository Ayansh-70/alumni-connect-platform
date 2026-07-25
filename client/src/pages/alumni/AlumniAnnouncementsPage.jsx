import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import { getAlumniAnnouncementsRequest } from '../../api/alumniAnnouncements.js';

function AlumniAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadAnnouncements = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getAlumniAnnouncementsRequest();
        setAnnouncements(response.data?.announcements || []);
      } catch (error) {
        setErrorMessage(error.userMessage || 'Unable to load announcements.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  return (
    <div>
      <PageHeader eyebrow="ALUMNI" title="Announcements" description="View active institute announcements meant for alumni." />
      <section className="surface-card p-6 md:p-8">
        {errorMessage ? <p className="alert-error mb-4">{errorMessage}</p> : null}
        {isLoading ? (
          <LoadingState message="Loading announcements..." />
        ) : announcements.length === 0 ? (
          <EmptyState
            title="No announcements available"
            description="Institute announcements for alumni will appear here when they are active."
          />
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <article key={announcement._id} className="content-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-950">{announcement.title}</h2>
                  <span className="status-badge border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-700">{announcement.category}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{announcement.message}</p>
                <p className="mt-3 text-xs text-slate-500">Posted on {new Date(announcement.createdAt).toLocaleDateString()}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AlumniAnnouncementsPage;
