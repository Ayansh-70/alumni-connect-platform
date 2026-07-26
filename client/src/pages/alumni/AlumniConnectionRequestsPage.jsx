import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import {
  acceptAlumniConnectionRequest,
  getAlumniConnectionRequestsRequest,
  rejectAlumniConnectionRequest
} from '../../api/alumniConnections.js';

function AlumniConnectionRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRequestId, setActiveRequestId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getAlumniConnectionRequestsRequest();
        setRequests(response.data?.requests || []);
      } catch (error) {
        setErrorMessage(error.userMessage || 'Unable to load connection requests.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  const replaceRequest = (updatedRequest) => {
    setRequests((current) =>
      current.map((request) => (request._id === updatedRequest._id ? updatedRequest : request))
    );
  };

  const handleAction = async (requestId, action) => {
    setActiveRequestId(requestId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response =
        action === 'accept'
          ? await acceptAlumniConnectionRequest(requestId)
          : await rejectAlumniConnectionRequest(requestId);

      const updatedRequest = response.data?.request;

      if (updatedRequest) {
        replaceRequest(updatedRequest);
      }

      setSuccessMessage(response.message || 'Connection request updated successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to update connection request.');
    } finally {
      setActiveRequestId('');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="ALUMNI"
        title="Connection requests"
        description="Review student connection requests from your institute and accept or reject them."
      />

      <section className="surface-card p-6 md:p-8">
        {errorMessage ? (
          <p className="alert-error mb-4">{errorMessage}</p>
        ) : null}

        {successMessage ? (
          <p className="alert-success mb-4">{successMessage}</p>
        ) : null}

        {isLoading ? (
          <LoadingState message="Loading connection requests..." />
        ) : requests.length === 0 ? (
          <EmptyState
            title="No connection requests yet"
            description="Student outreach requests from your institute will appear here when they arrive."
          />
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <article key={request._id} className="content-card p-6 flex flex-col">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-section font-semibold text-text-primary">{request.student?.name}</h2>
                    <p className="mt-1 text-caption text-text-secondary">{request.student?.email}</p>
                  </div>
                  <StatusBadge value={request.status} />
                </div>

                <div className="grid gap-4 text-body text-text-secondary grow md:grid-cols-2">
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Branch</span> <span className="font-medium text-text-primary">{request.studentProfile?.branch || 'Not provided'}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Batch</span> <span className="font-medium text-text-primary">{request.studentProfile?.batch || 'Not provided'}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Semester</span> <span className="font-medium text-text-primary">{request.studentProfile?.semester || 'Not provided'}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Skills</span> <span className="font-medium text-text-primary">{request.studentProfile?.skills?.join(', ') || 'Not provided'}</span></p>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Message</span>
                  <p className="mt-2 text-body font-medium text-text-primary">{request.message || 'No message added.'}</p>
                </div>

                {request.status === 'PENDING' ? (
                  <div className="mt-6 pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={activeRequestId === request._id}
                      onClick={() => handleAction(request._id, 'accept')}
                      className="btn-success"
                    >
                      {activeRequestId === request._id ? 'Processing...' : 'Accept'}
                    </button>
                    <button
                      type="button"
                      disabled={activeRequestId === request._id}
                      onClick={() => handleAction(request._id, 'reject')}
                      className="btn-danger"
                    >
                      {activeRequestId === request._id ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AlumniConnectionRequestsPage;
