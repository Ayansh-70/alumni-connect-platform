import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="content-card mx-auto max-w-3xl p-10 text-center mt-12">
      <p className="text-badge font-bold uppercase tracking-wider text-brand-600">404</p>
      <h1 className="mt-4 text-display font-bold tracking-tight text-text-primary">Page not found</h1>
      <p className="mx-auto mt-4 max-w-xl text-body leading-relaxed text-text-secondary">
        The page you are trying to reach does not exist or may have been moved. Use the navigation to return to a valid workspace page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/" className="btn-secondary px-8">
          Go to home
        </Link>
        <Link to="/login" className="btn-primary px-8">
          Go to login
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
