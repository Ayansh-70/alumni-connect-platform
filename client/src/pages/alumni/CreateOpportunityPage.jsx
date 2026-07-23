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

      <section className="surface-card max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Title
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
              className="field-control mt-2"
              placeholder="e.g. Frontend Developer"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              rows="4"
              className="field-control mt-2"
              placeholder="Detail the responsibilities and requirements..."
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Type
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field-control mt-2"
              >
                {OPPORTUNITY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Mode
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field-control mt-2"
              >
                {OPPORTUNITY_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Company
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field-control mt-2"
                placeholder="e.g. Google"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Role
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field-control mt-2"
                placeholder="e.g. SDE-1"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Location
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field-control mt-2"
                placeholder="e.g. Bangalore"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Deadline
              <input
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field-control mt-2"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Eligibility
            <textarea
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              disabled={isSubmitting}
              rows="2"
              className="field-control mt-2"
              placeholder="e.g. 2024 graduates with minimum 7.5 CGPA"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Skills required
            <input
              name="skillsRequired"
              value={formData.skillsRequired}
              onChange={handleChange}
              disabled={isSubmitting}
              className="field-control mt-2"
              placeholder="React, Node.js, MongoDB"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Application link
            <input
              name="applicationLink"
              value={formData.applicationLink}
              onChange={handleChange}
              disabled={isSubmitting}
              className="field-control mt-2"
              placeholder="https://company.com/apply"
            />
          </label>

          {errorMessage && <p className="alert-error" role="alert" aria-live="polite">{errorMessage}</p>}
          {successMessage && <p className="alert-success" role="alert" aria-live="polite">{successMessage}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Posting...' : 'Post Opportunity'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default CreateOpportunityPage;
