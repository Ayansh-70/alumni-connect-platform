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

      <section className="max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Title
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              placeholder="Software Engineering Internship"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              placeholder="Describe the opportunity and the role."
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Type
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
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
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
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
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                placeholder="Tech Company"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Role
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                placeholder="Backend Intern"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Location
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                placeholder="Bengaluru"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Deadline
              <input
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Eligibility
            <textarea
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              rows="3"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              placeholder="Eligible branches, batches, or qualifications"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Skills required
            <input
              name="skillsRequired"
              value={formData.skillsRequired}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              placeholder="React, Node.js, SQL"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Application link
            <input
              name="applicationLink"
              value={formData.applicationLink}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              placeholder="https://company.com/apply"
            />
          </label>

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
            {isSubmitting ? 'Posting...' : 'Post Opportunity'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default CreateOpportunityPage;
