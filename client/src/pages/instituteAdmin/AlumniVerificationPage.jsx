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
          <p className="text-sm text-slate-600">Only pending alumni profiles from your institute appear here.</p>
          <button
            type="button"
            onClick={loadProfiles}
            className="btn-secondary"
          >
            Refresh list
          </button>
        </div>

        {errorMessage ? (
          <p className="alert-error mt-4">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="alert-success mt-4">
            {successMessage}
          </p>
        ) : null}

        {isLoading ? (
          <LoadingState message="Loading pending alumni profiles..." className="mt-6" />
        ) : profiles.length === 0 ? (
          <EmptyState title="No pending alumni verification" description="Alumni profiles waiting for review will appear here." />
        ) : (
          <div className="mt-6 space-y-4">
            {profiles.map((profile) => (
              <article key={profile._id} className="content-card">
                <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                  <p className="text-base font-semibold text-slate-950">{profile.user?.name}</p>
                  <p>{profile.user?.email}</p>
                  <p>Branch: {profile.branch}</p>
                  <p>Batch: {profile.batch}</p>
                  <p>Company: {profile.currentCompany}</p>
                  <p>Role: {profile.currentRole}</p>
                  <p>Experience: {profile.experienceYears} years</p>
                  <p>Domain: {profile.domain || 'Not provided'}</p>
                  <p>Location: {profile.location || 'Not provided'}</p>
                  <p>Referral support: {profile.canProvideReferral ? 'Yes' : 'No'}</p>
                  <p>Mentoring: {profile.canMentor ? 'Yes' : 'No'}</p>
                  <p>Skills: {profile.skills?.join(', ') || 'Not provided'}</p>
                </div>

                <p className="mt-3 text-sm text-slate-600">{profile.bio || 'No bio provided yet.'}</p>

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
