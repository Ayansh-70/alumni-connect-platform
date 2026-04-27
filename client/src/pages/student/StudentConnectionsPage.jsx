import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { getStudentConnectionsRequest } from '../../api/studentConnections.js';

const STATUS_STYLES = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  ACCEPTED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  REJECTED: 'border-rose-200 bg-rose-50 text-rose-700'
};

const formatDate = (value) => new Date(value).toLocaleDateString();

function StudentConnectionsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getStudentConnectionsRequest();
        setRequests(response.data?.requests || []);
      } catch (error) {
        setErrorMessage(error.userMessage || 'Unable to load your connection requests.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="STUDENT"
        title="My connections"
        description="Track the connection requests you have sent to verified alumni in your institute."
      />

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {errorMessage ? (
          <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Loading connection requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            You have not sent any connection requests yet.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <article key={request._id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{request.alumni?.name}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {request.alumniProfile?.currentRole || 'Role not provided'} at{' '}
                      {request.alumniProfile?.currentCompany || 'Company not provided'}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      STATUS_STYLES[request.status] || STATUS_STYLES.PENDING
                    }`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                  <p>Email: {request.alumni?.email}</p>
                  <p>Branch: {request.alumniProfile?.branch || 'Not provided'}</p>
                  <p>Batch: {request.alumniProfile?.batch || 'Not provided'}</p>
                  <p>Domain: {request.alumniProfile?.domain || 'Not provided'}</p>
                  <p>Sent on: {formatDate(request.createdAt)}</p>
                  <p>Response date: {request.respondedAt ? formatDate(request.respondedAt) : 'Pending response'}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Message</h3>
                  <p className="mt-2 text-sm text-slate-600">{request.message || 'No message added.'}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentConnectionsPage;
