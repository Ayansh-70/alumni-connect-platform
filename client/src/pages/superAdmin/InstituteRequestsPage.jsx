import { useEffect, useState } from 'react';
import {
  approveInstituteRequest,
  getInstituteRequestsRequest,
  rejectInstituteRequest
} from '../../api/institutes.js';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
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
        <LoadingState message="Loading institute requests..." className="mt-6" />
      ) : institutes.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No pending requests" description="No pending institute registration requests right now." />
        </div>
      ) : (
        <div className="space-y-4">
          {institutes.map((institute) => {
            const isSubmitting = submittingId === institute._id;

            return (
              <article key={institute._id} className="content-card p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-section font-semibold text-text-primary">{institute.name}</h2>
                      <p className="mt-1 text-caption text-text-secondary">
                        {institute.city}, {institute.state}, {institute.country}
                      </p>
                    </div>

                    <dl className="grid gap-3 text-body text-text-secondary sm:grid-cols-2">
                      <div>
                        <dt className="text-badge font-bold uppercase tracking-wider text-text-muted">Email</dt>
                        <dd className="font-medium text-text-primary">{institute.email}</dd>
                      </div>
                      <div>
                        <dt className="text-badge font-bold uppercase tracking-wider text-text-muted">Phone</dt>
                        <dd className="font-medium text-text-primary">{institute.phone}</dd>
                      </div>
                      <div>
                        <dt className="text-badge font-bold uppercase tracking-wider text-text-muted">Website</dt>
                        <dd className="font-medium text-text-primary">{institute.website || 'Not provided'}</dd>
                      </div>
                      <div>
                        <dt className="text-badge font-bold uppercase tracking-wider text-text-muted">Submitted</dt>
                        <dd className="font-medium text-text-primary">{new Date(institute.createdAt).toLocaleString()}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-badge font-bold uppercase tracking-wider text-text-muted">Address</dt>
                        <dd className="font-medium text-text-primary">{institute.address}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-badge font-bold uppercase tracking-wider text-text-muted">Description</dt>
                        <dd className="leading-6 font-medium text-text-primary">{institute.description}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="w-full max-w-sm rounded-lg border border-border bg-bg-secondary p-4">
                    <label htmlFor={`reject-${institute._id}`}>
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
                      disabled={isSubmitting}
                      className="field-control mt-2"
                      placeholder="Add a reason if you are rejecting this request"
                    />

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleApprove(institute._id)}
                        disabled={isSubmitting}
                        className="btn-success"
                      >
                        {isSubmitting ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(institute._id)}
                        disabled={isSubmitting}
                        className="btn-danger"
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
