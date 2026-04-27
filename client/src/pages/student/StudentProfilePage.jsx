import { useEffect, useState } from 'react';
import { getStudentProfileRequest, saveStudentProfileRequest } from '../../api/studentProfiles.js';
import PageHeader from '../../components/ui/PageHeader.jsx';

const INITIAL_FORM_DATA = {
  branch: '',
  batch: '',
  semester: '',
  rollNumber: '',
  skills: '',
  interests: '',
  careerGoals: '',
  bio: '',
  location: '',
  linkedInUrl: '',
  githubUrl: '',
  portfolioUrl: ''
};

const formatList = (value) => (Array.isArray(value) ? value.join(', ') : '');

function StudentProfilePage() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getStudentProfileRequest();
        const profile = response.data?.profile;

        if (profile) {
          setFormData({
            branch: profile.branch || '',
            batch: profile.batch || '',
            semester: profile.semester || '',
            rollNumber: profile.rollNumber || '',
            skills: formatList(profile.skills),
            interests: formatList(profile.interests),
            careerGoals: profile.careerGoals || '',
            bio: profile.bio || '',
            location: profile.location || '',
            linkedInUrl: profile.linkedInUrl || '',
            githubUrl: profile.githubUrl || '',
            portfolioUrl: profile.portfolioUrl || ''
          });
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
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await saveStudentProfileRequest(formData);
      const profile = response.data?.profile;

      if (profile) {
        setFormData({
          branch: profile.branch || '',
          batch: profile.batch || '',
          semester: profile.semester || '',
          rollNumber: profile.rollNumber || '',
          skills: formatList(profile.skills),
          interests: formatList(profile.interests),
          careerGoals: profile.careerGoals || '',
          bio: profile.bio || '',
          location: profile.location || '',
          linkedInUrl: profile.linkedInUrl || '',
          githubUrl: profile.githubUrl || '',
          portfolioUrl: profile.portfolioUrl || ''
        });
      }

      setSuccessMessage(response.message || 'Student profile saved successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to save your profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="STUDENT"
        title="My profile"
        description="Complete your academic and personal profile so your institute can support verified alumni networking later."
      />

      <section className="max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Loading your profile...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Branch
                <input
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  placeholder="Computer Science"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Batch
                <input
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  placeholder="2026"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Semester
                <input
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  placeholder="6"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Roll number
                <input
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  placeholder="CS2026-014"
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
                placeholder="React, Node.js, MongoDB"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Interests
              <input
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                placeholder="Web development, AI, product design"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Career goals
              <textarea
                name="careerGoals"
                value={formData.careerGoals}
                onChange={handleChange}
                rows="3"
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                placeholder="Describe the kind of roles or growth you are aiming for."
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
                placeholder="Write a short introduction."
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
                  placeholder="Bengaluru, India"
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
        )}
      </section>
    </div>
  );
}

export default StudentProfilePage;
