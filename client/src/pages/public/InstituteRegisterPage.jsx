import PageHeader from '../../components/ui/PageHeader.jsx';

function InstituteRegisterPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Institute onboarding"
        title="Register an institute"
        description="Institute approval workflow placeholders are ready for the backend institute module."
      />

      <form className="grid max-w-2xl gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="instituteName">
            Institute name
          </label>
          <input id="instituteName" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="adminName">
            Admin name
          </label>
          <input id="adminName" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="adminEmail">
            Admin email
          </label>
          <input id="adminEmail" type="email" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <button type="button" className="sm:col-span-2 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900">
          Submit registration
        </button>
      </form>
    </div>
  );
}

export default InstituteRegisterPage;
