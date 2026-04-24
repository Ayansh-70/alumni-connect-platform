import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';

function LandingPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Verified institute network"
        title="Connect students with trusted alumni mentors and opportunities."
        description="AlumniConnect helps institutes manage verified students and alumni, while students discover active alumni for guidance, referrals, and career support."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {['Institute-led verification', 'Student alumni discovery', 'Mentorship and opportunities'].map((item) => (
          <div key={item} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">{item}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Placeholder module ready for the MVP implementation phase.
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/login" className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900">
          Sign in
        </Link>
        <Link
          to="/institutes/register"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
        >
          Register institute
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
