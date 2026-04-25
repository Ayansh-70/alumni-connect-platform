import { useEffect, useState } from 'react';
import {
  approveInstituteRequest,
  getInstituteRequestsRequest,
  rejectInstituteRequest
} from '../../api/institutes.js';
import PageHeader from '../../components/ui/PageHeader.jsx';

function InstituteRequestsPage() {
  const [institutes, setInstitutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [submittingId, setSubmittingId] = useState('');
  const [rejectionReasons, setRejectionReasons] = useState({});

  const loadRequests = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await getInstituteRequestsRequest();
      setInstitutes(response.data?.institutes || []);
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to load institute requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (instituteId) => {
    setSubmittingId(instituteId);
    setActionMessage('');
    setErrorMessage('');

    try {
      const response = await approveInstituteRequest(instituteId);
      setActionMessage(response.message || 'Institute approved successfully.');
      await loadRequests();
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to approve institute.');
    } finally {
      setSubmittingId('');
    }
  };

  const handleReject = async (instituteId) => {
    const rejectionReason = rejectionReasons[instituteId]?.trim();

    if (!rejectionReason) {
      setErrorMessage('Please provide a rejection reason before rejecting.');
      return;
    }

    setSubmittingId(instituteId);
    setActionMessage('');
    setErrorMessage('');

    try {
      const response = await rejectInstituteRequest(instituteId, rejectionReason);
      setActionMessage(response.message || 'Institute rejected successfully.');
      setRejectionReasons((current) => ({ ...current, [instituteId]: '' }));
      await loadRequests();
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to reject institute.');
    } finally {
      setSubmittingId('');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="SUPER_ADMIN"
        title="Institute registration requests"
        description="Review pending institute onboarding requests and approve or reject them."
      />

      {errorMessage ? (
        <p className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      {actionMessage ? (
        <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {actionMessage}
        </p>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Loading institute requests...
        </div>
      ) : institutes.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          No pending institute registration requests right now.
        </div>
      ) : (
        <div className="space-y-4">
          {institutes.map((institute) => {
            const isSubmitting = submittingId === institute._id;

            return (
              <article key={institute._id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">{institute.name}</h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {institute.city}, {institute.state}, {institute.country}
                      </p>
                    </div>

                    <dl className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                      <div>
                        <dt className="font-medium text-slate-800">Email</dt>
                        <dd>{institute.email}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-800">Phone</dt>
                        <dd>{institute.phone}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-800">Website</dt>
                        <dd>{institute.website || 'Not provided'}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-800">Submitted</dt>
                        <dd>{new Date(institute.createdAt).toLocaleString()}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="font-medium text-slate-800">Address</dt>
                        <dd>{institute.address}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="font-medium text-slate-800">Description</dt>
                        <dd className="leading-6">{institute.description}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <label className="block text-sm font-medium text-slate-700" htmlFor={`reject-${institute._id}`}>
                      Rejection reason
                    </label>
                    <textarea
                      id={`reject-${institute._id}`}
                      rows="4"
                      value={rejectionReasons[institute._id] || ''}
                      onChange={(event) =>
                        setRejectionReasons((current) => ({
                          ...current,
                          [institute._id]: event.target.value
                        }))
                      }
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                      placeholder="Add a reason if you are rejecting this request"
                    />

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleApprove(institute._id)}
                        disabled={isSubmitting}
                        className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSubmitting ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(institute._id)}
                        disabled={isSubmitting}
                        className="rounded-md bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSubmitting ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default InstituteRequestsPage;
