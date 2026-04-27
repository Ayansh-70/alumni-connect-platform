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
        {[
          {
            title: 'Institute-led verification',
            description: 'Every alumni and student journey stays grounded in institute-level approval and role-based access.'
          },
          {
            title: 'Career discovery',
            description: 'Students can browse alumni, request guidance, and explore approved opportunities with confidence.'
          },
          {
            title: 'Shared campus updates',
            description: 'Announcements, events, and notifications help the whole network stay aligned and active.'
          }
        ].map((item) => (
          <div key={item.title} className="surface-card p-5">
            <h2 className="text-base font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/login" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-brand-700">
          Sign in
        </Link>
        <Link
          to="/institutes/register"
          className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          Register institute
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
