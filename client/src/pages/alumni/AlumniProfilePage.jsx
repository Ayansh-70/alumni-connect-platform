import { useEffect, useState } from 'react';
import { getAlumniProfileRequest, saveAlumniProfileRequest } from '../../api/alumniProfiles.js';
import PageHeader from '../../components/ui/PageHeader.jsx';

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

const STATUS_STYLES = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  VERIFIED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  REJECTED: 'border-rose-200 bg-rose-50 text-rose-700'
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

      <section className="max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Loading your profile...
          </div>
        ) : (
          <>
            <div
              className={`mb-6 rounded-md border px-4 py-3 text-sm font-medium ${
                STATUS_STYLES[verificationStatus] || STATUS_STYLES.PENDING
              }`}
            >
              Verification status: {verificationStatus}
              {verificationReason ? <p className="mt-2 font-normal">Reason: {verificationReason}</p> : null}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Branch
                  <input
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                    placeholder="Electronics and Communication"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Batch
                  <input
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                    placeholder="2019"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Current company
                  <input
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                    placeholder="Acme Technologies"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Current role
                  <input
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
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
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                    placeholder="3"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Domain
                  <input
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
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
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  placeholder="Java, Spring Boot, AWS"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Bio
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
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
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                    placeholder="Hyderabad, India"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  LinkedIn URL
                  <input
                    name="linkedInUrl"
                    value={formData.linkedInUrl}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                    placeholder="https://linkedin.com/in/username"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  GitHub URL
                  <input
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                    placeholder="https://github.com/username"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Portfolio URL
                  <input
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                    placeholder="https://yourportfolio.com"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="canProvideReferral"
                    checked={formData.canProvideReferral}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-200"
                  />
                  I can provide referrals
                </label>
                <label className="flex items-center gap-3 rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="canMentor"
                    checked={formData.canMentor}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-200"
                  />
                  I can mentor students
                </label>
              </div>

              {errorMessage ? (
                <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {errorMessage}
                </p>
              ) : null}

              {successMessage ? (
                <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {successMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-70"
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
