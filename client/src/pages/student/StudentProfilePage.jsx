import { useEffect, useState } from 'react';
import { getStudentProfileRequest, saveStudentProfileRequest } from '../../api/studentProfiles.js';
import LoadingState from '../../components/ui/LoadingState.jsx';
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

      <section className="surface-card max-w-4xl">
        {isLoading ? (
          <LoadingState message="Loading your profile..." />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Branch
                <input
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="field-control mt-2"
                  placeholder="Computer Science"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Batch
                <input
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  className="field-control mt-2"
                  placeholder="2026"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Semester
                <input
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="field-control mt-2"
                  placeholder="6"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Roll number
                <input
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="field-control mt-2"
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
                className="field-control mt-2"
                placeholder="React, Node.js, MongoDB"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Interests
              <input
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                className="field-control mt-2"
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
                className="field-control mt-2"
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
                className="field-control mt-2"
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
                  className="field-control mt-2"
                  placeholder="Bengaluru, India"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                LinkedIn URL
                <input
                  name="linkedInUrl"
                  value={formData.linkedInUrl}
                  onChange={handleChange}
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
                  className="field-control mt-2"
                  placeholder="https://yourportfolio.com"
                />
              </label>
            </div>

            {errorMessage ? (
              <p className="alert-error">
                {errorMessage}
              </p>
            ) : null}

            {successMessage ? (
              <p className="alert-success">
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
        )}
      </section>
    </div>
  );
}

export default StudentProfilePage;
