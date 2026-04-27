import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import {
  cancelStudentGuidanceRequest,
  getStudentGuidanceRequestsRequest
} from '../../api/studentGuidanceRequests.js';

const STATUS_STYLES = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  ACCEPTED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  REJECTED: 'border-rose-200 bg-rose-50 text-rose-700',
  COMPLETED: 'border-sky-200 bg-sky-50 text-sky-700',
  CANCELLED: 'border-slate-200 bg-slate-100 text-slate-700'
};

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

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {errorMessage ? (
          <p className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMessage}
          </p>
        ) : null}

        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Loading guidance requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            You have not sent any guidance requests yet.
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
                    className="mt-4 rounded-md bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
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
