import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordRequest } from '../../api/auth.js';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await forgotPasswordRequest(email.trim());
      setIsSuccess(true);
    } catch (error) {
      setErrorMessage(error.userMessage || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Or{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400">
            return to login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="surface-card p-8">
          {isSuccess ? (
            <div className="animate-fadeInUp text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600 shadow-lg shadow-emerald-500/20 mb-6">
                ✓
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Check your inbox</h3>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400 mb-6">
                If an account exists with that email, we have sent password reset instructions to your inbox. The link will expire in 1 hour.
              </p>
              <Link to="/login" className="btn-primary w-full text-center py-2.5">
                Return to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="animate-fadeInUp alert-error">
                  {errorMessage}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="field-control"
                    placeholder="Enter your registered email"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-2.5"
                >
                  {isSubmitting ? 'Sending instructions...' : 'Send reset instructions'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
