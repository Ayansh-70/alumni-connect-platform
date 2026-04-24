import PageHeader from '../../components/ui/PageHeader.jsx';

function LoginPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Account access"
        title="Sign in to AlumniConnect"
        description="Authentication wiring will be added with JWT-backed role access in the next build phase."
      />

      <form className="max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-slate-700" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          placeholder="you@example.com"
        />

        <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          placeholder="Enter your password"
        />

        <button type="button" className="mt-6 w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900">
          Sign in
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
