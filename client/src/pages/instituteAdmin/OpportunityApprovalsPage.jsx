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
          <p className="text-body text-text-secondary">Only pending opportunities from your institute appear here.</p>
          <button
            type="button"
            onClick={loadOpportunities}
            className="btn-secondary"
          >
            Refresh list
          </button>
        </div>

        {errorMessage ? (
          <p className="alert-error mb-4" role="alert" aria-live="polite">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="alert-success mb-4" role="alert" aria-live="polite">
            {successMessage}
          </p>
        ) : null}

        {isLoading ? (
          <LoadingState message="Loading pending opportunities..." className="mt-6" />
        ) : opportunities.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No pending opportunities" description="Alumni opportunity submissions that need review will appear here." />
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <article key={opportunity._id} className="content-card p-6">
                <div className="grid gap-4 text-body text-text-secondary md:grid-cols-2">
                  <p className="text-section font-semibold text-text-primary col-span-full">{opportunity.title}</p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Posted by</span> <span className="font-medium text-text-primary">{opportunity.postedBy?.name}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Type</span> <span className="font-medium text-text-primary">{opportunity.type}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Company</span> <span className="font-medium text-text-primary">{opportunity.company}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Role</span> <span className="font-medium text-text-primary">{opportunity.role}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Location</span> <span className="font-medium text-text-primary">{opportunity.location}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Mode</span> <span className="font-medium text-text-primary">{opportunity.mode}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Deadline</span> <span className="font-medium text-text-primary">{new Date(opportunity.deadline).toLocaleDateString()}</span></p>
                  <p className="col-span-full"><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Skills</span> <span className="font-medium text-text-primary">{opportunity.skillsRequired?.join(', ') || 'Not provided'}</span></p>
                </div>

                <div className="mt-4">
                  <span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Description</span>
                  <p className="text-body font-medium text-text-primary">{opportunity.description}</p>
                </div>
                
                <div className="mt-4">
                  <span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Eligibility</span>
                  <p className="text-body font-medium text-text-primary">{opportunity.eligibility}</p>
                </div>

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
