import { useEffect, useState } from 'react';
import { getAlumniProfileRequest, saveAlumniProfileRequest } from '../../api/alumniProfiles.js';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';

const INITIAL_FORM_DATA = {
  branch: '',
  batch: '',
  currentCompany: '',
  currentRole: '',
  experienceYears: '',
  skills: '',
  domain: '',
  location: '',
  linkedInUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  bio: '',
  canProvideReferral: false,
  canMentor: false
};

const formatList = (value) => (Array.isArray(value) ? value.join(', ') : '');

function AlumniProfilePage() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [verificationStatus, setVerificationStatus] = useState('PENDING');
  const [verificationReason, setVerificationReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getAlumniProfileRequest();
        const profile = response.data?.profile;

        if (profile) {
          setFormData({
            branch: profile.branch || '',
            batch: profile.batch || '',
            currentCompany: profile.currentCompany || '',
            currentRole: profile.currentRole || '',
            experienceYears: String(profile.experienceYears ?? ''),
            skills: formatList(profile.skills),
            domain: profile.domain || '',
            location: profile.location || '',
            linkedInUrl: profile.linkedInUrl || '',
            githubUrl: profile.githubUrl || '',
            portfolioUrl: profile.portfolioUrl || '',
            bio: profile.bio || '',
            canProvideReferral: Boolean(profile.canProvideReferral),
            canMentor: Boolean(profile.canMentor)
          });
          setVerificationStatus(profile.verificationStatus || 'PENDING');
          setVerificationReason(profile.verificationReason || '');
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          setErrorMessage(error.userMessage || 'Unable to load your profile.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await saveAlumniProfileRequest(formData);
      const profile = response.data?.profile;

      if (profile) {
        setFormData({
          branch: profile.branch || '',
          batch: profile.batch || '',
          currentCompany: profile.currentCompany || '',
          currentRole: profile.currentRole || '',
          experienceYears: String(profile.experienceYears ?? ''),
          skills: formatList(profile.skills),
          domain: profile.domain || '',
          location: profile.location || '',
          linkedInUrl: profile.linkedInUrl || '',
          githubUrl: profile.githubUrl || '',
          portfolioUrl: profile.portfolioUrl || '',
          bio: profile.bio || '',
          canProvideReferral: Boolean(profile.canProvideReferral),
          canMentor: Boolean(profile.canMentor)
        });
        setVerificationStatus(profile.verificationStatus || 'PENDING');
        setVerificationReason(profile.verificationReason || '');
      }

      setSuccessMessage(response.message || 'Alumni profile saved successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to save your profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="ALUMNI"
        title="My profile"
        description="Keep your professional details up to date so your institute can review and verify your alumni identity."
      />

      <section className="surface-card max-w-4xl p-6">
        {isLoading ? (
          <LoadingState message="Loading your profile..." />
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-bg-secondary px-4 py-3">
              <div>
                <p className="text-badge font-bold uppercase tracking-wider text-text-muted">Verification status</p>
                {verificationReason ? <p className="mt-2 text-body text-text-secondary">Reason: {verificationReason}</p> : null}
              </div>
              <StatusBadge value={verificationStatus} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="branch">Branch</label>
                  <input
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="field-control"
                    placeholder="Electronics and Communication"
                  />
                </div>
                <div>
                  <label htmlFor="batch">Batch</label>
                  <input
                    id="batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control"
                    placeholder="2019"
                  />
                </div>
                <div>
                  <label htmlFor="currentCompany">Current company</label>
                  <input
                    id="currentCompany"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control"
                    placeholder="Acme Technologies"
                  />
                </div>
                <div>
                  <label htmlFor="currentRole">Current role</label>
                  <input
                    id="currentRole"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control"
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <label htmlFor="experienceYears">Experience years</label>
                  <input
                    id="experienceYears"
                    name="experienceYears"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label htmlFor="domain">Domain</label>
                  <input
                    id="domain"
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control"
                    placeholder="Backend, Data, Product"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="skills">Skills</label>
                <input
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="field-control"
                  placeholder="Java, Spring Boot, AWS"
                />
              </div>

              <div>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows="4"
                  className="field-control"
                  placeholder="Share your experience and the kind of support you can offer."
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control"
                    placeholder="Hyderabad, India"
                  />
                </div>
                <div>
                  <label htmlFor="linkedInUrl">LinkedIn URL</label>
                  <input
                    id="linkedInUrl"
                    name="linkedInUrl"
                    value={formData.linkedInUrl}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label htmlFor="githubUrl">GitHub URL</label>
                  <input
                    id="githubUrl"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label htmlFor="portfolioUrl">Portfolio URL</label>
                  <input
                    id="portfolioUrl"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-lg border border-border bg-bg-secondary px-4 py-3 text-body text-text-primary">
                  <input
                    type="checkbox"
                    name="canProvideReferral"
                    checked={formData.canProvideReferral}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  I can provide referrals
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-border bg-bg-secondary px-4 py-3 text-body text-text-primary">
                  <input
                    type="checkbox"
                    name="canMentor"
                    checked={formData.canMentor}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  I can mentor students
                </label>
              </div>

              {errorMessage ? (
                <p className="alert-error" role="alert" aria-live="polite">
                  {errorMessage}
                </p>
              ) : null}

              {successMessage ? (
                <p className="alert-success" role="alert" aria-live="polite">
                  {successMessage}
                </p>
              ) : null}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? 'Saving...' : 'Save profile'}
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

export default AlumniProfilePage;
