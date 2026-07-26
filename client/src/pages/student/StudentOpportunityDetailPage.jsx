import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { getStudentOpportunityByIdRequest } from '../../api/studentOpportunities.js';

function StudentOpportunityDetailPage() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadOpportunity = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getStudentOpportunityByIdRequest(id);
        setOpportunity(response.data?.opportunity || null);
      } catch (error) {
        setErrorMessage(error.userMessage || 'Unable to load opportunity details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunity();
  }, [id]);

  return (
    <div>
      <PageHeader
        eyebrow="STUDENT"
        title="Opportunity details"
        description="Review the full details of an approved opportunity from your institute."
      />

      <Link
        to="/student/opportunities"
        className="btn-secondary mb-6 inline-flex"
      >
        Back to opportunities
      </Link>

      <section className="max-w-3xl surface-card p-6 md:p-8">
        {isLoading ? (
          <div className="p-4 text-body text-text-secondary">
            Loading opportunity details...
          </div>
        ) : errorMessage ? (
          <p className="alert-error">
            {errorMessage}
          </p>
        ) : opportunity ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-display font-semibold text-text-primary">{opportunity.title}</h2>
              <p className="mt-2 text-body text-text-secondary">
                {opportunity.role} at {opportunity.company}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 text-body text-text-secondary">
              <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Type</span> <span className="font-medium text-text-primary">{opportunity.type}</span></p>
              <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Mode</span> <span className="font-medium text-text-primary">{opportunity.mode}</span></p>
              <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Location</span> <span className="font-medium text-text-primary">{opportunity.location}</span></p>
              <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Deadline</span> <span className="font-medium text-text-primary">{new Date(opportunity.deadline).toLocaleDateString()}</span></p>
              <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Posted by</span> <span className="font-medium text-text-primary">{opportunity.postedBy?.name}</span></p>
              <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Posted on</span> <span className="font-medium text-text-primary">{new Date(opportunity.createdAt).toLocaleDateString()}</span></p>
            </div>

            <div>
              <h3 className="text-badge font-bold uppercase tracking-wider text-text-muted block">Description</h3>
              <p className="mt-2 text-body leading-relaxed text-text-secondary">{opportunity.description}</p>
            </div>

            <div>
              <h3 className="text-badge font-bold uppercase tracking-wider text-text-muted block">Eligibility</h3>
              <p className="mt-2 text-body leading-relaxed text-text-secondary">{opportunity.eligibility}</p>
            </div>

            <div>
              <h3 className="text-badge font-bold uppercase tracking-wider text-text-muted block">Skills required</h3>
              <p className="mt-2 text-body font-medium text-text-primary">{opportunity.skillsRequired?.join(', ') || 'Not provided'}</p>
            </div>

            <a
              href={opportunity.applicationLink}
              target="_blank"
              rel="noreferrer"
              className="btn-primary inline-flex mt-2"
            >
              Open application link
            </a>
          </div>
        ) : (
          <div className="p-4 text-body text-text-secondary">
            Opportunity details are not available.
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentOpportunityDetailPage;
