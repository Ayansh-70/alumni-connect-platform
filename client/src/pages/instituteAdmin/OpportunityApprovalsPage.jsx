import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import {
  approveInstituteOpportunityRequest,
  getPendingInstituteOpportunitiesRequest,
  rejectInstituteOpportunityRequest
} from '../../api/instituteAdminOpportunities.js';

function OpportunityApprovalsPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeOpportunityId, setActiveOpportunityId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadOpportunities = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await getPendingInstituteOpportunitiesRequest();
      setOpportunities(response.data?.opportunities || []);
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to load pending opportunities.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  const handleReasonChange = (opportunityId, value) => {
    setRejectionReasons((current) => ({ ...current, [opportunityId]: value }));
  };

  const handleApprove = async (opportunityId) => {
    setActiveOpportunityId(opportunityId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await approveInstituteOpportunityRequest(opportunityId);
      setOpportunities((current) => current.filter((opportunity) => opportunity._id !== opportunityId));
      setSuccessMessage(response.message || 'Opportunity approved successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to approve opportunity.');
    } finally {
      setActiveOpportunityId('');
    }
  };

  const handleReject = async (opportunityId) => {
    setActiveOpportunityId(opportunityId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await rejectInstituteOpportunityRequest(opportunityId, rejectionReasons[opportunityId] || '');
      setOpportunities((current) => current.filter((opportunity) => opportunity._id !== opportunityId));
      setSuccessMessage(response.message || 'Opportunity rejected successfully.');
      setRejectionReasons((current) => ({ ...current, [opportunityId]: '' }));
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to reject opportunity.');
    } finally {
      setActiveOpportunityId('');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="INSTITUTE_ADMIN"
        title="Opportunity approvals"
        description="Review pending opportunities from alumni in your institute and approve or reject them."
      />

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Only pending opportunities from your institute appear here.</p>
          <button
            type="button"
            onClick={loadOpportunities}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Refresh list
          </button>
        </div>

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
            Loading pending opportunities...
          </div>
        ) : opportunities.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No pending opportunities are available right now.
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <article key={opportunity._id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                  <p className="text-base font-semibold text-slate-950">{opportunity.title}</p>
                  <p>Posted by: {opportunity.postedBy?.name}</p>
                  <p>Type: {opportunity.type}</p>
                  <p>Company: {opportunity.company}</p>
                  <p>Role: {opportunity.role}</p>
                  <p>Location: {opportunity.location}</p>
                  <p>Mode: {opportunity.mode}</p>
                  <p>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</p>
                  <p>Skills: {opportunity.skillsRequired?.join(', ') || 'Not provided'}</p>
                </div>

                <p className="mt-3 text-sm text-slate-600">{opportunity.description}</p>
                <p className="mt-3 text-sm text-slate-600">Eligibility: {opportunity.eligibility}</p>

                <textarea
                  value={rejectionReasons[opportunity._id] || ''}
                  onChange={(event) => handleReasonChange(opportunity._id, event.target.value)}
                  rows="3"
                  className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  placeholder="Enter a rejection reason if needed."
                />

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={activeOpportunityId === opportunity._id}
                    onClick={() => handleApprove(opportunity._id)}
                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {activeOpportunityId === opportunity._id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    type="button"
                    disabled={activeOpportunityId === opportunity._id}
                    onClick={() => handleReject(opportunity._id)}
                    className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {activeOpportunityId === opportunity._id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default OpportunityApprovalsPage;
