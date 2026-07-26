import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import {
  createInstituteAnnouncementRequest,
  deleteInstituteAnnouncementRequest,
  getInstituteAnnouncementsRequest,
  toggleInstituteAnnouncementStatusRequest,
  updateInstituteAnnouncementRequest
} from '../../api/instituteAdminAnnouncements.js';

const CATEGORIES = ['GENERAL', 'ACADEMIC', 'PLACEMENT', 'ALUMNI', 'EVENT', 'URGENT', 'OTHER'];
const AUDIENCES = ['STUDENTS', 'ALUMNI', 'BOTH'];

const INITIAL_FORM = {
  title: '',
  message: '',
  category: 'GENERAL',
  audience: 'BOTH'
};

function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadAnnouncements = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await getInstituteAnnouncementsRequest();
      setAnnouncements(response.data?.announcements || []);
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to load announcements.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setEditingId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setActiveId(editingId || 'creating');

    try {
      const response = editingId
        ? await updateInstituteAnnouncementRequest(editingId, formData)
        : await createInstituteAnnouncementRequest(formData);

      const announcement = response.data?.announcement;

      if (announcement) {
        setAnnouncements((current) =>
          editingId
            ? current.map((item) => (item._id === announcement._id ? announcement : item))
            : [announcement, ...current]
        );
      }

      setSuccessMessage(response.message || 'Announcement saved successfully.');
      resetForm();
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to save announcement.');
    } finally {
      setActiveId('');
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      category: announcement.category,
      audience: announcement.audience
    });
  };

  const handleToggle = async (announcementId) => {
    setActiveId(announcementId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await toggleInstituteAnnouncementStatusRequest(announcementId);
      const announcement = response.data?.announcement;

      if (announcement) {
        setAnnouncements((current) => current.map((item) => (item._id === announcement._id ? announcement : item)));
      }

      setSuccessMessage(response.message || 'Announcement status updated successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to update announcement status.');
    } finally {
      setActiveId('');
    }
  };

  const handleDelete = async (announcementId) => {
    setActiveId(announcementId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await deleteInstituteAnnouncementRequest(announcementId);
      setAnnouncements((current) => current.filter((item) => item._id !== announcementId));
      if (editingId === announcementId) {
        resetForm();
      }
      setSuccessMessage(response.message || 'Announcement deleted successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to delete announcement.');
    } finally {
      setActiveId('');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="INSTITUTE_ADMIN"
        title="Announcements"
        description="Create and manage institute announcements for students, alumni, or both audiences."
      />

      <section className="surface-card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={Boolean(activeId)}
                className="field-control"
              />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={Boolean(activeId)}
                className="field-control"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={Boolean(activeId)}
                rows="4"
                className="field-control"
              />
            </div>
            <div>
              <label htmlFor="audience">Audience</label>
              <select
                id="audience"
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                disabled={Boolean(activeId)}
                className="field-control"
              >
                {AUDIENCES.map((audience) => (
                  <option key={audience} value={audience}>
                    {audience}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errorMessage ? (
            <p className="alert-error" role="alert" aria-live="polite">{errorMessage}</p>
          ) : null}

          {successMessage ? (
            <p className="alert-success" role="alert" aria-live="polite">{successMessage}</p>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" disabled={Boolean(activeId)} className="btn-primary">
              {activeId === 'creating' || editingId ? 'Saving...' : 'Create Announcement'}
            </button>
            {editingId ? (
              <button type="button" onClick={resetForm} disabled={Boolean(activeId)} className="btn-secondary">
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="mt-8 surface-card p-6 md:p-8">
        {isLoading ? (
          <LoadingState message="Loading announcements..." />
        ) : announcements.length === 0 ? (
          <EmptyState
            title="No announcements created yet"
            description="Create your first announcement to keep students and alumni informed."
          />
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <article key={announcement._id} className="content-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-section font-semibold text-text-primary">{announcement.title}</h2>
                    <p className="mt-2 text-body text-text-secondary">{announcement.message}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex rounded-full border border-border bg-bg-secondary px-3 py-1 text-caption font-semibold uppercase tracking-wider text-text-primary">{announcement.category}</span>
                    <span className="inline-flex rounded-full border border-border bg-bg-secondary px-3 py-1 text-caption font-semibold uppercase tracking-wider text-text-primary">{announcement.audience}</span>
                    <StatusBadge value={announcement.isActive ? 'ACTIVE' : 'INACTIVE'} />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button type="button" onClick={() => handleEdit(announcement)} disabled={Boolean(activeId)} className="btn-secondary">
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={activeId === announcement._id || Boolean(activeId)}
                    onClick={() => handleToggle(announcement._id)}
                    className="btn-secondary"
                  >
                    {announcement.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    disabled={activeId === announcement._id || Boolean(activeId)}
                    onClick={() => handleDelete(announcement._id)}
                    className="btn-danger"
                  >
                    Delete
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

export default AnnouncementsPage;
