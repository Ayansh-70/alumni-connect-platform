import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getDashboardPathForRole } from '../../utils/auth.js';
import PageHeader from '../../components/ui/PageHeader.jsx';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Checking your session...
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
    <div>
      <PageHeader
        eyebrow="Account access"
        title="Sign in to AlumniConnect"
        description="Access the verified institute network with your registered email and password."
      />

      <form onSubmit={handleSubmit} className="max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-slate-700" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          placeholder="you@example.com"
          autoComplete="email"
        />

        <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        {formError ? (
          <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
