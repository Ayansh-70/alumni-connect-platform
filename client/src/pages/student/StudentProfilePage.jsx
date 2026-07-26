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

      <section className="surface-card max-w-4xl p-6">
        {isLoading ? (
          <LoadingState message="Loading your profile..." />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="branch">Branch</label>
                <input
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="field-control"
                  placeholder="Computer Science"
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
                  placeholder="2026"
                />
              </div>
              <div>
                <label htmlFor="semester">Semester</label>
                <input
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="field-control"
                  placeholder="6"
                />
              </div>
              <div>
                <label htmlFor="rollNumber">Roll number</label>
                <input
                  id="rollNumber"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="field-control"
                  placeholder="CS2026-014"
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
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label htmlFor="interests">Interests</label>
              <input
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field-control"
                placeholder="Web development, AI, product design"
              />
            </div>

            <div>
              <label htmlFor="careerGoals">Career goals</label>
              <textarea
                id="careerGoals"
                name="careerGoals"
                value={formData.careerGoals}
                onChange={handleChange}
                disabled={isSubmitting}
                rows="3"
                className="field-control"
                placeholder="Describe the kind of roles or growth you are aiming for."
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
                placeholder="Write a short introduction."
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
                  placeholder="Bengaluru, India"
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

            {errorMessage && <p className="alert-error" role="alert" aria-live="polite">{errorMessage}</p>}
            {successMessage && <p className="alert-success" role="alert" aria-live="polite">{successMessage}</p>}

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
        )}
      </section>
    </div>
  );
}

export default StudentProfilePage;
