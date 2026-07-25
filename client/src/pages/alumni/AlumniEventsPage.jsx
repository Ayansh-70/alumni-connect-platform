import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import { getAlumniEventsRequest } from '../../api/alumniEvents.js';

function AlumniEventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getAlumniEventsRequest();
        setEvents(response.data?.events || []);
      } catch (error) {
        setErrorMessage(error.userMessage || 'Unable to load events.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <div>
      <PageHeader eyebrow="ALUMNI" title="Events" description="View active institute events meant for alumni." />
      <section className="surface-card p-6 md:p-8">
        {errorMessage ? <p className="alert-error mb-4">{errorMessage}</p> : null}
        {isLoading ? (
          <LoadingState message="Loading events..." />
        ) : events.length === 0 ? (
          <EmptyState
            title="No events available"
            description="Active institute events for alumni will appear here when they are published."
          />
        ) : (
          <div className="space-y-4">
            {events.map((eventItem) => (
              <article key={eventItem._id} className="content-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-950">{eventItem.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="status-badge border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-700">{eventItem.eventType}</span>
                    <span className="status-badge border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-700">{eventItem.mode}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{eventItem.description}</p>
                <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                  <p>Date: {new Date(eventItem.date).toLocaleDateString()}</p>
                  <p>Time: {eventItem.startTime} - {eventItem.endTime}</p>
                  <p>Location: {eventItem.location}</p>
                  <p>Meeting link: {eventItem.mode === 'OFFLINE' ? 'Not required' : eventItem.meetingLink || 'Not provided'}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AlumniEventsPage;
