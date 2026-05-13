import { useState } from 'react';
import { registerInstituteRequest } from '../../api/institutes.js';
import PageHeader from '../../components/ui/PageHeader.jsx';

function InstituteRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'country', 'description'];
    const hasMissingFields = requiredFields.some((field) => !formData[field].trim());

    if (hasMissingFields) {
      setErrorMessage('Please fill in all required institute details.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerInstituteRequest(formData);
      setSuccessMessage(response.message || 'Institute registration submitted successfully.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        city: '',
        state: '',
        country: '',
        description: ''
      });
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to submit institute registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Institute onboarding"
        title="Register an institute"
        description="Submit your institute details for review. A super admin will approve or reject the request."
      />

      {errorMessage ? (
        <p className="alert-error mb-4 max-w-2xl">{errorMessage}</p>
      ) : null}

      {successMessage ? (
        <p className="alert-success mb-4 max-w-2xl">{successMessage}</p>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="surface-card grid max-w-3xl gap-4 p-6 sm:grid-cols-2 md:p-8"
      >
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="name">
            Institute name
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="field-control mt-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="email">
            Institute email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="field-control mt-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="field-control mt-2"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="website">
            Website
          </label>
          <input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="field-control mt-2"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="field-control mt-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="city">
            City
          </label>
          <input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="field-control mt-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="state">
            State
          </label>
          <input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="field-control mt-2"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="country">
            Country
          </label>
          <input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="field-control mt-2"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className="field-control mt-2"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary sm:col-span-2"
        >
          {isSubmitting ? 'Submitting...' : 'Submit registration'}
        </button>
      </form>
    </div>
  );
}

export default InstituteRegisterPage;
