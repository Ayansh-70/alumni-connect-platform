import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchStudentAlumniRequest } from '../../api/studentAlumni.js';
import PageHeader from '../../components/ui/PageHeader.jsx';

const INITIAL_FILTERS = {
  branch: '',
  batch: '',
  company: '',
  skill: '',
  domain: '',
  location: ''
};

function StudentAlumniSearchPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadResults = async (params = {}) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await searchStudentAlumniRequest(params);
      setResults(response.data?.alumni || []);
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to search alumni.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    const cleanedFilters = Object.fromEntries(
      Object.entries(filters)
        .map(([key, value]) => [key, value.trim()])
        .filter(([, value]) => value)
    );

    await loadResults(cleanedFilters);
  };

  const handleClear = async () => {
    setFilters(INITIAL_FILTERS);
    await loadResults();
  };

  return (
    <div>
      <PageHeader
        eyebrow="STUDENT"
        title="Search alumni"
        description="Browse verified alumni from your own institute using simple filters like branch, company, skill, and location."
      />

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="text-sm font-medium text-slate-700">
            Branch
            <input
              name="branch"
              value={filters.branch}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              placeholder="CSE"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Batch
            <input
              name="batch"
              value={filters.batch}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              placeholder="2020"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Company
            <input
              name="company"
              value={filters.company}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              placeholder="Infosys"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Skill
            <input
              name="skill"
              value={filters.skill}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              placeholder="React"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Domain
            <input
              name="domain"
              value={filters.domain}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              placeholder="Web Development"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Location
            <input
              name="location"
              value={filters.location}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              placeholder="Jaipur"
            />
          </label>

          <div className="flex flex-wrap gap-3 md:col-span-2 xl:col-span-3">
            <button
              type="submit"
              className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900"
            >
              Search alumni
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Clear filters
            </button>
          </div>
        </form>

        {errorMessage ? (
          <p className="mt-6 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        {isLoading ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Loading verified alumni...
          </div>
        ) : results.length === 0 ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No verified alumni matched your filters.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {results.map((alumni) => (
              <article key={alumni._id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{alumni.user?.name}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {alumni.currentRole} at {alumni.currentCompany}
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {alumni.verificationStatus}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-slate-600">
                  <p>Branch: {alumni.branch}</p>
                  <p>Batch: {alumni.batch}</p>
                  <p>Skills: {alumni.skills?.join(', ') || 'Not provided'}</p>
                  <p>Domain: {alumni.domain || 'Not provided'}</p>
                  <p>Location: {alumni.location || 'Not provided'}</p>
                  <p>Referral support: {alumni.canProvideReferral ? 'Yes' : 'No'}</p>
                  <p>Mentoring: {alumni.canMentor ? 'Yes' : 'No'}</p>
                </div>

                <Link
                  to={`/student/alumni/${alumni._id}`}
                  className="mt-4 inline-flex rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900"
                >
                  View details
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentAlumniSearchPage;
