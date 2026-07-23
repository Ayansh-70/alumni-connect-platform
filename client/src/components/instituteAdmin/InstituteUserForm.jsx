import { useState } from 'react';

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  password: ''
};

function InstituteUserForm({ title, description, submitLabel, onSubmit }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setFormError('Name, email, and password are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      setSuccessMessage(response.message || 'User created successfully.');
      setFormData(INITIAL_FORM_STATE);
    } catch (error) {
      setFormError(error.userMessage || 'Unable to create user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="surface-card max-w-2xl p-8">
      <div className="mb-6">
        <p className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
          Quick Create
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            className="field-control mt-2"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            className="field-control mt-2"
            placeholder="user@institute.edu"
          />
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700" htmlFor="password">
              Temporary password
            </label>
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[0.68rem] font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            className="field-control mt-2"
            placeholder="Minimum 6 characters"
          />
        </div>

        {formError ? (
          <p className="alert-error" role="alert" aria-live="polite">{formError}</p>
        ) : null}

        {successMessage ? (
          <p className="alert-success" role="alert" aria-live="polite">{successMessage}</p>
        ) : null}

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2">
          <p className="text-xs text-slate-500">New accounts inherit institute access automatically.</p>
          <button type="submit" disabled={isSubmitting} className="btn-primary min-w-36">
            {isSubmitting ? 'Submitting...' : submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
}

export default InstituteUserForm;
