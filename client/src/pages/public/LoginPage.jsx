import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LoadingState from '../../components/ui/LoadingState.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getDashboardPathForRole } from '../../utils/auth.js';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <LoadingState message="Checking your session..." className="mx-auto max-w-md border-slate-800 bg-slate-900/70" />
      </div>
    );
  }

  if (!isLoading && isAuthenticated && user) {
    return <Navigate to={getDashboardPathForRole(user.role)} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!email.trim() || !password.trim()) {
      setFormError('Email and password are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const authenticatedUser = await login({
        email: email.trim(),
        password
      });

      const fallbackPath = getDashboardPathForRole(authenticatedUser.role);
      const requestedPath = location.state?.from?.pathname;
      const shouldUseRequestedPath = requestedPath && requestedPath !== '/login';

      navigate(shouldUseRequestedPath ? requestedPath : fallbackPath, { replace: true });
    } catch (error) {
      setFormError(error.userMessage || 'Invalid login credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[90vh] items-center justify-center bg-bg-base px-4 py-10">
      <section className="relative w-full max-w-md surface-card p-8 sm:p-10">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
            AC
          </span>
          <p className="mt-5 text-badge font-bold uppercase tracking-wider text-primary">AlumniConnect</p>
          <h1 className="mt-3 text-display font-bold tracking-tight text-text-primary">Sign in to your workspace</h1>
          <p className="mt-3 text-body text-text-secondary">
            Verified institute networking for students, alumni, and administrators.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled={isSubmitting}
              onChange={(event) => setEmail(event.target.value)}
              className="field-control"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="mb-0">
                Password
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-badge font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                <Link to="/forgot-password" className="text-caption font-medium text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            disabled={isSubmitting}
            onChange={(event) => setPassword(event.target.value)}
            className="field-control"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>

          {formError ? (
            <p className="alert-error mt-4" role="alert" aria-live="polite">{formError}</p>
          ) : null}

          <button type="submit" disabled={isSubmitting} className="btn-primary mt-6 w-full py-3.5">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3">
          <Link to="/register-institute" className="text-button font-medium text-text-secondary hover:text-text-primary transition-colors">
            Register your institute
          </Link>
          <Link to="/" className="text-button font-medium text-text-muted hover:text-text-primary transition-colors">
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
