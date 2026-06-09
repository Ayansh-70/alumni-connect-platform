import { useEffect, useState } from 'react';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import {
  cancelStudentGuidanceRequest,
  getStudentGuidanceRequestsRequest
} from '../../api/studentGuidanceRequests.js';

const formatDate = (value) => new Date(value).toLocaleDateString();

function StudentGuidanceRequestsPage() {
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
        const response = await getStudentGuidanceRequestsRequest();
        setRequests(response.data?.requests || []);
      } catch (error) {
        setErrorMessage(error.userMessage || 'Unable to load guidance requests.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  const handleCancel = async (requestId) => {
    setActiveRequestId(requestId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await cancelStudentGuidanceRequest(requestId);
      const updatedRequest = response.data?.request;

      if (updatedRequest) {
        setRequests((current) =>
          current.map((request) => (request._id === updatedRequest._id ? updatedRequest : request))
        );
      }

      setSuccessMessage(response.message || 'Guidance request cancelled successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to cancel guidance request.');
    } finally {
      setActiveRequestId('');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="STUDENT"
        title="My guidance requests"
        description="Track the guidance and referral requests you have sent to verified alumni."
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
          <EmptyState title="No guidance requests yet" description="Requests you send to verified alumni will appear here." />
        ) : (
          <div className="space-y-4">
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
                  <p>Type: {request.type}</p>
                  <p>Domain: {request.alumniProfile?.domain || 'Not provided'}</p>
                  <p>Can mentor: {request.alumniProfile?.canMentor ? 'Yes' : 'No'}</p>
                  <p>Can provide referral: {request.alumniProfile?.canProvideReferral ? 'Yes' : 'No'}</p>
                  <p>Created: {formatDate(request.createdAt)}</p>
                  <p>Response date: {request.respondedAt ? formatDate(request.respondedAt) : 'Pending response'}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Title</h3>
                  <p className="mt-2 text-sm text-slate-600">{request.title}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Message</h3>
                  <p className="mt-2 text-sm text-slate-600">{request.message}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Response</h3>
                  <p className="mt-2 text-sm text-slate-600">{request.responseMessage || 'No response yet.'}</p>
                </div>

                {request.status === 'PENDING' ? (
                  <button
                    type="button"
                    disabled={activeRequestId === request._id}
                    onClick={() => handleCancel(request._id)}
                    className="btn-secondary mt-4"
                  >
                    {activeRequestId === request._id ? 'Cancelling...' : 'Cancel'}
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

export default StudentGuidanceRequestsPage;
