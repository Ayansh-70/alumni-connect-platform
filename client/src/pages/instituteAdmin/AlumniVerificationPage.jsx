import { useEffect, useState } from 'react';
import {
  getPendingAlumniProfilesRequest,
  rejectAlumniProfileRequest,
  verifyAlumniProfileRequest
} from '../../api/instituteAdminAlumniProfiles.js';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

function AlumniVerificationPage() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeProfileId, setActiveProfileId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rejectionReasons, setRejectionReasons] = useState({});

  const loadProfiles = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await getPendingAlumniProfilesRequest();
      setProfiles(response.data?.profiles || []);
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to load pending alumni profiles.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleReasonChange = (profileId, value) => {
    setRejectionReasons((current) => ({
      ...current,
      [profileId]: value
    }));
  };

  const handleVerify = async (profileId) => {
    setActiveProfileId(profileId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await verifyAlumniProfileRequest(profileId);
      setProfiles((current) => current.filter((profile) => profile._id !== profileId));
      setSuccessMessage(response.message || 'Alumni profile verified successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to verify alumni profile.');
    } finally {
      setActiveProfileId('');
    }
  };

  const handleReject = async (profileId) => {
    const reason = rejectionReasons[profileId] || '';

    setActiveProfileId(profileId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await rejectAlumniProfileRequest(profileId, reason);
      setProfiles((current) => current.filter((profile) => profile._id !== profileId));
      setSuccessMessage(response.message || 'Alumni profile rejected successfully.');
      setRejectionReasons((current) => ({ ...current, [profileId]: '' }));
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to reject alumni profile.');
    } finally {
      setActiveProfileId('');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="INSTITUTE_ADMIN"
        title="Alumni verification"
        description="Review alumni profile submissions from your institute and verify or reject them with a reason."
      />

      <section className="surface-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body text-text-secondary">Only pending alumni profiles from your institute appear here.</p>
          <button
            type="button"
            onClick={loadProfiles}
            className="btn-secondary"
          >
            Refresh list
          </button>
        </div>

        {errorMessage ? (
          <p className="alert-error mt-4" role="alert" aria-live="polite">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="alert-success mt-4" role="alert" aria-live="polite">
            {successMessage}
          </p>
        ) : null}

        {isLoading ? (
          <LoadingState message="Loading pending alumni profiles..." className="mt-6" />
        ) : profiles.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No pending alumni verification" description="Alumni profiles waiting for review will appear here." />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {profiles.map((profile) => (
              <article key={profile._id} className="content-card p-6">
                <div className="grid gap-4 text-body text-text-secondary md:grid-cols-2">
                  <p className="text-section font-semibold text-text-primary col-span-full">{profile.user?.name}</p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Email</span> <span className="font-medium text-text-primary">{profile.user?.email}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Branch</span> <span className="font-medium text-text-primary">{profile.branch}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Batch</span> <span className="font-medium text-text-primary">{profile.batch}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Company</span> <span className="font-medium text-text-primary">{profile.currentCompany}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Role</span> <span className="font-medium text-text-primary">{profile.currentRole}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Experience</span> <span className="font-medium text-text-primary">{profile.experienceYears} years</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Domain</span> <span className="font-medium text-text-primary">{profile.domain || 'Not provided'}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Location</span> <span className="font-medium text-text-primary">{profile.location || 'Not provided'}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Referral support</span> <span className="font-medium text-text-primary">{profile.canProvideReferral ? 'Yes' : 'No'}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Mentoring</span> <span className="font-medium text-text-primary">{profile.canMentor ? 'Yes' : 'No'}</span></p>
                  <p className="col-span-full"><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Skills</span> <span className="font-medium text-text-primary">{profile.skills?.join(', ') || 'Not provided'}</span></p>
                </div>

                <div className="mt-4">
                  <span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Bio</span>
                  <p className="text-body font-medium text-text-primary">{profile.bio || 'No bio provided yet.'}</p>
                </div>

                <textarea
                  value={rejectionReasons[profile._id] || ''}
                  onChange={(event) => handleReasonChange(profile._id, event.target.value)}
                  disabled={activeProfileId === profile._id}
                  rows="3"
                  className="field-control mt-4"
                  placeholder="Enter a rejection reason if you need to reject this alumni profile."
                />

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={activeProfileId === profile._id}
                    onClick={() => handleVerify(profile._id)}
                    className="btn-success"
                  >
                    {activeProfileId === profile._id ? 'Processing...' : 'Verify'}
                  </button>
                  <button
                    type="button"
                    disabled={activeProfileId === profile._id}
                    onClick={() => handleReject(profile._id)}
                    className="btn-danger"
                  >
                    {activeProfileId === profile._id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AlumniVerificationPage;
