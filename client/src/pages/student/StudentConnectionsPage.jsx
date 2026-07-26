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
              <article key={request._id} className="content-card p-6 flex flex-col">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-section font-semibold text-text-primary">{request.alumni?.name}</h2>
                    <p className="mt-1 text-caption text-text-secondary">
                      {request.alumniProfile?.currentRole || 'Role not provided'} at{' '}
                      {request.alumniProfile?.currentCompany || 'Company not provided'}
                    </p>
                  </div>
                  <StatusBadge value={request.status} />
                </div>

                <div className="grid gap-4 text-body text-text-secondary grow md:grid-cols-2">
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Email</span> <span className="font-medium text-text-primary">{request.alumni?.email}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Branch</span> <span className="font-medium text-text-primary">{request.alumniProfile?.branch || 'Not provided'}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Batch</span> <span className="font-medium text-text-primary">{request.alumniProfile?.batch || 'Not provided'}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Domain</span> <span className="font-medium text-text-primary">{request.alumniProfile?.domain || 'Not provided'}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Sent on</span> <span className="font-medium text-text-primary">{formatDate(request.createdAt)}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Response date</span> <span className="font-medium text-text-primary">{request.respondedAt ? formatDate(request.respondedAt) : 'Pending response'}</span></p>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Message</span>
                  <p className="mt-2 text-body font-medium text-text-primary">{request.message || 'No message added.'}</p>
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
