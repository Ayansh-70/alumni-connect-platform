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

      <section className="surface-card max-w-4xl">
        {isLoading ? (
          <LoadingState message="Loading your profile..." />
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Verification status</p>
                {verificationReason ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Reason: {verificationReason}</p> : null}
              </div>
              <StatusBadge value={verificationStatus} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Branch
                  <input
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="field-control mt-2"
                    placeholder="Electronics and Communication"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Batch
                  <input
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control mt-2"
                    placeholder="2019"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Current company
                  <input
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control mt-2"
                    placeholder="Acme Technologies"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Current role
                  <input
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control mt-2"
                    placeholder="Software Engineer"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Experience years
                  <input
                    name="experienceYears"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control mt-2"
                    placeholder="3"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Domain
                  <input
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control mt-2"
                    placeholder="Backend, Data, Product"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-slate-700">
                Skills
                <input
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="field-control mt-2"
                  placeholder="Java, Spring Boot, AWS"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Bio
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows="4"
                  className="field-control mt-2"
                  placeholder="Share your experience and the kind of support you can offer."
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Location
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control mt-2"
                    placeholder="Hyderabad, India"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  LinkedIn URL
                  <input
                    name="linkedInUrl"
                    value={formData.linkedInUrl}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control mt-2"
                    placeholder="https://linkedin.com/in/username"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  GitHub URL
                  <input
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control mt-2"
                    placeholder="https://github.com/username"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Portfolio URL
                  <input
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control mt-2"
                    placeholder="https://yourportfolio.com"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-300">
                  <input
                    type="checkbox"
                    name="canProvideReferral"
                    checked={formData.canProvideReferral}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-200"
                  />
                  I can provide referrals
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-300">
                  <input
                    type="checkbox"
                    name="canMentor"
                    checked={formData.canMentor}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-200"
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'Saving...' : 'Save profile'}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

export default AlumniProfilePage;
