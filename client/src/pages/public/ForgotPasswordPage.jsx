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
        <h2 className="mt-6 text-center text-display font-bold tracking-tight text-text-primary">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-body text-text-secondary">
          Or{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
            return to login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="surface-card p-8">
          {isSuccess ? (
            <div className="animate-fadeInUp text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-2xl text-success">
                ✓
              </div>
              <h3 className="mb-2 text-section font-bold text-text-primary">Check your inbox</h3>
              <p className="mb-6 text-body text-text-secondary">
                If an account exists with that email, we have sent password reset instructions to your inbox. The link will expire in 1 hour.
              </p>
              <Link to="/login" className="btn-primary w-full text-center py-2.5">
                Return to Login
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
                <label htmlFor="email">
                  Email address
                </label>
                <div>
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
                    disabled={isSubmitting}
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
