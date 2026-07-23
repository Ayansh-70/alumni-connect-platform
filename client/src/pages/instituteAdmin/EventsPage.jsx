import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import {
  createInstituteEventRequest,
  deleteInstituteEventRequest,
  getInstituteEventsRequest,
  toggleInstituteEventStatusRequest,
  updateInstituteEventRequest
} from '../../api/instituteAdminEvents.js';

const EVENT_TYPES = ['WEBINAR', 'WORKSHOP', 'MEETUP', 'PLACEMENT_DRIVE', 'ALUMNI_TALK', 'NETWORKING', 'OTHER'];
const MODES = ['ONLINE', 'OFFLINE', 'HYBRID'];
const AUDIENCES = ['STUDENTS', 'ALUMNI', 'BOTH'];

const INITIAL_FORM = {
  title: '',
  description: '',
  eventType: 'WEBINAR',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  mode: 'ONLINE',
  meetingLink: '',
  audience: 'BOTH'
};

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadEvents = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await getInstituteEventsRequest();
      setEvents(response.data?.events || []);
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to load events.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
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
        ? await updateInstituteEventRequest(editingId, formData)
        : await createInstituteEventRequest(formData);

      const savedEvent = response.data?.event;

      if (savedEvent) {
        setEvents((current) =>
          editingId ? current.map((item) => (item._id === savedEvent._id ? savedEvent : item)) : [savedEvent, ...current]
        );
      }

      setSuccessMessage(response.message || 'Event saved successfully.');
      resetForm();
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to save event.');
    } finally {
      setActiveId('');
    }
  };

  const handleEdit = (eventItem) => {
    setEditingId(eventItem._id);
    setFormData({
      title: eventItem.title,
      description: eventItem.description,
      eventType: eventItem.eventType,
      date: toDateInput(eventItem.date),
      startTime: eventItem.startTime,
      endTime: eventItem.endTime,
      location: eventItem.location,
      mode: eventItem.mode,
      meetingLink: eventItem.meetingLink || '',
      audience: eventItem.audience
    });
  };

  const handleToggle = async (eventId) => {
    setActiveId(eventId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await toggleInstituteEventStatusRequest(eventId);
      const updatedEvent = response.data?.event;

      if (updatedEvent) {
        setEvents((current) => current.map((item) => (item._id === updatedEvent._id ? updatedEvent : item)));
      }

      setSuccessMessage(response.message || 'Event status updated successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to update event status.');
    } finally {
      setActiveId('');
    }
  };

  const handleDelete = async (eventId) => {
    setActiveId(eventId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await deleteInstituteEventRequest(eventId);
      setEvents((current) => current.filter((item) => item._id !== eventId));
      if (editingId === eventId) {
        resetForm();
      }
      setSuccessMessage(response.message || 'Event deleted successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to delete event.');
    } finally {
      setActiveId('');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="INSTITUTE_ADMIN"
        title="Events"
        description="Create and manage institute events for students, alumni, or both audiences."
      />

      <section className="surface-card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Title
              <input name="title" disabled={Boolean(activeId)} value={formData.title} onChange={handleChange} className="field-control mt-2" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Event type
              <select name="eventType" disabled={Boolean(activeId)} value={formData.eventType} onChange={handleChange} className="field-control mt-2">
                {EVENT_TYPES.map((eventType) => <option key={eventType} value={eventType}>{eventType}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Description
              <textarea name="description" disabled={Boolean(activeId)} value={formData.description} onChange={handleChange} rows="4" className="field-control mt-2" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Date
              <input name="date" type="date" disabled={Boolean(activeId)} value={formData.date} onChange={handleChange} className="field-control mt-2" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Start time
              <input name="startTime" disabled={Boolean(activeId)} value={formData.startTime} onChange={handleChange} className="field-control mt-2" placeholder="10:00 AM" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              End time
              <input name="endTime" disabled={Boolean(activeId)} value={formData.endTime} onChange={handleChange} className="field-control mt-2" placeholder="12:00 PM" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Location
              <input name="location" disabled={Boolean(activeId)} value={formData.location} onChange={handleChange} className="field-control mt-2" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Mode
              <select name="mode" disabled={Boolean(activeId)} value={formData.mode} onChange={handleChange} className="field-control mt-2">
                {MODES.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Audience
              <select name="audience" disabled={Boolean(activeId)} value={formData.audience} onChange={handleChange} className="field-control mt-2">
                {AUDIENCES.map((audience) => <option key={audience} value={audience}>{audience}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Meeting link
              <input name="meetingLink" disabled={Boolean(activeId)} value={formData.meetingLink} onChange={handleChange} className="field-control mt-2" placeholder="https://meet.example.com" />
            </label>
          </div>

          {errorMessage ? <p className="alert-error">{errorMessage}</p> : null}
          {successMessage ? <p className="alert-success">{successMessage}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={Boolean(activeId)} className="btn-primary">
              {isSubmitting ? 'Saving...' : (editingId ? 'Update Event' : 'Create Event')}
            </button>
            {editingId ? (
              <button type="button" disabled={Boolean(activeId)} onClick={resetForm} className="btn-secondary">
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="mt-8 surface-card p-6 md:p-8">
        {isLoading ? (
          <LoadingState message="Loading events..." />
        ) : events.length === 0 ? (
          <EmptyState
            title="No events created yet"
            description="Create an event to keep students and alumni informed about upcoming activity."
          />
        ) : (
          <div className="space-y-4">
            {events.map((eventItem) => (
              <article key={eventItem._id} className="content-card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{eventItem.title}</h2>
                    <p className="mt-2 text-sm text-slate-600">{eventItem.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="status-badge border-slate-200 bg-white text-slate-700">{eventItem.eventType}</span>
                    <span className="status-badge border-slate-200 bg-white text-slate-700">{eventItem.mode}</span>
                    <span className="status-badge border-slate-200 bg-white text-slate-700">{eventItem.audience}</span>
                    <StatusBadge value={eventItem.isActive ? 'ACTIVE' : 'INACTIVE'} />
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                  <p>Date: {new Date(eventItem.date).toLocaleDateString()}</p>
                  <p>Time: {eventItem.startTime} - {eventItem.endTime}</p>
                  <p>Location: {eventItem.location}</p>
                  <p>Meeting link: {eventItem.meetingLink || 'Not provided'}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button type="button" disabled={Boolean(activeId)} onClick={() => handleEdit(eventItem)} className="btn-secondary">
                    Edit
                  </button>
                  <button type="button" disabled={activeId === eventItem._id || Boolean(activeId)} onClick={() => handleToggle(eventItem._id)} className="btn-secondary">
                    {eventItem.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button type="button" disabled={activeId === eventItem._id || Boolean(activeId)} onClick={() => handleDelete(eventItem._id)} className="btn-danger">
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

export default EventsPage;
