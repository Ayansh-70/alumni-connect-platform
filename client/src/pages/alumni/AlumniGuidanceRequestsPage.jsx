import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import {
  acceptAlumniGuidanceRequest,
  completeAlumniGuidanceRequest,
  getAlumniGuidanceRequestsRequest,
  rejectAlumniGuidanceRequest
} from '../../api/alumniGuidanceRequests.js';

const STATUS_STYLES = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  ACCEPTED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  REJECTED: 'border-rose-200 bg-rose-50 text-rose-700',
  COMPLETED: 'border-sky-200 bg-sky-50 text-sky-700',
  CANCELLED: 'border-slate-200 bg-slate-100 text-slate-700'
};

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
            No guidance requests are available yet.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <article key={request._id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{request.student?.name}</h2>
                    <p className="mt-1 text-sm text-slate-600">{request.student?.email}</p>
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
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                    placeholder="Optional response message"
                  />
                </label>

                {request.status === 'PENDING' ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={activeRequestId === request._id}
                      onClick={() => handleAction(request._id, 'accept')}
                      className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {activeRequestId === request._id ? 'Processing...' : 'Accept'}
                    </button>
                    <button
                      type="button"
                      disabled={activeRequestId === request._id}
                      onClick={() => handleAction(request._id, 'reject')}
                      className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
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
                    className="mt-4 rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
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
