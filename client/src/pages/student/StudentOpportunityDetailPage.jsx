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
        className="mb-6 inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Back to opportunities
      </Link>

      <section className="max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Loading opportunity details...
          </div>
        ) : errorMessage ? (
          <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : opportunity ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">{opportunity.title}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {opportunity.role} at {opportunity.company}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <p className="text-sm text-slate-600">Type: {opportunity.type}</p>
              <p className="text-sm text-slate-600">Mode: {opportunity.mode}</p>
              <p className="text-sm text-slate-600">Location: {opportunity.location}</p>
              <p className="text-sm text-slate-600">
                Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
              </p>
              <p className="text-sm text-slate-600">Posted by: {opportunity.postedBy?.name}</p>
              <p className="text-sm text-slate-600">
                Posted on: {new Date(opportunity.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Description</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{opportunity.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Eligibility</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{opportunity.eligibility}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Skills required</h3>
              <p className="mt-2 text-sm text-slate-600">{opportunity.skillsRequired?.join(', ') || 'Not provided'}</p>
            </div>

            <a
              href={opportunity.applicationLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900"
            >
              Open application link
            </a>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Opportunity details are not available.
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentOpportunityDetailPage;
