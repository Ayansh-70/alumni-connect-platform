import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { resetPasswordRequest } from '../../api/auth.js';
import PasswordChecklist, { validatePasswordStrength } from '../../components/ui/PasswordChecklist.jsx';

function ResetPasswordPage() {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isPasswordValid = validatePasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      setErrorMessage('Please ensure your password meets all requirements.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await resetPasswordRequest(token, formData.password);
      setIsSuccess(true);
    } catch (error) {
      setErrorMessage(error.userMessage || 'The reset link is invalid or has expired. Please request a new one.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-display font-bold tracking-tight text-text-primary">
          Create new password
        </h2>
        <p className="mt-2 text-center text-body text-text-secondary">
          Your new password must be different from previous used passwords.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="surface-card p-8">
          {isSuccess ? (
            <div className="animate-fadeInUp text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-2xl text-success">
                ✓
              </div>
              <h3 className="mb-2 text-section font-bold text-text-primary">Password reset complete</h3>
              <p className="mb-6 text-body text-text-secondary">
                Your password has been successfully updated. You can now log in with your new password.
              </p>
              <Link to="/login" className="btn-primary w-full text-center py-2.5">
                Go to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="animate-fadeInUp alert-error" role="alert" aria-live="polite">
                  {errorMessage}
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="mb-0">
                    New Password
                  </label>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-badge font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control"
                  />
                </div>
                <PasswordChecklist password={formData.password} />
              </div>

              <div>
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-2.5"
                >
                  {isSubmitting ? 'Resetting password...' : 'Reset password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
