import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
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
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {errorMessage ? <p className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMessage}</p> : null}
        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">No events are available right now.</div>
        ) : (
          <div className="space-y-4">
            {events.map((eventItem) => (
              <article key={eventItem._id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-950">{eventItem.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">{eventItem.eventType}</span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">{eventItem.mode}</span>
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
