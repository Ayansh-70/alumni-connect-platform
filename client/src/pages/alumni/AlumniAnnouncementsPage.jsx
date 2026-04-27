import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
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
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {errorMessage ? <p className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMessage}</p> : null}
        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">No announcements are available right now.</div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <article key={announcement._id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-950">{announcement.title}</h2>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">{announcement.category}</span>
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
