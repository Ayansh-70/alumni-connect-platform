import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
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

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Title
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Category
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Audience
              <select
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              >
                {AUDIENCES.map((audience) => (
                  <option key={audience} value={audience}>
                    {audience}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {errorMessage ? (
            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMessage}</p>
          ) : null}

          {successMessage ? (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {successMessage}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={Boolean(activeId)}
              className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {activeId === 'creating' || editingId ? 'Saving...' : 'Create Announcement'}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">No announcements created yet.</div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <article key={announcement._id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{announcement.title}</h2>
                    <p className="mt-2 text-sm text-slate-600">{announcement.message}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      {announcement.category}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      {announcement.audience}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        announcement.isActive
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 bg-slate-100 text-slate-700'
                      }`}
                    >
                      {announcement.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(announcement)}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={activeId === announcement._id}
                    onClick={() => handleToggle(announcement._id)}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {announcement.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    disabled={activeId === announcement._id}
                    onClick={() => handleDelete(announcement._id)}
                    className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
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
