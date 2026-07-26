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
        className="btn-secondary mb-6 inline-flex"
      >
        Back to search
      </Link>

      <section className="max-w-3xl surface-card p-6 md:p-8">
        {isLoading ? (
          <div className="p-4 text-body text-text-secondary">
            Loading alumni details...
          </div>
        ) : errorMessage ? (
          <p className="alert-error" role="alert" aria-live="polite">
            {errorMessage}
          </p>
        ) : alumni ? (
          <div className="space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-display font-semibold text-text-primary">{alumni.user?.name}</h2>
                <p className="mt-2 text-body text-text-secondary">{alumni.user?.email}</p>
              </div>
              <span className="inline-flex rounded-full border border-border bg-bg-secondary px-3 py-1 text-caption font-semibold uppercase tracking-wider text-text-primary">
                {alumni.verificationStatus}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 text-body text-text-secondary">
              <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Branch</span> <span className="font-medium text-text-primary">{alumni.branch}</span></p>
              <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Batch</span> <span className="font-medium text-text-primary">{alumni.batch}</span></p>
              <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Company</span> <span className="font-medium text-text-primary">{alumni.currentCompany}</span></p>
              <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Role</span> <span className="font-medium text-text-primary">{alumni.currentRole}</span></p>
              <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Experience</span> <span className="font-medium text-text-primary">{alumni.experienceYears} years</span></p>
              <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Domain</span> <span className="font-medium text-text-primary">{alumni.domain || 'Not provided'}</span></p>
              <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Location</span> <span className="font-medium text-text-primary">{alumni.location || 'Not provided'}</span></p>
              <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Referral support</span> <span className="font-medium text-text-primary">{alumni.canProvideReferral ? 'Yes' : 'No'}</span></p>
              <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Mentoring</span> <span className="font-medium text-text-primary">{alumni.canMentor ? 'Yes' : 'No'}</span></p>
            </div>

            <div>
              <h3 className="text-badge font-bold uppercase tracking-wider text-text-muted block">Skills</h3>
              <p className="mt-2 text-body font-medium text-text-primary">{alumni.skills?.join(', ') || 'Not provided'}</p>
            </div>

            <div>
              <h3 className="text-badge font-bold uppercase tracking-wider text-text-muted block">Bio</h3>
              <p className="mt-2 text-body leading-relaxed text-text-secondary">{alumni.bio || 'No bio provided.'}</p>
            </div>

            <div className="content-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-section font-semibold text-text-primary">Connection request</h3>
                  <p className="mt-2 text-body text-text-secondary">
                    Send a simple introduction to start a connection with this verified alumni.
                  </p>
                </div>
                {alumni.connectionRequest ? (
                  <span
                    className={`inline-flex rounded-full border border-border bg-bg-secondary px-3 py-1 text-caption font-semibold uppercase tracking-wider text-text-primary`}
                  >
                    {alumni.connectionRequest.status}
                  </span>
                ) : null}
              </div>

              <form onSubmit={handleSubmitRequest} className="mt-6">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows="4"
                  disabled={isSubmitting || Boolean(alumni.connectionRequest)}
                  className="field-control"
                  placeholder="Write an optional message about why you want to connect."
                />

                {errorMessage ? (
                  <p className="alert-error mt-4" role="alert" aria-live="polite">
                    {errorMessage}
                  </p>
                ) : null}

                {successMessage ? (
                  <p className="alert-success mt-4" role="alert" aria-live="polite">
                    {successMessage}
                  </p>
                ) : null}

                {alumni.connectionRequest ? (
                  <p className="mt-4 text-body text-text-secondary">
                    You already sent a connection request on{' '}
                    <span className="font-medium text-text-primary">{new Date(alumni.connectionRequest.createdAt).toLocaleDateString()}</span>.
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting || Boolean(alumni.connectionRequest)}
                  className="btn-primary mt-6"
                >
                  {alumni.connectionRequest ? 'Connection Request Sent' : isSubmitting ? 'Sending...' : 'Send Connection Request'}
                </button>
              </form>
            </div>

            <div className="content-card p-6">
              <div>
                <h3 className="text-section font-semibold text-text-primary">
                  Guidance or referral request
                </h3>
                <p className="mt-2 text-body text-text-secondary">
                  Ask this alumni for mentorship, referral support, project guidance, or broader career help.
                </p>
              </div>

              <form onSubmit={handleSubmitGuidanceRequest} className="mt-6 space-y-6">
                <div>
                  <label htmlFor="guidance-type">Request type</label>
                  <select
                    id="guidance-type"
                    name="type"
                    value={guidanceForm.type}
                    onChange={handleGuidanceChange}
                    disabled={isGuidanceSubmitting}
                    className="field-control"
                  >
                    {GUIDANCE_REQUEST_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="guidance-title">Title</label>
                  <input
                    id="guidance-title"
                    name="title"
                    value={guidanceForm.title}
                    onChange={handleGuidanceChange}
                    disabled={isGuidanceSubmitting}
                    className="field-control"
                    placeholder="Need help with internship preparation"
                  />
                </div>

                <div>
                  <label htmlFor="guidance-message">Message</label>
                  <textarea
                    id="guidance-message"
                    name="message"
                    value={guidanceForm.message}
                    onChange={handleGuidanceChange}
                    disabled={isGuidanceSubmitting}
                    rows="4"
                    className="field-control"
                    placeholder="Explain what kind of help you need and any context that would help the alumni respond."
                  />
                </div>

                {guidanceErrorMessage ? (
                  <p className="alert-error" role="alert" aria-live="polite">
                    {guidanceErrorMessage}
                  </p>
                ) : null}

                {guidanceSuccessMessage ? (
                  <p className="alert-success" role="alert" aria-live="polite">
                    {guidanceSuccessMessage}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isGuidanceSubmitting}
                  className="btn-primary mt-2"
                >
                  {isGuidanceSubmitting ? 'Sending...' : 'Send Request'}
                </button>
              </form>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <a
                href={alumni.linkedInUrl || undefined}
                target="_blank"
                rel="noreferrer"
                className={`btn-secondary justify-center ${
                  !alumni.linkedInUrl ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                LinkedIn
              </a>
              <a
                href={alumni.githubUrl || undefined}
                target="_blank"
                rel="noreferrer"
                className={`btn-secondary justify-center ${
                  !alumni.githubUrl ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                GitHub
              </a>
              <a
                href={alumni.portfolioUrl || undefined}
                target="_blank"
                rel="noreferrer"
                className={`btn-secondary justify-center ${
                  !alumni.portfolioUrl ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Portfolio
              </a>
            </div>
          </div>
        ) : (
          <div className="p-4 text-body text-text-secondary">
            Alumni details are not available.
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentAlumniDetailPage;
