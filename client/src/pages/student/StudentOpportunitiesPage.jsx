import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';
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

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {errorMessage ? (
          <p className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Loading opportunities...
          </div>
        ) : opportunities.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No approved opportunities are available right now.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {opportunities.map((opportunity) => (
              <article key={opportunity._id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-lg font-semibold text-slate-950">{opportunity.title}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {opportunity.role} at {opportunity.company}
                </p>
                <div className="mt-4 grid gap-2 text-sm text-slate-600">
                  <p>Type: {opportunity.type}</p>
                  <p>Location: {opportunity.location}</p>
                  <p>Mode: {opportunity.mode}</p>
                  <p>Deadline: {formatDate(opportunity.deadline)}</p>
                  <p>Posted by: {opportunity.postedBy?.name}</p>
                </div>
                <Link
                  to={`/student/opportunities/${opportunity._id}`}
                  className="mt-4 inline-flex rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900"
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
