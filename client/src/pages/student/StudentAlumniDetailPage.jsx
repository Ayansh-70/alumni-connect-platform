import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getStudentAlumniDetailRequest } from '../../api/studentAlumni.js';
import PageHeader from '../../components/ui/PageHeader.jsx';

function StudentAlumniDetailPage() {
  const { id } = useParams();
  const [alumni, setAlumni] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadAlumni = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getStudentAlumniDetailRequest(id);
        setAlumni(response.data?.alumni || null);
      } catch (error) {
        setErrorMessage(error.userMessage || 'Unable to load alumni details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlumni();
  }, [id]);

  return (
    <div>
      <PageHeader
        eyebrow="STUDENT"
        title="Alumni details"
        description="Review verified alumni information from your institute before future connection and mentorship features are added."
      />

      <Link
        to="/student/alumni-search"
        className="mb-6 inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Back to search
      </Link>

      <section className="max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Loading alumni details...
          </div>
        ) : errorMessage ? (
          <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : alumni ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">{alumni.user?.name}</h2>
                <p className="mt-2 text-sm text-slate-600">{alumni.user?.email}</p>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {alumni.verificationStatus}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <p className="text-sm text-slate-600">Branch: {alumni.branch}</p>
              <p className="text-sm text-slate-600">Batch: {alumni.batch}</p>
              <p className="text-sm text-slate-600">Company: {alumni.currentCompany}</p>
              <p className="text-sm text-slate-600">Role: {alumni.currentRole}</p>
              <p className="text-sm text-slate-600">Experience: {alumni.experienceYears} years</p>
              <p className="text-sm text-slate-600">Domain: {alumni.domain || 'Not provided'}</p>
              <p className="text-sm text-slate-600">Location: {alumni.location || 'Not provided'}</p>
              <p className="text-sm text-slate-600">Referral support: {alumni.canProvideReferral ? 'Yes' : 'No'}</p>
              <p className="text-sm text-slate-600">Mentoring: {alumni.canMentor ? 'Yes' : 'No'}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Skills</h3>
              <p className="mt-2 text-sm text-slate-600">{alumni.skills?.join(', ') || 'Not provided'}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Bio</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{alumni.bio || 'No bio provided.'}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <a
                href={alumni.linkedInUrl || undefined}
                target="_blank"
                rel="noreferrer"
                className={`rounded-md border px-4 py-3 text-sm font-medium ${
                  alumni.linkedInUrl
                    ? 'border-slate-300 text-slate-700 transition hover:bg-slate-50'
                    : 'cursor-not-allowed border-slate-200 text-slate-400'
                }`}
              >
                LinkedIn
              </a>
              <a
                href={alumni.githubUrl || undefined}
                target="_blank"
                rel="noreferrer"
                className={`rounded-md border px-4 py-3 text-sm font-medium ${
                  alumni.githubUrl
                    ? 'border-slate-300 text-slate-700 transition hover:bg-slate-50'
                    : 'cursor-not-allowed border-slate-200 text-slate-400'
                }`}
              >
                GitHub
              </a>
              <a
                href={alumni.portfolioUrl || undefined}
                target="_blank"
                rel="noreferrer"
                className={`rounded-md border px-4 py-3 text-sm font-medium ${
                  alumni.portfolioUrl
                    ? 'border-slate-300 text-slate-700 transition hover:bg-slate-50'
                    : 'cursor-not-allowed border-slate-200 text-slate-400'
                }`}
              >
                Portfolio
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Alumni details are not available.
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentAlumniDetailPage;
