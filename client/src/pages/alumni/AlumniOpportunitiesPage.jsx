import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { closeAlumniOpportunityRequest, getAlumniOpportunitiesRequest } from '../../api/alumniOpportunities.js';

const STATUS_STYLES = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  APPROVED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  REJECTED: 'border-rose-200 bg-rose-50 text-rose-700',
  CLOSED: 'border-slate-200 bg-slate-100 text-slate-700'
};

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
          className="inline-flex rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900"
        >
          Post Opportunity
        </Link>
      </div>

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
            Loading opportunities...
          </div>
        ) : opportunities.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            You have not posted any opportunities yet.
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <article key={opportunity._id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{opportunity.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {opportunity.role} at {opportunity.company}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      STATUS_STYLES[opportunity.status] || STATUS_STYLES.PENDING
                    }`}
                  >
                    {opportunity.status}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                  <p>Type: {opportunity.type}</p>
                  <p>Mode: {opportunity.mode}</p>
                  <p>Location: {opportunity.location}</p>
                  <p>Deadline: {formatDate(opportunity.deadline)}</p>
                </div>

                {opportunity.rejectionReason ? (
                  <p className="mt-4 text-sm text-rose-700">Rejection reason: {opportunity.rejectionReason}</p>
                ) : null}

                {opportunity.status === 'APPROVED' ? (
                  <button
                    type="button"
                    disabled={activeOpportunityId === opportunity._id}
                    onClick={() => handleClose(opportunity._id)}
                    className="mt-4 rounded-md bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {activeOpportunityId === opportunity._id ? 'Closing...' : 'Close Opportunity'}
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

export default AlumniOpportunitiesPage;
