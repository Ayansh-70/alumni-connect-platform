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
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create new password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Your new password must be different from previous used passwords.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="surface-card p-8">
          {isSuccess ? (
            <div className="animate-fadeInUp text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600 shadow-lg shadow-emerald-500/20 mb-6">
                ✓
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Password reset complete</h3>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400 mb-6">
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
                <div className="flex justify-between items-center">
                  <label className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="password">
                    New Password
                  </label>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[0.68rem] font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="mt-2">
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
                <label className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="mt-2">
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
