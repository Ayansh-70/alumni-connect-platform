import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchStudentAlumniRequest } from '../../api/studentAlumni.js';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';

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

      <section className="surface-card p-6 md:p-8">
        <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="text-sm font-medium text-slate-700">
            Branch
            <input
              name="branch"
              value={filters.branch}
              onChange={handleChange}
              className="field-control mt-2"
              placeholder="CSE"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Batch
            <input
              name="batch"
              value={filters.batch}
              onChange={handleChange}
              className="field-control mt-2"
              placeholder="2020"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Company
            <input
              name="company"
              value={filters.company}
              onChange={handleChange}
              className="field-control mt-2"
              placeholder="Infosys"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Skill
            <input
              name="skill"
              value={filters.skill}
              onChange={handleChange}
              className="field-control mt-2"
              placeholder="React"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Domain
            <input
              name="domain"
              value={filters.domain}
              onChange={handleChange}
              className="field-control mt-2"
              placeholder="Web Development"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Location
            <input
              name="location"
              value={filters.location}
              onChange={handleChange}
              className="field-control mt-2"
              placeholder="Jaipur"
            />
          </label>

          <div className="flex flex-wrap gap-3 md:col-span-2 xl:col-span-3">
            <button type="submit" className="btn-primary">
              Search alumni
            </button>
            <button type="button" onClick={handleClear} className="btn-secondary">
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
          <LoadingState message="Loading verified alumni..." className="mt-6" />
        ) : results.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No alumni matched your search"
              description="Try clearing one or two filters to broaden the results across your institute network."
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {results.map((alumni) => (
              <article key={alumni._id} className="content-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{alumni.user?.name}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {alumni.currentRole} at {alumni.currentCompany}
                    </p>
                  </div>
                  <StatusBadge value={alumni.verificationStatus} />
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
                  className="btn-primary mt-4"
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
