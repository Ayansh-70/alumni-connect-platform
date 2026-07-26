import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { createAlumniOpportunityRequest } from '../../api/alumniOpportunities.js';

const OPPORTUNITY_TYPES = [
  'INTERNSHIP',
  'JOB',
  'REFERRAL',
  'HACKATHON',
  'SCHOLARSHIP',
  'PROJECT',
  'HIGHER_STUDIES',
  'OTHER'
];

const OPPORTUNITY_MODES = ['REMOTE', 'ONSITE', 'HYBRID'];

const INITIAL_FORM_DATA = {
  title: '',
  description: '',
  type: 'INTERNSHIP',
  company: '',
  role: '',
  location: '',
  mode: 'REMOTE',
  eligibility: '',
  skillsRequired: '',
  applicationLink: '',
  deadline: ''
};

function CreateOpportunityPage() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      const response = await createAlumniOpportunityRequest(formData);
      setSuccessMessage(response.message || 'Opportunity created successfully and sent for approval.');
      setFormData(INITIAL_FORM_DATA);
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to create opportunity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="ALUMNI"
        title="Post opportunity"
        description="Share an opportunity with your institute. It will stay pending until an institute admin reviews it."
      />

      <section className="surface-card max-w-4xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
              className="field-control"
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              rows="4"
              className="field-control"
              placeholder="Detail the responsibilities and requirements..."
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field-control"
              >
                {OPPORTUNITY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="mode">Mode</label>
              <select
                id="mode"
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field-control"
              >
                {OPPORTUNITY_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field-control"
                placeholder="e.g. Google"
              />
            </div>
            
            <div>
              <label htmlFor="role">Role</label>
              <input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field-control"
                placeholder="e.g. SDE-1"
              />
            </div>
            
            <div>
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field-control"
                placeholder="e.g. Bangalore"
              />
            </div>
            
            <div>
              <label htmlFor="deadline">Deadline</label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field-control"
              />
            </div>
          </div>

          <div>
            <label htmlFor="eligibility">Eligibility</label>
            <textarea
              id="eligibility"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              disabled={isSubmitting}
              rows="2"
              className="field-control"
              placeholder="e.g. 2024 graduates with minimum 7.5 CGPA"
            />
          </div>

          <div>
            <label htmlFor="skillsRequired">Skills required</label>
            <input
              id="skillsRequired"
              name="skillsRequired"
              value={formData.skillsRequired}
              onChange={handleChange}
              disabled={isSubmitting}
              className="field-control"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div>
            <label htmlFor="applicationLink">Application link</label>
            <input
              id="applicationLink"
              name="applicationLink"
              value={formData.applicationLink}
              onChange={handleChange}
              disabled={isSubmitting}
              className="field-control"
              placeholder="https://company.com/apply"
            />
          </div>

          {errorMessage && <p className="alert-error" role="alert" aria-live="polite">{errorMessage}</p>}
          {successMessage && <p className="alert-success" role="alert" aria-live="polite">{successMessage}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Posting...' : 'Post Opportunity'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateOpportunityPage;
