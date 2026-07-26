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
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Type</span> <span className="font-medium text-text-primary">{request.type}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Domain</span> <span className="font-medium text-text-primary">{request.alumniProfile?.domain || 'Not provided'}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Can mentor</span> <span className="font-medium text-text-primary">{request.alumniProfile?.canMentor ? 'Yes' : 'No'}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Can provide referral</span> <span className="font-medium text-text-primary">{request.alumniProfile?.canProvideReferral ? 'Yes' : 'No'}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Created</span> <span className="font-medium text-text-primary">{formatDate(request.createdAt)}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Response date</span> <span className="font-medium text-text-primary">{request.respondedAt ? formatDate(request.respondedAt) : 'Pending response'}</span></p>
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
                  <span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Response</span>
                  <p className="mt-2 text-body font-medium text-text-primary">{request.responseMessage || 'No response yet.'}</p>
                </div>

                {request.status === 'PENDING' ? (
                  <div className="mt-6 pt-2 flex flex-wrap">
                    <button
                      type="button"
                      disabled={activeRequestId === request._id}
                      onClick={() => handleCancel(request._id)}
                      className="btn-secondary"
                    >
                      {activeRequestId === request._id ? 'Cancelling...' : 'Cancel request'}
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

export default StudentGuidanceRequestsPage;
