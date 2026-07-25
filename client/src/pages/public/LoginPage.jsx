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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#020617_0%,#0f172a_48%,#111827_100%)] px-4 py-10 text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent" />
      <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

      <section className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.08] p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-10">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 dark:border-slate-800 text-sm font-black text-slate-950 shadow-xl shadow-brand-500/20">
            AC
          </span>
          <p className="mt-5 text-sm font-black uppercase tracking-[0.22em] text-brand-200">AlumniConnect</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white">Sign in to your workspace</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Verified institute networking for students, alumni, and administrators.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <label htmlFor="email" className="text-slate-300">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            disabled={isSubmitting}
            onChange={(event) => setEmail(event.target.value)}
            className="field-control mt-2 border-white/10 bg-white/10 text-white placeholder:text-slate-500 focus:bg-white/15"
            placeholder="you@example.com"
            autoComplete="email"
          />

          <div className="mt-5 flex items-center justify-between">
            <label className="text-slate-300" htmlFor="password">
              Password
            </label>
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[0.68rem] font-bold uppercase tracking-wider text-brand-400 hover:text-brand-300 transition-colors">
                {showPassword ? 'Hide' : 'Show'}
              </button>
              <Link to="/forgot-password" className="text-[0.8rem] font-medium text-brand-400 hover:text-brand-300 transition-colors">
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
            className="field-control mt-2 border-white/10 bg-white/10 text-white placeholder:text-slate-500 focus:bg-white/15"
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          {formError ? (
            <p className="alert-error mt-4" role="alert" aria-live="polite">{formError}</p>
          ) : null}

          <button type="submit" disabled={isSubmitting} className="btn-primary mt-6 w-full py-3.5">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3">
          <Link to="/register-institute" className="inline-flex w-full justify-center text-sm font-semibold text-slate-400 transition hover:text-white">
            Register your institute
          </Link>
          <Link to="/" className="inline-flex w-full justify-center text-sm font-medium text-slate-500 transition hover:text-white">
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
