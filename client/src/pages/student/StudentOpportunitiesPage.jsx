import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import { getStudentOpportunitiesRequest } from '../../api/studentOpportunities.js';

const formatDate = (value) => new Date(value).toLocaleDateString();

function StudentOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadOpportunities = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getStudentOpportunitiesRequest();
        setOpportunities(response.data?.opportunities || []);
      } catch (error) {
        setErrorMessage(error.userMessage || 'Unable to load opportunities.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunities();
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="STUDENT"
        title="Opportunities"
        description="Browse approved opportunities shared by verified alumni from your institute."
      />

      <section className="surface-card p-6 md:p-8">
        {errorMessage ? (
          <p className="alert-error mb-4">{errorMessage}</p>
        ) : null}

        {isLoading ? (
          <LoadingState message="Loading opportunities..." />
        ) : opportunities.length === 0 ? (
          <EmptyState
            title="No opportunities available"
            description="Approved openings from verified alumni will appear here when your institute has active postings."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {opportunities.map((opportunity) => (
              <article key={opportunity._id} className="content-card p-6 flex flex-col">
                <h2 className="text-section font-semibold text-text-primary">{opportunity.title}</h2>
                <p className="mt-1 text-caption text-text-secondary">
                  {opportunity.role} at {opportunity.company}
                </p>
                <div className="mt-4 grid gap-3 text-body text-text-secondary grow">
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Type</span> <span className="font-medium text-text-primary">{opportunity.type}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Location</span> <span className="font-medium text-text-primary">{opportunity.location}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Mode</span> <span className="font-medium text-text-primary">{opportunity.mode}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Deadline</span> <span className="font-medium text-text-primary">{formatDate(opportunity.deadline)}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Posted by</span> <span className="font-medium text-text-primary">{opportunity.postedBy?.name}</span></p>
                </div>
                <Link
                  to={`/student/opportunities/${opportunity._id}`}
                  className="btn-primary mt-6 w-full justify-center"
                >
                  View details
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentOpportunitiesPage;
