import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';

function InstituteAdminDashboardPage() {
  const actions = [
    {
      title: 'Manage Students',
      description: 'View current student users and update their account status.',
      to: '/institute-admin/students'
    },
    {
      title: 'Manage Alumni',
      description: 'View current alumni users and update their account status.',
      to: '/institute-admin/alumni'
    },
    {
      title: 'Create Student',
      description: 'Create a new student account with a temporary password.',
      to: '/institute-admin/students/create'
    },
    {
      title: 'Create Alumni',
      description: 'Create a new alumni account with a temporary password.',
      to: '/institute-admin/alumni/create'
    }
  ];

  return (
    <div>
      <PageHeader
        eyebrow="INSTITUTE_ADMIN"
        title="Institute admin dashboard"
        description="Manage student and alumni users for your institute from one place."
      />

      <section className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-300 hover:shadow"
          >
            <h2 className="text-xl font-semibold text-slate-950">{action.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{action.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default InstituteAdminDashboardPage;
