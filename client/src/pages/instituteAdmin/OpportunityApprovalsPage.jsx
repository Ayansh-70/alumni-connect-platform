import { useEffect, useState } from 'react';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
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

      <section className="surface-card">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Only pending opportunities from your institute appear here.</p>
          <button
            type="button"
            onClick={loadOpportunities}
            className="btn-secondary"
          >
            Refresh list
          </button>
        </div>

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
          <LoadingState message="Loading pending opportunities..." />
        ) : opportunities.length === 0 ? (
          <EmptyState title="No pending opportunities" description="Alumni opportunity submissions that need review will appear here." />
        ) : (
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <article key={opportunity._id} className="content-card">
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
                  disabled={activeOpportunityId === opportunity._id}
                  rows="3"
                  className="field-control mt-4"
                  placeholder="Enter a rejection reason if needed."
                />

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={activeOpportunityId === opportunity._id}
                    onClick={() => handleApprove(opportunity._id)}
                    className="btn-success"
                  >
                    {activeOpportunityId === opportunity._id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    type="button"
                    disabled={activeOpportunityId === opportunity._id}
                    onClick={() => handleReject(opportunity._id)}
                    className="btn-danger"
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
