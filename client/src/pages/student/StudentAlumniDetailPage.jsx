import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getStudentAlumniDetailRequest } from '../../api/studentAlumni.js';
import { createStudentConnectionRequest } from '../../api/studentConnections.js';
import { createStudentGuidanceRequest } from '../../api/studentGuidanceRequests.js';
import PageHeader from '../../components/ui/PageHeader.jsx';

const GUIDANCE_REQUEST_TYPES = [
  'MENTORSHIP',
  'REFERRAL',
  'INTERNSHIP_HELP',
  'JOB_GUIDANCE',
  'PROJECT_GUIDANCE',
  'HIGHER_STUDIES',
  'GENERAL_CAREER_ADVICE'
];

const STATUS_STYLES = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  ACCEPTED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  REJECTED: 'border-rose-200 bg-rose-50 text-rose-700'
};

function StudentAlumniDetailPage() {
  const { id } = useParams();
  const [alumni, setAlumni] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guidanceForm, setGuidanceForm] = useState({
    type: 'MENTORSHIP',
    title: '',
    message: ''
  });
  const [guidanceErrorMessage, setGuidanceErrorMessage] = useState('');
  const [guidanceSuccessMessage, setGuidanceSuccessMessage] = useState('');
  const [isGuidanceSubmitting, setIsGuidanceSubmitting] = useState(false);

  useEffect(() => {
    const loadAlumni = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getStudentAlumniDetailRequest(id);
        const nextAlumni = response.data?.alumni || null;
        setAlumni(nextAlumni);
        setMessage(nextAlumni?.connectionRequest?.message || '');
      } catch (error) {
        setErrorMessage(error.userMessage || 'Unable to load alumni details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlumni();
  }, [id]);

  const handleGuidanceChange = (event) => {
    const { name, value } = event.target;
    setGuidanceForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmitRequest = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await createStudentConnectionRequest({
        alumniId: id,
        message
      });

      const createdRequest = response.data?.request;

      setAlumni((current) =>
        current
          ? {
              ...current,
              connectionRequest: createdRequest
                ? {
                    _id: createdRequest._id,
                    status: createdRequest.status,
                    message: createdRequest.message,
                    respondedAt: createdRequest.respondedAt,
                    createdAt: createdRequest.createdAt,
                    updatedAt: createdRequest.updatedAt
                  }
                : current.connectionRequest
            }
          : current
      );
      setSuccessMessage(response.message || 'Connection request sent successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to send connection request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitGuidanceRequest = async (event) => {
    event.preventDefault();
    setIsGuidanceSubmitting(true);
    setGuidanceErrorMessage('');
    setGuidanceSuccessMessage('');

    try {
      const response = await createStudentGuidanceRequest({
        alumniId: id,
        type: guidanceForm.type,
        title: guidanceForm.title,
        message: guidanceForm.message
      });

      setGuidanceSuccessMessage(response.message || 'Guidance request sent successfully.');
      setGuidanceForm({
        type: 'MENTORSHIP',
        title: '',
        message: ''
      });
    } catch (error) {
      setGuidanceErrorMessage(error.userMessage || 'Unable to send guidance request.');
    } finally {
      setIsGuidanceSubmitting(false);
    }
  };

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

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Connection request</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Send a simple introduction to start a connection with this verified alumni.
                  </p>
                </div>
                {alumni.connectionRequest ? (
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      STATUS_STYLES[alumni.connectionRequest.status] || STATUS_STYLES.PENDING
                    }`}
                  >
                    {alumni.connectionRequest.status}
                  </span>
                ) : null}
              </div>

              <form onSubmit={handleSubmitRequest} className="mt-4">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows="4"
                  disabled={Boolean(alumni.connectionRequest)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:bg-slate-900 dark:border-slate-700"
                  placeholder="Write an optional message about why you want to connect."
                />

                {errorMessage ? (
                  <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {errorMessage}
                  </p>
                ) : null}

                {successMessage ? (
                  <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {successMessage}
                  </p>
                ) : null}

                {alumni.connectionRequest ? (
                  <p className="mt-4 text-sm text-slate-600">
                    You already sent a connection request on{' '}
                    {new Date(alumni.connectionRequest.createdAt).toLocaleDateString()}.
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting || Boolean(alumni.connectionRequest)}
                  className="mt-4 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {alumni.connectionRequest ? 'Connection Request Sent' : isSubmitting ? 'Sending...' : 'Send Connection Request'}
                </button>
              </form>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Guidance or referral request
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Ask this alumni for mentorship, referral support, project guidance, or broader career help.
                </p>
              </div>

              <form onSubmit={handleSubmitGuidanceRequest} className="mt-4 space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Request type
                  <select
                    name="type"
                    value={guidanceForm.type}
                    onChange={handleGuidanceChange}
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:bg-slate-900 dark:border-slate-700"
                  >
                    {GUIDANCE_REQUEST_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Title
                  <input
                    name="title"
                    value={guidanceForm.title}
                    onChange={handleGuidanceChange}
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:bg-slate-900 dark:border-slate-700"
                    placeholder="Need help with internship preparation"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Message
                  <textarea
                    name="message"
                    value={guidanceForm.message}
                    onChange={handleGuidanceChange}
                    rows="4"
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:bg-slate-900 dark:border-slate-700"
                    placeholder="Explain what kind of help you need and any context that would help the alumni respond."
                  />
                </label>

                {guidanceErrorMessage ? (
                  <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {guidanceErrorMessage}
                  </p>
                ) : null}

                {guidanceSuccessMessage ? (
                  <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {guidanceSuccessMessage}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isGuidanceSubmitting}
                  className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isGuidanceSubmitting ? 'Sending...' : 'Send Guidance/Referral Request'}
                </button>
              </form>
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
