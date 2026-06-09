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
                  <p>Skills: {request.studentProfile?.skills?.join(', ') || 'Not provided'}</p>
                  <p>Career goals: {request.studentProfile?.careerGoals || 'Not provided'}</p>
                  <p>Type: {request.type}</p>
                  <p>Created: {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Title</h3>
                  <p className="mt-2 text-sm text-slate-600">{request.title}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Message</h3>
                  <p className="mt-2 text-sm text-slate-600">{request.message}</p>
                </div>

                <label className="mt-4 block text-sm font-medium text-slate-700">
                  Response message
                  <textarea
                    value={responseMessages[request._id] ?? request.responseMessage ?? ''}
                    onChange={(event) => handleResponseChange(request._id, event.target.value)}
                    rows="3"
                    className="field-control mt-2"
                    placeholder="Optional response message"
                  />
                </label>

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

                {request.status === 'ACCEPTED' ? (
                  <button
                    type="button"
                    disabled={activeRequestId === request._id}
                    onClick={() => handleAction(request._id, 'complete')}
                    className="btn-info mt-4"
                  >
                    {activeRequestId === request._id ? 'Processing...' : 'Mark Completed'}
                  </button>
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
