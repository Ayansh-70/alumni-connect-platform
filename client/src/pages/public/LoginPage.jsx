import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-6 text-sm text-slate-600 shadow-xl shadow-slate-900/5 backdrop-blur">
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
    <div className="grid min-h-[calc(100vh-11rem)] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_52%,#38bdf8_100%)] p-8 text-white shadow-2xl shadow-brand-900/15 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_30%)]" />
        <div className="relative max-w-xl">
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">
            Verified institute network
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome back to the trusted alumni-student community.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-sky-50/90">
            Sign in to continue building verified alumni relationships, manage requests, and stay connected with institute
            opportunities, announcements, and events.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: 'Verified people', text: 'Institute-scoped profiles and role-based access keep networking reliable.' },
              { title: 'Career support', text: 'Connections, guidance, and referrals stay organized in one place.' },
              { title: 'Campus updates', text: 'Opportunities, announcements, and events remain easy to discover.' }
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-sky-50/80">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-md rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">Sign in</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Access your workspace</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use your registered institute email and password. You'll be redirected to the right dashboard automatically.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <label className="block text-sm font-medium text-slate-700" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-100"
            placeholder="you@example.com"
            autoComplete="email"
          />

          <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-100"
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          {formError ? (
            <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {formError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <Link to="/" className="mt-6 inline-flex text-sm font-medium text-slate-600 transition hover:text-slate-950">
          {'<-'} Back to home
        </Link>
      </section>
    </div>
  );
}

export default LoginPage;
