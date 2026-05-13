import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="surface-card mx-auto max-w-3xl px-6 py-10 text-center sm:px-8 sm:py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Page not found</h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
        The page you are trying to reach does not exist or may have been moved. Use the navigation to return to a valid workspace page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-secondary">
          Go to home
        </Link>
        <Link to="/login" className="btn-primary">
          Go to login
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
