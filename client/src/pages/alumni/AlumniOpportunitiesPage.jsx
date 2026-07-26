import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { closeAlumniOpportunityRequest, getAlumniOpportunitiesRequest } from '../../api/alumniOpportunities.js';

const formatDate = (value) => new Date(value).toLocaleDateString();

function AlumniOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeOpportunityId, setActiveOpportunityId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadOpportunities = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getAlumniOpportunitiesRequest();
        setOpportunities(response.data?.opportunities || []);
      } catch (error) {
        setErrorMessage(error.userMessage || 'Unable to load your opportunities.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunities();
  }, []);

  const handleClose = async (opportunityId) => {
    setActiveOpportunityId(opportunityId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await closeAlumniOpportunityRequest(opportunityId);
      const updatedOpportunity = response.data?.opportunity;

      if (updatedOpportunity) {
        setOpportunities((current) =>
          current.map((opportunity) => (opportunity._id === updatedOpportunity._id ? updatedOpportunity : opportunity))
        );
      }

      setSuccessMessage(response.message || 'Opportunity closed successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to close opportunity.');
    } finally {
      setActiveOpportunityId('');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="ALUMNI"
        title="My opportunities"
        description="Track opportunities you posted for your institute and monitor their approval status."
      />

      <div className="mb-6">
        <Link
          to="/alumni/opportunities/create"
          className="btn-primary"
        >
          Post Opportunity
        </Link>
      </div>

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
          <LoadingState message="Loading opportunities..." />
        ) : opportunities.length === 0 ? (
          <EmptyState title="No opportunities posted yet" description="Opportunities you post for institute approval will appear here." />
        ) : (
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <article key={opportunity._id} className="content-card p-6 flex flex-col">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-section font-semibold text-text-primary">{opportunity.title}</h2>
                    <p className="mt-1 text-caption text-text-secondary">
                      {opportunity.role} at {opportunity.company}
                    </p>
                  </div>
                  <StatusBadge value={opportunity.status} />
                </div>

                <div className="grid gap-4 text-body text-text-secondary grow md:grid-cols-2">
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Type</span> <span className="font-medium text-text-primary">{opportunity.type}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Mode</span> <span className="font-medium text-text-primary">{opportunity.mode}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Location</span> <span className="font-medium text-text-primary">{opportunity.location}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Deadline</span> <span className="font-medium text-text-primary">{formatDate(opportunity.deadline)}</span></p>
                </div>

                {opportunity.rejectionReason ? (
                  <p className="mt-6 border-t border-border pt-4 text-sm font-medium text-error">Rejection reason: {opportunity.rejectionReason}</p>
                ) : null}

                {opportunity.status === 'APPROVED' ? (
                  <div className="mt-6 pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={activeOpportunityId === opportunity._id}
                      onClick={() => handleClose(opportunity._id)}
                      className="btn-secondary"
                    >
                      {activeOpportunityId === opportunity._id ? 'Closing...' : 'Close Opportunity'}
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

export default AlumniOpportunitiesPage;
