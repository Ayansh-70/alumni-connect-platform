import { Link } from 'react-router-dom';
import { ArrowRight, Building, GraduationCap, Users } from 'lucide-react';

function LandingPage() {
  return (
    <div className="flex flex-col gap-12 md:gap-24 py-12 md:py-20 text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-display font-semibold tracking-tight text-text-primary mb-6">
          Connect students with trusted alumni mentors and opportunities.
        </h1>
        <p className="text-section text-text-secondary leading-relaxed mb-10 max-w-2xl mx-auto">
          AlumniConnect helps institutes manage verified students and alumni, while students discover active alumni for guidance, referrals, and career support.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/login" className="btn-primary px-8 py-3 text-body font-semibold flex items-center gap-2">
            Sign in
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/register-institute"
            className="btn-secondary px-8 py-3 text-body font-semibold"
          >
            Register institute
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto px-4 text-left">
        {[
          {
            icon: <Building className="w-6 h-6 text-brand-600 mb-4" />,
            title: 'Institute-led verification',
            description: 'Every alumni and student journey stays grounded in institute-level approval and role-based access.'
          },
          {
            icon: <Users className="w-6 h-6 text-brand-600 mb-4" />,
            title: 'Career discovery',
            description: 'Students can browse alumni, request guidance, and explore approved opportunities with confidence.'
          },
          {
            icon: <GraduationCap className="w-6 h-6 text-brand-600 mb-4" />,
            title: 'Shared campus updates',
            description: 'Announcements, events, and notifications help the whole network stay aligned and active.'
          }
        ].map((item) => (
          <div key={item.title} className="content-card p-8">
            {item.icon}
            <h2 className="text-section font-semibold text-text-primary">{item.title}</h2>
            <p className="mt-3 text-body leading-relaxed text-text-secondary">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
