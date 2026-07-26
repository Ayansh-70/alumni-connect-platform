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
        <form onSubmit={handleSearch} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <label htmlFor="branch">Branch</label>
            <input
              id="branch"
              name="branch"
              value={filters.branch}
              onChange={handleChange}
              className="field-control"
              placeholder="CSE"
            />
          </div>
          <div>
            <label htmlFor="batch">Batch</label>
            <input
              id="batch"
              name="batch"
              value={filters.batch}
              onChange={handleChange}
              className="field-control"
              placeholder="2020"
            />
          </div>
          <div>
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              value={filters.company}
              onChange={handleChange}
              className="field-control"
              placeholder="Infosys"
            />
          </div>
          <div>
            <label htmlFor="skill">Skill</label>
            <input
              id="skill"
              name="skill"
              value={filters.skill}
              onChange={handleChange}
              className="field-control"
              placeholder="React"
            />
          </div>
          <div>
            <label htmlFor="domain">Domain</label>
            <input
              id="domain"
              name="domain"
              value={filters.domain}
              onChange={handleChange}
              className="field-control"
              placeholder="Web Development"
            />
          </div>
          <div>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              value={filters.location}
              onChange={handleChange}
              className="field-control"
              placeholder="Jaipur"
            />
          </div>

          <div className="flex flex-wrap gap-3 md:col-span-2 xl:col-span-3 pt-2">
            <button type="submit" className="btn-primary">
              Search alumni
            </button>
            <button type="button" onClick={handleClear} className="btn-secondary">
              Clear filters
            </button>
          </div>
        </form>

        {errorMessage ? (
          <p className="alert-error mt-6" role="alert" aria-live="polite">
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
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((alumni) => (
              <article key={alumni._id} className="content-card flex flex-col p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-section font-semibold text-text-primary">{alumni.user?.name}</h2>
                    <p className="mt-1 text-caption text-text-secondary">
                      {alumni.currentRole} at {alumni.currentCompany}
                    </p>
                  </div>
                  <StatusBadge value={alumni.verificationStatus} />
                </div>

                <div className="grid gap-3 text-body text-text-secondary grow">
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Branch</span> <span className="font-medium text-text-primary">{alumni.branch}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Batch</span> <span className="font-medium text-text-primary">{alumni.batch}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Domain</span> <span className="font-medium text-text-primary">{alumni.domain || 'Not provided'}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Location</span> <span className="font-medium text-text-primary">{alumni.location || 'Not provided'}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Referral support</span> <span className="font-medium text-text-primary">{alumni.canProvideReferral ? 'Yes' : 'No'}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Mentoring</span> <span className="font-medium text-text-primary">{alumni.canMentor ? 'Yes' : 'No'}</span></p>
                  <p className="col-span-full"><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Skills</span> <span className="font-medium text-text-primary">{alumni.skills?.join(', ') || 'Not provided'}</span></p>
                </div>

                <Link
                  to={`/student/alumni/${alumni._id}`}
                  className="btn-primary mt-6 w-full justify-center"
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
