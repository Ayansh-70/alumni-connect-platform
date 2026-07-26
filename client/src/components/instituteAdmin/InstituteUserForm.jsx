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
        <p className="inline-flex rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-badge font-semibold uppercase tracking-wider text-primary">
          Quick Create
        </p>
        <h2 className="mt-4 text-section font-bold text-text-primary">{title}</h2>
        <p className="mt-2 max-w-xl text-body leading-6 text-text-secondary">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name">
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
          <label htmlFor="email">
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
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="mb-0">
              Temporary password
            </label>
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-badge font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
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

        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-caption text-text-muted">New accounts inherit institute access automatically.</p>
          <button type="submit" disabled={isSubmitting} className="btn-primary min-w-36">
            {isSubmitting ? 'Submitting...' : submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
}

export default InstituteUserForm;
