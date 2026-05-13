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
              <article key={request._id} className="content-card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{request.student?.name}</h2>
                    <p className="mt-1 text-sm text-slate-600">{request.student?.email}</p>
                  </div>
                  <StatusBadge value={request.status} />
                </div>

                <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                  <p>Branch: {request.studentProfile?.branch || 'Not provided'}</p>
                  <p>Batch: {request.studentProfile?.batch || 'Not provided'}</p>
                  <p>Semester: {request.studentProfile?.semester || 'Not provided'}</p>
                  <p>Skills: {request.studentProfile?.skills?.join(', ') || 'Not provided'}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Message</h3>
                  <p className="mt-2 text-sm text-slate-600">{request.message || 'No message added.'}</p>
                </div>

                {request.status === 'PENDING' ? (
                  <div className="mt-4 flex flex-wrap gap-3">
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
