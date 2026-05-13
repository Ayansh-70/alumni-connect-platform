import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { getStudentConnectionsRequest } from '../../api/studentConnections.js';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';

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

      <section className="surface-card p-6 md:p-8">
        {errorMessage ? (
          <p className="alert-error">{errorMessage}</p>
        ) : null}

        {isLoading ? (
          <LoadingState message="Loading connection requests..." className="mt-4" />
        ) : requests.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No connection requests yet"
              description="Send a request from an alumni profile to start building your network."
            />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {requests.map((request) => (
              <article key={request._id} className="content-card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{request.alumni?.name}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {request.alumniProfile?.currentRole || 'Role not provided'} at{' '}
                      {request.alumniProfile?.currentCompany || 'Company not provided'}
                    </p>
                  </div>
                  <StatusBadge value={request.status} />
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
