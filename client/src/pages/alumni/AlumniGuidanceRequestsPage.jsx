import { useEffect, useState } from 'react';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import {
  acceptAlumniGuidanceRequest,
  completeAlumniGuidanceRequest,
  getAlumniGuidanceRequestsRequest,
  rejectAlumniGuidanceRequest
} from '../../api/alumniGuidanceRequests.js';

function AlumniGuidanceRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [responseMessages, setResponseMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeRequestId, setActiveRequestId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getAlumniGuidanceRequestsRequest();
        setRequests(response.data?.requests || []);
      } catch (error) {
        setErrorMessage(error.userMessage || 'Unable to load guidance requests.');
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

  const handleResponseChange = (requestId, value) => {
    setResponseMessages((current) => ({ ...current, [requestId]: value }));
  };

  const handleAction = async (requestId, action) => {
    setActiveRequestId(requestId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const responseMessage = responseMessages[requestId] || '';
      const response =
        action === 'accept'
          ? await acceptAlumniGuidanceRequest(requestId, responseMessage)
          : action === 'reject'
            ? await rejectAlumniGuidanceRequest(requestId, responseMessage)
            : await completeAlumniGuidanceRequest(requestId, responseMessage);

      const updatedRequest = response.data?.request;

      if (updatedRequest) {
        replaceRequest(updatedRequest);
      }

      setSuccessMessage(response.message || 'Guidance request updated successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to update guidance request.');
    } finally {
      setActiveRequestId('');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="ALUMNI"
        title="Guidance requests"
        description="Review student guidance and referral requests and manage their progress."
      />

      <section className="surface-card">
        {errorMessage ? (
          <p className="alert-error mb-4">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="alert-success mb-4">
            {successMessage}
          </p>
        ) : null}

        {isLoading ? (
          <LoadingState message="Loading guidance requests..." />
        ) : requests.length === 0 ? (
          <EmptyState title="No guidance requests yet" description="Student mentorship and referral requests will appear here." />
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
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Type</span> <span className="font-medium text-text-primary">{request.type}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Created</span> <span className="font-medium text-text-primary">{new Date(request.createdAt).toLocaleDateString()}</span></p>
                  <p className="col-span-full"><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Skills</span> <span className="font-medium text-text-primary">{request.studentProfile?.skills?.join(', ') || 'Not provided'}</span></p>
                  <p className="col-span-full"><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Career goals</span> <span className="font-medium text-text-primary">{request.studentProfile?.careerGoals || 'Not provided'}</span></p>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Title</span>
                  <p className="mt-2 text-body font-medium text-text-primary">{request.title}</p>
                </div>

                <div className="mt-4">
                  <span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Message</span>
                  <p className="mt-2 text-body font-medium text-text-primary">{request.message}</p>
                </div>

                <div className="mt-4">
                  <label htmlFor={`response-${request._id}`} className="text-badge font-bold uppercase tracking-wider text-text-muted block mb-2">Response message</label>
                  <textarea
                    id={`response-${request._id}`}
                    value={responseMessages[request._id] ?? request.responseMessage ?? ''}
                    onChange={(event) => handleResponseChange(request._id, event.target.value)}
                    rows="3"
                    className="field-control"
                    placeholder="Optional response message"
                  />
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

                {request.status === 'ACCEPTED' ? (
                  <div className="mt-6 pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={activeRequestId === request._id}
                      onClick={() => handleAction(request._id, 'complete')}
                      className="btn-info"
                    >
                      {activeRequestId === request._id ? 'Processing...' : 'Mark Completed'}
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

export default AlumniGuidanceRequestsPage;
